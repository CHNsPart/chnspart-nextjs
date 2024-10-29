"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { SocialLinks } from '../shared/SocialLinks';
import { FaChevronDown } from "react-icons/fa";
import { useLayout } from '@/app/contexts/LayoutContext';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isMobile, isTablet, isLaptop, isDesktop } = useLayout();

  const getImageSize = () => {
    if (isDesktop) return 150;
    if (isLaptop || isTablet) return 120;
    return 80;
  };

  const imageSize = getImageSize();

  const renderButtonContent = () => {
    if (isTablet || isLaptop) {
      return <span>Show Contacts</span>;
    }
    if (isMobile) {
      return <FaChevronDown />;
    }
    return null;
  };

  const shouldShowButton = !isDesktop;

  return (
    <aside className={`sidebar ${isExpanded ? 'active' : ''}`} data-sidebar>
      <div className="sidebar-info">
      <figure className="avatar-box">
          <Image 
            src="/images/chayan.png" 
            alt="Touhidul Islam Chayan"
            priority
            quality={100}
            width={imageSize}
            height={imageSize}
            className="avatar-image object-cover object-center"
          />
        </figure>

        <div className="info-content">
          <h1 className="name" title="Touhidul Islam Chayan">
            Touhidul Islam Chayan
          </h1>
          <p className="title">Software Engineer</p>
        </div>

        {shouldShowButton && (
          <button 
            className="info_more-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            data-sidebar-btn
          >
            {renderButtonContent()}
          </button>
        )}
      </div>

      <div className="sidebar-info_more">
        <div className="separator" />

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <Mail size={16} />
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:imchn24@gmail.com" className="contact-link">
                imchn24@gmail.com
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <Phone size={16} />
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+16476794219" className="contact-link">
                +1-(647)-679-4219
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <Calendar size={16} />
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthyear</p>
              <time dateTime="1998">1998</time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <MapPin size={16} />
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>Peterborough, Ontario, Canada</address>
            </div>
          </li>
        </ul>

        <div className="separator" />
        <SocialLinks />
      </div>
    </aside>
  );
}