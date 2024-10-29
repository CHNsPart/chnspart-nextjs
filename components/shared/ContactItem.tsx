interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  info: string;
  link?: string;
}

export const ContactItem = ({ icon, title, info, link }: ContactItemProps) => (
  <li className="flex items-center gap-4">
    <div className="relative bg-gradient-to-br from-[hsl(0,0%,25%)] to-transparent w-[30px] h-[30px] rounded-lg 
    flex justify-center items-center text-[hsl(45,100%,72%)] shadow-md">
      {icon}
    </div>
    <div>
      <p className="text-[hsl(0,0%,84%,0.7)] text-xs uppercase mb-0.5">{title}</p>
      {link ? (
        <a href={link} className="text-white text-sm">{info}</a>
      ) : (
        <span className="text-white text-sm">{info}</span>
      )}
    </div>
  </li>
);