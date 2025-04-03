
import React from 'react';
import { CodeMetric } from '@/types';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';
import InsightCard from './InsightCard';

interface CodeMetricsProps {
  metrics: CodeMetric[];
}

const CodeMetrics = ({ metrics }: CodeMetricsProps) => {
  return (
    <InsightCard 
      title="Code Quality Metrics" 
      description="Key metrics analyzing code health and maintainability"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{metric.name}</span>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {metric.value}{metric.unit}
                </span>
                {metric.change !== undefined && (
                  <span 
                    className={`text-xs flex items-center ${
                      metric.change > 0 
                        ? 'text-green-400' 
                        : metric.change < 0 
                          ? 'text-red-400' 
                          : 'text-gray-400'
                    }`}
                  >
                    {metric.change > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : metric.change < 0 ? (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    ) : null}
                    {Math.abs(metric.change)}%
                  </span>
                )}
              </div>
            </div>
            <Progress 
              value={metric.unit === '%' ? metric.value : Math.min(100, metric.value)} 
              className="h-2" 
            />
          </div>
        ))}
      </div>
    </InsightCard>
  );
};

export default CodeMetrics;
