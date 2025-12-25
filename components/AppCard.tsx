
import React from 'react';
import { AppEntry } from '../types';

interface AppCardProps {
  app: AppEntry;
  onClick: (app: AppEntry) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  return (
    <div 
      onClick={() => onClick(app)}
      className="group cursor-pointer bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100"
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-2xl shadow-md group-hover:shadow-lg transition-shadow">
          <img 
            src={app.iconUrl || `https://picsum.photos/seed/${app.id}/200`} 
            alt={app.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center w-full">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">{app.name}</h3>
          <p className="text-xs text-slate-500 mb-2">{app.category}</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs font-medium text-slate-700">{app.rating}</span>
            <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
