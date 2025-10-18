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
  Img,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface ClientConfirmationEmailProps {
  fullname: string;
  projectType: string;
  timeline: string;
  budget: string;
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

export const ClientConfirmationEmail = ({
  fullname,
  projectType,
  timeline,
  budget,
}: ClientConfirmationEmailProps) => {
  const previewText = `Thank you for reaching out, ${fullname}! I'm excited about your ${PROJECT_TYPE_LABELS[projectType]} project.`;

  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 20px !important; }
            .header-logo { width: 100px !important; height: auto !important; }
            .heading { font-size: 22px !important; }
            .text { font-size: 15px !important; }
            .summary-box { padding: 20px !important; }
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
              width="120"
              height="auto"
              style={logo}
              className="header-logo"
            />
          </Section>

          {/* Main Heading */}
          <Heading style={h1} className="heading">
            Thank You for Reaching Out!
          </Heading>

          {/* Greeting */}
          <Text style={text} className="text">
            Hi {fullname},
          </Text>

          {/* Warm Introduction */}
          <Text style={text} className="text">
            I hope this message finds you well! Thank you so much for taking the time to share your
            <strong style={highlight}> {PROJECT_TYPE_LABELS[projectType] || projectType}</strong> project
            vision with me. I'm genuinely excited to learn more about what you're looking to build!
          </Text>

          <Text style={text} className="text">
            Your inquiry means a lot to me, and I want to assure you that I'll give it the attention
            and care it deserves. I believe great projects start with great communication, and I'm committed
            to understanding your needs fully.
          </Text>

          {/* Project Summary Box */}
          <Section style={summaryBox} className="summary-box">
            <Heading as="h2" style={h2}>
              📋 Your Project Summary
            </Heading>
            <table style={summaryTable}>
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

          {/* Response Time */}
          <Text style={text} className="text">
            I've carefully reviewed your project details and will get back to you within{' '}
            <strong style={highlight}>24-48 hours</strong> with my thoughts, questions, and next steps.
          </Text>

          {/* Portfolio CTA */}
          <Text style={text} className="text">
            In the meantime, feel free to explore my portfolio at{' '}
            <Link href="https://chnspart.com" style={linkStyle}>
              chnspart.com
            </Link>{' '}
            to see some of the projects I've brought to life for other clients. I'd love for you to
            get a sense of what we could create together!
          </Text>

          {/* Divider */}
          <Hr style={hr} />

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureName}>
              Warm regards,
            </Text>
            <Text style={signatureTitle}>
              <strong>Touhidul Islam Chayan</strong>
            </Text>
            <Text style={signatureRole}>
              Full Stack Developer & UI/UX Designer
            </Text>
            <Text style={signatureContact}>
              <Link href="https://chnspart.com" style={linkStyle}>
                chnspart.com
              </Link>
              {' • '}
              <Link href="mailto:imchn24@gmail.com" style={linkStyle}>
                imchn24@gmail.com
              </Link>
            </Text>
          </Section>

          {/* Footer Note */}
          <Text style={footerNote}>
            This is an automated confirmation to let you know I've received your message.
            I'll personally review your project and respond soon!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ClientConfirmationEmail;

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
  maxWidth: '600px',
  borderRadius: '12px',
  border: '1px solid #383838', // jet
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const h1 = {
  color: '#fafafa', // white-2
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
  lineHeight: '1.2',
};

const h2 = {
  color: '#fafafa', // white-2
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const text = {
  color: '#e0e0e0', // light text
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const highlight = {
  color: '#ffd95a', // orange-yellow-crayola
  fontWeight: 'bold' as const,
};

const summaryBox = {
  backgroundColor: '#2a2a2a', // slightly lighter than eerie-black
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #ffd95a', // orange-yellow-crayola border
};

const summaryTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#c9a961', // vegas-gold
  fontSize: '15px',
  padding: '8px 12px 8px 0',
  fontWeight: '600' as const,
  verticalAlign: 'top' as const,
  width: '40%',
};

const valueCell = {
  color: '#fafafa', // white-2
  fontSize: '15px',
  padding: '8px 0',
  fontWeight: '500' as const,
};

const linkStyle = {
  color: '#ffd95a', // orange-yellow-crayola
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#383838', // jet
  margin: '32px 0',
};

const signatureSection = {
  marginTop: '24px',
};

const signatureName = {
  color: '#e0e0e0',
  fontSize: '16px',
  margin: '0 0 8px 0',
  lineHeight: '1.4',
};

const signatureTitle = {
  color: '#fafafa', // white-2
  fontSize: '18px',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const signatureRole = {
  color: '#c9a961', // vegas-gold
  fontSize: '14px',
  margin: '0 0 12px 0',
  lineHeight: '1.4',
};

const signatureContact = {
  color: '#e0e0e0',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
};

const footerNote = {
  color: '#888888',
  fontSize: '13px',
  lineHeight: '1.5',
  marginTop: '32px',
  paddingTop: '24px',
  borderTop: '1px solid #383838',
  textAlign: 'center' as const,
};
