import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { ReactElement } from "react";

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export interface SendEmailOptions {
    to: string;
    subject: string;
    react: ReactElement;
}

/**
 * Send an email using NodeMailer with React Email templates
 */
export async function sendEmail({ to, subject, react }: SendEmailOptions) {
    try {
        const html = await render(react);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });

        console.log("Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}



