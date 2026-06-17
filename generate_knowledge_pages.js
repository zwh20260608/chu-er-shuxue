/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

// Define the 25 knowledge points with rich child-friendly content
const knowledgeData = [
  {
    name: "三角形的边",
    title: "13.2.1 三角形的边 ── 搭建几何大厦的基石 📐",
    concept: "三角形是由三条不在同一直线上的线段，首尾顺次相接组成的封闭图形。我们通常用三个顶点的字母来表示它，比如 △ABC。最有趣的规律是它的三边长关系：<b>两边之和大于第三边</b>，<b>两边之差小于第三边</b>。否则这三根小木棍就搭不成三角形啦！",
    formula: "若三角形的三边为 a, b, c，则有：<br>① a + b > c  且  a + c > b  且  b + c > a<br>② |a - b| < c < a + b",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">🛠️ 动手搭一搭：改变木棒长度</h4>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label class="block text-xs font-bold text-emerald-700">木棒 A (绿色): <span id="valA">6</span></label>
            <input type="range" id="lnA" min="1" max="15" value="6" class="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer">
          </div>
          <div>
            <label class="block text-xs font-bold text-emerald-700">木棒 B (蓝色): <span id="valB">8</span></label>
            <input type="range" id="lnB" min="1" max="15" value="8" class="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer">
          </div>
          <div>
            <label class="block text-xs font-bold text-emerald-700">木棒 C (橙色): <span id="valC">10</span></label>
            <input type="range" id="lnC" min="1" max="15" value="10" class="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer">
          </div>
        </div>
        <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100 mb-2">
          <span class="text-xs font-bold text-gray-600">计算检验:</span>
          <span id="equationList" class="text-xs font-mono text-emerald-600 font-bold">6+8 > 10 (✔) | |6-8| < 10 (✔)</span>
        </div>
        <div class="flex items-center justify-center p-4 bg-white rounded-xl border border-emerald-100 min-h-[140px] relative overflow-hidden">
          <svg id="triangleSvg" width="200" height="120" viewBox="0 0 200 120" class="transition-all duration-300">
            <polygon id="poly" points="40,100 160,100 100,30" fill="#e6f4ea" stroke="#10b981" stroke-width="4" stroke-linejoin="round" />
            <text x="30" y="112" class="text-xs font-bold fill-emerald-800">A</text>
            <text x="165" y="112" class="text-xs font-bold fill-emerald-800">B</text>
            <text x="95" y="22" class="text-xs font-bold fill-emerald-800">C</text>
          </svg>
          <div id="constructMsg" class="absolute inset-0 bg-red-50/90 hidden flex-col items-center justify-center text-center p-4">
            <span class="text-2xl">⚠️</span>
            <span class="font-bold text-red-600 text-sm mt-1">两边之和不够长！拼不起来！</span>
            <span class="text-xs text-red-400 mt-0.5">请调长其中两个木棒，或调短最长的木棒。</span>
          </div>
        </div>
      </div>
      <script>
        const lnA = document.getElementById('lnA');
        const lnB = document.getElementById('lnB');
        const lnC = document.getElementById('lnC');
        const valA = document.getElementById('valA');
        const valB = document.getElementById('valB');
        const valC = document.getElementById('valC');
        const equationList = document.getElementById('equationList');
        const constructMsg = document.getElementById('constructMsg');
        const poly = document.getElementById('poly');

        function updateTri() {
          const a = parseInt(lnA.value);
          const b = parseInt(lnB.value);
          const c = parseInt(lnC.value);
          valA.innerText = a;
          valB.innerText = b;
          valC.innerText = c;

          const isPossible = (a + b > c) && (a + c > b) && (b + c > a);
          if (isPossible) {
            constructMsg.classList.add('hidden');
            // Try to approximate points A(40, 100), B based on triangle length
            // We use simple visual mapping
            const baseScale = 120 / Math.max(a, b, c, 1);
            const w = a * baseScale;
            const x1 = 40;
            const y1 = 100;
            const x2 = 40 + w;
            const y2 = 100;
            
            // solve for peak coordinates
            // c^2 = x^2 + y^2, b^2 = (w-x)^2 + y^2 -> x = (w^2 + c^2 - b^2)/(2w)
            const w_val = c * baseScale;
            const side_b = b * baseScale;
            const side_a = a * baseScale; // base side
            const targetX = (side_a*side_a + side_c_sq() - side_b*side_b) / (2 * side_a || 1);
            // standard geometric coordinates for nice drawing
            const norm_a = a * 8;
            const norm_b = b * 8;
            const norm_c = c * 8;
            
            // fallback generic nice triangle scaled
            const peakX = 40 + (a * 6);
            const peakY = 100 - (b * 5);
            poly.setAttribute('points', '40,100 ' + (40 + c*10) + ',100 ' + peakX + ',' + (100 - b*5));
            equationList.innerText = a + " + " + b + " > " + c + " (✔) | " + a + " + " + c + " > " + b + " (✔)";
          } else {
            constructMsg.classList.remove('hidden');
            equationList.innerText = "不满足三边定理 (✘)";
          }
        }
        function side_c_sq() { return parseInt(lnC.value)*parseInt(lnC.value); }
        lnA.addEventListener('input', updateTri);
        lnB.addEventListener('input', updateTri);
        lnC.addEventListener('input', updateTri);
        updateTri();
      </script>
    `,
    quiz: {
      q: "已知一个三角形的两边长分别为 4cm 和 7cm，则它的第三边长可能是：",
      opts: ["2cm", "3cm", "8cm", "11cm"],
      aIndex: 2,
      exp: "因为两边之和大于第三边，两边之差小于第三边。两边之差为 7 - 4 = 3cm，两边之和为 7 + 4 = 11cm，所以第三边长必须在 3cm 到 11cm 之间。在选项中，只有 8cm 符合这个范围。恭喜你答对啦！🎉"
    }
  },
  {
    name: "三角形的中线、角平分线、高",
    title: "13.2.2 重要线段 ── 三角形内部的三合一使者 🏹",
    concept: "三角形里面有三条非常神奇的特色专属线段：<br>1. <b>高 (Height)</b>：从顶点向对边作的垂线段。直角三角形的高在边上，钝角三角形的高有些在三角形外面哦！<br>2. <b>中线 (Median)</b>：连接顶点和对边中点的线段，它把三角形等分成两个面积相等的“兄弟三角形”。<br>3. <b>角平分线 (Angle Bisector)</b>：平分一个角的射线与对边相交，顶点与交点间的线段。每一类线段三条都相交于一个点！",
    formula: "高相交于垂心，中线相交于重心（2:1重力平衡点！），角平分线相交于内心（内切圆的圆心）。",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">🪄 魔法视界：三线变变变</h4>
        <div class="flex gap-2 mb-4">
          <button onclick="showLine('height')" id="btn-height" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500 text-white shadow-sm hover:shadow transition-all">高 (Height)</button>
          <button onclick="showLine('median')" id="btn-median" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all">中线 (Median)</button>
          <button onclick="showLine('bisector')" id="btn-bisector" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all">角平分线 (Bisector)</button>
        </div>
        <div class="relative bg-white rounded-xl border border-blue-100 p-4 h-[200px] flex items-center justify-center">
          <svg width="250" height="180" viewBox="0 0 250 180" class="mx-auto">
            <!-- Triangle -->
            <polygon points="40,140 210,140 160,40" fill="#f0f7ff" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round"/>
            <text x="30" y="150" class="text-xs font-bold fill-blue-800">B</text>
            <text x="215" y="150" class="text-xs font-bold fill-blue-800">C</text>
            <text x="155" y="32" class="text-xs font-bold fill-blue-800">A</text>

            <!-- Height Line -->
            <line id="height-line" x1="160" y1="40" x2="160" y2="140" stroke="#ef4444" stroke-width="3" stroke-dasharray="4" class="transition-all duration-300" />
            <!-- Height square symbol -->
            <rect id="height-sq" x="160" y="132" width="8" height="8" fill="none" stroke="#ef4444" stroke-width="1.5" />

            <!-- Median Line -->
            <line id="median-line" x1="160" y1="40" x2="125" y2="140" stroke="#10b981" stroke-width="3" stroke-dasharray="4" class="hidden transition-all duration-300" />
            <circle id="median-dot" cx="125" cy="140" r="4" fill="#10b981" class="hidden" />

            <!-- Bisector Line -->
            <line id="bisector-line" x1="160" y1="40" x2="141" y2="140" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4" class="hidden transition-all duration-300" />
          </svg>
          <div id="line-desc" class="absolute bottom-2 left-2 right-2 text-center text-xs font-bold text-gray-500">
            红色虚线从顶点 A 垂直投向对边 BC，就是它的「高」，垂足于 BC！
          </div>
        </div>
      </div>
      <script>
        function showLine(type) {
          const btnH = document.getElementById('btn-height');
          const btnM = document.getElementById('btn-median');
          const btnB = document.getElementById('btn-bisector');
          
          const lineH = document.getElementById('height-line');
          const sqH = document.getElementById('height-sq');
          const lineM = document.getElementById('median-line');
          const dotM = document.getElementById('median-dot');
          const lineB = document.getElementById('bisector-line');
          const desc = document.getElementById('line-desc');

          // Reset styles
          [btnH, btnM, btnB].forEach(b => {
            b.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all";
          });

          lineH.classList.add('hidden');
          sqH.classList.add('hidden');
          lineM.classList.add('hidden');
          dotM.classList.add('hidden');
          lineB.classList.add('hidden');

          if (type === 'height') {
            btnH.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500 text-white shadow-sm hover:shadow transition-all";
            lineH.classList.remove('hidden');
            sqH.classList.remove('hidden');
            desc.innerText = "红色虚线从顶点 A 垂直投向对边 BC，就是它的「高」，夹角为 90°！";
          } else if (type === 'median') {
            btnM.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow-sm hover:shadow transition-all";
            lineM.classList.remove('hidden');
            dotM.classList.remove('hidden');
            desc.innerText = "绿色虚线连结顶点 A 到对边的中点 (125, 140)，平分底边，让两个小三角形面积完全相同！";
          } else if (type === 'bisector') {
            btnB.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-sm hover:shadow transition-all";
            lineB.classList.remove('hidden');
            desc.innerText = "橙色虚线平分顶点 A 的角度（角平分线），使得 ∠BAC 左右两边大小完全相同！";
          }
        }
      </script>
    `,
    quiz: {
      q: "把一个三角形等分成两个面积相等的三角形，应该作什么样的标志线？",
      opts: ["任意一条高线", "三角形的中线", "角平分线", "线段的垂直平分线"],
      aIndex: 1,
      exp: "中线将底边二等分。根据三角形的面积公式（底×高/2），由于这两个小三角形由同一顶点出发且落于同一底线上，所以底相等、高相同，它们的面积完全相等！所以中线是完美的“面积平分线”。🎉"
    }
  },
  {
    name: "三角形的内角",
    title: "13.3.1 三角形内角和 ── 万能的 180° 恒常定理 🎨",
    concept: "你知道吗？无论一千年前还是今天，也无论是巨大的三角形还是小如尘埃的三角形，<b>所有三角形顶角的度数之和正好都是 180°</b>！把三角形剪开，拼在一起，正好拼成一个平角！",
    formula: "若三角形的三个内角为 ∠A, ∠B, ∠C，则有：∠A + ∠B + ∠C = 180°",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">📐 角度大拼图：算出丢失的角</h4>
        <div class="flex flex-col gap-4 mb-4">
          <div class="flex justify-around items-center bg-white p-3 rounded-xl border border-emerald-100">
            <div>
              <span class="text-xs text-gray-500 block font-bold">角 A ── 💡 蓝角</span>
              <strong class="text-blue-600 text-lg font-mono">60°</strong>
            </div>
            <div class="text-xl text-gray-400">+</div>
            <div>
              <span class="text-xs text-gray-500 block font-bold">角 B ── 🌟 黄角</span>
              <strong class="text-amber-500 text-lg font-mono">50°</strong>
            </div>
            <div class="text-xl text-gray-400">+</div>
            <div>
              <span class="text-xs text-gray-500 block font-bold">角 C ── 🔥 红角</span>
              <strong class="text-red-500 text-lg font-mono" id="missingAngle">70°</strong>
            </div>
            <div class="text-xl text-gray-400">=</div>
            <div>
              <span class="text-xs text-gray-500 block font-bold">内角和</span>
              <strong class="text-emerald-600 text-lg font-mono">180°</strong>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-emerald-700 mb-1">动态调整角 A 的度数： <span id="angleValue">60</span>°</label>
            <input type="range" id="angleBar" min="20" max="140" value="60" class="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer">
          </div>
        </div>
        <div class="flex items-center justify-center bg-white p-4 rounded-xl border border-emerald-100 min-h-[140px]">
          <svg width="220" height="120" id="interiorSvg">
            <polygon id="interiorPoly" points="30,100 190,100 110,35" fill="#f0fdf4" stroke="#10b981" stroke-width="3" />
            <path d="M30,100 L45,100 A15,15 0 0,0 37,88 Z" fill="#3b82f6" opacity="0.8" />
            <path d="M190,100 L175,100 A15,15 0 0,1 182,88 Z" fill="#f59e0b" opacity="0.8" />
          </svg>
        </div>
      </div>
      <script>
        const angleBar = document.getElementById('angleBar');
        const angleValue = document.getElementById('angleValue');
        const missingAngle = document.getElementById('missingAngle');
        const interiorPoly = document.getElementById('interiorPoly');

        angleBar.addEventListener('input', () => {
          const a = parseInt(angleBar.value);
          const b = 50;
          const c = 180 - a - b;

          angleValue.innerText = a;
          missingAngle.innerText = c + "°";

          // calculate a nice visual triangle peak coord based on A and B
          const peakX = 30 + (a * 1.2);
          interiorPoly.setAttribute('points', '30,100 190,100 ' + peakX + ',35');
        });
      </script>
    `,
    quiz: {
      q: "已知一个直角三角形的一个锐角是 35°，则另一个锐角的度数是：",
      opts: ["35°", "45°", "55°", "90°"],
      aIndex: 2,
      exp: "因为直角三角形中有个角是 90°，而三个角的内角和是 180°。所以两个锐角相加必须等于 90°。得到另一个锐角为 90° - 35° = 55°。算得真快，点个大大的赞！💯"
    }
  },
  {
    name: "三角形的外角",
    title: "13.3.2 三角形外角 ── 它和里面的叔叔阿姨可有关系了 🌟",
    concept: "三角形的一边与另一边的延长线组成的角，叫做三角形的<b>外角</b>。外角有一个无敌的超级定式：<b>三角形的一个外角等于与它不相邻的两个内角之和</b>。而且，任何一个外角都大于任何一个它不相邻的内角！",
    formula: "若 ∠ACD 是 △ABC 中 ∠C 的外角，则：∠ACD = ∠A + ∠B，且 ∠ACD > ∠A",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">🕵️ 外角的秘密武器（计算器）</h4>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-white p-3 rounded-xl border border-amber-100">
            <span class="text-xs text-gray-500 block font-bold">角 A (内角 1)</span>
            <input type="number" id="inA" value="55" min="1" max="178" class="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 p-1.5 rounded-lg text-sm text-center font-mono font-bold text-amber-700">
          </div>
          <div class="bg-white p-3 rounded-xl border border-amber-100">
            <span class="text-xs text-gray-500 block font-bold">角 B (内角 2)</span>
            <input type="number" id="inB" value="65" min="1" max="178" class="w-full bg-gray-50 border border-gray-200 focus:border-amber-400 p-1.5 rounded-lg text-sm text-center font-mono font-bold text-amber-700">
          </div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-amber-100 mb-3 flex justify-between items-center text-sm">
          <span class="font-bold text-gray-600">计算相邻内角 C:</span>
          <span id="adjacentC" class="font-bold text-amber-600 font-mono">60°</span>
        </div>
        <div class="p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-sm text-sm text-center font-bold">
          ✨ 不相邻外角 ∠ACD (角A + 角B) = <span id="outC" class="font-mono text-base font-black">120°</span>
        </div>
      </div>
      <script>
        const inA = document.getElementById('inA');
        const inB = document.getElementById('inB');
        const adjC = document.getElementById('adjacentC');
        const outC = document.getElementById('outC');

        function calcOut() {
          let valA = parseInt(inA.value) || 0;
          let valB = parseInt(inB.value) || 0;
          
          if (valA + valB >= 180) {
            valA = 50; valB = 60;
            inA.value = 50; inB.value = 60;
          }
          const c_in = 180 - valA - valB;
          const c_out = valA + valB;
          
          adjC.innerText = c_in + '°';
          outC.innerText = c_out + '°';
        }
        inA.addEventListener('input', calcOut);
        inB.addEventListener('input', calcOut);
      </script>
    `,
    quiz: {
      q: "已知等腰三角形的一个外角为 100°，那么它的顶角度数可能为：",
      opts: ["80°", "100°", "80° 或 20°", "40°"],
      aIndex: 2,
      exp: "因为外角为 100°，说明对应的相邻内角为 180° - 100° = 80°。这个 80° 的角既可以是顶角，也可以是底角！如果 80° 角是顶角，那直接得出顶角是 80°。如果 80° 是底角，由于等腰三角形底角相等，那另一个底角也是 80°，顶角就是 180° - 80° - 80° = 20°。所以顶角有可能是 80° 或 20° 两种情景！思维太严密了，你真棒！"
    }
  },
  {
    name: "全等三角形及其性质",
    title: "14.1 全等全能 ── 能够完美重合的“双胞胎”图形 👥",
    concept: "我们把能够<b>完全重合的两个三角形</b>叫做全等三角形。就像两张一模一样的透写纸，可以严丝合缝地重叠在一起！全等三角形拥有两条最强的核心法力：<b>对应边相等，对应角相等</b>。在书写时，我们使用专用的‘全等号’：<b>≌</b>。",
    formula: "若 △ABC ≌ △DEF，则有：<br>对边相等：AB = DE, BC = EF, AC = DF<br>对角相等：∠A = ∠D, ∠B = ∠E, ∠C = ∠F",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">🤝 全等对对碰：拼合重合游戏</h4>
        <p class="text-xs text-blue-600 mb-3 font-semibold">点击平移，看看两只三角形在拖曳之下能不能完美贴贴！</p>
        <div class="relative bg-white rounded-xl border border-blue-100 p-4 h-[180px] overflow-hidden flex items-center justify-center">
          <svg width="240" height="150" class="relative">
            <!-- Fixed green triangle -->
            <polygon points="30,120 110,120 80,40" fill="#e6f4ea" stroke="#10b981" stroke-width="3" />
            <text x="20" y="130" class="text-xs font-bold fill-emerald-800">A</text>
            <text x="115" y="130" class="text-xs font-bold fill-emerald-800">B</text>
            <text x="75" y="32" class="text-xs font-bold fill-emerald-800">C</text>

            <!-- Movable blue triangle -->
            <g id="movableTri" transform="translate(110, 0)" class="cursor-pointer transition-all duration-300">
              <polygon points="30,120 110,120 80,40" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="3" stroke-dasharray="2" />
              <text x="20" y="130" class="text-xs font-bold fill-blue-800">D</text>
              <text x="115" y="130" class="text-xs font-bold fill-blue-800">E</text>
              <text x="75" y="32" class="text-xs font-bold fill-blue-800">F</text>
            </g>
          </svg>
          <button onclick="snapTogether()" class="absolute bottom-2 right-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-bold shadow hover:bg-blue-600">重合对齐</button>
          <button onclick="separate()" class="absolute bottom-2 left-2 px-3 py-1 bg-gray-500 text-white rounded-lg text-xs font-bold shadow hover:bg-gray-600">分离</button>
        </div>
      </div>
      <script>
        function snapTogether() {
          document.getElementById('movableTri').setAttribute('transform', 'translate(0, 0)');
        }
        function separate() {
          document.getElementById('movableTri').setAttribute('transform', 'translate(100, 10)');
        }
      </script>
    `,
    quiz: {
      q: "若 △ABC ≌ △DEF，且 AB = 5cm，BC = 6cm，AC = 7cm。∠A = 40°，那么三角形 DEF 的周长以及 ∠D 的度数分别是：",
      opts: ["18cm, 40°", "18cm, 60°", "20cm, 40°", "由于不确定位置无法作答"],
      aIndex: 0,
      exp: "因为全等三角形对应边相等、周长也必定相等。周长为 5 + 6 + 7 = 18cm。且角 A 与角 D 为对应顶角，所以对应角 ∠D = ∠A = 40°。这便是全等的‘复制平移’美学！🌸"
    }
  },
  {
    name: "三角形全等的判定",
    title: "14.2 五大通关密码 ── 寻找三角形的完全重合条件 🔑",
    concept: "如何判断两个三角形全等？在几何拼图王国中有五大万能通行卡：<br>① <b>SSS (边边边)</b>：三边对应相等；<br>② <b>SAS (边角边)</b>：两边及夹角对应相等；<br>③ <b>ASA (角边角)</b>：两角及夹边对应相等；<br>④ <b>AAS (角角边)</b>：两角及一角对边对应相等；<br>⑤ <b>HL (斜边、直角边)</b>：直角三角形的专属白金卡！<br>⚠️ 记住，<b>AAA</b> 和 <b>SSA</b> 是假的判定，不能判断全等哦！",
    formula: "判定定理公式卡：S = Side (边)，A = Angle (角)，H = Hypotenuse (斜边)，L = Leg (直角边)",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">🧬 特征分析器：这可以判定全等吗？</h4>
        <div class="flex flex-wrap gap-2 mb-4">
          <button onclick="checkJudge('SSS', true)" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800">SSS</button>
          <button onclick="checkJudge('SAS', true)" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800">SAS</button>
          <button onclick="checkJudge('SSA', false)" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 hover:bg-red-200 text-red-800">SSA 🚫</button>
          <button onclick="checkJudge('ASA', true)" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800">ASA</button>
          <button onclick="checkJudge('AAA', false)" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 hover:bg-red-200 text-red-800">AAA 🚫</button>
          <button onclick="checkJudge('HL', true)" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800">HL (直角)</button>
        </div>
        <div id="judgeBox" class="p-3 bg-white border border-emerald-100 rounded-xl text-xs flex items-center justify-center font-bold min-h-[60px] text-gray-700">
          点击上方卡片，看看哪个才是真理通行密码！
        </div>
      </div>
      <script>
        function checkJudge(code, isCorrect) {
          const box = document.getElementById('judgeBox');
          if (isCorrect) {
            box.innerHTML = '✅ <span class="text-emerald-600 font-bold">' + code + '</span> 是通关密码：可以完全判定两个三角形全等！它的图形状态是宇宙唯一的。';
          } else {
            box.innerHTML = '❌ <span class="text-red-500 font-bold">' + code + '</span> <b>不可以判定！</b> 两个角相同的三角形可能只是大小不同，两边及一角对应也不一定重合，这是假冒判定！';
          }
        }
      </script>
    `,
    quiz: {
      q: "下面哪一种情况，不能被判定成两个三角形全等？",
      opts: ["三个角相等 (AAA)", "三条边相等 (SSS)", "两角及其夹边相等 (ASA)", "直角三角形的斜边和一直角边相等 (HL)"],
      aIndex: 0,
      exp: "AAA (三个角对应相等) 只能证明两个三角形长得像(相似)，但一个可以非常大，一个可以非常小，无法断定完全重叠相等。所以 AAA 是不成立的！答得太帅了！💪"
    }
  },
  {
    name: "角的平分线",
    title: "14.3 角的平分线 ── 距离完美的等距光梭 📡",
    concept: "从一个角的顶点引出的一条射线，把这个角分成两个完全相等的角，这条射线就是<b>角的平分线</b>。它最具魔法的一条定理是：<b>角平分线上的任何一点，到角两边的距离(垂直下落高度)都完全相等</b>！",
    formula: "P 为 ∠AOB 内角平分线 OC 上一点，若 PD ⊥ OA，PE ⊥ OB，垂足为 D、E，则有：PD = PE",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">📐 直观角平分线平衡</h4>
        <div class="relative bg-white border border-amber-100 rounded-xl p-4 h-[180px] flex items-center justify-center">
          <svg width="240" height="150" viewBox="0 0 240 150">
            <!-- Angle Lines -->
            <path d="M 200,130 L 30,130 L 160,30" fill="none" stroke="#d97706" stroke-width="3" />
            <!-- Angle Bisector -->
            <line x1="30" y1="130" x2="200" y2="70" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3" />
            
            <!-- Point P on bisector -->
            <circle cx="120" cy="98.2" r="5" fill="#ef4444" />
            <text x="115" y="85" class="text-xs font-bold fill-red-600">P (平分线上点)</text>
            
            <!-- Perpendicular PE, PD -->
            <line x1="120" y1="98.2" x2="120" y2="130" stroke="#3b82f6" stroke-width="2" />
            <text x="125" y="125" class="text-[10px] font-bold fill-blue-600">d1</text>
            
            <line x1="120" y1="98.2" x2="89.5" y2="76" stroke="#3b82f6" stroke-width="2" />
            <text x="96" y="92" class="text-[10px] font-bold fill-blue-600">d2</text>
          </svg>
          <div class="absolute bottom-2 right-2 text-xs font-bold text-blue-600">
            测距证明: d1 = d2 永远成立！
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "角平分线定理的核心物理或几何作用是：",
      opts: ["判断三边关系", "产生到角两边等距离的点", "确定重心位置", "画一个直角"],
      aIndex: 1,
      exp: "角平分线的作用在于提供了一个‘距离角两边处处等距’的对称轨迹，这让它在求几何作图中的最优网格定位时特别不可缺少！"
    }
  },
  {
    name: "轴对称及其性质",
    title: "15.1.1 轴对称王国 ── 完美对折的镜像魔术 🦋",
    concept: "如果一个平面图形沿着一条直线折叠，直线两旁的部分能够完全重合，这个图形就叫<b>轴对称图形</b>。同样，如果是两个图形，对折后它们能完全重合，那叫<b>关于这条直线对称</b>。折叠形成的这条直线被称为<b>对称轴</b>。",
    formula: "若点 A、B 关于直线 l 轴对称，则：l 是线段 AB 的垂直平分线。两旁对应点的连线被对称轴中分且垂直！",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">🦋 蝴蝶对开镜像效果</h4>
        <div class="relative bg-white rounded-xl border border-blue-100 p-4 min-h-[160px] flex flex-col justify-center items-center">
          <div class="flex gap-4 items-center mb-2">
            <span class="text-xs font-bold text-gray-500">左侧主脑:</span>
            <input type="text" id="leftText" value="123" class="w-20 bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-400 p-1 text-center font-bold text-blue-700 rounded-lg text-sm">
            <span class="text-xs font-bold text-gray-500">👑 对称轴 l (镜面)</span>
          </div>
          <div class="flex items-center gap-10 mt-2">
            <!-- Left text output reversed -->
            <div id="leftDisp" class="text-3xl font-extrabold text-indigo-500 font-mono scale-x-100 italic">123</div>
            <!-- Mirror line -->
            <div class="w-1.5 h-16 bg-red-400 rounded-full shadow-sm relative">
              <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-500">l</span>
            </div>
            <!-- Right text output mirrored mirrored -->
            <div id="rightDisp" class="text-3xl font-extrabold text-indigo-500 font-mono -scale-x-100 italic">123</div>
          </div>
        </div>
      </div>
      <script>
        const leftText = document.getElementById('leftText');
        const leftDisp = document.getElementById('leftDisp');
        const rightDisp = document.getElementById('rightDisp');
        leftText.addEventListener('input', () => {
          leftDisp.innerText = leftText.value;
          rightDisp.innerText = [...leftText.value].reverse().join('');
        });
      </script>
    `,
    quiz: {
      q: "下列英文字母中，哪个拥有超过 1 条的轴对称线？",
      opts: ["A", "H", "F", "Y"],
      aIndex: 1,
      exp: "字母 A 只有 1 条（竖直对称轴），F 没有，Y 只有 1 条（竖直对称轴）。而字母 H 同时拥有 1 条竖直对称轴和 1 条水平均等对称轴，共计 2 条！所以选 H。太聪明啦！💖"
    }
  },
  {
    name: "线段的垂直平分线",
    title: "15.1.2 垂直平分线 ── 寻找中点和等距起点的神器 🚧",
    concept: "经过线段中点并且垂直于这条线段的直线，叫做这条线段的<b>垂直平分线</b>（简称‘中垂线’）。它同样有一个黄金法力的秘密法则：<b>垂直平分线上的任意一点，到线段两端点的距离都完全相等！</b>反过来，到两端点距离相等的点也必定在这条线上！",
    formula: "若直线 l 是线段 AB 的垂直平分线，P 是 l 上一点，则：PA = PB 永远成立",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">📐 垂直平分线任意点距离测定</h4>
        <div class="relative bg-white rounded-xl border border-emerald-100 p-4 h-[180px] flex items-center justify-center">
          <svg width="240" height="150" viewBox="0 0 240 150">
            <!-- Segment AB -->
            <line x1="50" y1="110" x2="190" y2="110" stroke="#047857" stroke-width="3" />
            <circle cx="50" cy="110" r="4" fill="#047857" />
            <circle cx="190" cy="110" r="4" fill="#047857" />
            <text x="35" y="114" class="text-xs font-bold fill-emerald-800">A</text>
            <text x="195" y="114" class="text-xs font-bold fill-emerald-800">B</text>

            <!-- Bisector Line l -->
            <line x1="120" y1="20" x2="120" y2="140" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3" />
            <text x="125" y="28" class="text-xs font-bold fill-rose-600">l (垂直平分线)</text>

            <!-- Dynamic Point P -->
            <circle cx="120" cy="45" r="5" fill="#f43f5e" id="ptP" />
            <text x="125" y="50" class="text-xs font-bold fill-rose-600">P</text>

            <!-- Distance PA, PB -->
            <line x1="120" y1="45" x2="50" y2="110" stroke="#3b82f6" stroke-width="2" id="linePA" />
            <line x1="120" y1="45" x2="190" y2="110" stroke="#3b82f6" stroke-width="2" id="linePB" />
          </svg>
          <div class="absolute bottom-2 text-[10px] text-gray-500 font-bold">
            💡 不管 P 在直线上怎样上下走动，线段 PA 和 PB 长度绝对相等！
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "到 A、B 两点距离相等的点组成的一条直线是：",
      opts: ["连结 AB 顶角的中线", "线段 AB 的垂直平分线", "AB 的高线", "三角形外角平分线"],
      aIndex: 1,
      exp: "垂直平分线的几何定义就是“到线段两个端点距离相等的所有点的集合”。因此答案就是中垂线，选 B 妥妥的。⭐"
    }
  },
  {
    name: "画轴对称的图形",
    title: "15.2 画轴对称图形 ── 几何小画家的大显身手 🎨",
    concept: "想画一个关于某直线对称的漂亮图形吗？只需掌握神奇的“<b>作点秘诀</b>”：<br>1. 从原图形中挑出几个‘关键顶点’。<br>2. 投射每一个点，画出它关于对称轴的对称点（垂直穿越对称轴，且在对称轴两边距离相等）。<br>3. 用漂亮规整的直线把这些新反射出的‘虚无镜像点’首尾连起来。你就创造了完美的对称图样啦！",
    formula: "坐标反射公式：点 (x, y) 关于 x 轴对称的点为 (x, -y)；关于 y 轴对称的点为 (-x, y)。口诀：关于谁对称，谁就不改变！",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">坐标背诵大挑战：点 (4, -5) 关于 y 轴对称的点是：</h4>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <button onclick="coordCheck('(-4, -5)', true)" class="p-2 border border-amber-200 bg-white hover:border-amber-400 font-mono text-xs rounded-xl font-bold text-amber-700">(-4, -5)</button>
          <button onclick="coordCheck('(4, 5)', false)" class="p-2 border border-amber-200 bg-white hover:border-amber-400 font-mono text-xs rounded-xl font-bold text-amber-700">(4, 5)</button>
          <button onclick="coordCheck('(-4, 5)', false)" class="p-2 border border-amber-200 bg-white hover:border-amber-400 font-mono text-xs rounded-xl font-bold text-amber-700">(-4, 5)</button>
          <button onclick="coordCheck('(4, -5)', false)" class="p-2 border border-amber-200 bg-white hover:border-amber-400 font-mono text-xs rounded-xl font-bold text-amber-700">(4, -5)</button>
        </div>
        <div id="coordBox" class="p-2 bg-amber-100 rounded-xl text-center text-xs text-amber-900 font-bold min-h-[30px]">
          点击按钮答题检验哦！
        </div>
      </div>
      <script>
        function coordCheck(pt, correct) {
          const b = document.getElementById('coordBox');
          if (correct) {
            b.innerText = '💡 恭喜你回答正确！关于 y 轴对称，x 坐标变反，y 坐标不改。所以为 (-4, -5)！';
          } else {
            b.innerText = '😿 不太对噢，再试一次。记住口诀：“关于 y 轴对称，y 不改变，x 取相反”！';
          }
        }
      </script>
    `,
    quiz: {
      q: "点 M(-2, 3) 关于 x 轴对称的点的坐标是：",
      opts: ["(2, 3)", "(-2, -3)", "(2, -3)", "(3, -2)"],
      aIndex: 1,
      exp: "根据关于谁对称谁就不变的定理。关于 x 轴对称，x 坐标保持 -2 绝对不改动，而 y 坐标 3 变号变成其相反数 -3。得：(-2, -3)。回答十分熟练！"
    }
  },
  {
    name: "等腰三角形",
    title: "15.3.1 等腰三角形 ── 傲然矗立的古埃及金字塔 📐",
    concept: "有两条边相等的三角形，就是<b>等腰三角形</b>。它的两条长边像人的两条腿，底部的两角叫做底角。等腰三角形有两个无上的独家绝活：<br>① <b>等边对等角</b>：相等的两腰对的底角完全相等！<br>② <b>三线合一</b>：等腰三角形<b>底边上的中线、底边上的高、顶角平分线</b>重合，是同一直线！",
    formula: "若 AB = AC，则：<br>① ∠B = ∠C （等两腰对应的底角相等）<br>② AD ⊥ BC，BD = CD，∠BAD = ∠CAD （三线融合成一）",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">⛺ 三线合一的华丽演示</h4>
        <div class="relative bg-white rounded-xl border border-blue-100 p-4 h-[160px] flex justify-center items-center">
          <svg width="220" height="130" viewBox="0 0 220 130">
            <!-- Isosceles Triangle -->
            <polygon points="110,20 40,110 180,110" fill="#f0f7ff" stroke="#3b82f6" stroke-width="3" />
            <text x="105" y="14" class="text-xs font-bold fill-blue-800">A</text>
            <text x="30" y="115" class="text-xs font-bold fill-blue-800">B</text>
            <text x="185" y="115" class="text-xs font-bold fill-blue-800">C</text>

            <!-- Shared line -->
            <line x1="110" y1="20" x2="110" y2="110" stroke="#ef4444" stroke-width="2" stroke-dasharray="3" />
            <text x="114" y="70" class="text-[10px] font-bold fill-rose-600">顶角平分线/高的公共线</text>
            
            <circle cx="110" cy="110" r="3" fill="#ef4444" />
            <text x="106" y="122" class="text-xs font-bold fill-rose-600">D</text>
          </svg>
        </div>
      </div>
    `,
    quiz: {
      q: "等腰三角形已知一个角是 50°，那么另外两个角的度数分别为多少？",
      opts: ["50° 和 80°", "65° 和 65°", "50°和80° 或 65°和65°", "一定是 50° 和 50°"],
      aIndex: 2,
      exp: "因为没有指明已知的 50° 角是顶角还是底角！① 如果是底角，底角相等，那另一个底角也是 50°，顶角是 180° - 50° - 50° = 80°；② 如果是顶角，其余两个底角相等，每个底角都是 (180° - 50°) / 2 = 65°。两种情景均属实，必须选 C，这就是数学的分类思维！🎉"
    }
  },
  {
    name: "等边三角形",
    title: "15.3.2 等边三角形 ── 追求极致对称的三叶星 ✨",
    concept: "等边三角形是普通等腰三角形的升级版，它<b>三条边全部完美相等</b>。在几何世界，它是极度完美的代表。不仅全边相等，它内部的三个角也绝对一样大，<b>每个内角都是恒定不变的 60°</b>！",
    formula: "若 AB = BC = AC，则：∠A = ∠B = ∠C = 60°。<br>判定：三个角相等的三角形，或一个角是 60° 度的等腰三角形就是等边三角形！",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-2 text-sm md:text-base">等边三角形的完美几何尺</h4>
        <p class="text-xs text-gray-500 mb-3">当底角全自动设定成 60°，所有高和中线将重和。你可以自由测试判定条件卡哦！</p>
        <div class="p-3 bg-white rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
          <span class="font-bold text-gray-600">三顶角状态:</span>
          <span class="text-emerald-600 font-mono font-bold">∠A = 60° | ∠B = 60° | ∠C = 60°</span>
        </div>
      </div>
    `,
    quiz: {
      q: "等腰三角形满足哪种附加条件后，会升级蜕变成一个完美的等边三角形？",
      opts: ["顶角是 30°", "有一个底角是 45°", "有一个角是 60°", "顶角是直角"],
      aIndex: 2,
      exp: "等腰三角形的一角一旦是 60°。不管它是顶角(剩下同为60°)还是底角(另一个底角为60°, 顶角也是60°)，这三角形三个对应度数一定会全面变成 60°，顺利满足判定！得 A=B=C=60°，进化为等边三角形。选 C。🏆"
    }
  },
  {
    name: "同底数幂的乘法",
    title: "16.1.1 幂运算天机 ── 相同底数相排排坐，指数算加法 📈",
    concept: "如果你见到两个<b>底数（就是下面的大字母）一模一样</b>的分身乘数在乘积中相遇，你不需要计算庞大的实际值。只需应用无上的化简法则：<b>底数不变，指数直接相加</b>就可以啦！",
    formula: "同底数幂相乘法则：a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup>  (m, n 是正整数)",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">🚀 底数相同指数狂飙（拼图）</h4>
        <div class="flex items-center justify-center gap-4 bg-white p-4 rounded-xl border border-amber-100 mb-3">
          <div class="flex flex-col items-center">
            <span class="text-3xl font-extrabold text-blue-500 font-mono">x</span>
            <span class="text-xs bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full mt-1">底数 A</span>
          </div>
          <div class="text-xl font-bold text-gray-400"><sup>4</sup></div>
          <div class="text-2xl font-black text-gray-400">×</div>
          <div class="flex flex-col items-center">
            <span class="text-3xl font-extrabold text-blue-500 font-mono">x</span>
            <span class="text-xs bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-full mt-1">底数 B</span>
          </div>
          <div class="text-xl font-bold text-gray-400"><sup>5</sup></div>
          <div class="text-2xl font-black text-gray-400">=</div>
          <div class="flex flex-col items-center p-2 bg-amber-100 rounded-xl">
            <span class="text-3xl font-extrabold text-amber-600 font-mono">x<sup>9</sup></span>
            <span class="text-[10px] text-amber-800 font-bold mt-1">指数：4 + 5 = 9 !</span>
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "计算代数整式 x² · x³ · x 的化简结果应为：",
      opts: ["x⁵", "x⁶", "x²³", "3x"],
      aIndex: 1,
      exp: "最后的那个 x 其实代表着 x 的 1 次幂（x¹）。所以连乘的公式是：x² · x³ · x¹。底数不变，将指数相加得到：2 + 3 + 1 = 6！因此最后完美的代数化简结果是 x⁶。做得好极了！"
    }
  },
  {
    name: "幂的乘方与积的乘方",
    title: "16.1.2 幂大重奏 ── 连环乘方用乘法，团队分乘方 💥",
    concept: "在这里我们要学习两个幂运算超级重要的飞天口诀：<br>① <b>幂的乘方 (Power of Power)</b>：幂的指数再给它一个次方号，像高层建筑，底数不改变，<b>内外的指数相加乘！</b><br>② <b>积的乘方 (Power of Product)</b>：如果是几个不同的字母乘积被套在次方的大袋子里，那<b>里面的每一个字母都必须雨露均沾，瓜分得到这个次方！</b>",
    formula: "① 幂的乘方：(a<sup>m</sup>)<sup>n</sup> = a<sup>mn</sup><br>② 积的乘方：(ab)<sup>n</sup> = a<sup>n</sup> b<sup>n</sup>",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">🧠 连横合纵：看清幂的乘方算术</h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-3 rounded-xl border border-blue-100 text-center">
            <span class="text-xs font-bold text-blue-500 block">阶乘公式 ①：幂的乘方</span>
            <div class="font-mono text-xl text-blue-700 font-extrabold mt-1">(x³)⁴ = x¹²</div>
            <div class="text-[10px] text-gray-400 mt-1">原理：指数相乘 (3 × 4 = 12)</div>
          </div>
          <div class="bg-white p-3 rounded-xl border border-blue-100 text-center">
            <span class="text-xs font-bold text-blue-500 block">瓜分公式 ②：积的乘方</span>
            <div class="font-mono text-xl text-blue-700 font-extrabold mt-1">(xy)³ = x³y³</div>
            <div class="text-[10px] text-gray-400 mt-1">原理：大袋子拆开，人人有份！</div>
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "化简 [- (a²)³ ]² 之后，最终的最简表达式应该是：",
      opts: ["-a⁷", "a¹²", "-a¹²", "a⁸"],
      aIndex: 1,
      exp: "这是一步多层嵌套幂。先看最外面有个偶次方（平方），所以负号直接被消去变成正数！然后内层 (a²)³，根据幂的乘方，指数相乘为 2×3 = 6，得到 a⁶。最后外层的 2 次方再次相乘 6×2 = 12！最终完美得到 a¹²。奇妙的数学推导！"
    }
  },
  {
    name: "整式的乘法",
    title: "16.2 整式乘法 ── 乘法分配律的大型演兵 ⚔",
    concept: "整式的乘法是把代数式像小礼物一样分配出去。它包含单项式乘以多项式、多项式乘以多项式。其精髓在于：<b>不要漏乘任何一项！</b>，要像射箭一样，将左边括号里的每个元素，都与右边括号里的每个元素相乘一遍，最后合并同类项！",
    formula: "① 单项式乘以多项式：a(b + c) = ab + ac<br>② 多项式乘以多项式：(a + b)(c + d) = ac + ad + bc + bd",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">🏹 多项式乘法“弓箭连射”图</h4>
        <div class="relative bg-white border border-emerald-100 rounded-xl p-4 flex flex-col justify-center items-center min-h-[140px]">
          <div class="text-2xl font-extrabold text-blue-700 font-mono">(a + b)(c + d)</div>
          <div class="text-xs font-bold text-emerald-600 mt-2">计算射出 4 支单乘箭：ac, ad, bc, bd ！</div>
          <div class="text-sm font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg mt-3">ac + ad + bc + bd</div>
        </div>
      </div>
    `,
    quiz: {
      q: "化简计算 (x + 3)(x - 2) 的最终表达式是：",
      opts: ["x² - 6", "x² + x - 6", "x² - x - 6", "x² + 5x - 6"],
      aIndex: 1,
      exp: "使用多项式相乘公式分解：(x + 3)(x - 2) = x · x + x · (-2) + 3 · x + 3 · (-2) = x² - 2x + 3x - 6 将同类项合并（-2x + 3x 变成 x）！得到：x² + x - 6。对答如流！"
    }
  },
  {
    name: "平方差公式",
    title: "16.3.1 平方差公式 ── 繁琐大消除的绝世大捷 🛡",
    concept: "当你看到两个括号相乘，里面的内容非常相近，<b>唯一不同的是一个写着加号，一个写着减号</b>：(a+b)(a-b)。你不需要大费周章地一项项去乘，因为它的中间项 ab 与 -ab 会全部离奇抵消！直接得到最终的终极法宝：<b>首平方，尾平方，相减一刀切！</b>",
    formula: "平方差必背公式：(a + b)(a - b) = a<sup>2</sup> - b<sup>2</sup>",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">🔥 平方差公式心算加速器</h4>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="bg-white p-3 rounded-xl border border-amber-100">
            <span class="text-xs font-bold text-gray-500">经典相消例题</span>
            <div class="font-mono text-sm font-black text-amber-700 mt-1">(2x + 3)(2x - 3)</div>
          </div>
          <div class="bg-white p-3 rounded-xl border border-amber-100">
            <span class="text-xs font-bold text-gray-500">一秒得答案</span>
            <div class="font-mono text-sm font-black text-emerald-600 mt-1">4x² - 9</div>
          </div>
        </div>
        <div class="p-2.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold">
          💡 说明：第一项 (2x)² 变成 4x²，第二项 3² 变成 9，两项中间直接加负号连接。中间产生的 6x 和 -6x 被彻底消除了！
        </div>
      </div>
    `,
    quiz: {
      q: "利用平方差公式计算 101 × 99 的最佳变形写法是：",
      opts: ["(100+1)(100-1)", "(100+1)(98+1)", "(102-1)(100-1)", "不需要变形，直接用草稿本算"],
      aIndex: 0,
      exp: "把 101 变形成 (100 + 1)，把 99 变形成 (100 - 1)，正好凑成了平方差公式形式！计算为：100² - 1² = 10000 - 1 = 9999。口算就能算出来，这简直就是魔法！"
    }
  },
  {
    name: "完全平方公式",
    title: "16.3.2 完全平方公式 ── 三个宝贝的幸福大别墅 🏠",
    concept: "把两数和（或者差）的平方拿去拆开时，初学者最容易犯一个大错误 ── 以为 (a+b)² 的答案就是 a²+b²。这可漏掉了最关键的<b>两数乘积的 2 倍 (2ab) 核心中间使者</b>！这就是我们人人必背的「完全平方公式」！",
    formula: "完全平方公式大集：<br>① 两数和：(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup><br>② 两数差：(a - b)<sup>2</sup> = a<sup>2</sup> - 2ab + b<sup>2</sup>",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">📏 动感九宫格：为什么有 2ab 呢？</h4>
        <div class="mx-auto max-w-[180px] bg-white p-3 rounded-xl border border-blue-100">
          <!-- A cute visual of (a+b)^2 matrix -->
          <div class="grid grid-cols-2 gap-1 font-mono text-xs text-center font-bold">
            <div class="p-3 bg-blue-100 text-blue-800 rounded">a²</div>
            <div class="p-3 bg-emerald-100 text-emerald-800 rounded">ab (份1)</div>
            <div class="p-3 bg-emerald-100 text-emerald-800 rounded">ab (份2)</div>
            <div class="p-3 bg-blue-100 text-blue-800 rounded">b²</div>
          </div>
          <div class="text-[9px] text-gray-500 text-center mt-2 font-bold">左右上下一抱，合拼就是：a² + 2ab + b²</div>
        </div>
      </div>
    `,
    quiz: {
      q: "若多项式 x² + kx + 9 是一个关于 x 的完全平方式，则 k 的取值是：",
      opts: ["3", "6", "±3", "±6"],
      aIndex: 3,
      exp: "完全平方式 x² + kx + 9 根据完全平方公式，最后一项 9 是 3 或 -3 的平方。因此，中间的一项常数项应为：±2 × 3 × x = ±6x。所以常数系数 k 值为 ±6。这道题常设‘正负号双重陷阱’，想得分必须格外细心哦！"
    }
  },
  {
    name: "用提公因式法分解因式",
    title: "17.1 用提公因式法分解因式 ── 代数式的抓小偷游戏 🕵️‍♂️",
    concept: "因式分解就是把一个‘长长多项式’反向加工。而「<b>提公因式法</b>」是最核心的第一手段：在这个团队里，看看每一项身上都暗暗藏着哪种‘公共相同的因数、因式或字符’，就像捉小偷一样把这个相同的东西给拎出来，放到大括号外面去！",
    formula: "基底法则：ma + mb + mc = m(a + b + c) (其中 m 是所有人共享的公因式)",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-2 text-sm md:text-base">找出公因式魔法演练</h4>
        <p class="text-xs text-gray-500 mb-3">多项式：3x²y + 6xy² + 12xy</p>
        <div class="bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
          <span class="font-bold text-gray-600 font-mono">3x²y + 6xy² + 12xy</span>
          <span class="text-emerald-700 font-black font-mono">➔ 提取 3xy(x + 2y + 4)</span>
        </div>
      </div>
    `,
    quiz: {
      q: "分解因式 2a(b - c) - 3(c - b) 的结果是：",
      opts: ["(b - c)(2a - 3)", "(b - c)(2a + 3)", "(c - b)(2a - 3)", "无法继续分解"],
      aIndex: 1,
      exp: "注意这里的第二项括号里是 (c - b)，它是的第一项 (b - c) 的相反数。我们将第二项前面的减号变成加号，让括号内部对调：-3(c - b) = +3(b - c)。此时公因式 (b - c) 闪亮登场！提出来后得到 (b - c)(2a + 3)。选 B，这招乾坤大挪移太赞了！"
    }
  },
  {
    name: "用公式法分解因式",
    title: "17.2 用公式法分解因式 ── 乘法公式逆写大挑战 🌪",
    concept: "如果你手上的因式不能再进行提公因式了，别急，看看它能不能正好套用咱们大名鼎鼎的乘法公式的‘逆运算形式’？<br>① <b>平方差形式</b>：如果是 a² - b²，直接分解成 (a+b)(a-b)！<br>② <b>完全平方形式</b>：如果是三项式的 a² ± 2ab + b²，直接压缩捆绑回 (a ± b)²！",
    formula: "公式逆行大捷：<br>① a<sup>2</sup> - b<sup>2</sup> = (a + b)(a - b)<br>② a<sup>2</sup> ± 2ab + b<sup>2</sup> = (a ± b)<sup>2</sup>",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">🧬 两大因式分解公式逆向卡片</h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white p-3 rounded-xl border border-amber-100 text-center">
            <span class="text-xs font-bold text-amber-600 block">平方差逆向变形</span>
            <div class="font-mono text-xs font-bold text-amber-800 mt-2">x² - 4 = (x+2)(x-2)</div>
          </div>
          <div class="bg-white p-3 rounded-xl border border-amber-100 text-center">
            <span class="text-xs font-bold text-amber-600 block">完全平逆向压缩</span>
            <div class="font-mono text-xs font-bold text-amber-800 mt-2">x²-4x+4 = (x-2)²</div>
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "因式分解 3a² - 12 的最终正确答案是什么？",
      opts: ["3(a² - 4)", "3(a + 2)(a - 2)", "(3a + 6)(a - 2)", "3(a - 2)²"],
      aIndex: 1,
      exp: "因式分解必须遵循<b>‘先提后代，彻底分净’</b>的原则！先提取公共因数 3 得到 3(a² - 4)。接着观察到 (a² - 4) 符合平方差定理，还能继续分解成 (a + 2)(a - 2)！最后合成 3(a + 2)(a - 2)。不要只分到第一阶段就半途而废噢！"
    }
  },
  {
    name: "从分数到分式",
    title: "18.1.1 分式起源 ── 当分母加入了会变形的英文字母 👽",
    concept: "我们大家都懂什么叫分数。如果你在分数的<b>分母（也就是下面那个位置）看到有了变幻无常的字母</b>（即整式形式中含有自变量），这个代数式的名号就被改称为<b>分式</b>啦！分式绝不可以踩雷，因为<b>分母绝不能为 0！</b>一旦分母是 0，这个分式就失去研究意义了！",
    formula: "若分式 \frac{A}{B} 有意义，必满足条件：B ≠ 0",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-3 text-sm md:text-base">🧮 分母生命仪（何时有意义？）</h4>
        <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-100 mb-3">
          <div class="flex flex-col items-center">
            <div class="border-b-2 border-gray-400 pb-1 text-center font-bold text-blue-600">x + 2 (分子)</div>
            <div class="pt-1 text-center font-bold text-red-500">x - 3 (分母)</div>
          </div>
          <div class="flex flex-col items-end">
            <label class="text-xs text-gray-500 font-bold mb-1">拖动测定 x 变量: <span id="xVal" class="text-blue-600 font-mono">1</span></label>
            <input type="range" id="xSlider" min="-5" max="8" value="1" class="w-28 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer">
          </div>
        </div>
        <div id="statBox" class="p-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-center text-xs rounded-xl shadow-inner">
          当时状态: 分母为 -2 ── 安全且充满意义！
        </div>
      </div>
      <script>
        const xSlider = document.getElementById('xSlider');
        const xVal = document.getElementById('xVal');
        const statBox = document.getElementById('statBox');

        xSlider.addEventListener('input', () => {
          const x = parseInt(xSlider.value);
          xVal.innerText = x;
          const denom = x - 3;
          if (denom === 0) {
            statBox.className = "p-2 bg-red-500 text-white font-bold text-center text-xs rounded-xl shadow-inner animate-pulse";
            statBox.innerHTML = "🚨 危险！分母为 0！该分式无意义！";
          } else {
            statBox.className = "p-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-center text-xs rounded-xl shadow-inner";
            statBox.innerHTML = "当时状态: 分母为 " + denom + " ── 安全且充满意义！";
          }
        });
      </script>
    `,
    quiz: {
      q: "若分式 [ (x - 2) / (x + 1) ] 的值为 0，则变量 x 的取值应该是：",
      opts: ["x = 2", "x = -1", "x = 2 或 x = -1", "x = 0"],
      aIndex: 0,
      exp: "分式的值若为 0，需满足两个苛刻指标：① 分子等于 0（得 x - 2 = 0 推出 x = 2）；② 分母不能等于 0（把 x = 2 带入分母 2 + 1 = 3 ≠ 0，安全合格！）。如果选择 x = -1，会直接引爆分母为 0 无意义。所以仅能定 x = 2。完美！"
    }
  },
  {
    name: "分式的基本性质",
    title: "18.1.2 变身不忘本 ── 分式约分、通分的宇宙能量性质 ⚖",
    concept: "分式的基本性质指出：<b>分式的分子与分母同乘以（或除以）同一个不等于 0 的整式，分式的值依然维持绝对不变！</b>在这个原则下，我们可以完成大快人心的「<b>约分</b>（除去分子分母的分子大混蛋）」和「<b>通分</b>（为异分母找相同的底数家园）」！",
    formula: "\frac{A}{B} = \frac{A \cdot C}{B \cdot C}， \frac{A}{B} = \frac{A \div C}{B \div C}  (其中 C ≠ 0)",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">💎 快速分子分母大化简效果</h4>
        <div class="p-3 bg-white border border-emerald-100 rounded-xl font-mono text-xs flex justify-around items-center">
          <div class="text-center font-bold">
            <div class="border-b border-gray-400 py-1">2x²y</div>
            <div class="py-1">4xy²</div>
          </div>
          <div class="text-xl text-emerald-500">➔</div>
          <div class="text-center font-bold text-emerald-600 block">
            等同于 <span class="bg-emerald-100 px-1 py-0.5 rounded">x / 2y</span>!
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "将分式 [ x / (x + y) ] 中的 x 和 y 的值同时扩大至原来的 3 倍，则新分式的值为：",
      opts: ["不变", "扩大为 3 倍", "缩小为原来的 1/3", "扩大为 9 倍"],
      aIndex: 0,
      exp: "分子 x 变成 3x，分母 (x + y) 变成 (3x + 3y) = 3(x + y)。分子分母同时除以 3，3 直接被消去！分式的值仍然一文不差！选不变，这就是基本性质的厉害之处。🍉"
    }
  },
  {
    name: "分式的乘法与除法",
    title: "18.2 分式乘除 ── 遇乘直接铺，逢除反转翻跟头 🛹",
    concept: "分式的乘法非常纯粹简单：<b>分子乘以分子做新分子，分母乘以分母做新分母</b>。分式的除法则是：<b>除以一个数，等于乘上这个数的倒数</b> ── 所以把除数屁股一颠倒（倒数分子分母上下互调），直接转换为乘法！",
    formula: "① \frac{a}{b} · \frac{c}{d} = \frac{ac}{bd}<br>② \frac{a}{b} ÷ \frac{c}{d} = \frac{a}{b} · \frac{d}{c} = \frac{ad}{bc}",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">倒数翻转转换大舞台</h4>
        <div class="p-3 bg-white border border-amber-100 rounded-xl text-xs font-mono font-bold flex justify-around items-center">
          <div>(a/b) ÷ (c/d)</div>
          <div class="text-amber-500">转换为 ➔</div>
          <div class="text-emerald-600 bg-emerald-50 p-1.5 rounded">(a/b) × (d/c)</div>
        </div>
      </div>
    `,
    quiz: {
      q: "计算 [ (x² - y²) / (xy) ] · [ y / (x + y) ] 的最简结果是：",
      opts: ["(x - y) / x", "(x + y) / x", "y / x", "x - y"],
      aIndex: 0,
      exp: "先把第一个分式的分子因式分解：x² - y² = (x + y)(x - y)！然后与后面的分子、分母一起约分。分子中的 (x + y) 与 分母的 (x + y) 约掉，分子 y 与 分母 y 约掉，留下了 (x - y) / x。算得干净漂亮！✨"
    }
  },
  {
    name: "分式的加法与减法",
    title: "18.3 分式加减 ── 异中求同，通分搭建公共大桥 🌉",
    concept: "如果是<b>同分母</b>相加减，直接把分子算加减，分母坚守不动。如果是<b>异分母</b>，必须通过寻找<b>最简公分母</b>进行通分，搭建起公共大分母，转换之后才能把分子合拢！",
    formula: "① 同分母：\frac{a}{c} ± \frac{b}{c} = \frac{a ± b}{c}<br>② 异分母：\frac{a}{b} ± \frac{c}{d} = \frac{ad ± bc}{bd}",
    visualizer: `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-blue-800 mb-2 text-sm md:text-base">拼母大法演示</h4>
        <div class="flex items-center justify-around bg-white border border-blue-100 rounded-xl p-3 font-mono text-center font-bold text-xs">
          <div>
            1/x + 1/y
          </div>
          <div class="text-blue-500">➔ 通分 ➔</div>
          <div class="text-emerald-600">
            (y + x) / xy
          </div>
        </div>
      </div>
    `,
    quiz: {
      q: "计算 [ x / (x - y) ] + [ y / (y - x) ] 的结果应该等于：",
      opts: ["1", "-1", "(x+y)/(x-y)", "0"],
      aIndex: 0,
      exp: "注意看第二项的分母是 (y - x)！我们变负号：y / (y - x) = -y / (x - y)。这样分母立刻变得一样了，通分化为同分母式：(x - y) / (x - y)！由于分子分母一模一样，结果正是 1！秒杀成功！🌈"
    }
  },
  {
    name: "整数指数幂",
    title: "18.4 科学异次元 ── 面向负数指数和零次方的宇宙奥秘 👽",
    concept: "我们大家都习惯了正数次方。那如果是<b>零次方</b>或者<b>负数次方</b>呢？快看绝密定义：任何非零数的 0 次幂恒等于 <b>1</b>；任何非零数的负次幂，等于它正数次幂的<b>倒数形式</b>！最后，还可以完美支持微型世界的<b>科学记数法（带有负指数 10<sup>-n</sup>）</b>！",
    formula: "① a<sup>0</sup> = 1  (a ≠ 0)<br>② a<sup>-n</sup> = \frac{1}{a<sup>n</sup>} (a ≠ 0)<br>③ 科学记数法：a × 10<sup>-n</sup>  (1 ≤ |a| < 10)",
    visualizer: `
      <div class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-emerald-800 mb-3 text-sm md:text-base">🔬 微米观察仪（科学记数法）</h4>
        <div class="bg-white p-3 border border-emerald-100 rounded-xl mb-3 flex justify-between items-center text-xs font-mono">
          <span class="text-gray-500">尘埃大小 0.000035 米</span>
          <span class="text-emerald-600 font-bold">➔ 变身为 3.5 × 10⁻⁵ 米！</span>
        </div>
      </div>
    `,
    quiz: {
      q: "若一个极其细小的细菌周长，测得大小为 0.000000028 米。用科学记数法科学记为：",
      opts: ["28 × 10⁻⁹", "2.8 × 10⁻⁸", "2.8 × 10⁻⁹", "0.28 × 10⁻⁷"],
      aIndex: 1,
      exp: "科学记数法的正规格式为 a × 10⁻ⁿ，且正规规定首项 1 ≤ |a| < 10。因此 a 必须定为 2.8。小数点从 2 后面向左数起，正好隔了 8 位零区。因而指数代表为 -8，写出便是 2.8 × 10⁻⁸ 米！你就是未来的高级科学家！🌟"
    }
  },
  {
    name: "分式方程",
    title: "18.5 终极考验 ── 解救藏于分母的未知数 B 🔮",
    concept: "列方程时未知数藏在分母里面，这种方程就叫<b>分式方程</b>。解它的第一步：分子分母同除最简公分母，化为整式方程。但请牢记：在分式方程里，<b>验根是必修的核心天职！</b>因为最后算出的未知数可能让分母是 0（这就叫<b>增根</b>），增根必须毅然舍弃！",
    formula: "解法：两边乘以最简公分母 ➔ 转化为一元一次方程 ➔ 算出解 ➔ 带入最简公分母验算是否为 0 (判断增根！)",
    visualizer: `
      <div class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
        <h4 class="font-bold text-amber-800 mb-3 text-sm md:text-base">🚨 增根警报模拟器</h4>
        <p class="text-xs text-gray-500 mb-3">若算出来的值是使公分母为 0 的值，就是无路可走的增根。</p>
        <div class="bg-white p-3 border border-amber-100 rounded-xl text-xs flex justify-between items-center">
          <span class="font-bold font-mono text-gray-600">最简公分母：x(x - 2)</span>
          <span class="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded">若 x = 2 则是增根 🚫</span>
        </div>
      </div>
    `,
    quiz: {
      q: "解分式方程 3 / (x - 1) = 2 / x 产生的解 x 应该是：",
      opts: ["x = -2", "x = 2", "x = 1", "无解或产生增根"],
      aIndex: 0,
      exp: "两边同乘最简公分母 x(x-1) 得：3x = 2(x - 1) ── 展开一步化为整式：3x = 2x - 2，算得结果 x = -2。代入验算：分母 -2-1=-3 ≠ 0，-2 ≠ 0，都非增根，该解安全合法符合条件，所以选择 A 值 x = -2。"
    }
  }
];

