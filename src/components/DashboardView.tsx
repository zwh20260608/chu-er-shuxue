/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';
import { CategoryConfigs } from '../data';
import { KnowledgePoint } from '../types';

interface DashboardProps {
  points: KnowledgePoint[];
  completedList: string[];
  onEnterLearning: (targetCategory?: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  points,
  completedList,
  onEnterLearning,
}) => {
  const totalCount = points.length;
  const completedCount = completedList.length;
  const percentChange = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Circular progress settings
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentChange / 100) * circumference;

  // Slogan based on progress
  let greetingMsg = "哈罗，小数学家！快开启你的数学提前学冒险吧！🚀";
  if (percentChange > 0 && percentChange < 30) {
    greetingMsg = "太棒了！你已经迈出了超前学习的第一步，加油！🌱";
  } else if (percentChange >= 30 && percentChange < 70) {
    greetingMsg = "哇，进度过半！你对初二数学的掌握越来越熟练啦！✨";
  } else if (percentChange >= 70 && percentChange < 100) {
    greetingMsg = "神勇！初二数学大关即将被你全面攻克！🔥";
  } else if (percentChange === 100) {
    greetingMsg = "金榜题名！你已百分百攻克初二数学，小数学之神！👑";
  }

  // Dynamic Lucide helper to pull icons by string name
  const renderIcon = (name: string, colorClass: string) => {
    switch (name) {
      case 'Triangle':
        return <Lucide.Triangle className={`w-7 h-7 ${colorClass}`} fill="currentColor" fillOpacity={0.2} />;
      case 'Layers':
        return <Lucide.Layers className={`w-7 h-7 ${colorClass}`} />;
      case 'Workflow':
        return <Lucide.Workflow className={`w-7 h-7 ${colorClass}`} />;
      case 'Activity':
        return <Lucide.Activity className={`w-7 h-7 ${colorClass}`} />;
      case 'Sparkles':
        return <Lucide.Sparkles className={`w-7 h-7 ${colorClass}`} />;
      case 'Percent':
        return <Lucide.Percent className={`w-7 h-7 ${colorClass}`} />;
      default:
        return <Lucide.BookOpen className={`w-7 h-7 ${colorClass}`} />;
    }
  };

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* 🚀 Header Circular Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-sm border border-white relative overflow-hidden"
        id="stats-summary-card"
      >
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full opacity-60 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Radical Circular Progress Ring in High Density Theme style */}
          <div className="relative w-32 h-32 flex-shrink-0" id="radial-progress-wrapper">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                class="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <motion.circle
                class="text-[#4caf50]"
                strokeWidth="10"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (percentChange / 100) * 251.2 }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-700 leading-none">{percentChange}%</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">总进度</span>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm font-medium mb-1">欢迎回来，小小数学家！</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-700 leading-tight">
              你已经掌握了 {completedCount}/{totalCount} 个知识点
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                🏆 本周之星
              </span>
              <span className="px-3 py-1.5 bg-orange-50 text-orange-500 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                🔥 连续学习 {completedCount > 0 ? (completedCount * 3 % 7) + 2 : 1} 天
              </span>
            </div>
          </div>
        </div>

        {/* Action button inside header */}
        <button
          onClick={() => onEnterLearning()}
          className="px-8 py-4 bg-[#4caf50] text-white rounded-3xl font-black text-lg shadow-xl shadow-green-200/60 hover:scale-105 transition-transform cursor-pointer"
        >
          进入提前学目录
        </button>
      </motion.div>

      {/* 📦 Six Core Modules Bento Grid */}
      <div className="space-y-4" id="modules-section">
        <div className="flex items-center gap-2 px-1">
          <Lucide.LayoutGrid className="w-5 h-5 text-[#4caf50]" />
          <h3 className="text-base md:text-lg font-black text-slate-700">
            初二核心知识模块 (共六大单元)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="modules-grid">
          {CategoryConfigs.map((config, index) => {
            const catPoints = points.filter(p => p.category === config.category);
            const total = catPoints.length;
            const completed = catPoints.filter(p => completedList.includes(p.id)).length;
            const perc = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <motion.div
                key={config.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => onEnterLearning(config.category)}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-transparent hover:border-[#4caf50]/30 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative cursor-pointer"
                id={`module-card-${index}`}
              >
                {/* Accent line on selected highlights */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.progressbarColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div>
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 ${config.bgLight} rounded-2xl flex items-center justify-center`}>
                      {renderIcon(config.icon, `text-${config.color}-500`)}
                    </div>
                    {perc > 0 && perc < 100 && (
                      <span className="text-xs font-black text-[#4caf50] bg-green-50 px-2.5 py-1 rounded-lg">进行中</span>
                    )}
                    {perc === 100 && (
                      <span className="text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">已通关 🌟</span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-slate-700 group-hover:text-[#4caf50] transition-colors">
                      {config.category}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>已学完 {perc}%</span>
                    <span>{completed}/{total}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${config.progressbarColor} rounded-full`} style={{ width: `${perc}%` }}></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Spark Tooltip decoration at bottom for perfect balance */}
      <div className="flex justify-end pt-4" id="floating-tooltip">
        <div className="bg-white/90 backdrop-blur px-6 py-3.5 rounded-[24px] shadow-sm border border-white flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#4caf50] animate-pulse"></div>
          <span className="text-sm font-bold text-slate-500 italic">“学数学，像探险一样有趣！”</span>
        </div>
      </div>
    </div>
  );
};
