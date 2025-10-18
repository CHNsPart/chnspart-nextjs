import { Resend } from 'resend';
import { render } from '@react-email/components';
import React from 'react';
import ClientConfirmationEmail from '@/emails/ClientConfirmation';
import AdminNotificationEmail from '@/emails/AdminNotification';

// Initialize Resend with API key
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

    console.log('📧 Rendered email HTML type:', typeof emailHtml);

    // Use Resend's test domain for development until chnspart.com is verified
    // Change this to 'CHNsPart <noreply@chnspart.com>' after domain verification
    const fromEmail = process.env.NODE_ENV === 'production'
      ? 'CHNsPart <noreply@chnspart.com>'
      : 'Acme <onboarding@resend.dev>';

    // In development with test domain, we can only send to the Resend account owner
    // So send to admin email instead with a note about the intended recipient
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const recipientEmail = isDevelopment ? 'imchn24@gmail.com' : data.email;
    const subject = isDevelopment
      ? `[TEST - For: ${data.email}] Thank you for your project inquiry!`
      : 'Thank you for your project inquiry!';

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
export async function sendAdminNotificationEmail(data: ContactFormData) {
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
      })
    );

    console.log('📧 Rendered admin email HTML type:', typeof emailHtml);

    // Use Resend's test domain for development until chnspart.com is verified
    // Change this to 'CHNsPart Contact Form <noreply@chnspart.com>' after domain verification
    const fromEmail = process.env.NODE_ENV === 'production'
      ? 'CHNsPart Contact Form <noreply@chnspart.com>'
      : 'Acme <onboarding@resend.dev>';

    const result = await resend.emails.send({
      from: fromEmail,
      to: 'imchn24@gmail.com',
      subject: `New Contact Form: ${data.fullname} - ${data.projectType}`,
      html: emailHtml,
      replyTo: data.email, // Allow admin to reply directly to client
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
export async function sendContactFormEmails(data: ContactFormData) {
  const results = {
    clientEmail: { success: false, error: null as unknown },
    adminEmail: { success: false, error: null as unknown },
  };

  // Send emails in parallel
  const [clientResult, adminResult] = await Promise.allSettled([
    sendClientConfirmationEmail(data),
    sendAdminNotificationEmail(data),
  ]);

  // Process client email result
  if (clientResult.status === 'fulfilled') {
    results.clientEmail = clientResult.value;
  } else {
    results.clientEmail = { success: false, error: clientResult.reason as unknown };
  }

  // Process admin email result
  if (adminResult.status === 'fulfilled') {
    results.adminEmail = adminResult.value;
  } else {
    results.adminEmail = { success: false, error: adminResult.reason as unknown };
  }

  // Log results
  console.log('Email sending results:', {
    clientEmailSent: results.clientEmail.success,
    adminEmailSent: results.adminEmail.success,
  });

  return results;
}
