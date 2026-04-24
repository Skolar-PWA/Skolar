import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { SocialProof } from './sections/SocialProof';
import { Features } from './sections/Features';
import { HowItWorks } from './sections/HowItWorks';
import { Pricing } from './sections/Pricing';
import { Testimonials } from './sections/Testimonials';
import { FinalCTA } from './sections/FinalCTA';
import { Footer } from './sections/Footer';

export function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  );
}
