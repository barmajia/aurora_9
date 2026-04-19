'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Users, Award, TrendingUp, Globe, Heart } from 'lucide-react';
import { Card } from '@/components/ui';

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { label: 'Products', value: '500+' },
    { label: 'Customers', value: '10K+' },
    { label: 'Sellers', value: '500+' },
    { label: 'Countries', value: '30+' },
  ];

  const values = [
    { icon: Sparkles, title: 'Quality First', description: 'We curate only the finest products to ensure exceptional quality.' },
    { icon: Users, title: 'Customer Focus', description: 'Your satisfaction is our top priority.' },
    { icon: TrendingUp, title: 'Continuous Growth', description: 'Constantly improving to serve you better.' },
    { icon: Globe, title: 'Global Reach', description: 'Serving customers worldwide with love.' },
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
            About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Aurora</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            We believe in the power of exceptional products to transform your life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, idx) => (
            <Card key={idx} className="text-center py-8">
              <div className="text-3xl font-black italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-white/40 mt-2">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Sparkles className="text-primary" /> Our Story
          </h2>
          <Card>
            <p className="text-white/70 leading-relaxed mb-4">
              Aurora was born from a simple idea: everyone deserves access to premium products without compromise. 
              We founded our platform with a mission to connect quality manufacturers directly with customers who appreciate excellence.
            </p>
            <p className="text-white/70 leading-relaxed">
              What started as a small dream has grown into a thriving ecosystem connecting hundreds of sellers with 
              thousands of happy customers worldwide. We continue to innovate and expand, always staying true to our core values.
            </p>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Heart className="text-rose-400" /> Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <value.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">{value.title}</h3>
                      <p className="text-white/50 text-sm">{value.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Award className="text-yellow-400" /> Our Mission
          </h2>
          <Card className="text-center py-12">
            <p className="text-2xl md:text-3xl font-black italic tracking-tight text-white/80">
              "To make premium quality accessible to everyone, everywhere."
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}