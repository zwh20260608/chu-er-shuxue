/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgePoint, CategoryStats } from './types';

// The requested CSV constant with: 分类,子分类,知识点名称,对应年级
export const SyllabusCSV = `分类,子分类,知识点名称,对应年级
三角形,与三角形有关的线段,三角形的概念,初二上学期
三角形,与三角形有关的线段,三角形的边,初二上学期
三角形,与三角形有关的线段,三角形的中线、角平分线、高,初二上学期
三角形,三角形的内角与外角,三角形的内角,初二上学期
三角形,三角形的内角与外角,三角形的外角,初二上学期
全等三角形,全等三角形及其性质,全等三角形及其性质,初二上学期
全等三角形,三角形全等的判定,三角形全等的判定,初二上学期
全等三角形,角的平分线,角的平分线,初二上学期
轴对称,图形的轴对称,轴对称及其性质,初二上学期
轴对称,图形的轴对称,线段的垂直平分线,初二上学期
轴对称,画轴对称的图形,画轴对称的图形,初二上学期
轴对称,等腰三角形,等腰三角形,初二上学期
轴对称,等腰三角形,等边三角形,初二上学期
整式的乘法,幂的运算,同底数幂的乘法,初二上学期
整式的乘法,幂的运算,幂的乘方与积的乘方,初二上学期
整式的乘法,整式的乘法,整式的乘法,初二上学期
整式的乘法,乘法公式,平方差公式,初二上学期
整式的乘法,乘法公式,完全平方公式,初二上学期
因式分解,用提公因式法分解因式,用提公因式法分解因式,初二上学期
因式分解,用公式法分解因式,用公式法分解因式,初二上学期
分式,分式及其基本性质,从分数到分式,初二上学期
分式,分式及其基本性质,分式的基本性质,初二上学期
分式,分式的乘法与除法,分式的乘法与除法,初二上学期
分式,分式的加法与减法,分式的加法与减法,初二上学期
分式,整数指数幂,整数指数幂,初二上学期
分式,分式方程,分式方程,初二上学期`;

/**
 * Parses the CSV string constant into structured KnowledgePoint objects.
 */
export function parseSyllabus(): KnowledgePoint[] {
  const lines = SyllabusCSV.split('\n');
  const result: KnowledgePoint[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('分类')) {
      continue; // Skip empty lines and header
    }

    const parts = line.split(',');
    if (parts.length >= 4) {
      const category = parts[0].trim();
      const subcategory = parts[1].trim();
      const name = parts[2].trim();
      const grade = parts[3].trim();

      result.push({
        id: name, // Using Name as unique identifier for storage
        category,
        subcategory,
        name,
        grade
      });
    }
  }

  return result;
}

// 6 Core Module configurations with styles, icons, descriptions
export const CategoryConfigs = [
  {
    category: "三角形",
    icon: "Triangle",
    color: "emerald",
    primaryColor: "#10b981",
    bgLight: "bg-emerald-50/70 border-emerald-100 text-emerald-800",
    hoverBg: "hover:bg-emerald-50/50",
    badgeColor: "bg-emerald-100 text-emerald-800",
    progressbarColor: "bg-emerald-500",
    description: "领略三边及角之奥妙，洞悉三角形内外双重规则",
  },
  {
    category: "全等三角形",
    icon: "Layers",
    color: "sky",
    primaryColor: "#0ea5e9",
    bgLight: "bg-sky-50/80 border-sky-100 text-sky-800",
    hoverBg: "hover:bg-sky-50/50",
    badgeColor: "bg-sky-100 text-sky-800",
    progressbarColor: "bg-sky-500",
    description: "探究超强重合密匙，熟练运用五大判定法门",
  },
  {
    category: "轴对称",
    icon: "Workflow",
    color: "indigo",
    primaryColor: "#6366f1",
    bgLight: "bg-indigo-50/80 border-indigo-100 text-indigo-800",
    hoverBg: "hover:bg-indigo-50/50",
    badgeColor: "bg-indigo-100 text-indigo-800",
    progressbarColor: "bg-indigo-500",
    description: "关于镜面折叠的完美美学，征服等腰与等边三角形",
  },
  {
    category: "整式的乘法",
    icon: "Activity",
    color: "amber",
    primaryColor: "#f59e0b",
    bgLight: "bg-amber-50/80 border-amber-100 text-amber-800",
    hoverBg: "hover:bg-amber-50/50",
    badgeColor: "bg-amber-100 text-amber-800",
    progressbarColor: "bg-amber-500",
    description: "破解幂运算公式，熟练应用平方差与完全平方展开",
  },
  {
    category: "因式分解",
    icon: "Sparkles",
    color: "purple",
    primaryColor: "#a855f7",
    bgLight: "bg-purple-50/80 border-purple-100 text-purple-800",
    hoverBg: "hover:bg-purple-50/50",
    badgeColor: "bg-purple-100 text-purple-800",
    progressbarColor: "bg-purple-500",
    description: "学用提公因式与公式逆行法，实现高精简包装",
  },
  {
    category: "分式",
    icon: "Percent",
    color: "rose",
    primaryColor: "#f43f5e",
    bgLight: "bg-rose-50/80 border-rose-100 text-rose-800",
    hoverBg: "hover:bg-rose-50/50",
    badgeColor: "bg-rose-100 text-rose-800",
    progressbarColor: "bg-rose-500",
    description: "认识分母含字母的新成员，击破增根分式方程",
  }
];
