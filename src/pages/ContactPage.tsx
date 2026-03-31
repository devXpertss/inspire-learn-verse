import { motion } from "framer-motion";
import { Mail, Instagram, Github, Linkedin, Twitter, Send, MapPin, Phone, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FloatingShape, FloatingParticles, GridPattern } from "@/components/FloatingElements";
import { useState } from "react";

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/codespire", color: "from-pink-500 to-purple-500", handle: "@codespire" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/codespire", color: "from-blue-400 to-blue-500", handle: "@codespire" },
  { icon: Github, label: "GitHub", href: "https://github.com/codespire", color: "from-gray-600 to-gray-800", handle: "codespire" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/codespire", color: "from-blue-600 to-blue-700", handle: "CodeSpire" },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@codespire.dev", href: "mailto:hello@codespire.dev" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Location", value: "San Francisco, CA", href: "#" },
  { icon: Globe, label: "Website", value: "codespire.dev", href: "https://codespire.dev" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <GridPattern />
        <FloatingParticles />
        <FloatingShape type="hexagon" className="top-20 right-[10%]" delay={0} />
        <FloatingShape type="ring" className="bottom-20 left-[5%]" delay={2} />
        <FloatingShape type="sphere" className="top-40 left-[15%]" delay={1} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6"
            >
              <MessageCircle className="w-4 h-4" />
              We'd love to hear from you
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have a question, suggestion, or want to collaborate? Reach out and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-5 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Social */}
      <section className="py-24 relative overflow-hidden">
        <FloatingShape type="cube" className="top-20 right-[5%]" delay={3} />
        <FloatingShape type="pyramid" className="bottom-40 left-[8%]" delay={1.5} />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-heading mb-2">Send us a <span className="text-gradient">Message</span></h2>
              <p className="text-muted-foreground mb-8">Fill out the form and we'll get back to you within 24 hours.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-primary/10 border border-primary/30 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll respond soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Your Name</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Message</label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base py-5">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-heading mb-2">Connect with <span className="text-gradient">Us</span></h2>
              <p className="text-muted-foreground mb-8">Follow us on social media for updates, tips, and community content.</p>

              <div className="space-y-4">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 8 }}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <social.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-semibold">{social.label}</p>
                      <p className="text-sm text-muted-foreground">{social.handle}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.a>
                ))}
              </div>

              {/* FAQ teaser */}
              <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border">
                <h3 className="font-heading font-semibold mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-muted-foreground mb-4">Find quick answers to common questions about CodeSpire.</p>
                <div className="space-y-3">
                  {["Is CodeSpire free to use?", "How do I report a bug?", "Can I contribute content?"].map((q, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">?</span>
                      </div>
                      <span className="text-muted-foreground">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map / CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Let's Build Something <span className="text-gradient">Amazing</span> Together
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Whether you're a student, educator, or developer — we're here to help.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="mailto:hello@codespire.dev">
                <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 px-8">
                  <Mail className="w-4 h-4 mr-2" /> Email Us
                </Button>
              </a>
              <a href="https://instagram.com/codespire" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-8">
                  <Instagram className="w-4 h-4 mr-2" /> Follow Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 CodeSpire. Built with passion for learning.</p>
        </div>
      </footer>
    </div>
  );
}
