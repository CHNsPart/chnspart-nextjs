import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Code } from 'lucide-react';
import { TimelineItem, DescriptionItem, Link } from '@/types';

interface TimelineProps {
  title: string;
  icon: "book" | "briefcase" | "code-slash";
  items: TimelineItem[];
}

export const Timeline = ({ title, icon, items }: TimelineProps) => {
  const Icon = icon === "book" ? BookOpen : icon === "code-slash" ? Code : Briefcase;

  const renderLinks = (links: Link[], separator: string = " ") => {
    return links.map((link, index) => (
      <span key={index} className='hover:underline hover:underline-offset-2'>
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="links-only"
        >
          ♦ {link.text}
        </a>
        {index < links.length - 1 && separator}
      </span>
    ));
  };

  const renderDescription = (description: string | Array<string | DescriptionItem>) => {
    if (typeof description === "string") {
      return <p className="timeline-text">{description}</p>;
    }

    if (Array.isArray(description)) {
      return (
        <div className="timeline-text space-y-2">
          {description.map((item, index) => {
            if (typeof item === "string") {
              return (
                <p key={index} className="!text-light-gray">
                  {item}
                </p>
              );
            }

            const desc = item as DescriptionItem;
            return (
              <div key={index} className="space-y-1">
                {desc.text && (
                  <p className="font-medium">
                    {desc.text}
                  </p>
                )}
                
                {desc.description && (
                  <p className="ml-4 text-light-gray">
                    {desc.description}
                  </p>
                )}
                
                {desc.links && (
                  <div className="ml-4 inline-flex gap-2 flex-wrap">
                    {renderLinks(desc.links)}
                  </div>
                )}

                {desc.link && (
                  <div className="ml-4 inline-flex gap-2">
                    {renderLinks(Array.isArray(desc.link) ? desc.link : [desc.link])}
                  </div>
                )}

                {desc.credentials && (
                  <div className="ml-4 text-sm">
                    <span className="links-only">username</span> - {desc.credentials.username} {" "}
                    <span className="links-only">password</span> - {desc.credentials.password}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <section className="timeline mb-8">
      <motion.div 
        className="title-wrapper"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="icon-box">
          <Icon size={16} />
        </div>
        <h3 className="h3 font-bold">{title}</h3>
      </motion.div>

      <ol className="timeline-list">
        {items.map((item, index) => (
          <motion.li 
            key={index} 
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-baseline gap-2">
              {item.url ? (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h4 exp-title font-bold hover:underline hover:underline-offset-2"
                >
                  {item.title}
                </a>
              ) : (
                <h4 className="h4 timeline-item-title font-bold">
                  {item.title}
                </h4>
              )}
            </div>

            {item.role && (
              <h4 className="h4 timeline-item-title">{item.role}</h4>
            )}

            {item.period && (
              <span className="text-[var(--vegas-gold)] font-normal">
                {item.period}
              </span>
            )}

            {item.description && (
              <div className="mt-2">
                {renderDescription(item.description)}
              </div>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
};