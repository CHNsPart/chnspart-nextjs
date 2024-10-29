// components/shared/TestimonialCard.tsx
import Image from "next/image";

interface TestimonialCardProps {
  avatar: string;
  name: string;
  role: string;
  company?: string;
  text: string;
  date: string;
  onClick: () => void;
}

export const TestimonialCard = ({ avatar, name, role, text, date, onClick }: TestimonialCardProps) => {
  return (
    <div className="content-card" onClick={onClick}>
      <figure className="testimonials-avatar-box">
        <Image 
          src={avatar} 
          alt={name} 
          width={60} 
          height={60} 
        />
      </figure>

      <h4 className="h4 testimonials-item-title">{name}</h4>
      <h4 className="exp-role testimonials-item-title">{role}</h4>

      <time className="hidden" dateTime={date}>{date}</time>

      <div className="testimonials-text">
        <p>{text}</p>
      </div>
    </div>
  );
};