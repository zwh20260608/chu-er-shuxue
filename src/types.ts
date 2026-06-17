/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KnowledgePoint {
  id: string; // Unique ID (usually name)
  category: string; // 分类: e.g. "三角形", "全等三角形", etc.
  subcategory: string; // 子分类: e.g. "与三角形有关的线段"
  name: string; // 知识点名称: e.g. "三角形的边"
  grade: string; // 对应年级: e.g. "初二上学期"
}

export interface CategoryStats {
  category: string;
  total: number;
  completed: number;
  icon: string; // Icon name string
  color: string; // Base layout Tailwind color class
  bgLight: string; // Light Tailwind background color class
  description: string; // Cute module subtext/description
}
