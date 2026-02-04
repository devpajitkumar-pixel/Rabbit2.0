import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const isProd = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: isProd,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"Rabbit" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
};
