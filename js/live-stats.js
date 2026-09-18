/**
 * Real-Time Dynamic API Data Synchronizer
 * LeetCode, GitHub & Chess.com Live Tracking
 * Shaik Mohammed Ashraf // 3D Cyber Portfolio
 */

(function () {
  // Config & Usernames
  const CONFIG = {
    leetcodeUser: 'Shaik_mohameed_Ashraf',
    githubUser: 'Mohammed-Ashraf-Shaik',
    chessUser: 'ashumm',
    refreshInterval: 120000 // 2 minutes
  };

  // Cached fallback state in case of network restriction / offline
  const DEFAULTS = {
    leetcode: {
      totalSolved: 128,
      easy: 87,
      medium: 37,
      hard: 4,
      ranking: 1347751,
      recent: 'Subarray Sum Equals K'
    },
    github: {
      repos: 5,
      followers: 1,
      bio: 'EXTROVERT, trying to build new things using current tech like ai tools etc...',
      topRepo: 'smart-care-app'
    },
    chess: {
      rapid: 1216,
      rapidPeak: 1232,
      wins: 1116,
      losses: 977,
      draws: 78,
      tactics: 1461,
      daily: 974,
      bullet: 704,
      blitz: 584,
      league: 'Legend'
    }
  };

  // Helper: Number Counter Animation
  function animateValue(elem, start, end, duration = 1200) {
    if (!elem) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = Math.floor(ease * (end - start) + start);
      elem.textContent = current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        elem.textContent = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  }

  // 1. Fetch Chess.com Live Stats (Public CORS API)
  async function fetchChessLive() {
    const statusElem = document.getElementById('chess-sync-status');
    try {
      if (statusElem) statusElem.textContent = 'SYNCING...';

      const [profileRes, statsRes] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${CONFIG.chessUser}`),
        fetch(`https://api.chess.com/pub/player/${CONFIG.chessUser}/stats`)
      ]);

      const profile = await profileRes.json();
      const stats = await statsRes.json();

      const rapid = stats.chess_rapid?.last?.rating || DEFAULTS.chess.rapid;
      const rapidPeak = stats.chess_rapid?.best?.rating || DEFAULTS.chess.rapidPeak;
      const record = stats.chess_rapid?.record || { win: DEFAULTS.chess.wins, loss: DEFAULTS.chess.losses, draw: DEFAULTS.chess.draws };
      const tactics = stats.tactics?.highest?.rating || DEFAULTS.chess.tactics;
      const bullet = stats.chess_bullet?.last?.rating || DEFAULTS.chess.bullet;
      const blitz = stats.chess_blitz?.last?.rating || DEFAULTS.chess.blitz;
      const daily = stats.chess_daily?.last?.rating || DEFAULTS.chess.daily;

      // Update DOM
      animateValue(document.getElementById('chess-rapid-val'), 0, rapid);
      animateValue(document.getElementById('chess-peak-val'), 0, rapidPeak);
      animateValue(document.getElementById('chess-tactics-val'), 0, tactics);
      animateValue(document.getElementById('chess-wins-val'), 0, record.win);
      animateValue(document.getElementById('chess-losses-val'), 0, record.loss);
      animateValue(document.getElementById('chess-draws-val'), 0, record.draw);

      const bulletElem = document.getElementById('chess-bullet-val');
      if (bulletElem) bulletElem.textContent = bullet;
      const blitzElem = document.getElementById('chess-blitz-val');
      if (blitzElem) blitzElem.textContent = blitz;
      const dailyElem = document.getElementById('chess-daily-val');
      if (dailyElem) dailyElem.textContent = daily;

      // Win Rate Calculation
      const totalGames = record.win + record.loss + record.draw;
      if (totalGames > 0) {
        const winPercent = Math.round((record.win / totalGames) * 100);
        const winBar = document.getElementById('chess-win-bar');
        if (winBar) winBar.style.width = `${winPercent}%`;
        const winPercentElem = document.getElementById('chess-winrate-text');
        if (winPercentElem) winPercentElem.textContent = `${winPercent}% WIN RATE (${totalGames.toLocaleString()} GAMES)`;
      }

      if (profile.avatar) {
        const avatarElem = document.getElementById('chess-avatar-img');
        if (avatarElem) avatarElem.src = profile.avatar;
      }

      if (statusElem) {
        statusElem.textContent = 'LIVE NOW';
        statusElem.classList.add('live-active');
      }

      // Store in window for terminal access
      window.latestChessStats = { rapid, rapidPeak, record, tactics, totalGames, league: profile.league || 'Legend' };
    } catch (err) {
      console.warn('Chess.com API sync notice:', err);
      fallbackChess();
    }
  }

  function fallbackChess() {
    animateValue(document.getElementById('chess-rapid-val'), 0, DEFAULTS.chess.rapid);
    animateValue(document.getElementById('chess-peak-val'), 0, DEFAULTS.chess.rapidPeak);
    animateValue(document.getElementById('chess-tactics-val'), 0, DEFAULTS.chess.tactics);
    animateValue(document.getElementById('chess-wins-val'), 0, DEFAULTS.chess.wins);
    animateValue(document.getElementById('chess-losses-val'), 0, DEFAULTS.chess.losses);
    animateValue(document.getElementById('chess-draws-val'), 0, DEFAULTS.chess.draws);
    const winBar = document.getElementById('chess-win-bar');
    if (winBar) winBar.style.width = '52%';
    const statusElem = document.getElementById('chess-sync-status');
    if (statusElem) statusElem.textContent = 'CACHED SYNC';
  }

  // 2. Fetch GitHub Live Stats (Public REST API & Repos)
  async function fetchGitHubLive() {
    const statusElem = document.getElementById('github-sync-status');
    try {
      if (statusElem) statusElem.textContent = 'SYNCING...';

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${CONFIG.githubUser}`),
        fetch(`https://api.github.com/users/${CONFIG.githubUser}/repos?sort=updated&per_page=6`)
      ]);

      const userData = await userRes.json();
      const repos = await reposRes.json();

      const repoCount = userData.public_repos ?? DEFAULTS.github.repos;
      const followers = userData.followers ?? DEFAULTS.github.followers;
      const bio = userData.bio || DEFAULTS.github.bio;

      animateValue(document.getElementById('github-repos-val'), 0, repoCount);
      animateValue(document.getElementById('github-followers-val'), 0, followers);

      const bioElem = document.getElementById('github-bio-text');
      if (bioElem) bioElem.textContent = `"${bio}"`;

      // Render latest active repo chips
      const repoContainer = document.getElementById('github-recent-repos');
      if (repoContainer && Array.isArray(repos)) {
        repoContainer.innerHTML = '';
        repos.slice(0, 4).forEach((r) => {
          const chip = document.createElement('a');
          chip.href = r.html_url;
          chip.target = '_blank';
          chip.rel = 'noopener noreferrer';
          chip.className = 'live-repo-chip';
          chip.innerHTML = `
            <span class="repo-name">📂 ${r.name}</span>
            <span class="repo-meta">${r.language || 'Code'}</span>
          `;
          repoContainer.appendChild(chip);
        });
      }

      if (statusElem) {
        statusElem.textContent = 'LIVE NOW';
        statusElem.classList.add('live-active');
      }

      window.latestGitHubStats = { repoCount, followers, bio, repos };
    } catch (err) {
      console.warn('GitHub API sync notice:', err);
      fallbackGitHub();
    }
  }

  function fallbackGitHub() {
    animateValue(document.getElementById('github-repos-val'), 0, DEFAULTS.github.repos);
    animateValue(document.getElementById('github-followers-val'), 0, DEFAULTS.github.followers);
    const statusElem = document.getElementById('github-sync-status');
    if (statusElem) statusElem.textContent = 'CACHED SYNC';
  }

  // 3. Fetch LeetCode Live Stats
  async function fetchLeetCodeLive() {
    const statusElem = document.getElementById('leetcode-sync-status');
    try {
      if (statusElem) statusElem.textContent = 'SYNCING...';

      const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${CONFIG.leetcodeUser}`);
      const data = await res.json();

      const totalSolved = data.totalSolved ?? DEFAULTS.leetcode.totalSolved;
      const easy = data.easySolved ?? DEFAULTS.leetcode.easy;
      const medium = data.mediumSolved ?? DEFAULTS.leetcode.medium;
      const hard = data.hardSolved ?? DEFAULTS.leetcode.hard;
      const ranking = data.ranking ?? DEFAULTS.leetcode.ranking;

      animateValue(document.getElementById('leetcode-total-val'), 0, totalSolved);
      animateValue(document.getElementById('leetcode-easy-val'), 0, easy);
      animateValue(document.getElementById('leetcode-med-val'), 0, medium);
      animateValue(document.getElementById('leetcode-hard-val'), 0, hard);
      animateValue(document.getElementById('leetcode-rank-val'), 0, ranking);

      // Total submissions in past year count
      const totalSubmissions = data.totalSubmissions?.[0]?.submissions || 282;
      const subElem = document.getElementById('leetcode-submissions-val');
      if (subElem) subElem.textContent = totalSubmissions;

      // Update Gauge Bar percentages
      const easyBar = document.getElementById('lc-bar-easy');
      if (easyBar) easyBar.style.width = `${Math.min((easy / 965) * 100, 100).toFixed(1)}%`;

      const medBar = document.getElementById('lc-bar-med');
      if (medBar) medBar.style.width = `${Math.min((medium / 2115) * 100, 100).toFixed(1)}%`;

      const hardBar = document.getElementById('lc-bar-hard');
      if (hardBar) hardBar.style.width = `${Math.min((hard / 975) * 100, 100).toFixed(1)}%`;

      // Show recent solved problem title
      if (data.recentSubmissions && data.recentSubmissions.length > 0) {
        const accepted = data.recentSubmissions.find(s => s.statusDisplay === 'Accepted') || data.recentSubmissions[0];
        const recentElem = document.getElementById('leetcode-recent-problem');
        if (recentElem) {
          recentElem.innerHTML = `RECENT: <span style="color:#10b981;font-weight:bold;">${accepted.title}</span> (${accepted.lang})`;
        }
      }

      // Render dynamic 52-week LeetCode submission heatmap
      renderLeetCodeHeatmap(data.submissionCalendar);

      if (statusElem) {
        statusElem.textContent = 'LIVE NOW';
        statusElem.classList.add('live-active');
      }

      window.latestLeetCodeStats = { totalSolved, easy, medium, hard, ranking };
    } catch (err) {
      console.warn('LeetCode API sync notice:', err);
      fallbackLeetCode();
    }
  }

  function renderLeetCodeHeatmap(submissionCalendar) {
    const grid = document.getElementById('leetcode-heatmap-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let subMap = submissionCalendar;
    if (typeof subMap === 'string') {
      try {
        subMap = JSON.parse(subMap);
      } catch (e) {
        subMap = {};
      }
    }
    if (!subMap || typeof subMap !== 'object') {
      subMap = {};
    }

    const now = Math.floor(Date.now() / 1000);
    const daySec = 86400;
    const totalDays = 52 * 7;
    const startTime = now - (totalDays * daySec);

    // If API returned empty (e.g. offline/rate-limit), create realistic mock based on user profile
    const hasData = Object.keys(subMap).length > 0;
    if (!hasData) {
      // Seeded mock matching screenshot: ~265 submissions across ~61 active days
      const seeded = [3, 7, 12, 18, 25, 33, 45, 52, 60, 68, 80, 92, 105, 120, 140, 160, 175, 190, 210, 225, 240, 260, 280, 295, 310, 325, 340, 350];
      seeded.forEach((d, idx) => {
        const ts = startTime + (d * daySec);
        subMap[ts] = (idx % 4) + 1;
        if (idx % 3 === 0) subMap[ts + daySec] = (idx % 3) + 2;
        if (idx % 5 === 0) subMap[ts + (daySec * 2)] = 5;
      });
    }

    let totalSubs = 0;
    let activeDays = 0;

    for (let day = 0; day < totalDays; day++) {
      const dayTimestamp = startTime + (day * daySec);
      let count = 0;
      for (const [k, v] of Object.entries(subMap)) {
        if (Math.abs(parseInt(k) - dayTimestamp) < 43200) {
          count += Number(v);
        }
      }

      if (count > 0) {
        totalSubs += count;
        activeDays++;
      }

      const cell = document.createElement('div');
      cell.className = 'lc-cal-cell';
      if (count >= 10) cell.classList.add('lvl-4');
      else if (count >= 5) cell.classList.add('lvl-3');
      else if (count >= 2) cell.classList.add('lvl-2');
      else if (count >= 1) cell.classList.add('lvl-1');

      const dateStr = new Date(dayTimestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      cell.title = `${count} submissions on ${dateStr}`;
      grid.appendChild(cell);
    }

    const totalSubsElem = document.getElementById('lc-total-subs-text');
    if (totalSubsElem) totalSubsElem.textContent = totalSubs > 0 ? totalSubs : '265';

    const activeDaysElem = document.getElementById('lc-active-days-text');
    if (activeDaysElem) activeDaysElem.textContent = activeDays > 0 ? activeDays : '61';
  }

  function fallbackLeetCode() {
    animateValue(document.getElementById('leetcode-total-val'), 0, DEFAULTS.leetcode.totalSolved);
    animateValue(document.getElementById('leetcode-easy-val'), 0, DEFAULTS.leetcode.easy);
    animateValue(document.getElementById('leetcode-med-val'), 0, DEFAULTS.leetcode.medium);
    animateValue(document.getElementById('leetcode-hard-val'), 0, DEFAULTS.leetcode.hard);
    animateValue(document.getElementById('leetcode-rank-val'), 0, DEFAULTS.leetcode.ranking);
    renderLeetCodeHeatmap(null);
    const statusElem = document.getElementById('leetcode-sync-status');
    if (statusElem) statusElem.textContent = 'CACHED SYNC';
  }

  // Initialize all live syncs
  function initAllSync() {
    fetchChessLive();
    fetchGitHubLive();
    fetchLeetCodeLive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllSync);
  } else {
    initAllSync();
  }

  // Refresh periodically
  setInterval(initAllSync, CONFIG.refreshInterval);

  // Manual refresh button
  window.refreshAllLiveStats = initAllSync;
})();
