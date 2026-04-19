import { Resend } from 'resend';
import { render } from '@react-email/components';
import React from 'react';
import ClientConfirmationEmail from '@/emails/ClientConfirmation';
import AdminNotificationEmail from '@/emails/AdminNotification';
import {
  PROJECT_TYPE_LABELS,
  BUDGET_LABELS,
} from '@/lib/project-labels';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  fullname: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  requirements?: string;
}

interface AdminEmailData extends ContactFormData {
  clientId?: string;
  tags?: string[];
}

/**
 * Send confirmation email to the client who submitted the contact form
 */
export async function sendClientConfirmationEmail(data: ContactFormData) {
  try {
    const emailHtml = await render(
      React.createElement(ClientConfirmationEmail, {
        fullname: data.fullname,
        projectType: data.projectType,
        timeline: data.timeline,
        budget: data.budget,
      })
    );

    const fromEmail = process.env.NODE_ENV === 'production'
      ? 'CHNsPart <noreply@chnspart.com>'
      : 'Acme <onboarding@resend.dev>';

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const recipientEmail = isDevelopment ? 'imchn24@gmail.com' : data.email;
    const firstName = data.fullname.trim().split(' ')[0] || data.fullname;
    const subjectBase = `Thanks, ${firstName} — I'll be in touch within 48 hours`;
    const subject = isDevelopment
      ? `[TEST - For: ${data.email}] ${subjectBase}`
      : subjectBase;

    const result = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: subject,
      html: emailHtml,
    });

    if (isDevelopment) {
      console.log(`📧 DEV MODE: Client email sent to ${recipientEmail} instead of ${data.email}`);
    }
    console.log('✅ Client confirmation email sent successfully:', result);
    return { success: true, data: result, error: null };
  } catch (error: unknown) {
    const err = error as { message?: string; statusCode?: number; name?: string };
    console.error('❌ Error sending client confirmation email:', {
      message: err.message,
      statusCode: err.statusCode,
      name: err.name,
      details: error,
    });
    return { success: false, error };
  }
}

/**
 * Send notification email to admin about new contact form submission
 */
export async function sendAdminNotificationEmail(data: AdminEmailData) {
  try {
    const emailHtml = await render(
      React.createElement(AdminNotificationEmail, {
        fullname: data.fullname,
        email: data.email,
        projectType: data.projectType,
        timeline: data.timeline,
        budget: data.budget,
        message: data.message,
        requirements: data.requirements,
        clientId: data.clientId,
        tags: data.tags,
      })
    );

    const fromEmail = process.env.NODE_ENV === 'production'
      ? 'CHNsPart Contact Form <noreply@chnspart.com>'
      : 'Acme <onboarding@resend.dev>';

    const projectTypeLabel = PROJECT_TYPE_LABELS[data.projectType] || data.projectType;
    const budgetLabel = BUDGET_LABELS[data.budget] || data.budget;
    const subject = `New lead — ${budgetLabel} · ${projectTypeLabel} — ${data.fullname}`;

    const result = await resend.emails.send({
      from: fromEmail,
      to: 'imchn24@gmail.com',
      subject,
      html: emailHtml,
      replyTo: data.email,
    });

    console.log('✅ Admin notification email sent successfully:', result);
    return { success: true, data: result, error: null };
  } catch (error: unknown) {
    const err = error as { message?: string; statusCode?: number; name?: string };
    console.error('❌ Error sending admin notification email:', {
      message: err.message,
      statusCode: err.statusCode,
      name: err.name,
      details: error,
    });
    return { success: false, error };
  }
}

/**
 * Send both confirmation and notification emails
 * Returns success even if emails fail (don't block form submission)
 */
export async function sendContactFormEmails(data: AdminEmailData) {
  const results = {
    clientEmail: { success: false, error: null as unknown },
    adminEmail: { success: false, error: null as unknown },
  };

  const [clientResult, adminResult] = await Promise.allSettled([
    sendClientConfirmationEmail(data),
    sendAdminNotificationEmail(data),
  ]);

  if (clientResult.status === 'fulfilled') {
    results.clientEmail = clientResult.value;
  } else {
    results.clientEmail = { success: false, error: clientResult.reason as unknown };
  }

  if (adminResult.status === 'fulfilled') {
    results.adminEmail = adminResult.value;
  } else {
    results.adminEmail = { success: false, error: adminResult.reason as unknown };
  }

  console.log('Email sending results:', {
    clientEmailSent: results.clientEmail.success,
    adminEmailSent: results.adminEmail.success,
  });

  return results;
}
