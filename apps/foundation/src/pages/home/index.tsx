import { useAtomValue } from 'jotai';
import { SessionInformation } from '~/components/session-information/session-information';
import { ReadingList } from '~/components/reading-list/reading-list';
import { currentProject } from '~/config/project';
import { activeTabAtom } from '~/state-manager';

export const HomePage: React.FC = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const tab = currentProject.tabs.find(t => t.id === activeTab);

  const renderContent = () => {
    switch (tab?.view) {
      case 'sessions':
        return <SessionInformation />;
      case 'readings':
        return <ReadingList />;
      case 'placeholder':
        return (
          <div className="container mx-auto px-6 py-24 text-center">
            <h2 className="text-2xl font-medium text-stone-900">{tab.label}</h2>
            <p className="mt-3 text-stone-500">Coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};
