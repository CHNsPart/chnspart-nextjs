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
import {
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
  BUDGET_LABELS,
} from '@/lib/project-labels';

interface ClientConfirmationEmailProps {
  fullname: string;
  projectType: string;
  timeline: string;
  budget: string;
}

export const ClientConfirmationEmail = ({
  fullname,
  projectType,
  timeline,
  budget,
}: ClientConfirmationEmailProps) => {
  const firstName = fullname.trim().split(' ')[0] || fullname;
  const projectTypeLabel = PROJECT_TYPE_LABELS[projectType] || projectType;
  const previewText = `Got your ${projectTypeLabel} brief, ${firstName} — I'll reply within 48 hours.`;

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
            Got it, {firstName}.
          </Heading>

          {/* Opening */}
          <Text style={text} className="text">
            Your <strong style={highlight}>{projectTypeLabel}</strong> brief just
            landed in my inbox. Thanks for thinking of me for this — I'll read through
            it properly today.
          </Text>

          {/* Project Summary Box */}
          <Section style={summaryBox} className="summary-box">
            <Heading as="h2" style={h2}>
              Your brief at a glance
            </Heading>
            <table style={summaryTable}>
              <tbody>
                <tr>
                  <td style={labelCell}>Project:</td>
                  <td style={valueCell}>{projectTypeLabel}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Timeline:</td>
                  <td style={valueCell}>{TIMELINE_LABELS[timeline] || timeline}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Budget:</td>
                  <td style={valueCell}>{BUDGET_LABELS[budget] || budget}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Next step */}
          <Text style={text} className="text">
            <strong style={highlight}>What happens next:</strong> I'll review your brief
            and reply within <strong style={highlight}>24–48 hours</strong> with a few
            clarifying questions and next steps — usually a short call to scope things out.
          </Text>

          {/* Helpful ask */}
          <Text style={text} className="text">
            <strong>One small thing that helps:</strong> if you have references, competitor
            sites, a deck, or anything visual you like — just hit reply and send them over.
            It sharpens my response and saves us a back-and-forth.
          </Text>

          {/* Portfolio */}
          <Text style={text} className="text">
            While you wait, you can browse recent work at{' '}
            <Link href="https://chnspart.com/portfolio" style={linkStyle}>
              chnspart.com/portfolio
            </Link>
            .
          </Text>

          {/* Divider */}
          <Hr style={hr} />

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureName}>Talk soon,</Text>
            <Text style={signatureTitle}>
              <strong>Touhidul Islam Chayan</strong>
            </Text>
            <Text style={signatureRole}>
              Full Stack Developer &amp; UI/UX Designer
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

          <Text style={footerNote}>
            Automated confirmation — a real reply from me comes next.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

ClientConfirmationEmail.PreviewProps = {
  fullname: 'Jane Doe',
  projectType: 'aweb',
  timeline: '1-3',
  budget: 'md',
} satisfies ClientConfirmationEmailProps;

export default ClientConfirmationEmail;

const main = {
  backgroundColor: '#121212',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#1f1f1f',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
  borderRadius: '12px',
  border: '1px solid #383838',
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
  color: '#fafafa',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
  lineHeight: '1.2',
};

const h2 = {
  color: '#fafafa',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const text = {
  color: '#e0e0e0',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const highlight = {
  color: '#ffd95a',
  fontWeight: 'bold' as const,
};

const summaryBox = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  border: '1px solid #ffd95a',
};

const summaryTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#c9a961',
  fontSize: '15px',
  padding: '8px 12px 8px 0',
  fontWeight: '600' as const,
  verticalAlign: 'top' as const,
  width: '40%',
};

const valueCell = {
  color: '#fafafa',
  fontSize: '15px',
  padding: '8px 0',
  fontWeight: '500' as const,
};

const linkStyle = {
  color: '#ffd95a',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#383838',
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
  color: '#fafafa',
  fontSize: '18px',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};

const signatureRole = {
  color: '#c9a961',
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
