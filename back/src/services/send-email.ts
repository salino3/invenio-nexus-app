import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { SMTP_HOST, SMTP_PORT } from "../constants";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Configure SMTP Transporter
const smtpOptions: SMTPTransport.Options = {
  host: SMTP_HOST || "smtp.gmail.com",
  port: Number(SMTP_PORT) || 587,
  secure: (Number(SMTP_PORT) || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Pass the typed configuration to createTransport
const transporter = nodemailer.createTransport(smtpOptions);

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"Your App Name" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
