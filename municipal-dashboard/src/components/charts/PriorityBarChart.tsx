"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import type { PriorityStats } from '@/lib/types';
export default function PriorityBarChart({ 
  data 
}: { 
  data: PriorityStats[] 
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="priority" />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </ResponsiveContainer>
  );
}