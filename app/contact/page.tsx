"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Linkedin, Github, MapPin, Phone, Send, CheckCircle } from "lucide-react"
import ContactForm from "@/components/contact-form"
import FloatingParticles from "@/components/floating-particles"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@proteinai.research",
      link: "mailto:info@proteinai.research",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "San Francisco, CA",
      link: "#",
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      link: "https://github.com",
      color: "hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      link: "https://linkedin.com",
      color: "hover:text-blue-400",
    },
    {
      icon: Mail,
      label: "Twitter",
      link: "https://twitter.com",
      color: "hover:text-cyan-400",
    },
  ]

  const faqs = [
    {
      q: "How long does protein analysis typically take?",
      a: "Most analyses complete within 2-5 seconds depending on sequence length and number of selected tasks. Large sequences may take up to 30 seconds.",
    },
    {
      q: "Can I use the platform for commercial research?",
      a: "Yes, we offer both academic and commercial licenses. Contact our sales team for enterprise pricing and support options.",
    },
    {
      q: "What file formats do you support?",
      a: "We support FASTA, FA, TXT, and direct sequence input. Results can be exported as PDF, JSON, or CSV formats.",
    },
    {
      q: "How is my data handled?",
      a: "All data is processed securely and never stored on our servers. Results are automatically deleted after 24 hours unless saved by the user.",
    },
    {
      q: "Can I integrate this with my existing pipeline?",
      a: "Yes, we provide REST APIs and comprehensive documentation for seamless integration with your research workflows.",
    },
    {
      q: "Do you offer training and support?",
      a: "We offer comprehensive documentation, video tutorials, and personalized training sessions for teams and institutions.",
    },
  ]

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-background via-blue-950/20 to-background overflow-hidden">
      {/* Animated background particles */}
      <FloatingParticles />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            ProteinAI
          </Link>
          <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Get In{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
              Touch
            </span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Have questions about our platform or want to collaborate? Reach out to our team of AI and bioinformatics
            experts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <a key={info.label} href={info.link} className="group relative block">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/20">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        <p className="font-semibold text-foreground group-hover:text-accent transition">{info.value}</p>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}

            {/* Social Links */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-all">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span>Follow Us</span>
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg border border-border/50 text-foreground/60 hover:bg-background/50 transition ${social.color}`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-all">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/analysis" className="block text-foreground/70 hover:text-accent transition">
                    Analysis Portal
                  </Link>
                  <Link href="/about" className="block text-foreground/70 hover:text-accent transition">
                    About & Research
                  </Link>
                  <Link href="/" className="block text-foreground/70 hover:text-accent transition">
                    Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                    <p className="text-foreground/60 mb-8">We typically respond within 24 hours</p>
                    <ContactForm onSubmitSuccess={() => setIsSubmitted(true)} />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent/30 rounded-full blur-lg" />
                        <CheckCircle className="w-16 h-16 text-accent relative" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-foreground/60 mb-6">
                      Thank you for reaching out. We've received your message and will get back to you soon.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2 rounded-lg border border-border/50 hover:bg-background/50 transition text-sm font-medium"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-secondary/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-foreground/60">Find answers to common questions about ProteinAI</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm group-hover:border-accent/50 transition-all">
                  <h3 className="font-semibold mb-3 text-sm pr-6">{faq.q}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-primary/30 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-12 rounded-2xl bg-gradient-to-br from-card/80 to-secondary/50 backdrop-blur-xl border border-accent/30 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Research?</h2>
              <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                Explore the power of AI-driven protein analysis and accelerate your drug discovery pipeline
              </p>
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Launch Analysis Portal
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-background/50 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">ProteinAI</h4>
              <p className="text-sm text-foreground/60">AI-powered protein intelligence for drug discovery</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <Link href="/analysis" className="hover:text-foreground transition">
                    Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 pt-8 text-center text-sm text-foreground/50">
            <p>© 2025 Cross-Architecture Protein Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
