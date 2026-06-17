/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { KnowledgePoint } from '../types';
import { CategoryConfigs } from '../data';

interface DetailViewProps {
  points: KnowledgePoint[];
  completedList: string[];
  onToggleComplete: (id: string) => void;
  initialCategory?: string;
  onBackToHome: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  points,
  completedList,
  onToggleComplete,
  initialCategory,
  onBackToHome,
}) => {
  // State for active knowledge point
  const [activePoint, setActivePoint] = useState<KnowledgePoint | null>(null);

  // Expanded categories & subcategories states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});

  // Search filter
  const [searchText, setSearchText] = useState('');

  // Mobile sidebar visibility
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  // Iframe loading indicator
  const [iframeLoading, setIframeLoading] = useState(false);

  // 1. Group knowledge points into structured hierarchy: Category -> Subcategory -> List of Points
  const groupedTree = useMemo(() => {
    const tree: Record<string, Record<string, KnowledgePoint[]>> = {};
    points.forEach((point) => {
      if (!tree[point.category]) {
        tree[point.category] = {};
      }
      if (!tree[point.category][point.subcategory]) {
        tree[point.category][point.subcategory] = [];
      }
      tree[point.category][point.subcategory].push(point);
    });
    return tree;
  }, [points]);

  // 2. Set default active point and initial expanded sections based on initialCategory prop
  useEffect(() => {
    // If a specific category was clicked from the Dashboard, expand it and find its first point
    const targetCat = initialCategory || points[0]?.category;
    
    if (targetCat && groupedTree[targetCat]) {
      setExpandedCategories((prev) => ({ ...prev, [targetCat]: true }));
      
      // Auto expand all subcategories of this target category
      const subcats = Object.keys(groupedTree[targetCat]);
      if (subcats.length > 0) {
        const initialSubs: Record<string, boolean> = {};
        subcats.forEach((sub) => {
          initialSubs[`${targetCat}-${sub}`] = true;
        });
        setExpandedSubcategories((prev) => ({ ...prev, ...initialSubs }));

        // Find the first point
        const firstPoint = groupedTree[targetCat][subcats[0]]?.[0];
        if (firstPoint) {
          setActivePoint(firstPoint);
        }
      }
    } else if (points.length > 0) {
      setActivePoint(points[0]);
    }
  }, [initialCategory, points, groupedTree]);

  // 3. Listen to messages from the iframe (quiz completion)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'KNOWLEDGE_POINT_COMPLETED') {
        const kpName = e.data.name;
        // If it isn't already completed, check it!
        if (kpName && !completedList.includes(kpName)) {
          onToggleComplete(kpName);
          // Play a small success notification / console or temporary state
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [completedList, onToggleComplete]);

  // 4. Handle Search: Filter data and auto-expand matches
  const filteredPoints = useMemo(() => {
    if (!searchText.trim()) return points;
    return points.filter(p => 
      p.name.includes(searchText) || 
      p.subcategory.includes(searchText) || 
      p.category.includes(searchText)
    );
  }, [searchText, points]);

  // If search changes, expand active elements
  useEffect(() => {
    if (searchText.trim().length > 0) {
      const newExpCats: Record<string, boolean> = {};
      const newExpSubs: Record<string, boolean> = {};

      filteredPoints.forEach((p) => {
        newExpCats[p.category] = true;
        newExpSubs[`${p.category}-${p.subcategory}`] = true;
      });

      setExpandedCategories((prev) => ({ ...prev, ...newExpCats }));
      setExpandedSubcategories((prev) => ({ ...prev, ...newExpSubs }));

      // Fallback: update active point to first search result if current is filtered out
      if (activePoint && !filteredPoints.some(p => p.id === activePoint.id) && filteredPoints.length > 0) {
        setActivePoint(filteredPoints[0]);
      }
    }
  }, [searchText, filteredPoints]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleSubcategory = (cat: string, sub: string) => {
    const key = `${cat}-${sub}`;
    setExpandedSubcategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 5. CSV studying schema exporter
  const handleExportCSV = () => {
    // Get all uncompleted knowledge points
    const uncompletedPoints = points.filter(p => !completedList.includes(p.id));
    
    // Header
    let csvContent = '\uFEFF'; // UTF-8 BOM to prevent Chinese character garbling in Excel
    csvContent += '分类,子分类,知识点名称,对应年级,学习状态\n';

    uncompletedPoints.forEach((p) => {
      // Escape commas just in case
      const cat = p.category.replace(/,/g, '，');
      const sub = p.subcategory.replace(/,/g, '，');
      const name = p.name.replace(/,/g, '，');
      const grade = p.grade.replace(/,/g, '，');
      csvContent += `${cat},${sub},${name},${grade},规划待学\n`;
    });

    // Create blobs and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `初二数学提前学_我的待学课程表_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to match modular colors
  const getConfig = (cat: string) => {
    return CategoryConfigs.find(c => c.category === cat) || CategoryConfigs[0];
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]" id="detail-view-layout">
      
      {/* 📱 Mobile trigger to open side panel */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border-2 border-gray-100 shadow-sm" id="mobile-control-bar">
        <button
          onClick={() => onBackToHome()}
          className="flex items-center gap-1.5 text-xs font-black text-gray-500 hover:text-emerald-600 cursor-pointer"
        >
          <Lucide.ArrowLeft className="w-4 h-4" />
          <span>返回大厅</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 bg-[#edfbf3] border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer shadow-sm hover:bg-emerald-100"
          >
            <Lucide.Download className="w-3.5 h-3.5" />
            <span>导出待学表</span>
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-1 bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer shadow-md hover:bg-emerald-600"
          >
            <Lucide.Menu className="w-3.5 h-3.5" />
            <span>{mobileSidebarOpen ? "关闭目录" : "展开目录"}</span>
          </button>
        </div>
      </div>

      {/* 📁 Left Sidebar Tree collapsible */}
      <AnimatePresence>
        {(mobileSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            className={`w-full lg:w-[260px] flex-shrink-0 bg-white rounded-[32px] border border-slate-100 p-5 shadow-sm space-y-5 lg:block ${
              mobileSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
            id="syllabus-sidebar-wrapper"
          >
            {/* Header Area with back controls for desktop */}
            <div className="hidden lg:flex items-center justify-between pb-3 border-b border-gray-100" id="sidebar-top-bar">
              <button
                onClick={() => onBackToHome()}
                className="inline-flex items-center gap-2 text-xs font-black text-gray-500 hover:text-emerald-700 cursor-pointer group"
              >
                <Lucide.ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>返回主页大厅</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-800 text-[11px] font-black cursor-pointer shadow-sm transition-all"
                title="一键下载未完成知识点清单"
              >
                <Lucide.Download className="w-3.5 h-3.5" />
                <span>导出待学表</span>
              </button>
            </div>

            {/* Dynamic Real-time search */}
            <div className="space-y-1" id="search-container">
              <label className="text-[10px] md:text-xs font-black text-gray-400 block uppercase px-1">
                🔍 全书目录快速搜索
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="搜索知识点名称、分类..."
                  className="w-full bg-slate-50 text-xs md:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4caf50]/20 focus:border-[#4caf50] pl-10 pr-8 py-2 rounded-2xl font-medium transition-all text-slate-800 placeholder-slate-400"
                />
                <Lucide.Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                {searchText && (
                  <button
                    onClick={() => setSearchText('')}
                    className="absolute right-2.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <Lucide.X className="w-3.5 h-3.5 bg-gray-100 hover:bg-gray-200 rounded-full p-0.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 3-Level Collapsible Accordions List */}
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 custom-scrollbar" id="tree-scroller">
              {Object.keys(groupedTree).map((catName) => {
                // Check if search results include this category
                const subcatsObj = groupedTree[catName] || {};
                const hasMatchingPointsInCat = Object.values(subcatsObj).some((pointsList) => {
                  const list = pointsList as KnowledgePoint[];
                  return list.some(p => filteredPoints.some(fp => fp.id === p.id));
                });

                if (!hasMatchingPointsInCat) return null;

                const config = getConfig(catName);
                const isCatExpanded = !!expandedCategories[catName];

                return (
                  <div key={catName} className="space-y-1.5 border-b border-gray-50 pb-2 last:border-b-0" id={`cat-group-${catName}`}>
                    {/* Level 1: Category Bar */}
                    <button
                      onClick={() => toggleCategory(catName)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all font-bold text-xs md:text-sm cursor-pointer border ${
                        isCatExpanded ? 'text-[#4caf50] bg-green-50/70 border-[#c2ecd0]/80 shadow-inner' : 'text-slate-650 bg-slate-50/50 border-transparent hover:bg-slate-100/65'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📚</span>
                        <span>{catName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-gray-400 font-bold border border-gray-100">
                          {Object.values(groupedTree[catName]).flat().length}节
                        </span>
                        {isCatExpanded ? (
                          <Lucide.ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        ) : (
                          <Lucide.ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {/* Level 2: Subcategories List under Category */}
                    <AnimatePresence initial={false}>
                      {isCatExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-3.5 space-y-2 pt-1 overflow-hidden"
                          id={`cat-subs-${catName}`}
                        >
                          {Object.keys(groupedTree[catName]).map((subcatName) => {
                            // Check if search results include points in this subcategory
                            const hasPointInSub = groupedTree[catName][subcatName].some(p =>
                              filteredPoints.some(fp => fp.id === p.id)
                            );

                            if (!hasPointInSub) return null;

                            const subKey = `${catName}-${subcatName}`;
                            const isSubExpanded = !!expandedSubcategories[subKey];

                            return (
                              <div key={subcatName} className="space-y-1">
                                <button
                                  onClick={() => toggleSubcategory(catName, subcatName)}
                                  className="w-full flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-xl text-left text-[11px] md:text-xs font-bold text-gray-500 cursor-pointer"
                                >
                                  <span className="truncate pr-1">🔖 {subcatName}</span>
                                  {isSubExpanded ? (
                                    <Lucide.ChevronDown className="w-3 h-3 text-gray-400" />
                                  ) : (
                                    <Lucide.ChevronRight className="w-3 h-3 text-gray-400" />
                                  )}
                                </button>

                                {/* Level 3: Knowledge Points List */}
                                <AnimatePresence initial={false}>
                                  {isSubExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="pl-2 space-y-1 overflow-hidden"
                                      id={`sub-points-${subKey}`}
                                    >
                                      {groupedTree[catName][subcatName].map((point) => {
                                        // Filter in search
                                        const matchesSearch = filteredPoints.some(fp => fp.id === point.id);
                                        if (!matchesSearch) return null;

                                        const isCompleted = completedList.includes(point.id);
                                        const isActive = activePoint?.id === point.id;

                                        return (
                                          <div
                                            key={point.id}
                                            className={`group w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                                              isActive
                                                ? 'bg-green-50 text-[#4caf50] border border-green-105/30 font-bold shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 border border-transparent font-medium'
                                            }`}
                                            onClick={() => {
                                              setActivePoint(point);
                                              // Auto fold sidebar on small screen for better study focus
                                              if (window.innerWidth < 1024) {
                                                setMobileSidebarOpen(false);
                                              }
                                            }}
                                            id={`kp-row-${point.id}`}
                                          >
                                            <div className="flex items-center gap-1 px-0.5 truncate pointer-events-none">
                                              <span className="text-[10px] opacity-70">✏️</span>
                                              <span className="truncate">{point.name}</span>
                                            </div>

                                            {/* Checklist checkbox toggler */}
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation(); // Avoid choosing page
                                                onToggleComplete(point.id);
                                              }}
                                              className="p-1 text-gray-400 hover:text-emerald-600 rounded-lg bg-white/50 hover:bg-emerald-50 active:scale-90 transition-all border border-gray-100 flex-shrink-0 cursor-pointer"
                                              title={isCompleted ? "标记为未学习" : "标记为学习完毕"}
                                            >
                                              {isCompleted ? (
                                                <Lucide.CheckSquare className="w-3.5 h-3.5 text-[#4caf50]" />
                                              ) : (
                                                <Lucide.Square className="w-3.5 h-3.5 text-gray-300" />
                                              )}
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖥️ Right Content Area: Iframe display */}
      <div className="flex-1 bg-white border border-slate-100 rounded-[32px] p-4 md:p-6 shadow-sm flex flex-col space-y-4 relative" id="iframe-content-panel">
        
        {activePoint ? (
          <div className="flex-1 flex flex-col space-y-4" id="loaded-active-area">
            {/* Action Top Bar indicating what's loaded */}
            <div className="bg-gray-50 rounded-2xl p-3 md:p-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3" id="active-point-header">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center border border-emerald-100 shadow-sm`}>
                  💡
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-black text-gray-800 flex items-center gap-2">
                    <span>当前选定知识点课件:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-bold border border-emerald-200">
                      {activePoint.category}
                    </span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-1">
                    三级级联目录：{activePoint.category} ➔ {activePoint.subcategory} ➔ {activePoint.name}
                  </p>
                </div>
              </div>

              {/* Study Completion fast action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleComplete(activePoint.id)}
                  className={`px-4 py-2 text-xs font-black rounded-xl border cursor-pointer transition-all flex items-center gap-1.5 shadow-sm ${
                    completedList.includes(activePoint.id)
                      ? 'bg-green-50 text-[#4caf50] border-green-100/55 hover:bg-green-100/50'
                      : 'bg-[#4caf50] text-white border-[#4caf50] shadow-md shadow-green-100/40 hover:bg-green-600'
                  }`}
                >
                  {completedList.includes(activePoint.id) ? (
                    <>
                      <Lucide.CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✨ 本关已通关学成</span>
                    </>
                  ) : (
                    <>
                      <Lucide.Square className="w-3.5 h-3.5" />
                      <span>一键标为已学</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Iframe Frame Box */}
            <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200/80 rounded-2xl overflow-hidden relative min-h-[460px] md:min-h-[580px] flex shadow-inner" id="iframe-viewport-wrapper">
              
              <iframe
                id="learning-iframe"
                src={`./knowledge/${encodeURIComponent(activePoint.name)}.html`}
                className="w-full h-full border-none rounded-2xl"
                onLoad={() => setIframeLoading(false)}
                onLoadStart={() => setIframeLoading(true)}
              />

              {iframeLoading && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center space-y-2 font-bold text-xs text-gray-400">
                  <div className="w-8 h-8 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin" />
                  <span>正在调配数学乐园公式课件...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4" id="empty-state-card">
            <span className="text-5xl animate-pulse">📚</span>
            <div>
              <h3 className="text-base md:text-lg font-black text-gray-700">没有选定要学的知识点</h3>
              <p className="text-xs text-gray-400 font-bold mt-1">请从左侧列表目录中选择任何一个感兴趣的数学知识关卡进行提前超前学！</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
