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

interface AdminNotificationEmailProps {
  fullname: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  requirements?: string;
}

const PROJECT_TYPE_LABELS: { [key: string]: string } = {
  'sweb': 'Static Website',
  'aweb': 'Web Application',
  'app': 'Mobile App',
  'desktop': 'Desktop Application',
  'ai': 'AI/ML Solution',
  'ui': 'UI/UX Design',
  'logo': 'Logo Design',
  'branding': 'Branding'
};

const TIMELINE_LABELS: { [key: string]: string } = {
  '1m': 'Within 1 month',
  '1-3': '1-3 months',
  '3-6': '3-6 months',
  '6+': '6+ months'
};

const BUDGET_LABELS: { [key: string]: string } = {
  'xs': '$1.5k - $5k',
  'sm': '$5k - $10k',
  'md': '$10k - $25k',
  'lg': '$25k+'
};

export const AdminNotificationEmail = ({
  fullname,
  email,
  projectType,
  timeline,
  budget,
  message,
  requirements,
}: AdminNotificationEmailProps) => {
  const previewText = `New inquiry from ${fullname} - ${PROJECT_TYPE_LABELS[projectType]}`;

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

          {/* Alert Badge */}
          <Section style={badgeSection}>
            <span style={badge}>🔔 NEW INQUIRY</span>
          </Section>

          {/* Main Heading */}
          <Heading style={h1} className="heading">
            New Contact Form Submission
          </Heading>

          {/* Quick Summary */}
          <Text style={alertText}>
            <strong>{fullname}</strong> is interested in a{' '}
            <strong style={highlight}>{PROJECT_TYPE_LABELS[projectType]}</strong> project
          </Text>

          {/* Client Information Box */}
          <Section style={infoBox} className="info-box">
            <Heading as="h2" style={h2}>
              👤 Client Information
            </Heading>
            <table style={infoTable}>
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
            </table>
          </Section>

          {/* Project Details Box */}
          <Section style={infoBox} className="info-box">
            <Heading as="h2" style={h2}>
              📊 Project Details
            </Heading>
            <table style={infoTable}>
              <tr>
                <td style={labelCell}>Project Type:</td>
                <td style={valueCell}>{PROJECT_TYPE_LABELS[projectType] || projectType}</td>
              </tr>
              <tr>
                <td style={labelCell}>Timeline:</td>
                <td style={valueCell}>{TIMELINE_LABELS[timeline] || timeline}</td>
              </tr>
              <tr>
                <td style={labelCell}>Budget:</td>
                <td style={valueCell}>{BUDGET_LABELS[budget] || budget}</td>
              </tr>
            </table>
          </Section>

          {/* Message Box */}
          <Section style={messageBox}>
            <Heading as="h2" style={h2}>
              💬 Project Description
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          {/* Requirements Box (if provided) */}
          {requirements && (
            <Section style={requirementsBox}>
              <Heading as="h2" style={h2}>
                ⚙️ Technical Requirements
              </Heading>
              <Text style={messageText}>{requirements}</Text>
            </Section>
          )}

          {/* Action Buttons */}
          <Section style={actionSection}>
            <table style={buttonTable}>
              <tr>
                <td style={buttonCell}>
                  <Link href="https://chnspart.com/mmm/dashboard" style={primaryButton} className="button">
                    📋 View in Dashboard
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={buttonCell}>
                  <Link href={`mailto:${email}`} style={secondaryButton} className="button">
                    ✉️ Reply to {fullname.split(' ')[0]}
                  </Link>
                </td>
              </tr>
            </table>
          </Section>

          {/* Divider */}
          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            This notification was automatically generated from the contact form at{' '}
            <Link href="https://chnspart.com/contact" style={linkStyle}>
              chnspart.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNotificationEmail;

// Styles using brand colors
const main = {
  backgroundColor: '#121212', // smoky-black
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#1f1f1f', // eerie-black-1
  margin: '0 auto',
  padding: '40px',
  maxWidth: '650px',
  borderRadius: '12px',
  border: '1px solid #383838', // jet
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

const badge = {
  display: 'inline-block',
  backgroundColor: '#ffd95a', // orange-yellow-crayola
  color: '#1f1f1f',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  letterSpacing: '0.5px',
};

const h1 = {
  color: '#fafafa', // white-2
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  lineHeight: '1.2',
};

const h2 = {
  color: '#fafafa', // white-2
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const alertText = {
  color: '#ffd95a', // orange-yellow-crayola
  fontSize: '16px',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
  lineHeight: '1.5',
};

const highlight = {
  color: '#c9a961', // vegas-gold
  fontWeight: 'bold' as const,
};

const infoBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #383838', // jet
};

const messageBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #ffd95a', // orange-yellow-crayola border for emphasis
};

const requirementsBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
  border: '1px solid #c9a961', // vegas-gold border
};

const infoTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#c9a961', // vegas-gold
  fontSize: '14px',
  padding: '6px 12px 6px 0',
  fontWeight: '600' as const,
  verticalAlign: 'top' as const,
  width: '35%',
};

const valueCell = {
  color: '#fafafa', // white-2
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
  backgroundColor: '#ffd95a', // orange-yellow-crayola
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
  color: '#ffd95a', // orange-yellow-crayola
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
  color: '#ffd95a', // orange-yellow-crayola
  textDecoration: 'underline',
};

const linkStyle = {
  color: '#ffd95a', // orange-yellow-crayola
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#383838', // jet
  margin: '32px 0',
};

const footer = {
  color: '#888888',
  fontSize: '13px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '0',
};
