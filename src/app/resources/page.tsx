'use client';

import React, { useState } from 'react';

// Paper note component with torn edges
const PaperNote = ({ 
  children, 
  className = "", 
  rotation = 0, 
  priority = false 
}: { 
  children: React.ReactNode; 
  className?: string; 
  rotation?: number; 
  priority?: boolean;
}) => {
  const rotationClass = rotation ? `rotate-[${rotation}deg]` : '';
  
  return (
    <div 
      className={`
        relative bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 
        ${rotationClass} ${className}
        ${priority ? 'border-l-4 border-slate-600' : ''}
      `}
      style={{
        clipPath: 'polygon(0% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 0% 100%)',
        backgroundImage: `
          linear-gradient(transparent 35px, #e5e7eb 35px, #e5e7eb 36px, transparent 36px),
          linear-gradient(90deg, #f3f4f6 0px, #f3f4f6 25px, transparent 25px)
        `,
        backgroundSize: '100% 36px, 100% 100%',
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.2))',
      }}
    >
      {/* Torn paper edge effect */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-white transform rotate-45 opacity-70" />
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white transform rotate-12 opacity-60" />
      
      {/* Three-hole punch effect */}
      <div className="absolute left-6 top-4 w-2 h-2 bg-gray-300 rounded-full" />
      <div className="absolute left-6 top-16 w-2 h-2 bg-gray-300 rounded-full" />
      <div className="absolute left-6 top-28 w-2 h-2 bg-gray-300 rounded-full" />
      
      {/* Content */}
      <div className="ml-4 font-handwriting text-gray-800 relative z-10">
        {children}
      </div>
    </div>
  );
};

// Emergency hotline component
const HotlineCard = ({ 
  title, 
  number, 
  description, 
  available = "24/7" 
}: { 
  title: string; 
  number: string; 
  description: string; 
  available?: string;
}) => (
  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-4">
    <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
    <div className="text-2xl font-bold text-gray-700 mb-2">
      <a href={`tel:${number.replace(/\D/g, '')}`} className="hover:underline">
        {number}
      </a>
    </div>
    <p className="text-gray-600 text-sm mb-1">{description}</p>
    <p className="text-gray-500 text-xs font-semibold">{available}</p>
  </div>
);

// Resource link component
const ResourceLink = ({ 
  title, 
  url, 
  description 
}: { 
  title: string; 
  url: string; 
  description: string;
}) => (
  <div className="border-l-4 border-slate-400 pl-4 mb-3">
    <h4 className="font-semibold text-slate-700 mb-1">
      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {title} ↗
      </a>
    </h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// Contact form component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to send message');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-700 mb-4 underline">CONTACT</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white disabled:bg-gray-100"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white resize-none disabled:bg-gray-100"
            placeholder="Your message here..."
          />
        </div>
        
        {submitStatus === 'success' && (
          <div className="text-green-600 text-sm font-medium">
            Message sent successfully!
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="text-red-600 text-sm font-medium">
            {errorMessage}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
};

export default function ResourcesPage() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Emergency Resources</h1>
    
      </div>

      {/* Grid of paper notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Mental Health Crisis Resources */}
        <PaperNote priority={true} rotation={-1}>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 underline">CRISIS HOTLINES</h2>
          
          <HotlineCard 
            title="988 Suicide & Crisis Lifeline"
            number="988"
            description="Free, confidential support for people in distress"
            available="24/7"
          />
          
          <HotlineCard 
            title="Crisis Text Line"
            number="Text HOME to 741741"
            description="Text-based crisis support"
            available="24/7"
          />
          
          <HotlineCard 
            title="SAMHSA National Helpline"
            number="1-800-662-4357"
            description="Treatment referral service"
            available="24/7"
          />
          

        </PaperNote>

        {/* ICE Emergency Resources */}
        <PaperNote priority={true} rotation={1}>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 underline">ICE EMERGENCY</h2>
          
          <HotlineCard 
            title="ACLU Immigrant Rights"
            number="1-877-881-8281"
            description="Know your rights hotline"
            available="24/7"
          />
          
          <HotlineCard 
            title="National Immigration Law Center"
            number="1-213-639-3900"
            description="Legal assistance and resources"
            available="Mon-Fri 9am-5pm"
          />
          
          <ResourceLink 
            title="Detainee Support & Advocacy"
            url="https://www.freedomforimmigrants.org"
            description="Freedom for Immigrants – National Immigration Detention Hotline"
          />
          

        </PaperNote>



        {/* Specific Mental Health Issues */}
        <PaperNote rotation={1}>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 underline">SPECIFIC SUPPORT</h2>
          
          <ResourceLink 
            title="Substance Abuse Treatment Locator"
            url="https://findtreatment.samhsa.gov"
            description="Find substance abuse treatment facilities"
          />
         
         
          <ResourceLink 
            title="National Eating Disorders Association"
            url="https://www.nationaleatingdisorders.org"
            description="Support for eating disorders - Call 1-800-931-2237"
          />
          
        
          
          <ResourceLink 
            title="National Domestic Violence Hotline"
            url="https://www.thehotline.org"
            description="24/7 support at 1-800-799-7233"
          />
          
         
          <ResourceLink 
            title="National Sexual Assault Hotline"
            url="https://www.rainn.org"
            description="24/7 support at 1-800-656-4673"
          />
        </PaperNote>

        {/* Immigration Legal Support */}
        <PaperNote rotation={-1}>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 underline">IMMIGRATION LEGAL</h2>
          
          <ResourceLink 
            title="Immigration Advocates Network"
            url="https://www.immigrationadvocates.org/nonprofit/legaldirectory/"
            description="Find free and low-cost legal services"
          />
          
          <ResourceLink 
            title="United We Dream"
            url="https://unitedwedream.org"
            description="Immigration support and advocacy"
          />
          
          <ResourceLink 
            title="Catholic Legal Immigration Network"
            url="https://cliniclegal.org"
            description="Legal services for immigrants"
          />
          
          <ResourceLink 
            title="Immigrant Legal Resource Center"
            url="https://www.ilrc.org"
            description="Legal training and advocacy"
          />
          

        </PaperNote>

        {/* Youth & Family Resources */}
        <PaperNote rotation={2}>
          <h2 className="text-2xl font-bold text-gray-700 mb-4 underline">FAMILY & YOUTH</h2>
          
          <ResourceLink 
            title="National Runaway Safeline"
            url="https://www.1800runaway.org"
            description="Support for runaway and homeless youth: 1-800-786-2929"
          />
          
          <ResourceLink 
            title="Childhelp National Child Abuse Hotline"
            url="https://www.childhelp.org"
            description="24/7 support at 1-800-422-4453"
          />
          
          <ResourceLink 
            title="National Center for Missing & Exploited Children"
            url="https://www.missingkids.org"
            description="Report missing children: 1-800-843-5678"
          />
          
          <ResourceLink 
            title="Teen Line"
            url="https://teenline.org"
            description="Teen-to-teen support: 1-800-852-8336"
          />
          
          <ResourceLink 
            title="Underage Drinking and Its Dangers"
            url="https://brownandcrouppen.com/underage-drinking-and-its-dangers"
            description="Information about the risks and consequences of underage drinking"
          />
          

        </PaperNote>

        {/* Contact Section */}
        <PaperNote rotation={-1}>
          <ContactForm />
        </PaperNote>

      </div>




    </div>
  );
} 