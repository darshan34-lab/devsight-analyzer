
// Repository Types
export interface Repository {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  issues: number;
  language: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// Code Metrics
export interface CodeMetric {
  name: string;
  value: number;
  change?: number;
  unit?: string;
}

// Commit Activity
export interface CommitData {
  date: string;
  count: number;
}

// Contributors
export interface Contributor {
  name: string;
  avatarUrl: string;
  contributions: number;
  url: string;
}

// All repository data
export interface MockRepoData {
  repository: Repository;
  codeMetrics: CodeMetric[];
  commitActivity: CommitData[];
  contributors: Contributor[];
}

// GitHub API Response Types
export interface GitHubRepository {
  name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  default_branch: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubCommitActivity {
  total: number;
  week: number;
  days: number[];
}

export interface GitHubLanguage {
  [key: string]: number;
}
