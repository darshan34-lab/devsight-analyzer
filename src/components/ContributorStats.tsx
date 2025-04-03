
import React from 'react';
import { Contributor } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import InsightCard from './InsightCard';

interface ContributorStatsProps {
  contributors: Contributor[];
}

const ContributorStats = ({ contributors }: ContributorStatsProps) => {
  const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
  
  // Sort contributors by number of contributions (descending)
  const sortedContributors = [...contributors].sort((a, b) => b.contributions - a.contributions);

  return (
    <InsightCard 
      title="Top Contributors" 
      description={`${contributors.length} contributors with ${totalContributions} total contributions`}
      className="h-full"
    >
      <div className="space-y-4">
        {sortedContributors.map((contributor) => {
          const contributionPercentage = Math.round((contributor.contributions / totalContributions) * 100);
          
          return (
            <div key={contributor.name} className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={contributor.avatarUrl} alt={contributor.name} />
                <AvatarFallback>
                  {contributor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium leading-none">{contributor.name}</p>
                  <span className="text-xs text-muted-foreground">{contributor.contributions} commits</span>
                </div>
                <Progress value={contributionPercentage} className="h-1" />
              </div>
            </div>
          );
        })}
      </div>
    </InsightCard>
  );
};

export default ContributorStats;
