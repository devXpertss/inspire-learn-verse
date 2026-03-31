import { motion } from "framer-motion";
import { Mail, Instagram, Github, Linkedin, Twitter, Send, MapPin, Phone, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FloatingShape, FloatingParticles, GridPattern } from "@/components/FloatingElements";
import { useState } from "react";
import { useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { SiteFooter } from "@/components/SiteFooter";

const iconMap = { Mail, Phone, MapPin, Globe, Instagram, Twitter, Github, Linkedin };

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { data: siteContentData } = useSiteContent();
  const contact = (siteContentData ?? defaultSiteContent).contact;

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
              {contact.badge}
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              {contact.titlePrefix} <span className="text-gradient">{contact.titleAccent}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {contact.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contact.infoCards.map((item: { icon: keyof typeof iconMap; label: string; value: string; href: string }, i: number) => {
              const Icon = iconMap[item.icon] ?? Mail;
              return (
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
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </motion.a>
            )})}
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
              <h2 className="text-3xl font-bold font-heading mb-2">{contact.formTitlePrefix} <span className="text-gradient">{contact.formTitleAccent}</span></h2>
              <p className="text-muted-foreground mb-8">{contact.formDescription}</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-primary/10 border border-primary/30 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{contact.successTitle}</h3>
                  <p className="text-sm text-muted-foreground">{contact.successDescription}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{contact.fields.name}</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={contact.placeholders.name}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{contact.fields.email}</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={contact.placeholders.email}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{contact.fields.subject}</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={contact.placeholders.subject}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{contact.fields.message}</label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={contact.placeholders.message}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base py-5">
                    <Send className="w-4 h-4 mr-2" />
                    {contact.submitLabel}
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
              <h2 className="text-3xl font-bold font-heading mb-2">{contact.socialTitlePrefix} <span className="text-gradient">{contact.socialTitleAccent}</span></h2>
              <p className="text-muted-foreground mb-8">{contact.socialDescription}</p>

              <div className="space-y-4">
                {contact.socials.map((social: { icon: keyof typeof iconMap; label: string; href: string; handle: string }, i: number) => {
                  const Icon = iconMap[social.icon] ?? Instagram;
                  return (
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-semibold">{social.label}</p>
                      <p className="text-sm text-muted-foreground">{social.handle}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.a>
                )})}
              </div>

              {/* FAQ teaser */}
              <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border">
                <h3 className="font-heading font-semibold mb-2">{contact.faqTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4">{contact.faqDescription}</p>
                <div className="space-y-3">
                  {contact.faqs.map((q: string, i: number) => (
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
              {contact.ctaTitlePrefix} <span className="text-gradient">{contact.ctaTitleAccent}</span> {contact.ctaTitleSuffix}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {contact.ctaDescription}
            </p>
            <div className="flex gap-4 justify-center">
              <a href={contact.infoCards[0]?.href}>
                <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 px-8">
                  <Mail className="w-4 h-4 mr-2" /> {contact.ctaPrimary}
                </Button>
              </a>
              <a href={contact.socials[0]?.href} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-8">
                  <Instagram className="w-4 h-4 mr-2" /> {contact.ctaSecondary}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
