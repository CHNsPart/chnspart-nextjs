'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';

interface FormState {
  fullname: string;
  email: string;
  message: string;
  projectType: string;
  timeline: string;
  budget: string;
  requirements: string;
  honeypot?: string;
}

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

const PROJECT_TYPE_LABELS: { [key: string]: string } = {
  'sweb': 'Static Website',
  'aweb': 'Web Application',
  'app': 'Mobile App',
  'desktop': 'Desktop Application',
  'ai': 'AI/ML Solution',
  'ui': 'UI/UX Design',
  'logo': 'Logo Design',
  'branding': 'Branding'
};

const TIMELINE_OPTIONS: { [key: string]: string } = {
  '1m': 'Within 1 month',
  '1-3': '1-3 months',
  '3-6': '3-6 months',
  '6+': '6+ months'
};

const BUDGET_OPTIONS: { [key: string]: string } = {
  'xs': '$1.5k - $5k',
  'sm': '$5k - $10k',
  'md': '$10k - $25k',
  'lg': '$25k+'
};

export default function Contact() {
  const [formData, setFormData] = useState<FormState>({
    fullname: '',
    email: '',
    message: '',
    projectType: '',
    timeline: '',
    budget: '',
    requirements: '',
    honeypot: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });

  const resetForm = () => {
    setFormData({
      fullname: '',
      email: '',
      message: '',
      projectType: '',
      timeline: '',
      budget: '',
      requirements: '',
      honeypot: ''
    });
  };

  const validateForm = (data: FormState): boolean => {
    if (data.honeypot) return false;
    
    if (!data.email.includes('@') || !data.fullname.trim() || !data.message.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Please fill all required fields correctly.'
      });
      return false;
    }

    switch (data.projectType) {
      case 'ai':
        if (!data.requirements || data.requirements.length < 100) {
          setFormStatus({
            type: 'error',
            message: 'AI/ML projects require detailed technical requirements'
          });
          return false;
        }
        break;
      
      case 'branding':
        if (!data.message.toLowerCase().includes('company') && 
            !data.message.toLowerCase().includes('business')) {
          setFormStatus({
            type: 'error',
            message: 'Please include information about your company/business'
          });
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus({ type: null, message: '' });
  
    if (!validateForm(formData)) {
      setIsLoading(false);
      return;
    }
  
    try {
      // Create form submit URL
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScKMwZpRmMZAHgmEhCGr6iL5XWINlk9X4BQu35XqOrDc7zT_w/formResponse';
      
      // Create form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = formUrl;
      form.target = '_blank';
      
      const formFields = {
        // Full Name
        'entry.762586258': formData.fullname,
        // Email
        'entry.1748605394': formData.email,
        // Project Type  
        'entry.837080776': PROJECT_TYPE_LABELS[formData.projectType] || formData.projectType,
        // Timeline - use the mapping
        'entry.1344926538': TIMELINE_OPTIONS[formData.timeline] || '',
        // Budget Range - use the mapping
        'entry.1364809760': BUDGET_OPTIONS[formData.budget] || '',
        // Project Brief
        'entry.237065250': formData.message,
        // Technical Requirements
        'entry.319233900': formData.requirements || 'Not specified',
        // Required metadata
        'fvv': '1',
        'partialResponse': '[null,null,"7764873195851155049"]',
        'pageHistory': '0',
        'fbzx': '7764873195851155049'
      };

      // Create form inputs
      Object.entries(formFields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
  
      // Add form to document and submit
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
  
      // Show success message
      setFormStatus({
        type: 'success',
        message: `Thank you! Your ${PROJECT_TYPE_LABELS[formData.projectType]} project inquiry has been sent successfully. We'll get back to you soon!`
      });
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your inquiry. Please try again or contact us directly.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.article 
      className="active" 
      data-page="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="h2 article-title">Contact</h2>
      </motion.header>

      <motion.div 
        className="mb-8 h-[250px] md:h-[380px] rounded-2xl border border-[var(--jet)] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11420.114250423369!2d-78.33353679790835!3d44.30936331569579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d58c9312853901%3A0xee2341b4e02f22d0!2s227%20McDonnel%20St%2C%20Peterborough%2C%20ON%20K9H%202W1!5e0!3m2!1sen!2sca!4v1697403960683!5m2!1sen!2sca"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1) invert(1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-[var(--white-2)] text-xl mb-5">Project Inquiry Form</h3>

        <AnimatePresence mode="wait">
          {formStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl border ${
                formStatus.type === 'success'
                  ? 'bg-green-500/10 border-green-500 text-green-500'
                  : 'bg-red-500/10 border-red-500 text-red-500'
              } flex items-center gap-2`}
            >
              {formStatus.type === 'success' ? (
                <Check size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <p>{formStatus.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field for spam prevention */}
          <input
            type="text"
            name="honeypot"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot}
            onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
          />
          
          {/* Basic Info */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="text"
              name="fullname"
              placeholder="Full name"
              required
              disabled={isLoading}
              className="bg-transparent text-[var(--white-2)] text-sm p-4 border border-[var(--jet)] 
              rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]
              disabled:opacity-60 disabled:cursor-not-allowed"
              value={formData.fullname}
              onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              disabled={isLoading}
              className="bg-transparent text-[var(--white-2)] text-sm p-4 border border-[var(--jet)] 
              rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]
              disabled:opacity-60 disabled:cursor-not-allowed"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </motion.div>

          {/* Project Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <select 
              required
              disabled={isLoading}
              value={formData.projectType}
              onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
              className="form-select"
            >
              <option value="">Select project type</option>
              <option value="sweb">Static Website</option>
              <option value="aweb">Web Application</option>
              <option value="app">Mobile App</option>
              <option value="desktop">Desktop Application</option>
              <option value="ai">{"AI/ML Solution"}</option>
              <option value="ui">{"UI/UX Design"}</option>
              <option value="logo">Logo Design</option>
              <option value="branding">Brandings</option>
            </select>
          </motion.div>

          {/* Timeline & Budget */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <select 
              required
              disabled={isLoading}
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              className="form-select"
            >
              <option value="">Expected timeline</option>
              <option value="1m">Within 1 month</option>
              <option value="1-3">1-3 months</option>
              <option value="3-6">3-6 months</option>
              <option value="6+">6+ months</option>
            </select>
            
            <select 
              required
              disabled={isLoading}
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="form-select"
            >
              <option value="">Budget range (CAD)</option>
              <option value="xs">$1.5k - $5k</option>
              <option value="sm">$5k - $10k</option>
              <option value="md">$10k - $25k</option>
              <option value="lg">$25k+</option>
            </select>
          </motion.div>

          {/* Budget Guidance */}
          {formData.projectType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[var(--light-gray-70)] text-sm mt-2"
            >
              {formData.projectType === 'sweb' && "Typical budget: $1.5k - $10k depending on complexity"}
              {formData.projectType === 'aweb' && "Typical budget: $5k - $25k+ depending on features"}
              {formData.projectType === 'app' && "Typical budget: $10k - $25k+ depending on platform and features"}
              {formData.projectType === 'desktop' && "Typical budget: $10k - $25k+ depending on complexity"}
              {formData.projectType === 'ai' && "Typical budget: $25k+ depending on requirements"}
              {formData.projectType === 'ui' && "Typical budget: $5k - $10k per design package"}
              {formData.projectType === 'logo' && "Typical budget: $1.5k - $5k including variations"}
              {formData.projectType === 'branding' && "Typical budget: $10k - $25k for complete brand identity"}
            </motion.div>
          )}

          {/* Project Brief */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <textarea
              name="message"
              placeholder="Please describe your project goals and must-have features"
              required
              disabled={isLoading}
              className="w-full min-h-[120px] max-h-[200px] bg-transparent text-[var(--white-2)] text-sm p-4 
              border border-[var(--jet)] rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]
              resize-y disabled:opacity-60 disabled:cursor-not-allowed"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </motion.div>

          {/* Special Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <textarea
              name="requirements"
              placeholder="Any specific technical requirements, integrations, or compliance needs?"
              disabled={isLoading}
              className="w-full min-h-[80px] bg-transparent text-[var(--white-2)] text-sm p-4 
              border border-[var(--jet)] rounded-xl outline-none focus:border-[var(--orange-yellow-crayola)]
              resize-y disabled:opacity-60 disabled:cursor-not-allowed"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </motion.div>

          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="gradient-border ml-auto flex items-center gap-2 px-5 py-4 rounded-xl 
            hover:text-[var(--eerie-black-1)] text-[var(--orange-yellow-crayola)] text-sm font-medium transition-all
            hover:bg-gradient-to-br hover:from-[hsl(45,100%,71%)] hover:to-[hsla(36,100%,69%,0)]
            md:w-max disabled:opacity-60 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
          </motion.button>
        </form>
      </motion.section>
    </motion.article>
  );
}