
import { 
  MockRepoData, 
  GitHubRepository, 
  GitHubContributor, 
  GitHubCommitActivity,
  GitHubLanguage,
  CodeMetric
} from "@/types";

// Extract owner and repo name from GitHub URL
const extractRepoInfo = (repoUrl: string): { owner: string; repo: string } => {
  const parts = repoUrl.split('/');
  // Handle URLs with or without trailing slash
  const repoIndex = parts.length - 1 === 0 || parts[parts.length - 1] === '' ? parts.length - 2 : parts.length - 1;
  const ownerIndex = repoIndex - 1;
  
  return {
    owner: parts[ownerIndex],
    repo: parts[repoIndex]
  };
};

// Calculate code metrics based on languages and commit activity
const calculateCodeMetrics = (
  languages: GitHubLanguage, 
  commitActivity: GitHubCommitActivity[]
): CodeMetric[] => {
  // Calculate total bytes of code
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  // Get the primary language percentage
  const primaryLanguage = Object.keys(languages)[0] || 'None';
  const primaryLanguagePercentage = primaryLanguage !== 'None' 
    ? Math.round((languages[primaryLanguage] / totalBytes) * 100) 
    : 0;
  
  // Calculate recent commit frequency
  const recentCommits = commitActivity.slice(-4).reduce((sum, week) => sum + week.total, 0);
  const olderCommits = commitActivity.slice(-8, -4).reduce((sum, week) => sum + week.total, 0);
  const commitChange = olderCommits > 0 
    ? Math.round(((recentCommits - olderCommits) / olderCommits) * 100) 
    : 100;
  
  // Count languages used
  const languageCount = Object.keys(languages).length;
  
  // Generate metrics
  return [
    { name: 'Primary Language Usage', value: primaryLanguagePercentage, change: 0, unit: '%' },
    { name: 'Languages Used', value: languageCount, change: 0, unit: '' },
    { name: 'Recent Commit Frequency', value: recentCommits, change: commitChange, unit: 'per month' },
    { name: 'Code Size', value: Math.round(totalBytes / 1024), change: 0, unit: 'KB' },
    { name: 'Code Quality Score', value: 85, change: 2, unit: '%' },  // Mocked as it requires code analysis
    { name: 'Documentation Coverage', value: 62, change: 5, unit: '%' },  // Mocked as it requires code analysis
  ];
};

// Format commit activity data for the chart
const formatCommitActivity = (commitActivity: GitHubCommitActivity[]): { date: string; count: number }[] => {
  return commitActivity.map((week) => {
    const date = new Date(week.week * 1000);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return {
      date: monthYear,
      count: week.total
    };
  }).slice(-12); // Last 12 weeks
};

// Fetch all required data from GitHub API
export const fetchRepositoryData = async (repoUrl: string): Promise<MockRepoData> => {
  const { owner, repo } = extractRepoInfo(repoUrl);
  
  // Fetch repository details
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!repoResponse.ok) {
    throw new Error(`Repository not found or API limit reached (${repoResponse.status})`);
  }
  const repository: GitHubRepository = await repoResponse.json();
  
  // Fetch contributors
  const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`);
  if (!contributorsResponse.ok) {
    throw new Error('Failed to fetch contributors');
  }
  const contributorsData: GitHubContributor[] = await contributorsResponse.json();
  
  // Fetch commit activity
  const commitActivityResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`);
  if (!commitActivityResponse.ok) {
    throw new Error('Failed to fetch commit activity');
  }
  const commitActivityData: GitHubCommitActivity[] = await commitActivityResponse.json();
  
  // Fetch languages
  const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
  if (!languagesResponse.ok) {
    throw new Error('Failed to fetch languages');
  }
  const languagesData: GitHubLanguage = await languagesResponse.json();
  
  // Format and transform the data
  const formattedRepository = {
    name: repository.name,
    owner: repository.owner.login,
    description: repository.description || 'No description provided',
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    issues: repository.open_issues_count,
    language: repository.language || 'Not specified',
    url: repository.html_url,
    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
  };
  
  const formattedContributors = contributorsData.map(contributor => ({
    name: contributor.login,
    avatarUrl: contributor.avatar_url,
    contributions: contributor.contributions,
    url: contributor.html_url,
  }));
  
  const codeMetrics = calculateCodeMetrics(languagesData, commitActivityData);
  const commitActivity = formatCommitActivity(commitActivityData);
  
  return {
    repository: formattedRepository,
    codeMetrics,
    commitActivity,
    contributors: formattedContributors,
  };
};
