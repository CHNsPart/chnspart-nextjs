// File: components/sections/Contact.tsx
'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <article className="active" data-page="contact">
      <header>
        <h2 className="h2 article-title">
          Contact
        </h2>
      </header>

      <div className="mb-8 h-[250px] md:h-[380px] rounded-2xl border border-[var(--jet)] overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11420.114250423369!2d-78.33353679790835!3d44.30936331569579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d58c9312853901%3A0xee2341b4e02f22d0!2s227%20McDonnel%20St%2C%20Peterborough%2C%20ON%20K9H%202W1!5e0!3m2!1sen!2sca!4v1697403960683!5m2!1sen!2sca"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1) invert(1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <section>
        <h3 className="text-[var(--white-2)] text-xl mb-5">Contact Form</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullname"
              placeholder="Full name"
              required
              className="bg-transparent text-[var(--white-2)] text-sm p-4 border border-[var(--jet)] 
              rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]"
              value={formData.fullname}
              onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="bg-transparent text-[var(--white-2)] text-sm p-4 border border-[var(--jet)] 
              rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <textarea
            name="message"
            placeholder="Your Message"
            required
            className="w-full min-h-[120px] max-h-[200px] bg-transparent text-[var(--white-2)] text-sm p-4 
            border border-[var(--jet)] rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]
            resize-y"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          />

          <button
            type="submit"
            className="gradient-border ml-auto flex items-center gap-2 px-5 py-4 rounded-xl 
            text-[var(--orange-yellow-crayola)] text-sm font-medium transition-all
            hover:bg-gradient-to-br hover:from-[hsl(45,100%,71%)] hover:to-[hsla(36,100%,69%,0)]
            md:w-max"
          >
            <Send size={18} />
            <span>Send Message</span>
          </button>
        </form>
      </section>
    </article>
  );
}