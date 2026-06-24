'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Dumbbell, Apple, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface Message {
 id: string;
 sender: 'user' | 'ai';
 text: string;
 timestamp: Date;
}

export default function AIChatbot() {
 const pathname = usePathname();
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState<Message[]>([
 {
 id: 'welcome',
 sender: 'ai',
 text: 'Hey! I am the LeanVerse AI Assistant. Ask me anything about diet plans, gym splits, macro metrics, or try some quick helpers below!',
 timestamp: new Date(),
 },
 ]);
 const [input, setInput] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const scrollToBottom = () => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 };

 useEffect(() => {
 scrollToBottom();
 }, [messages, isTyping]);

 if (pathname?.startsWith('/admin')) return null;

 const quickPrompts = [
 { text: 'Calculate my BMI', action: 'bmi' },
 { text: '5-min fat loss HIIT split', action: 'hiit' },
 { text: 'High protein vegetarian snacks', action: 'snacks' },
 { text: 'Water intake requirements', action: 'water' },
 ];

 const handleSend = (text: string) => {
 if (!text.trim()) return;

 const userMsg: Message = {
 id: Math.random().toString(),
 sender: 'user',
 text,
 timestamp: new Date(),
 };

 setMessages((prev) => [...prev, userMsg]);
 setInput('');
 setIsTyping(true);

 // Simulate AI response
 setTimeout(() => {
 let aiText = '';
 const query = text.toLowerCase();

 if (query.includes('bmi')) {
 aiText = 'Your Body Mass Index (BMI) is a simple height-to-weight calculation. Try out our visual BMI Calculator at /calculators/bmi to see your health category and get tailored recommendations!';
 } else if (query.includes('hiit') || query.includes('workout')) {
 aiText = 'Here is a quick HIIT workout: 30s Jumping Jacks, 30s Mountain Climbers, 30s Squat Jumps, 30s Plank Hold. Repeat for 3 rounds! For a full gym or home plan, use our AI Workout Planner at /workout-planner!';
 } else if (query.includes('snack') || query.includes('protein') || query.includes('diet')) {
 aiText = 'Excellent high-protein vegetarian snacks include: Paneer Tikka (20g protein/100g), Roasted Chana (15g protein/100g), Greek Yogurt with Chia Seeds, or Whey Protein Shake. Try our AI Diet Planner at /diet-planner to build your full schedule!';
 } else if (query.includes('water') || query.includes('hydration')) {
 aiText = 'Hydration is crucial for fat loss and muscle recovery! A good baseline is 35ml of water per kg of bodyweight, adjusted for workouts. Track your daily cups with our Water Intake Calculator at /calculators/water!';
 } else {
 aiText = "That is a great fitness question! LeanVerse's custom AI engines can generate complete diet blueprints and workout splits tailored to your budget, experience level, and body stats. Head over to our AI Diet Planner or AI Workout Planner pages to build yours now!";
 }

 const aiMsg: Message = {
 id: Math.random().toString(),
 sender: 'ai',
 text: aiText,
 timestamp: new Date(),
 };

 setMessages((prev) => [...prev, aiMsg]);
 setIsTyping(false);
 }, 1200);
 };

 return (
 <div className="fixed bottom-24 md:bottom-6 right-6 z-[60] no-print">
 {/* Floating Action Button */}
 <motion.button
 onClick={() => setIsOpen(!isOpen)}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
 className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-2xl hover:shadow-emerald-500/30 cursor-pointer border border-white/20 focus:outline-none"
 >
 {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
 </motion.button>

 {/* Chat Window */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 50, scale: 0.9 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 50, scale: 0.9 }}
 className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[500px] bg-background rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-border/50 dark:border-border"
 >
 {/* Header */}
 <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-b border-border/20 dark:border-border px-5 py-4 flex items-center justify-between">
 <div className="flex items-center space-x-2.5">
 <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
 <Bot className="w-5 h-5" />
 </div>
 <div>
 <h4 className="text-sm font-bold text-foreground flex items-center">
 LeanVerse AI <Sparkles className="w-3.5 h-3.5 ml-1 text-emerald-400 fill-current animate-bounce" />
 </h4>
 <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-extrabold flex items-center">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
 Online & Ready
 </span>
 </div>
 </div>
 <button onClick={() => setIsOpen(false)} className="text-muted hover:text-foreground dark:text-muted dark:hover:text-slate-200">
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Message Area */}
 <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
 {messages.map((msg) => (
 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
 <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
 msg.sender === 'user'
 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-500/10'
 : 'bg-secondary/50 dark:bg-card/5 border border-border/10 dark:border-border text-foreground rounded-bl-none'
 }`}>
 <p>{msg.text}</p>
 <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
 {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>
 </div>
 ))}

 {isTyping && (
 <div className="flex justify-start">
 <div className="bg-secondary/50 dark:bg-card/5 border border-border/10 dark:border-border text-foreground rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1">
 <span className="w-1.5 h-1.5 bg-background0 dark:bg-slate-400 rounded-full animate-bounce" />
 <span className="w-1.5 h-1.5 bg-background0 dark:bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
 <span className="w-1.5 h-1.5 bg-background0 dark:bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Quick Prompts List */}
 {messages.length === 1 && (
 <div className="px-4 py-2 border-t border-border/10 dark:border-border flex flex-wrap gap-1.5">
 {quickPrompts.map((p) => (
 <button
 key={p.action}
 onClick={() => handleSend(p.text)}
 className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1.5 rounded-full hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
 >
 {p.text}
 </button>
 ))}
 </div>
 )}

 {/* Input Form */}
 <form
 onSubmit={(e) => {
 e.preventDefault();
 handleSend(input);
 }}
 className="p-3 bg-secondary/50 dark:bg-card border-t border-border/15 dark:border-border flex items-center space-x-2"
 >
 <input
 type="text"
 placeholder="Ask me anything..."
 value={input}
 onChange={(e) => setInput(e.target.value)}
 className="flex-1 bg-card/70 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl px-3.5 py-2 text-foreground text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500"
 />
 <button
 type="submit"
 className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl cursor-pointer shadow-md active:scale-95 transition-all"
 >
 <Send className="w-4 h-4" />
 </button>
 </form>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
