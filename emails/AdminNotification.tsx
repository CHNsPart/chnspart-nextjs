import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Img,
} from '@react-email/components';
import * as React from 'react';
import {
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
  BUDGET_LABELS,
} from '@/lib/project-labels';

interface AdminNotificationEmailProps {
  fullname: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  requirements?: string;
  clientId?: string;
  tags?: string[];
}

type PriorityBadge = {
  label: string;
  style: React.CSSProperties;
};

const getPriorityBadge = (budget: string, timeline: string, tags: string[]): PriorityBadge => {
  if (budget === 'lg' || tags.includes('high-budget') || tags.includes('enterprise')) {
    return { label: '🔥 HIGH-BUDGET LEAD', style: badgeHigh };
  }
  if (timeline === '1m' || tags.includes('urgent')) {
    return { label: '⚡ URGENT · 1 MONTH', style: badgeUrgent };
  }
  return { label: '📋 NEW LEAD', style: badgeDefault };
};

export const AdminNotificationEmail = ({
  fullname,
  email,
  projectType,
  timeline,
  budget,
  message,
  requirements,
  clientId,
  tags = [],
}: AdminNotificationEmailProps) => {
  const projectTypeLabel = PROJECT_TYPE_LABELS[projectType] || projectType;
  const budgetLabel = BUDGET_LABELS[budget] || budget;
  const timelineLabel = TIMELINE_LABELS[timeline] || timeline;
  const firstName = fullname.trim().split(' ')[0] || fullname;

  const previewText = `${budgetLabel} · ${timelineLabel} · ${message.slice(0, 80)}${message.length > 80 ? '…' : ''}`;
  const priority = getPriorityBadge(budget, timeline, tags);

  const dashboardUrl = clientId
    ? `https://chnspart.com/mmm/clients/${clientId}`
    : 'https://chnspart.com/mmm/dashboard';
  const dashboardLabel = clientId ? `Open ${firstName}'s client page` : 'View in Dashboard';

  const replySubject = encodeURIComponent(`Re: your ${projectTypeLabel} inquiry`);
  const replyMailto = `mailto:${email}?subject=${replySubject}`;

  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 20px !important; }
            .header-logo { width: 80px !important; height: auto !important; }
            .heading { font-size: 22px !important; }
            .info-box { padding: 16px !important; }
            .button { padding: 12px 24px !important; font-size: 14px !important; }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container} className="container">
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://www.chnspart.com/images/logo.png"
              alt="CHNsPart Logo"
              width="100"
              height="auto"
              style={logo}
              className="header-logo"
            />
          </Section>

          {/* Priority Badge */}
          <Section style={badgeSection}>
            <span style={priority.style}>{priority.label}</span>
          </Section>

          {/* Headline summary */}
          <Heading style={h1} className="heading">
            {fullname}
          </Heading>
          <Text style={alertText}>
            <strong style={highlight}>{budgetLabel}</strong>
            {' · '}
            <strong>{projectTypeLabel}</strong>
            {' · '}
            {timelineLabel}
          </Text>

          {/* Tags pill row */}
          {tags.length > 0 && (
            <Section style={tagsSection}>
              {tags.map((tag) => (
                <span key={tag} style={tagPill}>
                  {tag}
                </span>
              ))}
            </Section>
          )}

          {/* Client Information Box */}
          <Section style={infoBox} className="info-box">
            <Heading as="h2" style={h2}>
              Client
            </Heading>
            <table style={infoTable}>
              <tbody>
                <tr>
                  <td style={labelCell}>Name:</td>
                  <td style={valueCell}>{fullname}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Email:</td>
                  <td style={valueCell}>
                    <Link href={`mailto:${email}`} style={emailLink}>
                      {email}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Project Details Box */}
          <Section style={infoBox} className="info-box">
            <Heading as="h2" style={h2}>
              Project
            </Heading>
            <table style={infoTable}>
              <tbody>
                <tr>
                  <td style={labelCell}>Type:</td>
                  <td style={valueCell}>{projectTypeLabel}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Timeline:</td>
                  <td style={valueCell}>{timelineLabel}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Budget:</td>
                  <td style={valueCell}>{budgetLabel}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Message Box */}
          <Section style={messageBox}>
            <Heading as="h2" style={h2}>
              Description
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          {/* Requirements Box (if provided) */}
          {requirements && (
            <Section style={requirementsBox}>
              <Heading as="h2" style={h2}>
                Technical requirements
              </Heading>
              <Text style={messageText}>{requirements}</Text>
            </Section>
          )}

          {/* Action Buttons */}
          <Section style={actionSection}>
            <table style={buttonTable}>
              <tbody>
                <tr>
                  <td style={buttonCell}>
                    <Link href={dashboardUrl} style={primaryButton} className="button">
                      {dashboardLabel}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td style={buttonCell}>
                    <Link href={replyMailto} style={secondaryButton} className="button">
                      Reply to {firstName}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Sent from the contact form at{' '}
            <Link href="https://chnspart.com/contact" style={linkStyle}>
              chnspart.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

