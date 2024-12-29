export type ProjectId = 'ai_safety' | 'animal_welfare';

export interface ProjectConfig {
  id: ProjectId;
  title: string;
  currentTab: string;
  comingSoon: string;
  defaultView: 'sessions' | 'readings';
  fontFamily: string;
  backgroundColor: string;
}

const projectConfigs: Record<ProjectId, ProjectConfig> = {
  ai_safety: {
    id: 'ai_safety',
    title: 'AI Safety Notes',
    currentTab: 'AI Safety Fundamentals: Alignment',
    comingSoon: 'Coming Soon',
    defaultView: 'sessions',
    fontFamily: '"Inter", "Noto Sans JP", system-ui, sans-serif',
    backgroundColor: 'bg-white'
  },
  animal_welfare: {
    id: 'animal_welfare',
    title: 'Animal Welfare Notes',
    currentTab: 'Animal Ethics',
    comingSoon: 'Coming Soon',
    defaultView: 'readings',
    fontFamily: '"Gambetta", "Noto Sans JP", system-ui, sans-serif',
    backgroundColor: 'bg-sage-100'
  }
};

// Read from environment variable, fallback to ai_safety if not set
const currentProjectId = (import.meta.env.VITE_PROJECT_ID as ProjectId) || 'ai_safety';

export const currentProject = projectConfigs[currentProjectId];

// Helper function to validate if a string is a valid ProjectId
export const isValidProjectId = (id: string): id is ProjectId => {
  return id in projectConfigs;
}; 