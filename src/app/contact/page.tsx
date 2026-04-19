'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, HeadphonesIcon } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSent(true);
    setLoading(false);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'support@aurora.com', description: '24/7 Support' },
    { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567', description: 'Mon-Fri 9am-6pm' },
    { icon: MapPin, title: 'Address', value: '123 Innovation Drive\nTech City, TC 12345', description: 'Visit us' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            Contact <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-xl text-white/50">
            We'd love to hear from you. Reach out anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <h2 className="text-xl font-bold mb-6">Get in Touch</h2>
              
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-white/50">We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-glass border border-glass-border rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" isLoading={loading} leftIcon={<Send size={18} />}>
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <info.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{info.title}</h3>
                    <p className="text-white/70 whitespace-pre-line">{info.value}</p>
                    <p className="text-white/40 text-sm mt-1">{info.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}

            <Card hover className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <HeadphonesIcon className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-white/70">Chat with us in real-time</p>
                <Button variant="secondary" size="sm" className="mt-2" leftIcon={<MessageCircle size={16} />}>
                  Start Chat
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}