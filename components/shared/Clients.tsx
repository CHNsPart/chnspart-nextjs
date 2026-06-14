// components/shared/Clients.tsx
import { CLIENTS } from "@/lib/constants";

export const Clients = () => {
  return (
    <section className="clients">
      <h3 className="h3 clients-title font-bold">Clients</h3>

      <ul className="clients-list has-scrollbar">
        {CLIENTS.map((client, index) => (
          <li key={index} className="clients-item">
            <span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                width={200}
                height={100}
                loading="lazy"
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};