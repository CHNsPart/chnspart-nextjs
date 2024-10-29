import Image from 'next/image';
import { Eye } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  link: string;
}

export const ProjectCard = ({ title, category, image, link }: ProjectCardProps) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="block group"
  >
    <div className="relative mb-4 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all z-10" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-[var(--jet)] text-[var(--orange-yellow-crayola)] p-4 rounded-xl
        opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100
        transition-all z-20">
        <Eye size={24} />
      </div>
      
      <Image
        src={image}
        alt={title}
        width={400}
        height={300}
        className="w-full h-[200px] object-cover transition-transform group-hover:scale-110"
      />
    </div>
    
    <h3 className="text-[var(--white-2)] text-base mb-1">{title}</h3>
    <p className="text-[var(--light-gray-70)] text-sm capitalize">{category}</p>
  </a>
);