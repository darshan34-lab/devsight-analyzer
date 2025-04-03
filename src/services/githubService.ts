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
  //  { name: 'Primary Language Usage', value: primaryLanguagePercentage, change: 0, unit: '%' },
  //  { name: 'Languages Used', value: languageCount, change: 0, unit: '' },
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

// Create headers with authorization if token is provided
const createHeaders = (token?: string): HeadersInit => {
  if (token) {
    return {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
  }
  return {
    'Accept': 'application/vnd.github.v3+json'
  };
};

// Fetch all required data from GitHub API
export const fetchRepositoryData = async (repoUrl: string, token?: string): Promise<MockRepoData> => {
  const { owner, repo } = extractRepoInfo(repoUrl);
  const headers = createHeaders(token);
  
  // Fetch repository details
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoResponse.ok) {
    if (repoResponse.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. ${token ? 'Your token may have insufficient permissions.' : 'Try adding a GitHub personal access token.'}`);
    } else if (repoResponse.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    } else {
      throw new Error(`Repository not found or API error (${repoResponse.status})`);
    }
  }
  const repository: GitHubRepository = await repoResponse.json();
  
  // Fetch contributors
  const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`, { headers });
  if (!contributorsResponse.ok) {
    console.error(`Failed to fetch contributors: ${contributorsResponse.status}`);
    // Continue with empty contributors instead of failing
    const contributorsData: GitHubContributor[] = [];
    
    // Fetch commit activity
    const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });

if (!commitResponse.ok) {
  console.error(`Failed to fetch commits: ${commitResponse.status}`);
  return []; // Return empty if API fails
}

const commitData = await commitResponse.json();

//  Filter out bot commits
const filteredCommits = commitData.filter(commit => 
  commit.author && 
  !commit.author.login.includes("lovable-dev[bot]") &&  // Removes bot accounts

);


      // Mock empty commit activity
      const commitActivityData: GitHubCommitActivity[] = Array(12).fill({ week: Date.now() / 1000, total: 0, days: [0, 0, 0, 0, 0, 0, 0] });
      
      // Fetch languages (continue despite previous errors)
      const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      if (!languagesResponse.ok) {
        console.error(`Failed to fetch languages: ${languagesResponse.status}`);
        // Mock empty languages
        const languagesData: GitHubLanguage = {};
        
        // Format with available data
        return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
      }
      
      const languagesData: GitHubLanguage = await languagesResponse.json();
      return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
    }
    
    const commitActivityData: GitHubCommitActivity[] = await commitActivityResponse.json();
    
    // Fetch languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    if (!languagesResponse.ok) {
      console.error(`Failed to fetch languages: ${languagesResponse.status}`);
      // Mock empty languages
      const languagesData: GitHubLanguage = {};
      return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
    }
    
    const languagesData: GitHubLanguage = await languagesResponse.json();
    return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
  }
  
  const contributorsData: GitHubContributor[] = await contributorsResponse.json();
  
  // Fetch commit activity
  const commitActivityResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers });
  if (!commitActivityResponse.ok) {
    console.error(`Failed to fetch commit activity: ${commitActivityResponse.status}`);
    // Mock empty commit activity
    const commitActivityData: GitHubCommitActivity[] = Array(12).fill({ week: Date.now() / 1000, total: 0, days: [0, 0, 0, 0, 0, 0, 0] });
    
    // Fetch languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    if (!languagesResponse.ok) {
      console.error(`Failed to fetch languages: ${languagesResponse.status}`);
      // Mock empty languages
      const languagesData: GitHubLanguage = {};
      return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
    }
    
    const languagesData: GitHubLanguage = await languagesResponse.json();
    return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
  }
  
  const commitActivityData: GitHubCommitActivity[] = await commitActivityResponse.json();
  
  // Fetch languages
  const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
  if (!languagesResponse.ok) {
    console.error(`Failed to fetch languages: ${languagesResponse.status}`);
    // Mock empty languages
    const languagesData: GitHubLanguage = {};
    return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
  }
  
  const languagesData: GitHubLanguage = await languagesResponse.json();
  return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
};

// Format repository data
const formatRepositoryData = (
  repository: GitHubRepository,
  contributorsData: GitHubContributor[],
  commitActivityData: GitHubCommitActivity[],
  languagesData: GitHubLanguage
): MockRepoData => {
  // Format repository
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
  
  // Format contributors
  const formattedContributors = contributorsData.map(contributor => ({
    name: contributor.login,
    avatarUrl: contributor.avatar_url,
    contributions: contributor.contributions,
    url: contributor.html_url,
  }));
  
  // Calculate metrics and format commit activity
  const codeMetrics = calculateCodeMetrics(languagesData, commitActivityData);
  const commitActivity = formatCommitActivity(commitActivityData);
  
  return {
    repository: formattedRepository,
    codeMetrics,
    commitActivity,
    contributors: formattedContributors,
  };
};
