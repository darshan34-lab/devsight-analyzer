
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Search, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface RepoInputProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
}

const RepoInput = ({ onSubmit, isLoading }: RepoInputProps) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('github-token') || '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onSubmit(repoUrl.trim());
    }
  };

  const saveToken = () => {
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
    setShowTokenDialog(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8 md:text-left">
        <h1 className="text-3xl font-bold mb-2">DevSight Analyzer</h1>
        <p className="text-muted-foreground">
          Enter a GitHub repository URL to analyze code quality, commit patterns, and developer insights
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
        <form onSubmit={handleSubmit} className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <GitHubLogoIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isLoading || !repoUrl.trim()}>
            {isLoading ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </span>
            )}
          </Button>
        </form>
        
        <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Key className="mr-2 h-4 w-4" />
              {localStorage.getItem('github-token') ? 'Update Token' : 'Add API Token'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>GitHub API Token</DialogTitle>
              <DialogDescription>
                Add your GitHub Personal Access Token to increase API rate limits and access private repositories.
                You can create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="underline text-primary">GitHub Settings</a>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2">
                This token will be stored in your browser's local storage. It is never sent to our servers.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTokenDialog(false)}>Cancel</Button>
              <Button onClick={saveToken}>Save Token</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RepoInput;
