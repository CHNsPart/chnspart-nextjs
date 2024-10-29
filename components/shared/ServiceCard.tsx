import Image from 'next/image';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

export const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
  <li className="service-item relative bg-[var(--border-gradient-onyx)] p-[20px] rounded-[14px] 
    shadow-[var(--shadow-2)] z-[1]
    before:content-[''] before:absolute before:inset-[1px] before:bg-[var(--bg-gradient-jet)] 
    before:rounded-[inherit] before:-z-[1]
    md:flex md:justify-start md:items-start md:gap-[18px] md:p-[30px]">
    
    <div className="service-icon-box mb-[10px] md:mb-0 md:mt-[5px]">
      <Image 
        src={icon} 
        alt={title} 
        width={40} 
        height={40} 
        className="mx-auto md:mx-0"
      />
    </div>

    <div className="service-content-box text-center md:text-left">
      <h4 className="h4 service-item-title text-[var(--white-2)] text-[16px] mb-[7px]">
        {title}
      </h4>
      <p className="service-item-text text-[var(--light-gray)] text-[14px] font-[300] leading-[1.6]">
        {description}
      </p>
    </div>
  </li>
);