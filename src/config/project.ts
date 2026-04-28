export type ProjectId = 'ai_safety' | 'animal_welfare';

export type TabView = 'sessions' | 'readings' | 'placeholder';

export interface Tab {
  id: string;
  label: string;
  view: TabView;
  sessionNumbers?: number[];
  /** If set, clicking the tab navigates here directly instead of switching `view`. */
  directLink?: string;
}

export interface ProjectConfig {
  id: ProjectId;
  title: string;
  tabs: Tab[];
  defaultView: 'sessions' | 'readings';
  fontFamily: string;
  backgroundColor: string;
}

const projectConfigs: Record<ProjectId, ProjectConfig> = {
  ai_safety: {
    id: 'ai_safety',
    title: 'AI Safety Notes',
    tabs: [
      { id: 'alignment', label: 'AI Safety Fundamentals: Alignment', view: 'sessions', sessionNumbers: [1, 2, 3, 4] },
      { id: 'ai_2027', label: 'AI 2027年', view: 'sessions', sessionNumbers: [100], directLink: '/ai-2027' },
    ],
    defaultView: 'sessions',
    fontFamily: '"Inter", "Noto Sans JP", system-ui, sans-serif',
    backgroundColor: 'bg-white'
  },
  animal_welfare: {
    id: 'animal_welfare',
    title: 'Animal Welfare Notes',
    tabs: [
      { id: 'animal_ethics', label: 'Animal Ethics', view: 'readings' },
    ],
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
