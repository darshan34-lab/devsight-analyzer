
import { MockRepoData } from "@/types";

// For demo purposes, we'll use mock data
export const fetchRepositoryData = async (repoUrl: string): Promise<MockRepoData> => {
  // In a real implementation, we would parse the repoUrl and make API calls
  // to GitHub's API to fetch the actual data
  
  // Mock data for visualization purposes
  return {
    repository: {
      name: repoUrl.split('/').pop() || 'Repository',
      owner: repoUrl.split('/').slice(-2, -1)[0] || 'Owner',
      description: 'A modern code analysis and development insights tool',
      stars: 1287,
      forks: 348,
      issues: 67,
      language: 'TypeScript',
      url: repoUrl,
      createdAt: '2022-03-15',
      updatedAt: '2023-07-25',
    },
    codeMetrics: [
      { name: 'Code Quality Score', value: 87, change: 3, unit: '%' },
      { name: 'Test Coverage', value: 76, change: -2, unit: '%' },
      { name: 'Technical Debt', value: 24, change: -5, unit: 'hours' },
      { name: 'Code Duplication', value: 7, change: 1, unit: '%' },
      { name: 'Documentation Coverage', value: 62, change: 8, unit: '%' },
      { name: 'Complexity Score', value: 28, change: -3, unit: '' },
    ],
    commitActivity: [
      { date: '2023-01', count: 56 },
      { date: '2023-02', count: 42 },
      { date: '2023-03', count: 85 },
      { date: '2023-04', count: 37 },
      { date: '2023-05', count: 63 },
      { date: '2023-06', count: 91 },
      { date: '2023-07', count: 72 },
      { date: '2023-08', count: 84 },
      { date: '2023-09', count: 65 },
      { date: '2023-10', count: 78 },
      { date: '2023-11', count: 94 },
      { date: '2023-12', count: 52 },
    ],
    contributors: [
      { name: 'Sarah Chen', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', contributions: 243, url: '#' },
      { name: 'Alex Rivera', avatarUrl: 'https://i.pravatar.cc/150?u=alex', contributions: 186, url: '#' },
      { name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?u=jordan', contributions: 142, url: '#' },
      { name: 'Tasha Kim', avatarUrl: 'https://i.pravatar.cc/150?u=tasha', contributions: 97, url: '#' },
      { name: 'Miguel Santos', avatarUrl: 'https://i.pravatar.cc/150?u=miguel', contributions: 76, url: '#' },
    ]
  };
};
