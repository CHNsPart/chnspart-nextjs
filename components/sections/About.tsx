// components/sections/About.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { TestimonialCard } from '../shared/TestimonialCard';
import { TestimonialModal } from '../shared/TestimonialModal';
import { Clients } from '../shared/Clients';
import { TESTIMONIALS, SERVICES } from '@/lib/constants';
import type { TestimonialType } from '@/types';

export default function About() {
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialType | null>(null);

  const handleTestimonialClick = (testimonial: TestimonialType) => {
    setSelectedTestimonial(testimonial);
    setIsModalActive(true);
  };

  return (
    <article className="about active" data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        <p>
          {`I'm Touhidul Islam Chayan, a software engineer specializing in front-end development, UI/UX design, and machine learning. 
          I have experience with independent international clients and full-time jobs, honing my skills in various technologies.`}
        </p>

        <p>
          {`My expertise is in Typescript/JavaScript, with a focus on front-end development using Next.JS 15, React 19, Vite with Tailwind CSS. 
          For back-end development, I use Node.JS and its frameworks, including Express.JS and Nest.JS. Additionally, 
          I'm a skilled UI/UX designer, creating visually appealing and user-friendly interfaces.`}
        </p>

        <p>
          {`In the field of machine learning, I have experience with deep learning and pre-trained models. 
          I've published research on IEEE in the computer vision field, where I used these techniques to predict 
          glaucoma with an accuracy of 94.71% and its explanation.`}
        </p>
      </section>

      <section className="service">
        <h3 className="h3 service-title font-bold">{"What i'm doing"}</h3>

        <ul className="service-list">
          {SERVICES.map((service, index) => (
            <li key={index} className="service-item">
              <div className="service-icon-box">
                <Image src={service.icon} alt={service.title} width={60} height={32} />
              </div>

              <div className="service-content-box">
                <h4 className="h4 service-item-title">{service.title}</h4>
                <p className="service-item-text">{service.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="testimonials">
        <h3 className="h3 testimonials-title font-bold">Testimonials</h3>

        <ul className="testimonials-list has-scrollbar">
          {TESTIMONIALS.map((testimonial, index) => (
            <li key={index} className="testimonials-item">
              <TestimonialCard
                {...testimonial}
                onClick={() => handleTestimonialClick(testimonial)}
              />
            </li>
          ))}
        </ul>
      </section>

      {selectedTestimonial && (
        <TestimonialModal
          isOpen={isModalActive}
          onClose={() => setIsModalActive(false)}
          testimonial={selectedTestimonial}
        />
      )}

      <Clients />
    </article>
  );
}