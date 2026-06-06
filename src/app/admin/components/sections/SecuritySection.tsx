'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Clock, User, ShieldCheck, Eye, Copy, RefreshCw, CheckCircle } from 'lucide-react';

const roles = [
 { name: 'Super Admin', desc: 'Full platform access. Can manage all settings, users, and data.', permissions: ['All'], color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
 { name: 'Admin', desc: 'Can manage users, content, and view all analytics.', permissions: ['Users', 'Blogs', 'Exercises', 'Diet', 'Analytics'], color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
 { name: 'Content Manager', desc: 'Can create and manage blog posts and exercise content only.', permissions: ['Blogs', 'Exercises'], color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
 { name: 'Nutrition Expert', desc: 'Can edit diet plans and food database.', permissions: ['Diet', 'Food DB'], color: 'text-green-500 bg-green-500/10 border-green-500/20' },
 { name: 'Support Agent', desc: 'Can view users and manage support tickets.', permissions: ['Support Tickets', 'View Users'], color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
 { name: 'Fitness Coach', desc: 'Can view and edit workout plans and transformation programs.', permissions: ['Workouts', 'Transformation'], color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
];

export default function SecuritySection() {
 const [auditLogs, setAuditLogs] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetch('/api/admin/security/audit')
 .then(r => r.json())
 .then(data => {
 if (data.logs) setAuditLogs(data.logs);
 setLoading(false);
 })
 .catch(() => setLoading(false));
 }, []);
 const [apiKeys] = useState([
 { name: 'Production API Key', key: 'lv_prod_••••••••••••••••••••••••', created: '2025-01-15', last: '2 min ago' },
 { name: 'Development API Key', key: 'lv_dev_••••••••••••••••••••••••••', created: '2025-02-01', last: '3 days ago' },
 ]);
 const [copiedKey, setCopiedKey] = useState<string | null>(null);

 const copyKey = (key: string) => {
 navigator.clipboard.writeText(key).catch(() => {});
 setCopiedKey(key);
 setTimeout(() => setCopiedKey(null), 1500);
 };

 return (
 <div className="space-y-6">
 {/* Role Management */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <div className="flex items-center gap-3 mb-2">
 <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500"><Shield className="w-4 h-4" /></div>
 <div>
 <h3 className="font-black text-foreground text-sm">Role Management</h3>
 <p className="text-[10px] text-muted">Define what each role can access</p>
 </div>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {roles.map((role) => (
 <div key={role.name} className={`p-4 rounded-2xl border ${role.color}`}>
 <div className="flex items-center gap-2 mb-1.5">
 <ShieldCheck className="w-3.5 h-3.5" />
 <p className="font-black text-sm">{role.name}</p>
 </div>
 <p className="text-[10px] opacity-80 mb-2">{role.desc}</p>
 <div className="flex flex-wrap gap-1">
 {role.permissions.map(p => (
 <span key={p} className="text-[9px] font-black bg-black/10 dark:bg-card/10 px-1.5 py-0.5 rounded-md">{p}</span>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* API Keys */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500"><Key className="w-4 h-4" /></div>
 <h3 className="font-black text-foreground text-sm">API Keys</h3>
 </div>
 <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all">
 <RefreshCw className="w-3 h-3" /> Generate New Key
 </button>
 </div>
 <div className="space-y-3">
 {apiKeys.map((ak) => (
 <div key={ak.name} className="flex items-center justify-between p-4 bg-secondary/50 dark:bg-card/3 rounded-2xl border border-border/10 dark:border-border">
 <div>
 <p className="font-bold text-foreground text-sm">{ak.name}</p>
 <p className="text-xs font-mono text-muted mt-0.5">{ak.key}</p>
 <p className="text-[10px] text-muted mt-0.5">Last used {ak.last}</p>
 </div>
 <button onClick={() => copyKey(ak.key)}
 className={`p-2 rounded-xl transition-all ${copiedKey === ak.key ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary/50 dark:bg-card/5 text-muted hover:text-foreground dark:hover:text-zinc-200'}`}>
 {copiedKey === ak.key ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
 </button>
 </div>
 ))}
 </div>
 </div>

 {/* Audit Log */}
 <div className="glass rounded-2xl p-6 border border-border/10 dark:border-border space-y-4">
 <div className="flex items-center gap-3">
 <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><Clock className="w-4 h-4" /></div>
 <h3 className="font-black text-foreground text-sm">Audit Log</h3>
 </div>
 <div className="space-y-2">
 {loading ? (
 <div className="p-4 text-center text-xs text-muted">Loading audit logs...</div>
 ) : auditLogs.length === 0 ? (
 <div className="p-4 text-center text-xs text-muted">No audit logs found</div>
 ) : auditLogs.map((log, i) => (
 <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 dark:bg-card/3 rounded-xl border border-border/10 dark:border-border">
 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
 <div className="flex-1 min-w-0">
 <p className="text-xs font-bold text-foreground ">{log.action}</p>
 <p className="text-[10px] text-muted truncate">{log.adminEmail} → {log.resource}</p>
 </div>
 <span className="text-[10px] text-muted shrink-0">{new Date(log.createdAt).toLocaleDateString()}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}
