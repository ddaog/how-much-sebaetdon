import { useState } from 'react';
import { SurveyForm } from './components/SurveyForm';
import { Statistics } from './components/Statistics';
import { useSurvey } from './hooks/useSurvey';
import type { SurveyEntry } from './types/survey';
import './App.css';

function App() {
  const [view, setView] = useState<'survey' | 'stats'>('survey');
  const [currentSurvey, setCurrentSurvey] = useState<SurveyEntry | undefined>();
  const { data, submitSurvey } = useSurvey();

  const handleSurveySubmit = async (formData: SurveyEntry) => {
    setCurrentSurvey(formData);
    const success = await submitSurvey(formData);
    window.scrollTo(0, 0);
    if (success) {
      setView('stats');
    } else {
      // For prototype demo, we still show stats even if DB fail
      setView('stats');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-900">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-blue-600 mb-2">세뱃돈 메이커</h1>
        <p className="text-gray-500 font-medium">다른 사람들은 얼마나 줄까?</p>
      </header>

      <main className="w-full max-w-md">
        {view === 'survey' ? (
          <SurveyForm onSubmit={handleSurveySubmit} />
        ) : (
          <Statistics data={data} currentSurvey={currentSurvey} />
        )}

        {view === 'stats' && (
          <button
            onClick={() => {
              setView('survey');
              window.scrollTo(0, 0);
            }}
            className="w-full mt-4 py-3 text-gray-500 font-medium text-sm hover:text-blue-600 transition-colors"
          >
            ← 다시 설문하기
          </button>
        )}
      </main>

      <footer className="mt-auto pt-10 pb-6 text-center">
        <p className="text-xs text-gray-400">© 2026 Sebaetdon Maker. All rights reserved.</p>
        <p className="text-[10px] text-gray-300 mt-1 italic">Powered by Apps in Toss Prototype</p>
      </footer>
    </div>
  );
}

export default App;
