import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  link: string;
  index: number;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.15,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

export const ProjectCard = ({
  title,
  category,
  image,
  link,
  index,
  className
}: ProjectCardProps) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className={cn("group cursor-pointer", className)}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <motion.div 
            variants={overlayVariants}
            className="absolute inset-0 bg-black/50 z-10"
          />
          
          <motion.div
            variants={overlayVariants}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              bg-[var(--jet)] text-[var(--orange-yellow-crayola)] p-4 rounded-xl z-20"
          >
            <Eye size={24} />
          </motion.div>
          
          <motion.div variants={imageVariants}>
            <Image
              src={image}
              alt={title}
              width={400}
              height={300}
              className="w-full h-[200px] object-cover"
            />
          </motion.div>
        </div>
        
        <motion.div>
          <h3 className="text-[var(--white-2)] text-base mb-1 
            group-hover:text-[var(--orange-yellow-crayola)] transition-colors">
            {title}
          </h3>
          <p className="text-[var(--light-gray-70)] text-sm capitalize">
            {category}
          </p>
        </motion.div>
      </a>
    </motion.div>
  );
};