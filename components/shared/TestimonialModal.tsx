// components/shared/TestimonialModal.tsx
import Image from "next/image";
import { X } from "lucide-react";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: {
    avatar: string;
    name: string;
    role: string;
    company?: string;
    text: string;
    date: string;
  };
}

export const TestimonialModal = ({ isOpen, onClose, testimonial }: TestimonialModalProps) => {
  return (
    <div className={`modal-container ${isOpen ? 'active' : ''}`}>
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />

      <section className="testimonials-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-img-wrapper">
          <figure className="modal-avatar-box">
            <Image 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              width={80} 
              height={80} 
            />
          </figure>

          <Image 
            src="/images/icon-quote.svg" 
            alt="quote" 
            width={35} 
            height={35} 
          />
        </div>

        <div className="modal-content">
          <h4 className="h3 modal-title">{testimonial.name}</h4>
          <h4 className="exp-role modal-title">{testimonial.role}</h4>
          {testimonial.company && (
            <h4 className="exp-role modal-title">{testimonial.company}</h4>
          )}
          
          <time dateTime={testimonial.date}>
            {new Date(testimonial.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>

          <div className="testimonials-text">
            <p>{testimonial.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
};