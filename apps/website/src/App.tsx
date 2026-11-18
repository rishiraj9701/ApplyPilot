import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Walkthrough } from './sections/Walkthrough';
import { ProblemSolution } from './sections/ProblemSolution';
import { Features } from './sections/Features';
import { ATSCompatibility } from './sections/ATSCompatibility';
import { HowItWorks } from './sections/HowItWorks';
import { Privacy } from './sections/Privacy';
import { AIProviders } from './sections/AIProviders';
import { Installation } from './sections/Installation';
import { OpenSource } from './sections/OpenSource';
import { FAQ } from './sections/FAQ';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <Walkthrough />
        <ProblemSolution />
        <Features />
        <ATSCompatibility />
        <HowItWorks />
        <Privacy />
        <AIProviders />
        <Installation />
        <OpenSource />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
