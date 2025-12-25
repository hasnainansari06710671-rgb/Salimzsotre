
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AppEntry, Category } from './types';
import AppCard from './components/AppCard';
import AppDetails from './components/AppDetails';
import PublishForm from './components/PublishForm';

const App: React.FC = () => {
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppEntry | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "apps"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppEntry[];
      setApps(appData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           app.developer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, activeCategory, searchQuery]);

  const featuredApps = useMemo(() => apps.slice(0, 3), [apps]);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="glass-morphism sticky top-0 z-40 w-full px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-2xl italic">S</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight hidden sm:block">
              Salimz <span className="text-indigo-600">Store</span>
            </h1>
          </div>

          <div className="flex-1 max-w-2xl relative">
            <input 
              type="text"
              placeholder="Search apps, games, and more..."
              className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button 
            onClick={() => setShowPublish(true)}
            className="shrink-0 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden md:inline">Publish</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {['All', ...Object.values(Category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        {activeCategory === 'All' && !searchQuery && featuredApps.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredApps.map(app => (
                <div 
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img 
                    src={`https://picsum.photos/seed/${app.id}/800/600`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-4">
                      <img src={app.iconUrl} className="w-12 h-12 rounded-xl shadow-lg border border-white/20" alt="" />
                      <div>
                        <h3 className="text-white font-bold text-xl">{app.name}</h3>
                        <p className="text-slate-300 text-sm">{app.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* App List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory === 'All' ? 'Popular Apps' : activeCategory}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading store content...</p>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredApps.map(app => (
                <AppCard 
                  key={app.id} 
                  app={app} 
                  onClick={(a) => setSelectedApp(a)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No apps found in this collection.</p>
              <button 
                onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t bg-white pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl italic">S</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Salimz <span className="text-indigo-600">Store</span></h1>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              The premier platform for high-quality Android applications. Discover, share, and publish the best tools and games within the Salimz ecosystem.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Discover</h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li><a href="#" className="hover:text-indigo-600">New Releases</a></li>
              <li><a href="#" className="hover:text-indigo-600">Top Charts</a></li>
              <li><a href="#" className="hover:text-indigo-600">Editors' Choice</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Developer Console</a></li>
              <li><a href="#" className="hover:text-indigo-600">Publishing Guide</a></li>
              <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-slate-400 text-xs">
          © 2024 Salimz Branding. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      {selectedApp && (
        <AppDetails 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}

      {showPublish && (
        <PublishForm 
          onClose={() => setShowPublish(false)}
          onSuccess={() => {
            setShowPublish(false);
            alert("App published successfully! It will appear in the store soon.");
          }}
        />
      )}
    </div>
  );
};

export default App;
