// components/shared/SocialLinks.tsx
import Link from 'next/link';
import { FaBehance, FaDribbble, FaLinkedin, FaGithub, FaFacebook, FaInstagram } from "react-icons/fa";

const socialLinks = [
  { 
    icon: FaBehance, 
    href: 'https://behance.net/chnspart',
    label: 'Behance Profile'
  },
  { 
    icon: FaDribbble, 
    href: 'https://dribbble.com/chnspart',
    label: 'Dribbble Profile'
  },
  { 
    icon: FaLinkedin, 
    href: 'https://www.linkedin.com/in/touhidul-islam-chayan-50b857143/',
    label: 'LinkedIn Profile'
  },
  { 
    icon: FaGithub, 
    href: 'https://github.com/CHNsPart',
    label: 'GitHub Profile'
  },
  { 
    icon: FaFacebook, 
    href: 'https://facebook.com/chnspart',
    label: 'Facebook Profile'
  },
  { 
    icon: FaInstagram, 
    href: 'https://instagram.com/chnspart',
    label: 'Instagram Profile'
  },
];

export const SocialLinks = () => (
  <ul className="social-list">
    {socialLinks.map((social) => (
      <li key={social.href} className="social-item">
        <Link
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={social.label}
        >
          <social.icon />
        </Link>
      </li>
    ))}
  </ul>
);