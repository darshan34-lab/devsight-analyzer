
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

export interface CodeMetric {
  name: string;
  value: number;
  change?: number;
  unit?: string;
}

export interface CommitData {
  date: string;
  count: number;
}

export interface Contributor {
  name: string;
  avatarUrl: string;
  contributions: number;
  url: string;
}

export interface MockRepoData {
  repository: Repository;
  codeMetrics: CodeMetric[];
  commitActivity: CommitData[];
  contributors: Contributor[];
}
