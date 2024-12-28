import { SessionInformation } from '../../components/session-information/session-information';
import { ReadingList } from '../../components/reading-list/reading-list';

export const HomePage: React.FC = () => {
  const projectId = import.meta.env.VITE_PROJECT_ID;

  const renderContent = () => {
    if (projectId === 'ai_safety') {
      return <SessionInformation />;
    }

    if (projectId === 'animal_welfare') {
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