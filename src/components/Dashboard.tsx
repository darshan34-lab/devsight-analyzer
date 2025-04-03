
import React from 'react';
import { MockRepoData, Repository } from '@/types';
import { Star, GitFork, AlertCircle, Clock, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CodeMetrics from './CodeMetrics';
import CommitActivity from './CommitActivity';
import ContributorStats from './ContributorStats';
import { Separator } from '@/components/ui/separator';

interface DashboardProps {
  data: MockRepoData;
}

const Dashboard = ({ data }: DashboardProps) => {
  const { repository, codeMetrics, commitActivity, contributors } = data;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full space-y-8">
      {/* Repository Header */}
      <div className="px-4 py-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <span>{repository.owner}/</span>
              <span className="text-primary">{repository.name}</span>
            </h2>
            <p className="text-muted-foreground mt-1">{repository.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <Code className="h-3.5 w-3.5" />
                {repository.language}
              </Badge>
              <span className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-github-yellow" />
                {repository.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <GitFork className="h-4 w-4 text-github-purple" />
                {repository.forks.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <AlertCircle className="h-4 w-4 text-github-red" />
                {repository.issues.toLocaleString()} issues
              </span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              Created: {formatDate(repository.createdAt)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 inline mr-1" />
              Last updated: {formatDate(repository.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CodeMetrics metrics={codeMetrics} />
        </div>
        <div className="h-full">
          <ContributorStats contributors={contributors} />
        </div>
      </div>

      {/* Commit Activity */}
      <div className="mt-6">
        <CommitActivity data={commitActivity} />
      </div>
    </div>
  );
};

export default Dashboard;
