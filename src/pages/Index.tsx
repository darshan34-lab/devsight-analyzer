import React, { useState } from 'react';
import RepoInput from '@/components/RepoInput';
import Dashboard from '@/components/Dashboard';
import { fetchRepositoryData } from '@/services/githubService';
import { MockRepoData } from '@/types';
import { toast } from 'sonner';
import { Bot, Code2, Github } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState<MockRepoData | null>(null);

  const handleAnalyzeRepo = async (repoUrl: string) => {
    try {
      setIsLoading(true);
      
      // Validate URL format as GitHub repo URL
      if (!repoUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i)) {
        throw new Error('Please enter a valid GitHub repository URL (https://github.com/username/repository)');
      }
      
      // Simulate loading for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = await fetchRepositoryData(repoUrl);
      setRepoData(data);
      
      toast.success('Repository analyzed successfully', {
        description: `Analysis complete for ${data.repository.owner}/${data.repository.name}`,
      });
    } catch (error) {
      let message = 'Failed to analyze repository';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error('Analysis failed', {
        description: message,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <RepoInput onSubmit={handleAnalyzeRepo} isLoading={isLoading} />
        </div>

        {/* Dashboard or Welcome */}
        {repoData ? (
          <Dashboard data={repoData} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
              <FeatureCard 
                icon={<Github className="h-10 w-10 text-primary" />}
                title="Repository Analysis"
                description="Get insights into any public GitHub repository's structure, quality, and development patterns."
              />
              <FeatureCard 
                icon={<Code2 className="h-10 w-10 text-primary" />}
                title="Code Metrics"
                description="Understand code quality, test coverage, technical debt, and documentation levels."
              />
              <FeatureCard 
                icon={<Bot className="h-10 w-10 text-primary" />}
                title="Developer Insights"
                description="Identify contribution patterns, active developers, and commit frequency."
              />
            </div>
            <p className="text-muted-foreground mt-12">
              Enter a GitHub repository URL above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 flex flex-col items-center text-center insight-card-hover">
      {icon}
      <h3 className="text-lg font-medium mt-4 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
