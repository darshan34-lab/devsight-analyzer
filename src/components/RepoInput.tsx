
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Search } from 'lucide-react';

interface RepoInputProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
}

const RepoInput = ({ onSubmit, isLoading }: RepoInputProps) => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onSubmit(repoUrl.trim());
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8 md:text-left">
        <h1 className="text-3xl font-bold mb-2">DevSight Analyzer</h1>
        <p className="text-muted-foreground">
          Enter a GitHub repository URL to analyze code quality, commit patterns, and developer insights
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
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
    </div>
  );
};

export default RepoInput;
