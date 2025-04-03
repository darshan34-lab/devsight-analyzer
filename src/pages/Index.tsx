
import React, { useState } from 'react';
import RepoInput from '@/components/RepoInput';
import Dashboard from '@/components/Dashboard';
import { fetchRepositoryData } from '@/services/githubService';
import { MockRepoData } from '@/types';
import { toast } from 'sonner';
import { Bot, Code2, Github, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState<MockRepoData | null>(null);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [githubToken, setGithubToken] = useState<string>(() => {
    // Try to get token from localStorage
    return localStorage.getItem('github-token') || '';
  });

  const handleSaveToken = () => {
    if (githubToken) {
      localStorage.setItem('github-token', githubToken);
      toast.success('GitHub token saved', {
        description: 'Your token has been securely saved in your browser'
      });
    } else {
      localStorage.removeItem('github-token');
      toast.info('GitHub token removed', {
        description: 'Your token has been removed from your browser'
      });
    }
    setTokenDialogOpen(false);
  };

  const handleAnalyzeRepo = async (repoUrl: string) => {
    try {
      setIsLoading(true);
      
      // Validate URL format as GitHub repo URL
      if (!repoUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i)) {
        throw new Error('Please enter a valid GitHub repository URL (https://github.com/username/repository)');
      }
      
      const token = localStorage.getItem('github-token') || undefined;
      const data = await fetchRepositoryData(repoUrl, token);
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <RepoInput onSubmit={handleAnalyzeRepo} isLoading={isLoading} />
            <Button
              variant="outline"
              size="sm"
              className="md:self-start"
              onClick={() => setTokenDialogOpen(true)}
            >
              <Key className="mr-2 h-4 w-4" />
              {githubToken ? 'Update API Token' : 'Add API Token'}
            </Button>
          </div>
          
          {!githubToken && (
            <Alert className="bg-card/50 mb-4">
              <AlertDescription>
                GitHub has API rate limits. Add a personal access token to increase your limit and access private repositories.
              </AlertDescription>
            </Alert>
          )}
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

      {/* GitHub Token Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>GitHub Personal Access Token</DialogTitle>
            <DialogDescription>
              Add your GitHub Personal Access Token to increase API rate limits and access private repositories.
              You can create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="underline text-primary">GitHub Settings</a>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full"
            />
            <DialogDescription>
              This token will be stored in your browser's local storage. It is never sent to our servers.
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTokenDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveToken}>Save Token</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