AdminNotificationEmail.PreviewProps = {
  fullname: 'Jane Doe',
  email: 'jane@example.com',
  projectType: 'ai',
  timeline: '1m',
  budget: 'lg',
  message:
    'We need an AI-powered document analysis tool for internal use. Roughly 50 employees, needs SSO, integrates with our existing Google Drive. Timeline is tight because of a Q2 board demo.',
  requirements:
    'Must support OCR for scanned PDFs, redaction of PII before LLM calls, audit logging per query, and role-based access control. Hosted on our own AWS account preferred.',
  clientId: 'preview-client-id',
  tags: ['high-budget', 'urgent', 'ai-ml', 'technical', 'cutting-edge', 'detailed-requirements'],
} satisfies AdminNotificationEmailProps;

export default AdminNotificationEmail;

const main = {
  backgroundColor: '#121212',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#1f1f1f',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '650px',
  borderRadius: '12px',
  border: '1px solid #383838',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const badgeSection = {
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const badgeBase: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
};

const badgeDefault: React.CSSProperties = {
  ...badgeBase,
  backgroundColor: '#ffd95a',
  color: '#1f1f1f',
};

const badgeHigh: React.CSSProperties = {
  ...badgeBase,
  backgroundColor: '#ff6b35',
  color: '#ffffff',
};

const badgeUrgent: React.CSSProperties = {
  ...badgeBase,
  backgroundColor: '#c9a961',
  color: '#1f1f1f',
};

const h1 = {
  color: '#fafafa',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
  lineHeight: '1.2',
};

const h2 = {
  color: '#fafafa',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const alertText = {
  color: '#e0e0e0',
  fontSize: '16px',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const highlight = {
  color: '#ffd95a',
  fontWeight: 'bold' as const,
};

const tagsSection = {
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
  lineHeight: '2',
};

const tagPill: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#2a2a2a',
  color: '#c9a961',
  border: '1px solid #383838',
  padding: '4px 10px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 600,
  margin: '0 4px 4px 0',
  lineHeight: '1.4',
};

const infoBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #383838',
};

const messageBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #ffd95a',
};

const requirementsBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #c9a961',
};

const infoTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#c9a961',
  fontSize: '14px',
  padding: '6px 12px 6px 0',
  fontWeight: '600' as const,
  verticalAlign: 'top' as const,
  width: '35%',
};

const valueCell = {
  color: '#fafafa',
  fontSize: '14px',
  padding: '6px 0',
  fontWeight: '500' as const,
};

const messageText = {
  color: '#e0e0e0',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const actionSection = {
  margin: '32px 0',
};

const buttonTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const buttonCell = {
  padding: '8px 0',
  textAlign: 'center' as const,
};

const primaryButton = {
  backgroundColor: '#ffd95a',
  color: '#1f1f1f',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  textAlign: 'center' as const,
};

const secondaryButton = {
  backgroundColor: 'transparent',
  color: '#ffd95a',
  fontSize: '15px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '12px 28px',
  borderRadius: '8px',
  display: 'inline-block',
  border: '1px solid #ffd95a',
  textAlign: 'center' as const,
};

const emailLink = {
  color: '#ffd95a',
  textDecoration: 'underline',
};

const linkStyle = {
  color: '#ffd95a',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#383838',
  margin: '32px 0',
};

const footer = {
  color: '#888888',
  fontSize: '13px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '0',
};
