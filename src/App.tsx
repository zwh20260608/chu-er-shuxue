/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { parseSyllabus } from './data';
import { DashboardView } from './components/DashboardView';
import { DetailView } from './components/DetailView';
import { KnowledgePoint } from './types';

export default function App() {
  // Parse static CSV syllabus data
  const points: KnowledgePoint[] = parseSyllabus();

  // Load state from localStorage on first render
  const [completedPoints, setCompletedPoints] = useState<string[]>(() => {
    const saved = localStorage.getItem('math_prelearn_completed');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'dashboard' | 'detail'>(() => {
    const saved = localStorage.getItem('math_prelearn_view');
    return (saved === 'detail' || saved === 'dashboard') ? saved : 'dashboard';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('math_prelearn_category') || '';
  });

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem('math_prelearn_completed', JSON.stringify(completedPoints));
  }, [completedPoints]);

  useEffect(() => {
    localStorage.setItem('math_prelearn_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('math_prelearn_category', selectedCategory);
  }, [selectedCategory]);

  // Handle checking / unchecking a knowledge point
  const handleToggleComplete = (id: string) => {
    setCompletedPoints((prev) => {
      const isDone = prev.includes(id);
      if (isDone) {
        return prev.filter((p) => p !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Reset progress and start fresh
  const handleClearProgress = () => {
    if (window.confirm('确定要清除这尊好不容易学到的徽章进度，重新回到零开始学习吗？🧹')) {
      setCompletedPoints([]);
      setSelectedCategory('');
      setView('dashboard');
    }
  };

  // Switch to study detail page with selected module config
  const handleEnterLearning = (targetCat?: string) => {
    if (targetCat) {
      setSelectedCategory(targetCat);
    } else {
      setSelectedCategory('');
    }
    setView('detail');
  };

  const totalPointsCount = points.length;
  const completedCount = completedPoints.length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8 min-h-screen text-slate-800 font-sans" id="app-root-shell">
      {/* 🎒 Top Premium Navigation App Brand Banner */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] border border-slate-100 p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
        id="app-global-navigation-header"
      >
        <div className="flex items-center gap-3.5 text-center sm:text-left" id="app-logo-and-title">
          {/* Logo element */}
          <div className="w-12 h-12 bg-[#4caf50] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100/60 flex-shrink-0 animate-pulse">
            <Lucide.BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-705 tracking-tight leading-none">
              初一升初二数学提前学
            </h1>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1">
              Grade 8 Semester 1 · Math Pre-learning Adventure Hub 🗺️
            </p>
          </div>
        </div>

        {/* Global Progress indicators and Clear functions */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end" id="app-global-action-controls">
          {/* Progress Pill Bar */}
          <div className="flex items-center gap-2 bg-[#f0f9ff]/80 border border-sky-100 px-4 py-2 rounded-2xl shadow-sm" id="global-pill-tracker">
            <div className="flex items-center gap-1">
              <Lucide.Award className="w-4 h-4 text-[#4caf50]" />
              <span className="text-xs font-bold text-slate-600">已斩获勋章:</span>
            </div>
            <strong className="text-sm font-mono text-[#4caf50] font-black">
              {completedCount} <span className="text-slate-300">/</span> {totalPointsCount} 关
            </strong>
          </div>

          {/* Reset progress cleaner */}
          {completedCount > 0 && (
            <button
              onClick={handleClearProgress}
              className="text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 hover:border-red-100 px-3 py-2 rounded-2xl cursor-pointer transition-all flex items-center gap-1 shadow-sm bg-white"
              title="清空记录重新开始你的暑期超前学"
            >
              <Lucide.Undo className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">清除记录</span>
            </button>
          )}
        </div>
      </motion.header>

      {/* 📽️ Content Area with Beautiful sliding Transitions between views */}
      <main className="relative" id="main-route-content-container">
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              <DashboardView
                points={points}
                completedList={completedPoints}
                onEnterLearning={handleEnterLearning}
              />
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <DetailView
                points={points}
                completedList={completedPoints}
                onToggleComplete={handleToggleComplete}
                initialCategory={selectedCategory}
                onBackToHome={() => setView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🎈 Footer badge info decor and guidelines */}
      <footer className="text-center py-6 text-xs text-gray-400 font-bold" id="app-footer-brand-claims">
        <span className="block mb-1">🍭 专为初一升初二量身打造 · 温和童趣版超前自刷教材</span>
        <span className="font-mono text-[10px] opacity-60">
          © 2026 探险家趣味数学 · 学无止境, 精巧匠心
        </span>
      </footer>
    </div>
  );
}
