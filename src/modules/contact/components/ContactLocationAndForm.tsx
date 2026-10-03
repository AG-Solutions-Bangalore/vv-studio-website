import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import {
  MapPin,
  Navigation,
  User,
  Mail,
  Phone,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SERVICES_DATA } from '@/data/salonData';
import {
  STUDIO_DIRECTIONS_URL,
  STUDIO_MAP_EMBED_SRC,
} from '@/data/salonData';
import { useSubmitEnquiry } from '@/modules/home/hooks/useEnquiry';
import { useCompanyInfo } from '@/modules/about/hook/useCompanyInfo';
import { getUtmParams } from '@/lib/utm';

export const ContactLocationAndForm: React.FC = () => (
  // Own provider over the shared singleton client (see main.tsx): the query
  // runtime loads with the contact route chunk, never with the critical path.
  <QueryClientProvider client={queryClient}>
    <ContactLocationAndFormInner />
  </QueryClientProvider>
);

const ContactLocationAndFormInner: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: submitEnquiry, isPending } = useSubmitEnquiry();
  // Live studio address (GET /getCompany) with static fallback.
  const company = useCompanyInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const utm = getUtmParams();
      await submitEnquiry({
        enquiryFullName: fullName.trim(),
        enquiryEmail: email.trim(),
        enquiryMobile: cleanedPhone.slice(-10),
        enquiryProduct: selectedService || 'Contact Us - General Enquiry',
        enquiryMessage: message.trim(),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      setIsSubmitted(true);
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setSelectedService('');
      setMessage('');
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or reach out to us via WhatsApp or Phone.';
      setErrorMessage(errorMsg);
    }
  };

  const mapDirectionUrl = STUDIO_DIRECTIONS_URL;

  return (
    <section id="location-and-form" className="py-10 sm:py-12 lg:py-16 bg-[#FCFCFC]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Left Column: Our Location */}
          <div className="lg:col-span-6 flex flex-col justify-start min-w-0">
            <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-2">
              FIND US
            </p>
            <h2 className="font-display italic text-[26px] sm:text-4xl text-[#2D0A2E] font-semibold tracking-tight leading-[1.15] mb-2.5 sm:mb-3">
              Our Location
            </h2>
            <p className="text-[#6D5D6A] text-sm sm:text-[15px] leading-relaxed mb-5 sm:mb-6">
              We are conveniently located in the heart of JP Nagar, Bangalore.
              Step into our studio for a relaxing and rejuvenating beauty experience.
            </p>

            {/* Map Canvas with Floating Card */}
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EEDBEC] shadow-[0_8px_30px_rgba(80,0,70,0.06)] bg-[#F5ECF2]">
              <iframe
                title="V V Studio JP Nagar Map"
                src={STUDIO_MAP_EMBED_SRC}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Overlay Card matching design */}
              <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[360px] max-w-[360px] bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.14)] border border-[#F4E1EE] text-center flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#FFF0F7] flex items-center justify-center text-[#D91A8A] shrink-0">
                    <MapPin className="w-4 h-4 fill-current text-[#D91A8A]" />
                  </div>
                  <h3 className="font-bold text-[#2D0A2E] text-sm sm:text-[15px]">
                    V V Studio
                  </h3>
                </div>

                <p className="text-[11px] sm:text-xs text-[#6B5C69] leading-relaxed mb-3 sm:mb-3.5 max-w-[280px]">
                  {company.addressShort}
                </p>

                <a
                  href={mapDirectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Get Directions to VV Studio"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#D91A8A] hover:bg-[#A80086] text-white text-xs font-semibold px-5 py-2 sm:py-2 transition-all shadow-[0_4px_14px_rgba(232,50,157,0.4)] hover:shadow-[0_6px_20px_rgba(232,50,157,0.55)] cursor-pointer min-h-[36px]"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Send Us a Message / Get In Touch Form */}
          <div className="lg:col-span-6 min-w-0">
            <div className="rounded-2xl sm:rounded-3xl bg-[#FFF5F9] border border-[#FCE1EE] p-5 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(180,30,120,0.04)]">
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#D91A8A] mb-2">
                SEND US A MESSAGE
              </p>
              <h2 className="font-display italic text-[26px] sm:text-4xl text-[#2D0A2E] font-semibold tracking-tight leading-[1.15] mb-2">
                Get in Touch
              </h2>
              <p className="text-[#6D5D6A] text-xs sm:text-[13px] leading-relaxed mb-6">
                Have a question, need a consultation, or want to book an appointment?
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>

              {isSubmitted ? (
                <div className="bg-white/90 border border-[#D91A8A]/30 rounded-2xl p-7 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#FDF0F8] text-[#D91A8A] mx-auto flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display italic text-2xl text-[#2D0A2E] font-semibold mb-2">
                    Message Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665763] leading-relaxed mb-5">
                    Thank you for reaching out to V V Studio. Our team will review your enquiry
                    and contact you promptly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="border-[#E8329D] text-[#B3127A] hover:bg-[#FFF0F7]"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Your Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B8997]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name *"
                      className="w-full pl-10 pr-4 py-3 bg-white text-[#2D0A2E] text-sm rounded-xl border border-[#F1E0EC] focus:border-[#E8329D] focus:ring-2 focus:ring-[#E8329D]/20 focus:outline-none transition-all placeholder:text-[#A798A3]"
                    />
                  </div>

                  {/* Your Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B8997]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email *"
                      className="w-full pl-10 pr-4 py-3 bg-white text-[#2D0A2E] text-sm rounded-xl border border-[#F1E0EC] focus:border-[#E8329D] focus:ring-2 focus:ring-[#E8329D]/20 focus:outline-none transition-all placeholder:text-[#A798A3]"
                    />
                  </div>

                  {/* Your Phone Number */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B8997]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Your Phone Number *"
                      className="w-full pl-10 pr-4 py-3 bg-white text-[#2D0A2E] text-sm rounded-xl border border-[#F1E0EC] focus:border-[#E8329D] focus:ring-2 focus:ring-[#E8329D]/20 focus:outline-none transition-all placeholder:text-[#A798A3]"
                    />
                  </div>

                  {/* Select a Service */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9B8997]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-white text-[#2D0A2E] text-sm rounded-xl border border-[#F1E0EC] focus:border-[#E8329D] focus:ring-2 focus:ring-[#E8329D]/20 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-[#A798A3]">
                        Select a Service
                      </option>
                      {SERVICES_DATA.map((srv) => (
                        <option key={srv.id} value={srv.title}>
                          {srv.title}
                        </option>
                      ))}
                      <option value="General Consultation">
                        General Consultation / Other
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9B8997]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Your Message */}
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#9B8997]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your Message *"
                      className="w-full pl-10 pr-4 py-3 bg-white text-[#2D0A2E] text-sm rounded-xl border border-[#F1E0EC] focus:border-[#E8329D] focus:ring-2 focus:ring-[#E8329D]/20 focus:outline-none transition-all placeholder:text-[#A798A3] resize-y"
                    />
                  </div>

                  {/* Send Message Button */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-[#D91A8A] hover:bg-[#A80086] text-white font-medium text-sm transition-all duration-300 shadow-[0_8px_25px_rgba(232,50,157,0.45)] hover:shadow-[0_12px_30px_rgba(232,50,157,0.6)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
