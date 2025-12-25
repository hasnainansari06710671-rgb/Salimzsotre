
import React, { useEffect, useState } from 'react';
import { AppEntry } from '../types';
import { getAIReviewSummary } from '../geminiService';

interface AppDetailsProps {
  app: AppEntry;
  onClose: () => void;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose }) => {
  const [aiInsight, setAiInsight] = useState<string>('Loading AI insight...');

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getAIReviewSummary(app.name, app.description);
      setAiInsight(insight);
    };
    fetchInsight();
  }, [app]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-white/80 backdrop-blur-md border-b">
          <h2 className="text-xl font-bold text-slate-800">App Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <img 
              src={app.iconUrl || `https://picsum.photos/seed/${app.id}/300`} 
              className="w-40 h-40 rounded-3xl shadow-lg object-cover"
              alt={app.name}
            />
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{app.name}</h1>
              <p className="text-indigo-600 font-semibold mb-4">{app.developer} • {app.category}</p>
              
              <div className="flex flex-wrap gap-8 text-sm text-slate-600 mb-6">
                <div>
                  <p className="font-bold text-slate-900 text-lg">{app.rating} ★</p>
                  <p>Rating</p>
                </div>
                <div className="border-x border-slate-200 px-8">
                  <p className="font-bold text-slate-900 text-lg">{app.downloads}</p>
                  <p>Downloads</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{app.size}</p>
                  <p>Size</p>
                </div>
              </div>

              <button className="w-full md:w-auto px-12 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95">
                Install Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">About this app</h3>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {app.description}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Screenshots</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/${app.id}-${i}/400/700`} 
                      className="h-[400px] w-auto rounded-xl object-cover shadow-md flex-shrink-0"
                      alt="Screenshot"
                    />
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 17.657a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" />
                  </svg>
                  <h4 className="font-bold text-indigo-900">Salimz AI insight</h4>
                </div>
                <p className="text-sm text-indigo-800 italic leading-relaxed">
                  "{aiInsight}"
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Additional Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Updated</span>
                    <span className="text-slate-900 font-medium">Dec 12, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Version</span>
                    <span className="text-slate-900 font-medium">4.2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Developer</span>
                    <span className="text-slate-900 font-medium">{app.developer}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
