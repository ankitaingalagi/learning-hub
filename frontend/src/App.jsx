import React from 'react';
import { Target, Users, Map, Star, ChevronRight } from 'lucide-react';
import './index.css';

const Navbar = () => (
  <nav style={{ padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
    <div style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px' }} className="bg-gradient" />
      <span>LearningHub</span>
    </div>
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Features</a>
      <a href="#mentors" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Mentors</a>
      <button className="btn-outline">Sign In</button>
      <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Get Started</button>
    </div>
  </nav>
);

const Hero = () => (
  <header style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 5%', position: 'relative', overflow: 'hidden' }}>
    {/* Decorative blur orb */}
    <div style={{ position: 'absolute', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(11,15,25,0) 70%)', top: '-20%', left: '50%', transform: 'translateX(-50%)', zIndex: -1 }} />
    
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', opacity: 0 }} className="animate-fade-in">
      <div style={{ padding: '8px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-electric)' }}>
        🚀 The #1 Mentorship Platform for PMs
      </div>
      <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
        Accelerate Your <span className="text-gradient">PM Career</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }} className="animate-fade-in delay-100">
        Master product sense, define your roadmap, and get 1-on-1 guidance from top-tier Product Managers at elite tech companies.
      </p>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }} className="animate-fade-in delay-200">
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.1rem' }}>
          Take the Free Assessment <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Social Proof Ribbon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '48px', color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="animate-fade-in delay-300">
        <div style={{ display: 'flex' }}>
           {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--accent-electric)" color="var(--accent-electric)" />)}
        </div>
        <span>Over 500+ Product Managers placed globally</span>
      </div>
    </div>
  </header>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <div className={`glass-panel animate-fade-in delay-${delay}`} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0 }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-electric)' }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
  </div>
);

const Features = () => (
  <section id="features" style={{ padding: '100px 5%', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>Frameworks That <span className="text-gradient">Actually Work</span></h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Stop guessing. Follow proven curriculums and let real experts analyze your weaknesses.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
      <FeatureCard 
        icon={Target} 
        title="Deep Skills Assessment" 
        desc="Take a rigorous evaluation spanning product sense, execution, and strategy to discover your baseline PM archetype."
        delay="100"
      />
      <FeatureCard 
        icon={Map} 
        title="Personalized Roadmaps" 
        desc="Follow a step-by-step curriculum of video modules and reading lessons tailored precisely to the gaps we identify."
        delay="200"
      />
      <FeatureCard 
        icon={Users} 
        title="1-on-1 Expert Mentorship" 
        desc="Book live sessions with senior PMs. Get your resume roasted, run mock interviews, and receive actionable tactical advice."
        delay="300"
      />
    </div>
  </section>
);

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '40px 5%', marginTop: '64px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
    <p>© 2026 LearningHub PM Platform. All rights reserved. | Built with React + Vite</p>
  </footer>
);

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}
