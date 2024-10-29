// components/shared/Clients.tsx
import Image from "next/image";
import { CLIENTS } from "@/lib/constants";

export const Clients = () => {
  return (
    <section className="clients">
      <h3 className="h3 clients-title font-bold">Clients</h3>

      <ul className="clients-list has-scrollbar">
        {CLIENTS.map((client, index) => (
          <li key={index} className="clients-item">
            <span>
              <Image 
                src={client.logo} 
                alt={`${client.name} logo`}
                width={200}
                height={100}
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};