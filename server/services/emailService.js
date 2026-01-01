import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("Email Config:", {
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER ? process.env.EMAIL_USER.slice(0, 10) + "***" : "NOT SET",
  pass: process.env.EMAIL_PASSWORD ? "SET" : "NOT SET",
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("⚠️  Email service verification failed:", error.message);
    console.log("Note: App will continue to run. Email features may not work.");
  } else if (success) {
    console.log("✅ Email service is ready to send emails");
  }
});

export const sendEmail = async (email, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #666; font-size: 16px;">
        We received a request to reset your password. Click the link below to proceed:
      </p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                  color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="color: #999; font-size: 14px;">
        This link will expire in 15 minutes. If you didn't request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        © 2025 Coding Platform. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail(email, "Password Reset Request", htmlContent);
};

export const sendVerificationEmail = async (email, verificationLink) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p style="color: #666; font-size: 16px;">
        Welcome to Coding Platform! Please verify your email address by clicking the link below:
      </p>
      <div style="margin: 30px 0;">
        <a href="${verificationLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #28a745; 
                  color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p style="color: #999; font-size: 14px;">
        This link will expire in 24 hours.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        © 2025 Coding Platform. All rights reserved.
      </p>
    </div>
  `;

  return sendEmail(email, "Verify Your Email Address", htmlContent);
};

export const sendOTPEmail = async (email, otp, purpose = "signup") => {
  const purposeText = purpose === "signup" ? "verify your account" : "reset your password";
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
      <div style="background: white; padding: 40px; border-radius: 8px; text-align: center;">
        <h2 style="color: #333; margin-top: 0;">Verify Your Identity</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Use this code to ${purposeText}
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 10px; font-family: 'Courier New', monospace;">
            ${otp}
          </div>
        </div>
        <p style="color: #999; font-size: 14px; margin: 20px 0;">
          This code will expire in 10 minutes
        </p>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
      <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
        © 2025 Coding Platform. All rights reserved.
      </p>
    </div>
  `;

  const subject = purpose === "signup" ? "Your Verification Code" : "Password Reset Code";
  return sendEmail(email, subject, htmlContent);
};
