/**
 * Interactive Developer Terminal [CLI Mode]
 * Shaik Mohammed Ashraf // 3D Cyber Portfolio
 */

(function () {
  const modal = document.getElementById('terminal-modal');
  const closeBtn = document.getElementById('terminal-close');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const triggerBtns = document.querySelectorAll('.btn-cli, [data-open-terminal]');
  const matrixCanvas = document.getElementById('matrix-canvas');

  if (!modal || !input || !output) return;

  const history = [];
  let historyIndex = -1;
  let matrixInterval = null;

  // Open Terminal
  function openTerminal() {
    modal.classList.add('open');
    if (window.cyberAudio) window.cyberAudio.playClick();
    setTimeout(() => {
      input.focus();
    }, 150);
  }

  // Close Terminal
  function closeTerminal() {
    modal.classList.remove('open');
    stopMatrixRain();
    if (window.cyberAudio) window.cyberAudio.playClick();
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openTerminal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeTerminal);
  }

  // Close when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeTerminal();
    }
  });

  // Hotkey ~ or ` or Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      if (document.activeElement !== input) {
        e.preventDefault();
        if (modal.classList.contains('open')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeTerminal();
    }
  });

  // Terminal Commands & Responses
  const COMMANDS = {
    help: () => `
<div class="terminal-line info">SYSTEM UTILITIES & COMMAND REGISTRY:</div>
<div class="terminal-line">  <span class="text-cyan">bio</span>         - About Shaik Mohammed Ashraf & philosophy</div>
<div class="terminal-line">  <span class="text-cyan">skills</span>      - Engineering stack & core competencies</div>
<div class="terminal-line">  <span class="text-cyan">projects</span>    - Featured flagship project (SmartCare Web App)</div>
<div class="terminal-line">  <span class="text-cyan">dsa</span>         - Algorithmic problem solving & pattern toolkit</div>
<div class="terminal-line">  <span class="text-cyan">leetcode</span>    - Live LeetCode real-time stats & rank</div>
<div class="terminal-line">  <span class="text-cyan">github</span>      - Live GitHub repos & contributions</div>
<div class="terminal-line">  <span class="text-cyan">chess</span>       - Live Chess.com ratings (Rapid, Blitz, Tactics)</div>
<div class="terminal-line">  <span class="text-cyan">edu</span>         - Academic credentials & milestones</div>
<div class="terminal-line">  <span class="text-cyan">contact</span>     - Direct communication channels & links</div>
<div class="terminal-line">  <span class="text-cyan">resume</span>      - Download / inspect official CV</div>
<div class="terminal-line">  <span class="text-cyan">matrix</span>      - Initialize Digital Rain protocol</div>
<div class="terminal-line">  <span class="text-cyan">clear</span>       - Wipe terminal output buffer</div>
<div class="terminal-line">  <span class="text-cyan">exit</span>        - Close terminal HUD</div>
`,

    chess: () => {
      const stats = window.latestChessStats || { rapid: 1216, rapidPeak: 1232, record: { win: 1116, loss: 977, draw: 78 }, tactics: 1461, league: 'Legend' };
      return `
<div class="terminal-line success">// CHESS.COM LIVE TELEMETRY [@ashumm] //</div>
<div class="terminal-line">  • <span class="text-cyan">Rapid Rating:</span>     <strong>${stats.rapid}</strong> (Peak: ${stats.rapidPeak})</div>
<div class="terminal-line">  • <span class="text-cyan">Tactics Rating:</span>   <strong>${stats.tactics}</strong></div>
<div class="terminal-line">  • <span class="text-cyan">Match Record:</span>     <span style="color:#10b981;">${stats.record.win} Wins</span> / <span style="color:#ef4444;">${stats.record.loss} Losses</span> / ${stats.record.draw} Draws</div>
<div class="terminal-line">  • <span class="text-cyan">League Standing:</span>  🏆 ${stats.league}</div>
<div class="terminal-line">  • <span class="text-cyan">Official Link:</span>    <a href="https://www.chess.com/member/ashumm" target="_blank" style="color:#00f5ff;text-decoration:underline;">chess.com/member/ashumm</a></div>
`;
    },

    leetcode: () => {
      const stats = window.latestLeetCodeStats || { totalSolved: 128, easy: 87, medium: 37, hard: 4, ranking: 1347751 };
      return `
<div class="terminal-line success">// LEETCODE LIVE PULSE [@Shaik_mohameed_Ashraf] //</div>
<div class="terminal-line">  • <span class="text-cyan">Total Solved:</span>    <strong>${stats.totalSolved}</strong> / 4,055 problems</div>
<div class="terminal-line">  • <span class="text-cyan">Easy / Med / Hard:</span>  <span style="color:#00b8a3;">${stats.easy} Easy</span> | <span style="color:#ffc01e;">${stats.medium} Med</span> | <span style="color:#ff375f;">${stats.hard} Hard</span></div>
<div class="terminal-line">  • <span class="text-cyan">Global Ranking:</span>  #${stats.ranking.toLocaleString()}</div>
<div class="terminal-line">  • <span class="text-cyan">Contest Rating:</span>  1,460</div>
<div class="terminal-line">  • <span class="text-cyan">Profile:</span>         <a href="https://leetcode.com/u/Shaik_mohameed_Ashraf/" target="_blank" style="color:#00f5ff;text-decoration:underline;">leetcode.com/u/Shaik_mohameed_Ashraf</a></div>
`;
    },

    github: () => {
      const stats = window.latestGitHubStats || { repoCount: 5, followers: 1, bio: 'EXTROVERT' };
      return `
<div class="terminal-line success">// GITHUB LIVE STATS [@Mohammed-Ashraf-Shaik] //</div>
<div class="terminal-line">  • <span class="text-cyan">Public Repos:</span>    <strong>${stats.repoCount}</strong></div>
<div class="terminal-line">  • <span class="text-cyan">Followers:</span>       ${stats.followers}</div>
<div class="terminal-line">  • <span class="text-cyan">Active Repos:</span>    smart-care-app, myleetcode, razor, web2</div>
<div class="terminal-line">  • <span class="text-cyan">Profile Link:</span>    <a href="https://github.com/Mohammed-Ashraf-Shaik" target="_blank" style="color:#00f5ff;text-decoration:underline;">github.com/Mohammed-Ashraf-Shaik</a></div>
`;
    },

    bio: () => `
<div class="terminal-line success">// IDENTITY PROTOCOL //</div>
<div class="terminal-line">Name:       Shaik Mohammed Ashraf</div>
<div class="terminal-line">Role:       Full-Stack Software Engineer & DSA Lover</div>
<div class="terminal-line">Location:   Nandyal, Andhra Pradesh, India</div>
<div class="terminal-line">Philosophy: "Architecting high-scale distributed systems and immersive web experiences."</div>
<div class="terminal-line text-muted">Passionate about turning complex computational challenges into simple, elegant algorithms. Dedicated to deep logic over rote memorization.</div>
`,

    skills: () => `
<div class="terminal-line success">// TECH ARSENAL //</div>
<div class="terminal-line">  • <span class="text-cyan">Languages:</span>      Python, Java, JavaScript (ES6+), HTML5, CSS3</div>
<div class="terminal-line">  • <span class="text-cyan">Frontend:</span>       Vite, Modular CSS Architecture, Three.js, Responsive UI</div>
<div class="terminal-line">  • <span class="text-cyan">Backend:</span>        MongoDB, RESTful APIs, Node runtime</div>
<div class="terminal-line">  • <span class="text-cyan">Algorithms:</span>     Arrays, Sliding Window, Two Pointers, Binary Search, Trees, Graphs, Hashing</div>
<div class="terminal-line">  • <span class="text-cyan">Tools & Vision:</span> OpenCV (Computer Vision), Git, GitHub, Figma, Vercel</div>
`,

    projects: () => `
<div class="terminal-line success">// FLAGSHIP PRODUCTION SYSTEM //</div>
<div class="terminal-line">★ <span class="text-cyan">SmartCare – Smart Healthcare Management Web App</span></div>
<div class="terminal-line">   Status:    <span style="color:#10b981;">LIVE PRODUCTION [v1.0]</span></div>
<div class="terminal-line">   Category:  Full-Stack Web Engineering / Healthcare Portal</div>
<div class="terminal-line">   Stack:     HTML5, CSS3, JavaScript (ES6+), Vite, Vercel Edge</div>
<div class="terminal-line">   Overview:  Centralized digital healthcare platform simplifying patient-doctor access with sub-second responsive UX.</div>
<div class="terminal-line">   Live URL:  <a href="https://smartcare-gprec.vercel.app" target="_blank" style="color:#00f5ff;text-decoration:underline;">https://smartcare-gprec.vercel.app</a></div>
<div class="terminal-line">   GitHub:    <a href="https://github.com/Mohammed-Ashraf-Shaik/smart-care-app" target="_blank" style="color:#a855f7;text-decoration:underline;">github.com/Mohammed-Ashraf-Shaik/smart-care-app</a></div>
`,

    dsa: () => `
<div class="terminal-line success">// ALGORITHMIC FOUNDATION //</div>
<div class="terminal-line">Active focus on Data Structures & Algorithms with deep understanding of time & space complexities:</div>
<div class="terminal-line">  [✓] Sliding Window & Two Pointers</div>
<div class="terminal-line">  [✓] Binary Search & Search Space Reduction</div>
<div class="terminal-line">  [✓] Hash Tables & Frequency Maps</div>
<div class="terminal-line">  [✓] Binary Trees, BST & Tree Traversals</div>
<div class="terminal-line">  [✓] Graph Theory (BFS/DFS, Topological Sort)</div>
<div class="terminal-line">  [✓] Dynamic Programming & Memoization</div>
<div class="terminal-line text-cyan">Active competitive programming profile on LeetCode & CodeChef.</div>
`,

    edu: () => `
<div class="terminal-line success">// ACADEMIC CREDENTIALS //</div>
<div class="terminal-line">1. <span class="text-cyan">B.Tech — Computer Science & Engineering</span></div>
<div class="terminal-line">   Institution: G. Pulla Reddy Engineering College (GPREC), Kurnool</div>
<div class="terminal-line">   Timeline:    2024–2028 (Currently in 5th Semester)</div>
<div class="terminal-line">   Score:       <span class="text-cyan" style="font-weight:bold;">CGPA: 8.78</span></div>
<br>
<div class="terminal-line">2. <span class="text-cyan">Intermediate (MPC)</span></div>
<div class="terminal-line">   Institution: Nucleus Jr College, BIEAP</div>
<div class="terminal-line">   Score:       <span class="text-cyan" style="font-weight:bold;">94.3%</span> (2022–2024)</div>
<br>
<div class="terminal-line">3. <span class="text-cyan">10th Standard (SSC)</span></div>
<div class="terminal-line">   Institution: GVR EM School</div>
<div class="terminal-line">   Score:       <span class="text-cyan" style="font-weight:bold;">543 / 600 (90.5%)</span> (2021–2022)</div>
`,

    contact: () => `
<div class="terminal-line success">// DIRECT COMMS CHANNELS //</div>
<div class="terminal-line">  • Email:    <a href="mailto:ashubasha52@gmail.com" style="color:#00f5ff;">ashubasha52@gmail.com</a></div>
<div class="terminal-line">  • Phone:    <a href="tel:+918500543154" style="color:#00f5ff;">+91 8500543154</a></div>
<div class="terminal-line">  • GitHub:   <a href="https://github.com/Mohammed-Ashraf-Shaik" target="_blank" style="color:#00f5ff;">github.com/Mohammed-Ashraf-Shaik</a></div>
<div class="terminal-line">  • LinkedIn: <a href="https://linkedin.com/in/mohammed-ashraf-shaik" target="_blank" style="color:#00f5ff;">linkedin.com/in/mohammed-ashraf-shaik</a></div>
<div class="terminal-line">  • X / Twitter: <a href="https://x.com/ashraf_m_shaik" target="_blank" style="color:#00f5ff;">x.com/ashraf_m_shaik</a></div>
`,

    resume: () => {
      const a = document.createElement('a');
      a.href = 'Resume_Mohammed_Ashraf.docx';
      a.download = 'Resume_Mohammed_Ashraf.docx';
      a.click();
      return `<div class="terminal-line success">[✓] Initializing direct download: Resume_Mohammed_Ashraf.docx</div>`;
    },

    matrix: () => {
      startMatrixRain();
      if (window.cyberAudio) window.cyberAudio.playMatrixRain();
      return `<div class="terminal-line success">[✓] Matrix rain protocol engaged. Type 'matrix' again or 'clear' to terminate.</div>`;
    },

    clear: () => {
      output.innerHTML = '';
      return '';
    },

    exit: () => {
      closeTerminal();
      return `<div class="terminal-line text-muted">Terminating CLI session...</div>`;
    }
  };

  // Process User Input
  function handleCommand(cmdStr) {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIndex = history.length;

    // Echo command
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line cmd-echo';
    echoLine.innerHTML = `<span class="terminal-prompt">ashraf@cyber:~$</span> ${escapeHTML(trimmed)}`;
    output.appendChild(echoLine);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();

    if (COMMANDS[cmd]) {
      const res = COMMANDS[cmd](parts.slice(1));
      if (res) {
        const resDiv = document.createElement('div');
        resDiv.innerHTML = res;
        output.appendChild(resDiv);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'terminal-line error';
      errLine.innerHTML = `Command not recognized: "${escapeHTML(cmd)}". Type <span class="text-cyan">help</span> for available commands.`;
      output.appendChild(errLine);
    }

    // Scroll to bottom
    const body = document.querySelector('.terminal-body');
    if (body) body.scrollTop = body.scrollHeight;

    input.value = '';
  }

  // Escape HTML helper
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  input.addEventListener('keydown', (e) => {
    if (window.cyberAudio) window.cyberAudio.playTerminalKey();

    if (e.key === 'Enter') {
      handleCommand(input.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });

  // Matrix Rain Effect Implementation
  function startMatrixRain() {
    if (!matrixCanvas) return;
    if (matrixInterval) {
      stopMatrixRain();
      return;
    }

    matrixCanvas.classList.add('active');
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = matrixCanvas.parentElement.offsetWidth;
    matrixCanvas.height = matrixCanvas.parentElement.offsetHeight;

    const chars = '0123456789ABCDEFΑΒΓΔΕΖΗΘΙΚΛMNΞΟΠΡΣΤΥΦΧΨΩ';
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(8, 10, 16, 0.15)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#00f5ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);
  }

  function stopMatrixRain() {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
    if (matrixCanvas) {
      matrixCanvas.classList.remove('active');
      const ctx = matrixCanvas.getContext('2d');
      ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    }
  }
})();
