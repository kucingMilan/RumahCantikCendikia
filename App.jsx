import { useState, useEffect, useRef } from "react";
import "./styles.css";

// ============ SUPABASE CONFIG ============
const SUPABASE_URL = "https://gpswkbqkkitndsmpqnvl.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwc3drYnFra2l0bmRzbXBxbnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODEzOTYsImV4cCI6MjA5MzM1NzM5Nn0.yzUgg-njBgqlR9GfmVI_qS1-V9VZxYwg1IR307ja6UM";

async function supaFetch(path) {
  const res = await fetch(SUPABASE_URL + "/rest/v1" + path, {
    headers: { apikey: SUPABASE_ANON, Authorization: "Bearer " + SUPABASE_ANON },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ============ FALLBACK CONTENT (used if Supabase fetch fails/empty) ============
const DEFAULT_SETTINGS = {
  business_name: "Rumah Cantik Cendekia",
  spa_label: "SPA",
  tagline: "Pijat ala Spa & bikin badan kembali segar langsung di rumah Anda",
  hero_script: "Home Service Massage",
  free_transport_label: "Free Transport",
  intro_text: "Datang ke rumah, kami bawakan perlengkapan spa, praktis, nyaman, dan bikin badan segar kembali.",
  whatsapp_number: "6281317866169",
  whatsapp_display: "0813-1786-6169",
  whatsapp_message: "Halo, saya mau tanya-tanya dan booking home service massage 🌸",
  cta_heading: "Siap dipijat sampai rileks?",
  cta_subtext: "Booking sekarang, terapis kami yang datang ke rumah Anda.",
};

const DEFAULT_SERVICES = [
  { id: "1", name: "Full body massage", duration_minutes: 60, price: 90000, original_price: 100000, badge: null, icon: "massage" },
  { id: "2", name: "Full body massage", duration_minutes: 90, price: 110000, original_price: 135000, badge: null, icon: "massage" },
  { id: "3", name: "Full body massage + totok wajah", duration_minutes: 120, price: 150000, original_price: 195000, badge: "+ Creambath", icon: "face" },
  { id: "4", name: "Full body massage + totok wajah + kerok", duration_minutes: 120, price: 160000, original_price: 210000, badge: "+ Creambath", icon: "face" },
  { id: "5", name: "Massage + lulur", duration_minutes: 100, price: 150000, original_price: 180000, badge: null, icon: "lulur" },
  { id: "6", name: "Full body massage anak & bunda", duration_minutes: 150, price: 180000, original_price: 235000, badge: null, icon: "family" },
  { id: "7", name: "Full body massage + refleksi", duration_minutes: 120, price: 150000, original_price: 195000, badge: null, icon: "feet" },
];

const DEFAULT_BADGES = [
  { id: "1", icon: "certified", label: "Terapis bersertifikat & ramah" },
  { id: "2", icon: "home", label: "Layanan datang ke rumah (praktis & nyaman)" },
  { id: "3", icon: "hygienic", label: "Peralatan higienis" },
  { id: "4", icon: "calendar", label: "Booking mudah & fleksibel" },
];

// ============ DATA HOOK ============
function useSiteContent() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [badges, setBadges] = useState(DEFAULT_BADGES);

  useEffect(() => {
    (async () => {
      try {
        const [s, sv, b] = await Promise.all([
          supaFetch("/cendekia_settings?select=key,value"),
          supaFetch("/cendekia_services?is_active=eq.true&order=display_order.asc"),
          supaFetch("/cendekia_trust_badges?is_active=eq.true&order=display_order.asc"),
        ]);
        if (s && s.length) {
          const obj = {};
          s.forEach((r) => { obj[r.key] = r.value; });
          setSettings((prev) => ({ ...prev, ...obj }));
        }
        if (sv && sv.length) setServices(sv);
        if (b && b.length) setBadges(b);
      } catch (e) {
        // keep defaults — landing page must never look broken to a visitor
      }
    })();
  }, []);

  return { settings, services, badges };
}

// ============ HELPERS ============
function formatK(n) {
  if (n == null) return "";
  return Math.round(n / 1000) + "k";
}

function waLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// ============ ICONS (bespoke line icons, single stroke) ============
function Icon({ name, className }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", className };
  switch (name) {
    case "massage":
      return (
        <svg {...common}>
          <circle cx="12" cy="5.2" r="2" />
          <path d="M7.5 16c0-3.3 2-5.8 4.5-5.8s4.5 2.5 4.5 5.8" />
          <path d="M6.5 13c1-1.1 2-1.4 2.8-1M17.5 13c-1-1.1-2-1.4-2.8-1" />
        </svg>
      );
    case "lulur":
      return (
        <svg {...common}>
          <path d="M12 3c1.5 1.8 2.5 3.3 2.5 5a2.5 2.5 0 0 1-5 0c0-1.7 1-3.2 2.5-5Z" />
          <path d="M6 13c1.2-1 2.6-1 4 0M14 13c1.4-1 2.8-1 4 0" />
          <path d="M4 20c1.5-3 4.5-4.5 8-4.5s6.5 1.5 8 4.5" />
        </svg>
      );
    case "face":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.5 10.5h.01M14.5 10.5h.01" />
          <path d="M9 15c1 1 4 1 5 0" />
        </svg>
      );
    case "family":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="7" r="2.3" />
          <path d="M4 19c0-3.4 2-5.7 4.5-5.7s4.5 2.3 4.5 5.7" />
          <circle cx="16.3" cy="10.3" r="1.7" />
          <path d="M13 19c0-2.5 1.4-4.2 3.2-4.2s3.3 1.7 3.3 4.2" />
        </svg>
      );
    case "feet":
      return (
        <svg {...common}>
          <path d="M8.3 20c-2 0-3-1.9-3-4.6C5.3 11.7 6.7 7.5 9 7.5s3.3 3.1 3.3 6.6c0 3.5-1.4 5.9-4 5.9Z" />
          <path d="M6.5 7.2c.3-.9.6-1.5 1-1.5M8 6.3c.2-.9.3-1.6.3-1.6M9.7 6.3c-.1-.9-.1-1.6 0-1.6" />
          <path d="M17 17.2c-1.7 0-2.6-1.5-2.6-3.9 0-3 1.2-6.3 3.2-6.3s2.7 2.6 2.7 5.6c0 3-1 4.6-3.3 4.6Z" />
          <path d="M15.3 6.9c.2-.8.5-1.4.8-1.4M16.7 6c.1-.8.2-1.4.2-1.4M18.2 6c0-.8-.1-1.4-.2-1.4" />
        </svg>
      );
    case "certified":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5.5" />
          <path d="M9 9.2l1.8 1.8L15 7.5" />
          <path d="M9 14l-1.5 6L12 18l4.5 2L15 14" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9h12v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );
    case "hygienic":
      return (
        <svg {...common}>
          <path d="M12 3.5c3 1.2 5 1.6 7 1.6 0 8-3 12-7 15.4-4-3.4-7-7.4-7-15.4 2 0 4-.4 7-1.6Z" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
          <path d="M4 10h16M8 3.5v3.5M16 3.5v3.5" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} strokeWidth="1.4">
          <path d="M6.5 17.5 4.8 21l3.6-1.6a8.4 8.4 0 1 0-1.9-1.9Z" />
          <path d="M9 9.3c0-.5.4-1 1-1h.5c.3 0 .6.2.7.5l.6 1.5c.1.3 0 .6-.1.8l-.5.6c-.2.2-.2.5-.1.8.5 1 1.5 2 2.5 2.5.3.1.6.1.8-.1l.6-.5c.2-.2.5-.2.8-.1l1.5.6c.3.1.5.4.5.7v.5c0 .6-.5 1-1 1-3.6 0-7.3-3.7-7.3-7.4Z" />
        </svg>
      );
    default:
      return null;
  }
}

