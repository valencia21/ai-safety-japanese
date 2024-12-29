import { SessionInformation } from '../../components/session-information/session-information';
import { ReadingList } from '../../components/reading-list/reading-list';
import { currentProject } from '../../config/project';

export const HomePage: React.FC = () => {
  const renderContent = () => {
    if (currentProject.defaultView === 'sessions') {
      return <SessionInformation />;
    }
    if (currentProject.defaultView === 'readings') {
      return <ReadingList />;
    }
    return null;
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};