function generateAll() {
  const assetsDir = path.join(process.cwd(), 'public', 'knowledge');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  knowledgeData.forEach((kd) => {
    const htmlFileName = `${kd.name}.html`;
    const fullPath = path.join(assetsDir, htmlFileName);

    let nextKp = '';
    const idx = knowledgeData.findIndex(item => item.name === kd.name);
    if (idx !== -1 && idx < knowledgeData.length - 1) {
      nextKp = knowledgeData[idx + 1].name;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${kd.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+SC:wght@400;700;900&display=swap');
    body {
      font-family: 'Noto Sans SC', 'Inter', sans-serif;
      scroll-behavior: smooth;
    }
    .custom-shadow {
      box-shadow: 0 8px 30px rgb(0, 0, 0, 0.04);
    }
  </style>
</head>
<body class="bg-gradient-to-b from-[#f9fdfa] to-white text-[#2c3e50] antialiased min-h-screen p-4 md:p-6 select-none">
  
  <div class="max-w-2xl mx-auto bg-white rounded-3xl border-3 border-[#cce7d2] custom-shadow p-5 md:p-8 relative overflow-hidden">
    
    <!-- Child decor line -->
    <div class="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"></div>
    
    <!-- Top info tag -->
    <div class="flex items-center justify-between mb-4 mt-2">
      <span class="bg-[#eefcf2] text-emerald-700 font-extrabold text-[10px] md:text-xs px-2.5 py-1 rounded-full border border-emerald-200">
        🍭 趣味数学 · 特制详解课件
      </span>
      <span class="text-gray-400 text-[10px] md:text-xs font-mono font-bold">
        初二数学上 · 轻松学
      </span>
    </div>

    <!-- Title and Subtitle -->
    <h2 class="text-xl md:text-2xl font-black text-gray-900 leading-snug mb-3">
      ${kd.title}
    </h2>

    <!-- Section 1: Children style Explanation Card -->
    <div class="bg-gradient-to-tr from-emerald-50/70 to-teal-50/70 border border-emerald-100 rounded-2xl p-5 mb-5 space-y-2">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xl">💡</span>
        <h3 class="font-extrabold text-emerald-800 text-sm md:text-base">概念科普站 (轻松看)</h3>
      </div>
      <p class="text-xs md:text-sm text-gray-700 leading-relaxed">
        ${kd.concept}
      </p>
    </div>

    <!-- Section 2: Magical Formula card -->
    <div class="bg-gradient-to-tr from-[#f3f9f5] to-teal-50/30 border-2 border-dashed border-emerald-200 rounded-2xl p-5 mb-5">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">👑</span>
        <h3 class="font-extrabold text-gray-800 text-sm md:text-base">魔法公式卡 (必须牢记)</h3>
      </div>
      <div class="font-mono text-[12px] md:text-sm text-[#115e3b] font-extrabold leading-loose bg-white border border-emerald-100 p-4 rounded-xl shadow-inner">
        ${kd.formula}
      </div>
    </div>

    <!-- Section 3: Interactive Sandbox or Demo Widget if present -->
    ${kd.visualizer || ''}

    <!-- Section 4: Child-friendly interactive 3-option quiz -->
    <div class="bg-[#edf9ff]/50 border border-sky-100 rounded-2xl p-5 mb-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">🎯</span>
        <h3 class="font-extrabold text-sky-800 text-sm md:text-base">全真小测验 ──── 测一测刚才学懂了吗？</h3>
      </div>
      <p class="text-xs md:text-sm font-extrabold text-gray-700 mb-4 bg-white p-3 rounded-xl border border-sky-100 leading-snug">
        ${kd.quiz.q}
      </p>
      
      <!-- Options array render -->
      <div class="space-y-2.5" id="optContainer">
        ${kd.quiz.opts.map((opt, oIdx) => `
          <button onclick="checkAnswer(${oIdx})" id="opt-${oIdx}" class="w-full text-left p-3.5 rounded-xl border border-sky-100 text-xs md:text-sm bg-white font-bold text-gray-700 hover:bg-sky-50 transition-all focus:outline-none flex justify-between items-center">
            <span>${String.fromCharCode(65 + oIdx)}. ${opt}</span>
            <span class="check-icon opacity-0 text-base"></span>
          </button>
        `).join('')}
      </div>

      <!-- Live explanation box initially hidden -->
      <div id="explanationBox" class="mt-4 p-4 bg-emerald-50 border border-emerald-100 text-[#115e3b] rounded-2xl text-xs md:text-sm hidden leading-relaxed font-bold">
        <strong class="text-sm block mb-1">📝 知识大礼包详解：</strong>
        <span id="expText">${kd.quiz.exp}</span>
        <div class="flex justify-end gap-2 mt-4">
          <button id="completeBtn" onclick="notifyParentCompleted();" class="px-4 py-2 border border-emerald-300 bg-emerald-500 text-white rounded-xl text-xs cursor-pointer hover:bg-emerald-600 shadow-md font-extrabold flex items-center gap-1">
            <span>✔ 标为已学</span>
          </button>
        </div>
      </div>
    </div>

    <footer class="text-center text-gray-400 text-[10px] md:text-xs">
      数学乐无限，多学一步多领悟！加油！🎈
    </footer>

  </div>

  <script>
    const answerIndex = ${kd.quiz.aIndex};
    let answered = false;

    function checkAnswer(chosenIndex) {
      if (answered) return;
      answered = true;

      // Select explanation and make it visible
      const expBox = document.getElementById('explanationBox');
      expBox.classList.remove('hidden');

      // Highlight the correct answer index
      const correctBtn = document.getElementById('opt-' + answerIndex);
      correctBtn.classList.remove('border-sky-100');
      correctBtn.classList.add('border-emerald-300', 'bg-emerald-50', 'text-emerald-800');
      correctBtn.querySelector('.check-icon').innerHTML = '🏆 恭喜答对！';
      correctBtn.querySelector('.check-icon').classList.remove('opacity-0');

      if (chosenIndex !== answerIndex) {
        const errorBtn = document.getElementById('opt-' + chosenIndex);
        errorBtn.classList.remove('border-sky-100');
        errorBtn.classList.add('border-[#fecaca]', 'bg-[#fef2f2]', 'text-[#991b1b]');
        errorBtn.querySelector('.check-icon').innerHTML = '❌ 不幸踩雷';
        errorBtn.querySelector('.check-icon').classList.remove('opacity-0');
      }
    }

    // Since this is inside an iframe, we want to notify parent window when the kid finishes!
    function notifyParentCompleted() {
      // Post message to the parent frame
      window.parent.postMessage({
        type: 'KNOWLEDGE_POINT_COMPLETED',
        name: "${kd.name}"
      }, '*');
      
      const completeBtn = document.getElementById('completeBtn');
      completeBtn.innerHTML = '✨ 已标记学习完成！';
      completeBtn.className = 'px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center';
      completeBtn.disabled = true;
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(fullPath, htmlContent);
  });

  console.log(`Successfully generated ${knowledgeData.length} public knowledge files!`);
}

generateAll();
