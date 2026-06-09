'use client';

import React, { useState } from 'react';
import { Bell, Send, Clock, Users, CheckCircle, BarChart3 } from 'lucide-react';

const notifTypes = ['Workout Reminder', 'Diet Reminder', 'Blog Update', 'Promotion', 'Achievement', 'Streak Alert'];
const segments = ['All Users', 'Premium Users', 'Free Users', 'Streak > 7 Days', 'Inactive (3+ Days)', 'New Users (< 7 Days)'];

const sentNotifications: any[] = [];

export default function NotificationsSection() {
 const [title, setTitle] = useState('');
 const [body, setBody] = useState('');
 const [type, setType] = useState('Workout Reminder');
 const [segment, setSegment] = useState('All Users');
 const [schedule, setSchedule] = useState('now');
 const [scheduleTime, setScheduleTime] = useState('');
 const [sending, setSending] = useState(false);
 const [sent, setSent] = useState(false);

 const handleSend = async () => {
 if (!title || !body) return;
 setSending(true);
 await new Promise(r => setTimeout(r, 1200));
 setSent(true);
 setSending(false);
 setTimeout(() => setSent(false), 3000);
 setTitle('');
 setBody('');
 };

 return (
 <div className="space-y-6">
 {/* Quick Stats */}
 <div className="grid grid-cols-3 gap-4">
 {[
 { label: 'Total Sent', value: sentNotifications.reduce((acc, n) => acc + n.delivered, 0).toLocaleString(), icon: Send, color: 'text-emerald-500 bg-emerald-500/10' },
 { label: 'Avg Open Rate', value: `${sentNotifications.length ? Math.round(sentNotifications.reduce((acc, n) => acc + (n.opened / n.delivered), 0) / sentNotifications.length * 100) : 0}%`, icon: Bell, color: 'text-cyan-500 bg-cyan-500/10' },
 { label: 'Avg Click Rate', value: `${sentNotifications.length ? Math.round(sentNotifications.reduce((acc, n) => acc + (n.clicked / n.opened), 0) / sentNotifications.length * 100) : 0}%`, icon: BarChart3, color: 'text-violet-500 bg-violet-500/10' },
 ].map(s => (
 <div key={s.label} className="glass rounded-2xl p-4 border border-border/10 dark:border-border flex items-center gap-3">
 <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
 <div>
 <p className="text-[10px] text-muted font-bold">{s.label}</p>
 <p className="text-xl font-black text-foreground">{s.value}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Push Builder */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><Bell className="w-4 h-4" /></div>
 <h3 className="font-black text-foreground text-sm">Send Push Notification</h3>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Notification Title</label>
 <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Day 7 Check-in 🔥"
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
 </div>
 <div className="col-span-2">
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Message Body</label>
 <textarea rows={3} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your notification message..."
 className="w-full px-3 py-2.5 bg-secondary/50 dark:bg-card/5 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none" />
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Type</label>
 <select value={type} onChange={e => setType(e.target.value)}
 className="w-full px-3 py-2.5 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none">
 {notifTypes.map(t => <option key={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Target Segment</label>
 <select value={segment} onChange={e => setSegment(e.target.value)}
 className="w-full px-3 py-2.5 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none">
 {segments.map(s => <option key={s}>{s}</option>)}
 </select>
 </div>
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">When</label>
 <div className="flex gap-2">
 {['now', 'schedule'].map(opt => (
 <button key={opt} onClick={() => setSchedule(opt)}
 className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${schedule === opt ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-secondary/50 dark:bg-card/5 text-muted border-border/20 dark:border-border'}`}>
 {opt === 'now' ? '⚡ Now' : '📅 Schedule'}
 </button>
 ))}
 </div>
 </div>
 {schedule === 'schedule' && (
 <div>
 <label className="text-[10px] font-black text-muted uppercase block mb-1">Schedule Time</label>
 <input type="datetime-local" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}
 className="w-full px-3 py-2.5 bg-secondary/50 border border-border/20 dark:border-border rounded-xl text-sm focus:outline-none" />
 </div>
 )}
 </div>

 <button onClick={handleSend} disabled={sending || !title || !body}
 className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${sent ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400'}`}>
 {sent ? <><CheckCircle className="w-4 h-4" /> Sent!</> : sending ? 'Sending...' : <><Send className="w-4 h-4" /> {schedule === 'now' ? 'Send Now' : 'Schedule Notification'}</>}
 </button>
 </div>

 {/* Recent Notifications */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <h3 className="font-black text-foreground text-sm">Recent Notifications</h3>
 <div className="space-y-3">
 {sentNotifications.length === 0 ? (
 <p className="text-center text-muted py-6">No recent notifications.</p>
 ) : (
 sentNotifications.map((n, i) => {
 const openRate = Math.round((n.opened / n.delivered) * 100) || 0;
 const clickRate = Math.round((n.clicked / n.opened) * 100) || 0;
 return (
 <div key={i} className="p-4 bg-secondary/30 dark:bg-card/3 rounded-2xl border border-border/10 dark:border-border">
 <div className="flex justify-between items-start mb-2">
 <div>
 <p className="font-bold text-foreground ">{n.title}</p>
 <p className="text-xs text-muted mt-0.5">{n.body}</p>
 <p className="text-[10px] text-muted mt-1">→ {n.segment} · {n.time}</p>
 </div>
 </div>
 <div className="grid grid-cols-3 gap-3 mt-3">
 {[
 { label: 'Delivered', value: n.delivered.toLocaleString(), color: 'text-foreground ' },
 { label: `Opened (${openRate}%)`, value: n.opened.toLocaleString(), color: 'text-cyan-500' },
 { label: `Clicked (${clickRate}%)`, value: n.clicked.toLocaleString(), color: 'text-emerald-500' },
 ].map(s => (
 <div key={s.label} className="bg-card/50 dark:bg-card/5 rounded-xl p-2 text-center">
 <p className="text-[9px] text-muted">{s.label}</p>
 <p className={`font-black text-sm ${s.color}`}>{s.value}</p>
 </div>
 ))}
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>
 </div>
 );
}
