
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { enhanceAppDescription } from '../geminiService';
import { Category } from '../types';

interface PublishFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PublishForm: React.FC<PublishFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    description: '',
    category: Category.TOOLS,
    iconUrl: '',
    apkUrl: '',
    size: '',
  });

  const handleAIImprove = async () => {
    if (!formData.name || !formData.description) {
      alert("Please provide at least a name and a basic description.");
      return;
    }
    setAiLoading(true);
    const improved = await enhanceAppDescription(formData.name, formData.description);
    setFormData(prev => ({ ...prev, description: improved || prev.description }));
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "apps"), {
        ...formData,
        rating: (Math.random() * 2 + 3).toFixed(1), // Random initial rating
        downloads: '0+',
        createdAt: serverTimestamp(),
        isFeatured: false,
      });
      onSuccess();
    } catch (error) {
      console.error("Error publishing app:", error);
      alert("Failed to publish app. Please check your Firebase rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Publish to Salimz Store</h2>
            <p className="text-slate-500 text-sm">Join our community of developers</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">App Name</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Salimz Messenger"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Developer Name</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.developer}
                onChange={e => setFormData({...formData, developer: e.target.value})}
                placeholder="Your Name / Studio"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <button 
                type="button"
                onClick={handleAIImprove}
                disabled={aiLoading}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-full transition-all border border-indigo-100 disabled:opacity-50"
              >
                {aiLoading ? "Thinking..." : "✨ AI Improve Description"}
              </button>
            </div>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what your app does..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">App Size</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.size}
                onChange={e => setFormData({...formData, size: e.target.value})}
                placeholder="Ex: 24.5 MB"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Icon URL</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.iconUrl}
              onChange={e => setFormData({...formData, iconUrl: e.target.value})}
              placeholder="https://example.com/icon.png"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">APK URL</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.apkUrl}
              onChange={e => setFormData({...formData, apkUrl: e.target.value})}
              placeholder="https://example.com/app.apk"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish App'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishForm;
