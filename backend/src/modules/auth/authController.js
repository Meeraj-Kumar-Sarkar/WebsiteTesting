import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/index.js';
import { store } from '../../database/db.js';
import { generateId } from '../../utils/idGenerator.js';
import { emailService } from '../../services/emailService.js';
import { logAudit, notify } from '../../middleware/audit.js';

export const authController = {
  // 1. Employee Registration
  async register(req, res) {
    try {
      const { fullName, email, phone, password } = req.body;
      if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ error: 'Full name, email, phone, and password are required.' });
      }

      const existingUser = store.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email address already exists.' });
      }

      const empId = generateId('EMP');
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Generate OTP for email verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 6);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const newUser = {
        id: uuidv4(),
        empId,
        fullName,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        status: 'PENDING_MASTER_APPROVAL', // Email verified or directly awaiting Master approval
        otpHash,
        otpExpiresAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.insert('users', newUser);

      // Send OTP
      await emailService.sendOtp(email, otp, 'Registration Verification');

      // Notify Master about new registration
      notify({
        recipientDept: 'MASTER',
        title: 'New Employee Registration Awaiting Approval',
        message: `${fullName} (${empId}) registered with email ${email}. Requires department and role assignment.`,
        category: 'EMPLOYEE_MANAGEMENT',
        linkedType: 'EMPLOYEE',
        linkedId: empId
      });

      logAudit({ user: { id: newUser.id, empId, fullName, departments: ['GENERAL'] } }, 'EMPLOYEE_REGISTERED', 'EMPLOYEE', empId, { email, phone });

      return res.status(201).json({
        message: 'Registration successful! Your Employee ID has been generated. Your account is pending Master approval.',
        empId,
        email,
        demoOtp: otp // Available in response for immediate testing convenience
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 2. Employee Login
  async login(req, res) {
    try {
      const { identifier, password } = req.body; // identifier can be empId or email
      if (!identifier || !password) {
        return res.status(400).json({ error: 'Employee ID (or email) and password are required.' });
      }

      const user = store.findOne('users', u => 
        u.empId?.toLowerCase() === identifier.trim().toLowerCase() || 
        u.email?.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (!user) {
        return res.status(401).json({ error: 'Invalid Employee ID/email or password.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid Employee ID/email or password.' });
      }

      // Check status
      if (user.status !== 'ACTIVE') {
        const messages = {
          PENDING_VERIFICATION: 'Your email verification is pending. Please verify your OTP.',
          PENDING_MASTER_APPROVAL: 'Your registration is complete and awaiting Master approval & department assignment.',
          FROZEN: 'This account has been temporarily frozen. Please contact Management.',
          SUSPENDED: 'This account is currently suspended pending administrative review.',
          BLOCKED: 'This account has been administratively blocked.',
          DEACTIVATED: 'This account has been deactivated.'
        };
        return res.status(403).json({
          error: messages[user.status] || 'Account is not currently active.',
          accountStatus: user.status
        });
      }

      // Gather department memberships and roles
      const memberships = store.find('userDepartmentRoles', m => m.userId === user.id);
      const roles = store.get('roles');
      const userDepartments = [...new Set(memberships.map(m => m.departmentCode))];
      const permissions = new Set();

      if (userDepartments.includes('MASTER')) {
        permissions.add('*');
      }

      for (const m of memberships) {
        const role = roles.find(r => r.code === m.roleCode);
        if (role && role.permissions) {
          role.permissions.forEach(p => permissions.add(p));
        }
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          empId: user.empId,
          email: user.email,
          fullName: user.fullName,
          departments: userDepartments
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      // Update last login
      store.updateById('users', user.id, { lastLoginAt: new Date().toISOString() });

      logAudit({ user: { id: user.id, empId: user.empId, fullName: user.fullName, departments: userDepartments } }, 'USER_LOGIN', 'USER', user.empId);

      return res.json({
        token,
        user: {
          id: user.id,
          empId: user.empId,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          departments: userDepartments,
          roles: memberships.map(m => m.roleCode),
          permissions: Array.from(permissions)
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 3. Current Authenticated Profile
  async me(req, res) {
    try {
      const user = store.findById('users', req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.json({
        user: {
          id: user.id,
          empId: user.empId,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          departments: req.user.departments,
          roles: req.user.roles,
          permissions: req.user.permissions,
          activeDepartment: req.user.activeDepartment
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 4. Request Password Reset OTP
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const user = store.findOne('users', u => u.email.toLowerCase() === email?.toLowerCase());
      if (!user) {
        return res.status(200).json({ message: 'If an account with that email exists, an OTP has been sent.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 6);
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      store.updateById('users', user.id, { otpHash, otpExpiresAt });
      await emailService.sendOtp(email, otp, 'Password Reset');

      logAudit({ user: { id: user.id, empId: user.empId, fullName: user.fullName, departments: ['SYSTEM'] } }, 'PASSWORD_RESET_REQUESTED', 'USER', user.empId);

      return res.json({
        message: 'An OTP has been dispatched to your email address.',
        demoOtp: otp
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // 5. Reset Password with OTP
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const user = store.findOne('users', u => u.email.toLowerCase() === email?.toLowerCase());
      if (!user || !user.otpHash || !user.otpExpiresAt) {
        return res.status(400).json({ error: 'Invalid or expired OTP session.' });
      }

      if (new Date() > new Date(user.otpExpiresAt)) {
        return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
      }

      const isValid = await bcrypt.compare(otp, user.otpHash);
      if (!isValid) {
        return res.status(400).json({ error: 'Incorrect OTP entered.' });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      store.updateById('users', user.id, {
        passwordHash,
        otpHash: null,
        otpExpiresAt: null,
        updatedAt: new Date().toISOString()
      });

      logAudit({ user: { id: user.id, empId: user.empId, fullName: user.fullName, departments: ['SYSTEM'] } }, 'PASSWORD_RESET_COMPLETED', 'USER', user.empId);

      return res.json({ message: 'Password has been successfully updated. You may now log in.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