function LotusEmblem({ className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path className="lotus-path" d="M32 58c-10-6-16-16-16-27 6 2 11 6 16 14 5-8 10-12 16-14 0 11-6 21-16 27Z" />
      <path className="lotus-path" d="M32 45C24 40 19 32 19 23c5 1.5 9 5 13 11 4-6 8-9.5 13-11 0 9-5 17-13 22Z" />
      <path className="lotus-path" d="M32 33c-5-3-8-8-8-14 4 1 7 3.5 8 8 1-4.5 4-7 8-8 0 6-3 11-8 14Z" />
      <path className="lotus-path" d="M14 27c4-1 8 0 12 3M50 27c-4-1-8 0-12 3" />
    </svg>
  );
}

function FloralDivider({ className }) {
  return (
    <svg viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M0 12h42" />
      <path d="M78 12h42" />
      <circle cx="60" cy="12" r="4" />
      <path d="M60 8c-2-2-2-4 0-6M60 16c-2 2-2 4 0 6M56 12c-2-2-4-2-6 0M64 12c2-2 4-2 6 0" />
    </svg>
  );
}

// ============ SCROLL REVEAL WRAPPER ============
function Reveal({ children, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

// ============ SECTIONS ============
function Hero({ settings }) {
  return (
    <header className="hero">
      <div className="container">
        <LotusEmblem className="hero-emblem" />
        <div className="hero-eyebrow">{settings.business_name}</div>
        <h1 className="hero-wordmark">CENDEKIA</h1>
        <div className="hero-spa-label">{settings.spa_label}</div>
        <p className="hero-tagline">{settings.tagline}</p>
        <div className="hero-script">{settings.hero_script}</div>
        <div className="hero-actions">
          <span className="pill-badge">
            <Icon name="home" />
            {settings.free_transport_label}
          </span>
          <a className="btn-primary" href={waLink(settings.whatsapp_number, settings.whatsapp_message)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />
            Booking via WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

function IntroStrip({ settings }) {
  return (
    <Reveal as="section" className="intro-strip">
      <div className="container">
        <p>{settings.intro_text}</p>
        <FloralDivider className="floral-divider" />
      </div>
    </Reveal>
  );
}

function ServiceCard({ s, settings }) {
  const message = `Halo kak, saya mau tanya-tanya dan booking untuk *${s.name}${s.duration_minutes ? " (" + s.duration_minutes + "')" : ""}* — harga promo ${formatK(s.price)}. Boleh dibantu? 🌸`;
  return (
    <a className="service-card" href={waLink(settings.whatsapp_number, message)} target="_blank" rel="noopener noreferrer">
      <div className="service-icon"><Icon name={s.icon} /></div>
      <div className="service-info">
        <div className="service-name">{s.name}</div>
        {s.duration_minutes && <div className="service-duration">{s.duration_minutes}'</div>}
      </div>
      <div className="service-price">
        <div className="price-now">{formatK(s.price)}</div>
        {s.original_price && <div className="price-was">{formatK(s.original_price)}</div>}
      </div>
      {s.badge && <div className="service-badge">{s.badge}</div>}
    </a>
  );
}

function Services({ services, settings }) {
  return (
    <Reveal as="section" className="services-section">
      <div className="container">
        <div className="services-header">
          <div className="eyebrow">Menu Layanan</div>
          <div className="section-title">Harga Promo Hari Ini</div>
          <div className="services-hint">Ketuk salah satu untuk tanya & booking via WhatsApp</div>
        </div>
        <div className="services-grid">
          {services.map((s) => <ServiceCard key={s.id} s={s} settings={settings} />)}
        </div>
      </div>
    </Reveal>
  );
}

function TrustBadges({ badges }) {
  return (
    <Reveal as="section" className="trust-section">
      <div className="container">
        <div className="trust-grid">
          {badges.map((b) => (
            <div className="trust-item" key={b.id}>
              <Icon name={b.icon} className="trust-icon" />
              <div className="trust-label">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function CTASection({ settings }) {
  return (
    <Reveal as="section" className="cta-section">
      <div className="container">
        <FloralDivider className="floral-divider" />
        <div className="cta-heading">{settings.cta_heading}</div>
        <p className="cta-subtext">{settings.cta_subtext}</p>
        <a className="btn-primary" href={waLink(settings.whatsapp_number, settings.whatsapp_message)} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" />
          {settings.whatsapp_display}
        </a>
      </div>
    </Reveal>
  );
}

function Footer({ settings }) {
  return (
    <footer className="footer">
      <div className="footer-name">{settings.business_name} Spa</div>
      <div className="footer-sub">Home service massage — datang langsung ke rumah Anda</div>
    </footer>
  );
}

// ============ MAIN APP ============
export default function App() {
  const { settings, services, badges } = useSiteContent();

  return (
    <div className="snap-container">
      <div className="snap-panel snap-panel--center">
        <Hero settings={settings} />
        <IntroStrip settings={settings} />
      </div>

      <div className="snap-panel snap-panel--top">
        <Services services={services} settings={settings} />
      </div>

      <div className="snap-panel snap-panel--center">
        <TrustBadges badges={badges} />
        <CTASection settings={settings} />
        <Footer settings={settings} />
      </div>
    </div>
  );
}
