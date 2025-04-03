
import React from 'react';
import { CommitData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InsightCard from './InsightCard';

interface CommitActivityProps {
  data: CommitData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-2 rounded-md shadow-md">
        <p className="text-sm font-medium">{`${label}: ${payload[0].value} commits`}</p>
      </div>
    );
  }

  return null;
};

const CommitActivity = ({ data }: CommitActivityProps) => {
  const totalCommits = data.reduce((sum, item) => sum + item.count, 0);
  const avgCommitsPerMonth = Math.round(totalCommits / data.length);

  return (
    <InsightCard 
      title="Commit Activity" 
      description={`${totalCommits} commits over the last year (${avgCommitsPerMonth} avg/month)`}
    >
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </InsightCard>
  );
};

export default CommitActivity;
