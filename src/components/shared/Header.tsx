import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  HeaderPhonesStatic,
  MobileMenuContactStatic,
} from "@/modules/about/components/CompanyStatic";

// Live company phones (own query chunk — never in the critical bundle).
const HeaderPhonesLive = lazy(() =>
  import("@/modules/about/components/CompanyLive").then((m) => ({
    default: m.HeaderPhonesLive,
  })),
);
const MobileMenuContactLive = lazy(() =>
  import("@/modules/about/components/CompanyLive").then((m) => ({
    default: m.MobileMenuContactLive,
  })),
);

interface HeaderProps {
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  // Live contact blocks mount only post-hydration: SSR + first client tick
  // render the static fallback with NO Suspense boundary, so hydration is
  // byte-identical (an SSR <Suspense> emits comment/template markers the
  // client doesn't reproduce → React #419, Best Practices 96).
  const [liveReady, setLiveReady] = useState(false);
  useEffect(() => {
    setLiveReady(true);
  }, []);

  // Render-phase state adjustment to close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", to: "/", title: "V V Studio | Luxury Salon | Female Salon | J P Nagar, Bengaluru" },
    {
      name: "About",
      to: "/about",
      title: "About V V Studio | Luxury Female Salon in J P Nagar, Bengaluru",
    },
    {
      name: "Services",
      to: "/services",
      title: "V V Studio | Female Salon Services in J P Nagar, Bengaluru",
    },
    {
      name: "Gallery",
      to: "/gallery",
      title: "VV Studio Salon & Beauty Gallery",
    },
    { name: "Blog", to: "/blog", title: "VV Studio Beauty & Wellness Blog" },
    {
      name: "Contact",
      to: "/contact",
      title: "Contact VV Studio | Get in Touch With Our Creative Team",
    },
  ];

  const handleNavClick = (to: string) => {
    if (
      to === "/contact" ||
      to === "/about" ||
      to === "/services" ||
      to === "/blog" ||
      to === "/gallery"
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (to.includes("#")) {
      const id = to.split("#")[1];
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLinkActive = (link: { name: string; to: string }) => {
    if (link.to === "/contact") {
      return location.pathname === "/contact";
    }
    if (link.to === "/about") {
      return location.pathname === "/about";
    }
    if (link.to === "/services") {
      return location.pathname === "/services";
    }
    if (link.to === "/gallery") {
      return location.pathname === "/gallery";
    }
    if (link.to === "/blog") {
      return location.pathname === "/blog";
    }
    if (link.name === "Home") {
      return location.pathname === "/" && !location.hash;
    }
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 py-2 sm:py-2.5 right-0 z-40 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "bg-[#3D003D]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.3)]"
            : "bg-gradient-to-b from-black/35 to-transparent"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between min-h-[56px] gap-6">
            {/* Brand Logo */}
            <Logo theme="dark" size="md" />

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-white/90"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    title={link.title}
                    onClick={() => handleNavClick(link.to)}
                    className={`relative py-1 transition-colors duration-200 hover:text-white ${
                      active ? "text-white font-semibold" : "text-white/85"
                    }`}
                  >
                    <span>{link.name}</span>
                    {/* Pink underline active indicator matching reference */}
                    <span
                      className={`absolute bottom-[-2px] left-0 right-0 h-[2px] bg-[#D91A8A] rounded-full transition-all duration-300 ${
                        active ? "opacity-100" : "opacity-0 hover:opacity-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Contact Numbers, Socials & Book Appointment CTA on Right - single line */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              {liveReady ? (
                <Suspense fallback={<HeaderPhonesStatic />}>
                  <HeaderPhonesLive />
                </Suspense>
              ) : (
                <HeaderPhonesStatic />
              )}

              <span className="text-white/30 mx-1">|</span>

              {/* Socials - inline SVGs (lucide removed brand icons) */}
              <span className="flex items-center gap-2.5 pl-1">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="VV Studio on Instagram"
                  aria-label="VV Studio on Instagram"
                  className="text-white/85 hover:text-white transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/vvstudioblr"
                  target="_blank"
                  rel="noreferrer"
                  title="VV Studio on Facebook"
                  aria-label="VV Studio on Facebook"
                  className="text-white/85 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  title="VV Studio on X"
                  aria-label="VV Studio on X"
                  className="text-white/85 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@vvstudio512"
                  target="_blank"
                  rel="noreferrer"
                  title="VV Studio on YouTube"
                  aria-label="VV Studio on YouTube"
                  className="text-white/85 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </span>

              <Button
                variant="primary"
                size="sm"
                withArrow
                onClick={onOpenBooking}
                className="!px-5 !py-2 !text-[13px] !leading-none bg-[#D91A8A] hover:bg-[#A80086] shadow-[0_8px_20px_-5px_rgba(232,50,157,0.55)] cursor-pointer whitespace-nowrap"
              >
                Book Appointment
              </Button>
            </div>

            {/* Mobile Menu & Quick Book Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1 text-[13px] bg-[#D91A8A] hover:bg-[#A80086] text-white pl-4 pr-3.5 py-2 rounded-full font-semibold active:scale-95 transition-all shadow-[0_4px_14px_rgba(232,50,157,0.5)] min-h-[38px]"
              >
                Book
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 text-white hover:text-[#F8C1DE] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl cursor-pointer transition-colors"
                aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Sidebar — slides in from the right */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="lg:hidden fixed inset-0 z-50"
        >
          {/* Scrim — tap to close */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default animate-in fade-in duration-300"
          />
          <aside className="absolute top-0 right-0 h-full w-[85%] max-w-[340px] flex flex-col bg-[#2B002B] border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <Logo theme="dark" size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 text-white hover:text-[#F8C1DE] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl cursor-pointer transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav
              aria-label="Mobile"
              className="flex-1 overflow-y-auto p-3 sm:p-4"
            >
              {navLinks.map((link, i) => {
                const active = isLinkActive(link);
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    title={link.title}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(link.to);
                    }}
                    style={{ transitionDelay: `${i * 30}ms` }}
                    className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-[17px] font-medium transition-all animate-in fade-in slide-in-from-right-4 duration-300 ${
                      active
                        ? "bg-[#D91A8A]/15 text-white"
                        : "text-white/85 hover:bg-white/5 hover:text-white active:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {link.name}
                      {active && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#D91A8A]"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span aria-hidden="true" className="text-white/30">
                      →
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex flex-col gap-3">
              <Suspense fallback={<MobileMenuContactStatic />}>
                <MobileMenuContactLive />
              </Suspense>

              <Button
                variant="primary"
                size="lg"
                withArrow
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full justify-center bg-[#D91A8A] hover:bg-[#A80086] min-h-[52px] text-[15px]"
              >
                Book Appointment Now
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
