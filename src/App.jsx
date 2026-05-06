import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
import BgStage from './components/BgStage';
import Nav from './components/Nav';
import PreRoll from './components/PreRoll';
import Hero from './components/Hero';
import DiagnoseSection from './components/Diagnose/DiagnoseSection';
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

  // PreRoll-Aktenkarte vor Hero-Mount. Component fadet sich selbst aus
  // bevor onComplete feuert — DOM-Removal danach erzeugt keinen Flash.
  const [preRollDone, setPreRollDone] = useState(false);

  useEffect(() => {
    // Race document.fonts.ready gegen 1500ms Timeout — falls eine Font hängt
    // (langsames CDN, Glitch), läuft ScrollTrigger.refresh() trotzdem und
    // Sections pinnen an den korrekten Scroll-Positionen.
    const timeout = new Promise((r) => setTimeout(r, 1500));
    Promise.race([document.fonts.ready, timeout]).then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    <>
      {!preRollDone && <PreRoll onComplete={() => setPreRollDone(true)} />}
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
