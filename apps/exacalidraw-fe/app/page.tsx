"use client"

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Check } from 'lucide-react';
import Link from "next/link"
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import axios from "axios"
function App() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();

const handleGetStarted = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${HTTP_BACKEND}/room`,
            {
                slug: `room-${Date.now()}`
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const roomId = response.data.roomId;

        router.push(`/canvas/${roomId}`);

    } catch (error) {
        console.error("ROOM ERROR:", error);
    }
};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
  ];

  const features = [
    { icon: '⚡', title: 'Fast', desc: 'Built for speed. Everything loads instantly so you never wait.' },
    { icon: '🎯', title: 'Simple', desc: 'No bloated menus. Just the tools you actually use, every day.' },
    { icon: '🔒', title: 'Reliable', desc: 'Rock-solid infrastructure that keeps your data safe and synced.' },
  ];

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      features: ['Up to 3 projects', 'Basic support', '1 GB storage'],
      featured: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/mo',
      features: ['Unlimited projects', 'Priority support', '100 GB storage', 'Team collaboration'],
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight">
            Brand
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <Link
    href="/signin"
    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
>
    Sign in
</Link>
<Link
    href="/signup"
    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
>
    Sign up
</Link>
             <button
    onClick={handleGetStarted}
    className="px-5 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800"
>
    Get started
</button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 mt-3">
            <ul className="px-5 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-medium text-gray-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
               
<button
    onClick={handleGetStarted}
    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
>
    Get started free
    <ArrowRight size={18} />
</button>
                
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6">
            New — v2.0 is here
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Build something great
            <br />
            <span className="text-blue-600">without the busywork</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A clean, simple tool that helps you get work done faster. No clutter, no learning
            curve — just you and your goals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Get started free
              <ArrowRight size={18} />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-5 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need</h2>
            <p className="mt-4 text-gray-600 text-lg">Simple, powerful, and built to stay out of your way.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA */}
      <section id="cta" className="py-24 px-5">
        <div className="max-w-3xl mx-auto text-center bg-gray-900 rounded-3xl p-12 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Start building today
          </h2>
          <p className="mt-4 text-gray-300 text-lg">
            Join thousands of people who got their time back.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors"
          >
            Get started free
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-gray-100 py-12 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 Brand. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
