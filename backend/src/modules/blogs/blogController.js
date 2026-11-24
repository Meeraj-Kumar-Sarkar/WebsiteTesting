import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

function formatBodyToHtml(body = '') {
  if (!body) return '';
  if (/<[a-z][\s\S]*>/i.test(body)) {
    return body;
  }
  return body
    .split(/\n\n+/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('### ')) return `<h3>${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith('## ')) return `<h3>${trimmed.slice(3)}</h3>`;
      if (trimmed.startsWith('# ')) return `<h3>${trimmed.slice(2)}</h3>`;
      if (trimmed.startsWith('> ')) return `<blockquote>${trimmed.slice(2)}</blockquote>`;
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
}

function normalizeBlog(blog) {
  if (!blog) return null;
  const bodyText = blog.body || blog.content || '';
  const wordCount = bodyText.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTime = blog.readTime || `${Math.max(1, Math.ceil(wordCount / 180))} min read`;
  const rawDate = blog.publishedAt || blog.createdAt || new Date().toISOString();
  const formattedDate = blog.date || new Date(rawDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    ...blog,
    body: bodyText,
    content: formatBodyToHtml(bodyText),
    readTime,
    date: formattedDate,
    author: blog.author || {
      name: blog.authorName || 'Editorial Team',
      role: 'Mountain & Memories Journal'
    }
  };
}

export const blogController = {
  // 1. List Blogs
  async listBlogs(req, res) {
    try {
      const { status } = req.query;
      let blogs = store.get('blogPosts').map(normalizeBlog);

      if (!req.user) {
        blogs = blogs.filter(b => b.status === 'PUBLISHED');
      } else if (status && status !== 'ALL') {
        blogs = blogs.filter(b => b.status === status);
      }

      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(blogs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Get Single Blog by Slug or ID
  async getBlog(req, res) {
    try {
      const { identifier } = req.params;
      const blog = store.findOne('blogPosts', b => b.id === identifier || b.blogId === identifier || b.slug === identifier);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      if (!req.user && blog.status !== 'PUBLISHED') {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      return res.json(normalizeBlog(blog));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Create Blog (Marketing / Author)
  async createBlog(req, res) {
    try {
      const {
        title,
        excerpt,
        body,
        content,
        coverImage,
        category = 'TRAVEL_GUIDE',
        tags = [],
        relatedPackageSlug = null,
        status = 'DRAFT'
      } = req.body;

      const resolvedBody = body || content;
      if (!title || !resolvedBody) {
        return res.status(400).json({ error: 'Title and body are required.' });
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const blogId = generateId('BLG');

      const isPublished = status === 'PUBLISHED';
      const newPost = normalizeBlog({
        id: uuidv4(),
        blogId,
        title: title.trim(),
        slug,
        excerpt: excerpt || resolvedBody.replace(/<[^>]+>/g, '').slice(0, 160),
        body: resolvedBody,
        coverImage: coverImage || '',
        category,
        tags: Array.isArray(tags) ? tags : String(tags || '').split(',').map(t => t.trim()).filter(Boolean),
        relatedPackageSlug,
        authorEmpId: req.user.empId,
        authorName: req.user.fullName,
        status: isPublished ? 'PUBLISHED' : 'DRAFT',
        publishedAt: isPublished ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      store.insert('blogPosts', newPost);

      if (isPublished) {
        notify({
          recipientDept: 'MASTER',
          title: 'New Blog Post Published',
          message: `${req.user.fullName} published a new blog post: "${title}".`,
          category: 'CONTENT',
          linkedType: 'BLOG',
          linkedId: blogId
        });
      }

      logAudit(req, isPublished ? 'BLOG_PUBLISHED' : 'BLOG_DRAFTED', 'BLOG', blogId, { title });

      return res.status(201).json(newPost);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Update Blog
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const blog = store.findById('blogPosts', id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      const updates = { ...req.body, updatedAt: new Date().toISOString() };
      delete updates.id;
      delete updates.blogId;

      if (updates.title && updates.title !== blog.title) {
        updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const merged = normalizeBlog({ ...blog, ...updates });
      store.updateById('blogPosts', blog.id, merged);
      logAudit(req, 'BLOG_UPDATED', 'BLOG', blog.blogId, { title: merged.title });

      return res.json({ message: 'Blog updated successfully.', blog: merged });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Hide Blog (Master Power)
  async hideBlog(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const blog = store.findById('blogPosts', id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      store.updateById('blogPosts', blog.id, {
        status: 'HIDDEN',
        hiddenReason: reason || 'Hidden by Master oversight.'
      });

      notify({
        recipientId: blog.authorEmpId,
        title: 'Blog Post Hidden by Master',
        message: `Your blog post "${blog.title}" was hidden from the public website by Master. Reason: ${reason || 'Editorial review requested.'}`,
        category: 'CONTENT',
        linkedType: 'BLOG',
        linkedId: blog.blogId
      });

      logAudit(req, 'BLOG_HIDDEN_BY_MASTER', 'BLOG', blog.blogId, { reason });

      return res.json({ message: 'Blog post unpublished and hidden from public website.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 6. Publish / Restore Blog
  async publishBlog(req, res) {
    try {
      const { id } = req.params;
      const blog = store.findById('blogPosts', id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      const updated = store.updateById('blogPosts', blog.id, {
        status: 'PUBLISHED',
        publishedAt: blog.publishedAt || new Date().toISOString(),
        hiddenReason: null
      });

      logAudit(req, 'BLOG_PUBLISHED', 'BLOG', blog.blogId, { title: blog.title });

      return res.json({ message: 'Blog published successfully.', blog: normalizeBlog(updated) });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 7. Delete Blog
  async deleteBlog(req, res) {
    try {
      const { id } = req.params;
      const blog = store.findById('blogPosts', id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      store.deleteById('blogPosts', blog.id);
      logAudit(req, 'BLOG_DELETED', 'BLOG', blog.blogId, { title: blog.title });

      return res.json({ message: 'Blog post deleted.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
