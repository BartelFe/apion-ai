import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
import BgStage from './components/BgStage';
import Nav from './components/Nav';
import Hero from './components/Hero';
import DiagnoseSection from './components/DiagnoseSection';
import ROISection from './components/ROISection';
import StoriesSection from './components/StoriesSection';
import MethodSection from './components/MethodSection';
import ManifestoSection from './components/ManifestoSection';
import CollaborationSection from './components/CollaborationSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ConsoleBar from './components/ConsoleBar';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useLenis();

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BgStage />
      <Nav />
      <main>
        <Hero />
        <DiagnoseSection />
        <ROISection />
        <StoriesSection />
        <MethodSection />
        <ManifestoSection />
        <CollaborationSection />
        <CTASection />
      </main>
      <Footer />
      <ConsoleBar />
    </>
  );
}
