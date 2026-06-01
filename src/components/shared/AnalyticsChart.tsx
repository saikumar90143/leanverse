'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsChartProps {
  liftData: { date: string; bench: number; squat: number; deadlift: number }[];
}

export default function AnalyticsChart({ liftData }: AnalyticsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={liftData}>
        <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
        <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} 
        />
        <Line type="monotone" dataKey="bench" name="Bench Press" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
        <Line type="monotone" dataKey="squat" name="Squat" stroke="#06b6d4" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
        <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
      </LineChart>
    </ResponsiveContainer>
  );
}
