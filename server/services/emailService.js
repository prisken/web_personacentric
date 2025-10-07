const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    this.transporter = null;
    this.useSendGridAPI = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Try to create transporter with environment variables
    // If not available, create a test transporter for development
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Check if using SendGrid (EMAIL_USER === 'apikey')
      if (process.env.EMAIL_USER === 'apikey') {
        // Use SendGrid HTTP API instead of SMTP (more reliable)
        sgMail.setApiKey(process.env.EMAIL_PASS);
        this.useSendGridAPI = true;
        console.log('✅ Email service initialized with SendGrid HTTP API');
      } else {
        // Gmail or other SMTP
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        console.log('✅ Email service initialized with Gmail');
      }
    } else {
      // Create a test account for development
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
      console.log('⚠️  Email service using Ethereal test account (development mode)');
      console.log('   Set EMAIL_USER and EMAIL_PASS environment variables for production');
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Persona Centric</h1>
          <p style="color: white; margin: 5px 0 0 0;">Financial Advisory Platform</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello,
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Persona Centric account. 
            If you made this request, click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Or copy and paste this link into your browser:
          </p>
          
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace; color: #333;">
            ${resetUrl}
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request a password reset, please ignore this email. 
            Your password will remain unchanged.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The Persona Centric Team
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            © 2024 Persona Centric. All rights reserved.
          </p>
        </div>
      </div>
    `;

    if (this.useSendGridAPI) {
      // Use SendGrid HTTP API
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@personacentric.com',
        subject: 'Password Reset Request - Persona Centric',
        html: htmlContent
      };

      try {
        const result = await sgMail.send(msg);
        console.log('📧 Password reset email sent via SendGrid API');
        return result;
      } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw error;
      }
    } else {
      // Use SMTP
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@personacentric.com',
        to: email,
        subject: 'Password Reset Request - Persona Centric',
        html: htmlContent
      };

      try {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('📧 Password reset email sent:', result.messageId);
        
        if (process.env.NODE_ENV !== 'production' && result.previewUrl) {
          console.log('📧 Preview URL:', result.previewUrl);
        }
        
        return result;
      } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw error;
      }
    }
  }

  async sendWelcomeEmail(email, firstName) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Persona Centric!</h1>
          <p style="color: white; margin: 5px 0 0 0;">Your Financial Journey Starts Here</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Persona Centric! We're excited to help you on your financial journey.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            With Persona Centric, you can:
          </p>
          
          <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <li>Get personalized financial advice from certified agents</li>
            <li>Participate in educational events and workshops</li>
            <li>Take quizzes to assess your financial knowledge</li>
            <li>Earn points and rewards for your engagement</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Get Started
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions, don't hesitate to reach out to our support team.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            The Persona Centric Team
          </p>
        </div>
      </div>
    `;

    if (this.useSendGridAPI) {
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@personacentric.com',
        subject: 'Welcome to Persona Centric!',
        html: htmlContent
      };

      try {
        const result = await sgMail.send(msg);
        console.log('📧 Welcome email sent via SendGrid API');
        return result;
      } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        throw error;
      }
    } else {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@personacentric.com',
        to: email,
        subject: 'Welcome to Persona Centric!',
        html: htmlContent
      };

      try {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('📧 Welcome email sent:', result.messageId);
        return result;
      } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        throw error;
      }
    }
  }

  async sendFoodForTalkPasswordResetEmail(email, resetToken) {
    const base = process.env.FOOD_FOR_TALK_FRONTEND_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${base}/food-for-talk/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background:#111827; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Food for Talk</h1>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #333; margin-bottom: 16px;">Password reset</h2>
          <p style="color:#555;">Click the button below to set a new password. This link expires in 1 hour.</p>
          <div style="text-align:center; margin: 24px 0;">
            <a href="${resetUrl}" style="background:#f59e0b; color:#111; padding:12px 24px; text-decoration:none; border-radius:8px; font-weight:600;">
              Reset Password
            </a>
          </div>
          <p style="color:#777; word-break:break-all;">Or paste this URL into your browser:<br>${resetUrl}</p>
        </div>
      </div>
    `;

    if (this.useSendGridAPI) {
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'noreply@personacentric.com',
        subject: 'Reset your Food for Talk password',
        html: htmlContent
      };

      try {
        const result = await sgMail.send(msg);
        console.log('📧 FFT password reset email sent via SendGrid API');
        return result;
      } catch (error) {
        console.error('❌ Failed to send FFT password reset email:', error);
        throw error;
      }
    } else {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@personacentric.com',
        to: email,
        subject: 'Reset your Food for Talk password',
        html: htmlContent
      };

      try {
        const result = await this.transporter.sendMail(mailOptions);
        console.log('📧 FFT password reset email sent:', result.messageId);
        if (process.env.NODE_ENV !== 'production' && result.previewUrl) {
          console.log('📧 FFT Preview URL:', result.previewUrl);
        }
        return result;
      } catch (error) {
        console.error('❌ Failed to send FFT password reset email:', error);
        throw error;
      }
    }
  }
}

module.exports = new EmailService();
