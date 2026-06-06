import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Send } from 'lucide-react';

export const metadata = {
 title: 'Contact Us | LeanVerse',
 description: 'Get in touch with the LeanVerse team.',
};

export default function ContactPage() {
 return (
 <div className="max-w-4xl mx-auto px-4 py-12">
 <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted hover:text-emerald-500 transition-colors mb-8">
 <ArrowLeft className="w-3.5 h-3.5" />
 <span>Back to Home</span>
 </Link>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Contact Info */}
 <div className="glass rounded-3xl p-8 shadow-2xl border border-border/20 dark:border-border">
 <div className="flex items-center space-x-4 mb-6">
 <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
 <Mail className="w-6 h-6" />
 </div>
 <h1 className="text-2xl font-black text-foreground tracking-tight">Get in Touch</h1>
 </div>
 
 <p className="text-muted mb-8 leading-relaxed">
 Have questions about your transformation journey? Need technical support? We're here to help you achieve your fitness goals.
 </p>

 <div className="space-y-6">
 <div className="flex items-start space-x-4">
 <div className="w-10 h-10 rounded-xl bg-secondary dark:bg-card/5 flex items-center justify-center shrink-0">
 <Mail className="w-5 h-5 text-emerald-500" />
 </div>
 <div>
 <h3 className="font-bold text-foreground">Email Us</h3>
 <p className="text-sm text-muted mt-1">saikumardoodala011@gmail.com</p>
 <p className="text-xs text-muted mt-1">We usually respond within 24 hours.</p>
 </div>
 </div>
 
 <div className="flex items-start space-x-4">
 <div className="w-10 h-10 rounded-xl bg-secondary dark:bg-card/5 flex items-center justify-center shrink-0">
 <MapPin className="w-5 h-5 text-cyan-500" />
 </div>
 <div>
 <h3 className="font-bold text-foreground">Location</h3>
 <p className="text-sm text-muted mt-1">shameerpet,Jangaon, Telangana</p>
 </div>
 </div>
 </div>
 </div>

 {/* Contact Form */}
 <div className="glass rounded-3xl p-8 shadow-2xl border border-border/20 dark:border-border">
 <h2 className="text-xl font-bold text-foreground mb-6">Send a Message</h2>
 <div className="space-y-4">
 <div>
 <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5 ml-1">Name</label>
 <input type="text" placeholder="John Doe" className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
 </div>
 <div>
 <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5 ml-1">Email</label>
 <input type="email" placeholder="john@example.com" className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
 </div>
 <div>
 <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5 ml-1">Message</label>
 <textarea rows={4} placeholder="How can we help?" className="w-full bg-secondary/50 border border-border/20 dark:border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"></textarea>
 </div>
 <button type="button" className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-transform active:scale-95">
 <span>Send Message</span>
 <Send className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
