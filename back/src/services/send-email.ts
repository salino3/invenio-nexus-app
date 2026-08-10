import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import {
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "../constants";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: nodemailer.SendMailOptions["attachments"];
}

// Configure SMTP Transporter
const smtpOptions: SMTPTransport.Options = {
  host: SMTP_HOST || "smtp.gmail.com",
  port: Number(SMTP_PORT) || 587,
  secure: (Number(SMTP_PORT) || 587) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

// Pass the typed configuration to createTransport
const transporter = nodemailer.createTransport(smtpOptions);

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments,
}: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: `"Your App Name" <${SMTP_FROM || SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};
