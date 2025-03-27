/* eslint-disable @typescript-eslint/no-unused-vars */
import CTA from "../sections/CTA";
import Features from "../sections/Features";
import Footer from "../sections/Footer";
import Hero from "../sections/Hero";
import Steps from "../sections/Steps";
import Testimonials from "../sections/Testimonials";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#1E1B4B] to-[#3B0764] text-white">
      <Hero />
      <Features />
      <Steps />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}