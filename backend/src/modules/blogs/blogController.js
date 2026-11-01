import { v4 as uuidv4 } from 'uuid';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const blogController = {
  // 1. List Blogs
  async listBlogs(req, res) {
    try {
      const { status } = req.query;
      let blogs = store.get('blogPosts');

      // Public without auth only sees PUBLISHED
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

      // If public request, hidden and draft are not accessible
      if (!req.user && blog.status !== 'PUBLISHED') {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      return res.json(blog);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Create Blog (Marketing / Author)
  async createBlog(req, res) {
    try {
      const { title, excerpt, body, coverImage, category = 'Travel Guide', tags = [], status = 'DRAFT' } = req.body;

      if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required.' });
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const blogId = generateId('BLG');

      const isPublished = status === 'PUBLISHED';
      const newPost = {
        id: uuidv4(),
        blogId,
        title: title.trim(),
        slug,
        excerpt: excerpt || title.slice(0, 160),
        body,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
        category,
        tags: Array.isArray(tags) ? tags : [tags],
        authorEmpId: req.user.empId,
        authorName: req.user.fullName,
        status: isPublished ? 'PUBLISHED' : 'DRAFT',
        publishedAt: isPublished ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.insert('blogPosts', newPost);

      if (isPublished) {
        notify({
          recipientDept: 'MASTER',
          title: 'New Blog Post Published',
          message: `${req.user.fullName} published a new blog post: "${title}". Master may review or hide if needed.`,
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

  // 4. Update Blog (Author edit)
  async updateBlog(req, res) {
    try {
      const { id } = req.params;
      const blog = store.findById('blogPosts', id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found.' });
      }

      // Security rule: Master can hide/unpublish, but must not directly edit blog content!
      const isMasterOnly = req.user.departments.includes('MASTER') && !req.user.departments.includes('MARKETING');
      if (isMasterOnly) {
        return res.status(403).json({
          error: 'Policy rule: Master cannot directly edit blog content. Please consult the author or use the Hide action.'
        });
      }

      const updates = { ...req.body, updatedAt: new Date().toISOString() };
      delete updates.id;
      delete updates.blogId;

      store.updateById('blogPosts', blog.id, updates);
      logAudit(req, 'BLOG_UPDATED', 'BLOG', blog.blogId, { title: updates.title || blog.title });

      return res.json({ message: 'Blog updated successfully.', blog: { ...blog, ...updates } });
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

      store.updateById('blogPosts', blog.id, {
        status: 'PUBLISHED',
        publishedAt: blog.publishedAt || new Date().toISOString(),
        hiddenReason: null
      });

      logAudit(req, 'BLOG_PUBLISHED', 'BLOG', blog.blogId, { title: blog.title });

      return res.json({ message: 'Blog published successfully.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
