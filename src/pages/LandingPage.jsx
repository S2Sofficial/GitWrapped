import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Code,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Star,
  Share2,
  Terminal,
  Zap,
  Moon,
  Trophy,
  Users,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Book,
  Heart,
  LogOut
} from 'lucide-react';

// --- Constants & Config ---
const CURRENT_YEAR = new Date().getFullYear();
const CREATOR_X_HANDLE = "S2SmeX";
const CREATOR_X_LINK = "https://x.com/S2SmeX";

// --- OAUTH CONFIGURATION ---
// Safe environment variable accessor
const getEnv = (key, defaultValue) => {
  try {
    return (import.meta && import.meta.env && import.meta.env[key]) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const GITHUB_CLIENT_ID = getEnv("VITE_GITHUB_CLIENT_ID", "YOUR_GITHUB_CLIENT_ID");
const REDIRECT_URI = getEnv("VITE_REDIRECT_URI", "http://localhost:5173");
const BACKEND_URL = getEnv("VITE_BACKEND_URL", "http://localhost:5000/api");

// --- Dynamic Demo Generator ---
const generateDemoData = () => {
  const profiles = [
    { username: "torvalds", avatar: "https://avatars.githubusercontent.com/u/1024025?v=4", mainLang: "C", color: "#555555" },
    { username: "gaearon", avatar: "https://avatars.githubusercontent.com/u/810438?v=4", mainLang: "JavaScript", color: "#f7df1e" },
    { username: "sindresorhus", avatar: "https://avatars.githubusercontent.com/u/170270?v=4", mainLang: "TypeScript", color: "#3178c6" },
    { username: "tj", avatar: "https://avatars.githubusercontent.com/u/25254?v=4", mainLang: "Go", color: "#00ADD8" },
    { username: "yyx990803", avatar: "https://avatars.githubusercontent.com/u/499550?v=4", mainLang: "Vue", color: "#41b883" },
    { username: "defunkt", avatar: "https://avatars.githubusercontent.com/u/2?v=4", mainLang: "Ruby", color: "#701516" },
    { username: "addyosmani", avatar: "https://avatars.githubusercontent.com/u/110953?v=4", mainLang: "JavaScript", color: "#f7df1e" },
    { username: "getify", avatar: "https://avatars.githubusercontent.com/u/150330?v=4", mainLang: "JavaScript", color: "#f7df1e" }
  ];

  const profile = profiles[Math.floor(Math.random() * profiles.length)];

  // Generate randomized realistic stats
  const commits = Math.floor(Math.random() * 4000) + 500;
  const repos = Math.floor(Math.random() * 200) + 20;
  const stars = Math.floor(Math.random() * 50000) + 1000;
  const followers = Math.floor(Math.random() * 20000) + 500;

  const rawStats = {
    totalCommits: commits,
    publicRepos: repos,
    totalStars: stars,
    followers: followers,
    yearsActive: Math.floor(Math.random() * 10) + 5
  };

  const heroStat = determineHeroStat(rawStats);
  const persona = determinePersona(heroStat, profile.mainLang);

  return {
    username: profile.username,
    avatarUrl: profile.avatar,
    heroStat,
    totalCommits: commits,
    totalPRs: Math.floor(commits * 0.1),
    totalIssues: Math.floor(commits * 0.05),
    totalReviews: Math.floor(commits * 0.15),
    publicRepos: repos,
    totalStars: stars,
    followers: followers,
    yearsActive: rawStats.yearsActive,
    topLanguages: [
      { name: profile.mainLang, percentage: Math.floor(Math.random() * 30) + 40, color: profile.color },
      { name: "HTML", percentage: 20, color: "#e34c26" },
      { name: "CSS", percentage: 15, color: "#563d7c" },
      { name: "Shell", percentage: 10, color: "#89e051" },
    ],
    topRepos: [
      { name: `${profile.username}-awesome`, stars: Math.floor(stars * 0.4), contribs: 450 },
      { name: "next-big-thing", stars: Math.floor(stars * 0.2), contribs: 210 },
      { name: "utils-v2", stars: Math.floor(stars * 0.1), contribs: 110 },
    ],
    streak: Math.floor(Math.random() * 100) + 10,
    achievements: [
      { icon: <Moon className="w-6 h-6 text-purple-400" />, title: "Midnight Committer", desc: "Most active 12AM - 4AM" },
      { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Bug Slayer", desc: "Closed 40+ issues" },
      { icon: <Activity className="w-6 h-6 text-green-400" />, title: "Consistent", desc: "Committed 24 days in a row" },
    ],
    persona: persona,
    isAccurate: true // It's "accurate" in the sense that it's a consistent demo
  };
};

// --- Helper Functions ---

const getRandomColor = (str) => {
  if (!str) return '#6b7280';
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const determineHeroStat = (stats) => {
  const scores = [
    { id: 'commits', weight: 1, val: stats.totalCommits, label: "Contributions", title: "The Machine", icon: GitCommit },
    { id: 'repos', weight: 15, val: stats.publicRepos, label: "Projects Created", title: "The Architect", icon: Book },
    { id: 'stars', weight: 5, val: stats.totalStars, label: "Stars Earned", title: "Community Favorite", icon: Star },
    { id: 'followers', weight: 2, val: stats.followers, label: "Followers", title: "The Influencer", icon: Users },
    { id: 'years', weight: 50, val: stats.yearsActive, label: "Years Active", title: "The Veteran", icon: Trophy }
  ];

  let max = scores[0];
  let maxScore = -1;

  scores.forEach(s => {
    const score = s.val * s.weight;
    if (score > maxScore) {
      maxScore = score;
      max = s;
    }
  });

  if (max.val === 0) {
    return { label: "Contributions", value: 0, title: "The Newcomer", icon: Code };
  }

  return { label: max.label, value: max.val, title: max.title, icon: max.icon };
};

const determinePersona = (heroStat, topLang) => {
  if (heroStat.id === 'commits' && heroStat.value > 1000) return "The 10x Developer";
  if (heroStat.id === 'repos') return "The Open Sourcer";
  if (heroStat.id === 'stars') return "The Rock Star";
  if (heroStat.id === 'followers') return "The Tech Lead";
  if (topLang === 'Python') return "The Data Wizard";
  if (topLang === 'Rust') return "The Oxidizer";
  if (topLang === 'JavaScript' || topLang === 'TypeScript') return "The Web Native";
  return "The Code Explorer";
};

const fetchGitHubData = async (usernameInput, authSession = null) => {
  const isAuth = !!authSession;
  const username = usernameInput.replace(/^@/, '').trim();

  if (!username) throw new Error("Please enter a username");

  const headers = {};

  const getUrl = (endpoint) => {
    if (isAuth) {
      return `${BACKEND_URL}/github${endpoint}`;
    }
    return `https://api.github.com${endpoint}`;
  };

  const userRes = await fetch(getUrl(`/users/${username}`), { headers });

  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error(`User "${username}" not found.`);
    if (userRes.status === 403) throw new Error(`API Rate Limit Exceeded. Log in with GitHub for more.`);
    throw new Error(`GitHub API Error: ${userRes.status}`);
  }

  const user = await userRes.json();
  const createdDate = new Date(user.created_at);
  const yearsActive = new Date().getFullYear() - createdDate.getFullYear();

  const searchBase = isAuth
    ? `/search/issues?q=author:${username}+created:${CURRENT_YEAR}-01-01..${CURRENT_YEAR}-12-31`
    : `/search/issues?q=author:${username}+created:${CURRENT_YEAR}-01-01..${CURRENT_YEAR}-12-31`;

  const [prsRes, issuesRes] = await Promise.all([
    fetch(getUrl(`${searchBase}+type:pr`), { headers }),
    fetch(getUrl(`${searchBase}+type:issue`), { headers })
  ]);

  if (prsRes.status === 403 || issuesRes.status === 403) {
    throw new Error("Search Limit Hit. Log in with GitHub for accurate stats.");
  }

  const prsData = prsRes.ok ? await prsRes.json() : { total_count: 0 };
  const issuesData = issuesRes.ok ? await issuesRes.json() : { total_count: 0 };

  const fetchEvents = async (page) => {
    try {
      const res = await fetch(getUrl(`/users/${username}/events?per_page=100&page=${page}`), { headers });
      if (res.status === 403) return [];
      return res.ok ? await res.json() : [];
    } catch (e) { return []; }
  };

  const [events1, events2] = await Promise.all([fetchEvents(1), fetchEvents(2)]);
  const allEvents = [...events1, ...events2];

  let recentCommits = 0;
  let recentReviews = 0;
  let eventBasedActivity = 0;

  if (Array.isArray(allEvents)) {
    allEvents.forEach(event => {
      const eventYear = new Date(event.created_at).getFullYear();
      if (eventYear === CURRENT_YEAR) {
        eventBasedActivity++;
        if (event.type === 'PushEvent') {
          recentCommits += event.payload.size || 0;
        } else if (event.type === 'PullRequestReviewEvent') {
          recentReviews++;
        }
      }
    });
  }

  const reposRes = await fetch(getUrl(`/users/${username}/repos?sort=updated&per_page=30`), { headers });
  const repos = reposRes.ok ? await reposRes.json() : [];

  const langMap = {};
  let totalSize = 0;
  let totalStars = 0;

  repos.forEach(repo => {
    totalStars += repo.stargazers_count;
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      totalSize++;
    }
  });

  const topLanguages = Object.entries(langMap)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / totalSize) * 100),
      color: getRandomColor(name)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map(r => ({ name: r.name, stars: r.stargazers_count, contribs: "Active" }));

  const totalContributions = prsData.total_count + issuesData.total_count + recentCommits;

  const rawStats = {
    totalCommits: totalContributions,
    publicRepos: user.public_repos || repos.length,
    totalStars: totalStars,
    followers: user.followers,
    yearsActive: yearsActive
  };

  const heroStat = determineHeroStat(rawStats);
  const persona = determinePersona(heroStat, topLanguages[0]?.name);

  const achievements = [];
  if (prsData.total_count > 50) achievements.push({ icon: <GitPullRequest className="w-6 h-6 text-blue-400" />, title: "PR Machine", desc: "Shipped 50+ PRs" });
  if (topLanguages.length > 4) achievements.push({ icon: <Layers className="w-6 h-6 text-pink-400" />, title: "Polyglot", desc: "Fluent in 5+ languages" });
  if (recentCommits > 0 || prsData.total_count > 0) achievements.push({ icon: <Star className="w-6 h-6 text-yellow-400" />, title: "Open Sourcer", desc: "Contributed to public code" });
  if (user.followers > 100) achievements.push({ icon: <Users className="w-6 h-6 text-purple-400" />, title: "Crowd Favorite", desc: "100+ Followers" });
  if (achievements.length === 0) achievements.push({ icon: <Code className="w-6 h-6 text-slate-400" />, title: "Lurker Mode", desc: "Observing the code universe" });

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    heroStat,
    totalCommits: totalContributions,
    totalPRs: prsData.total_count,
    totalIssues: issuesData.total_count,
    totalReviews: recentReviews,
    publicRepos: user.public_repos,
    totalStars,
    followers: user.followers,
    yearsActive,
    topLanguages,
    topRepos,
    streak: Math.min(eventBasedActivity, 365),
    achievements,
    persona,
    isAccurate: isAuth
  };
};

// --- Components ---

const Slide = ({ children, active, className = "" }) => {
  if (!active) return null;
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, delay = 0 }) => (
  <div
    className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 w-full max-w-xs animate-slide-up hover:bg-white/20 transition-all border border-white/5 shadow-xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white font-mono">{value}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, color, delay }) => (
  <div className="w-full mb-4 animate-grow-width" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex justify-between mb-1 text-sm">
      <span className="font-bold text-gray-200">{label}</span>
      <span className="text-gray-400">{percentage}%</span>
    </div>
    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

// --- Main Application ---

export default function GitWrappedApp() {
  const [phase, setPhase] = useState('login');
  const [data, setData] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [inputUser, setInputUser] = useState('');

  const [authSession, setAuthSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const MAX_SLIDES = 6;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code) => {
    setIsAuthLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/github/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const sessionData = await res.json();
      if (!res.ok) throw new Error(sessionData.message || "OAuth Login Failed");

      setAuthSession(sessionData);

      if (sessionData.username) {
        setInputUser(sessionData.username);
        const fetchedData = await fetchGitHubData(sessionData.username, sessionData);
        setData(fetchedData);
        setPhase('wrapped');
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      setError("Backend connection failed (Expected in demo). Try Public Search.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const initiateLogin = () => {
    const scopes = "read:user repo";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setAuthSession(null);
    setInputUser('');
    setPhase('login');
  };

  const handleNext = () => {
    if (slideIndex < MAX_SLIDES - 1) setSlideIndex(p => p + 1);
  };

  const handlePrev = () => {
    if (slideIndex > 0) setSlideIndex(p => p - 1);
  };

  const reset = () => {
    setPhase('login');
    setSlideIndex(0);
    setData(null);
    setInputUser('');
    setCopied(false);
  };

  const handleScreenTap = (e) => {
    if (phase !== 'wrapped') return;

    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
      return;
    }

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    if (clickX > screenWidth / 2) {
      if (slideIndex === MAX_SLIDES - 1) {
        reset();
      } else {
        handleNext();
      }
    } else {
      handlePrev();
    }
  };

  const startWrapped = async (isDemo = false) => {
    setPhase('loading');
    setError('');

    try {
      if (isDemo) {
        setTimeout(() => {
          const demoData = generateDemoData();
          setData(demoData);
          setPhase('wrapped');
        }, 1500);
      } else {
        if (!inputUser && !authSession) throw new Error("Enter a username or Log in");
        const fetchedData = await fetchGitHubData(inputUser, authSession);
        setData(fetchedData);
        setPhase('wrapped');
      }
    } catch (err) {
      console.log("Fetch info:", err.message);
      const msg = err.message.replace("Error: ", "");
      setError(msg);
      setPhase('login');
    }
  };

  const getShareText = () => {
    if (!data) return "";
    return `My #GitWrapped ${CURRENT_YEAR}:
🚀 ${data.heroStat.value} ${data.heroStat.label}
🔥 ${data.topLanguages[0]?.name || 'Code'} Expert
⭐ Top Repo: ${data.topRepos[0]?.name || 'None'}

Check yours at GitWrapped! Built by @${CREATOR_X_HANDLE}`;
  };

  const shareToTwitter = (e) => {
    e?.stopPropagation();
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const copyToClipboard = (e) => {
    e?.stopPropagation();
    const text = getShareText();
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  };

  const shareToLinkedIn = (e) => {
    e?.stopPropagation();
    copyToClipboard();
    setTimeout(() => {
      window.open(`https://www.linkedin.com/feed/`, '_blank');
    }, 500);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (phase === 'wrapped') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') handleNext();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, slideIndex]);

  return (
    <div className="min-h-screen  text-white font-sans overflow-hidden selection:bg-purple-500 selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      </div>

      {phase === 'login' && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 max-w-md mx-auto w-full">
          <div className="mb-8 text-center animate-fade-in-up">
            <Github className="w-16 h-16 mx-auto mb-4 text-white" />
            <h1 className="text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              GitWrapped
            </h1>
            <p className="text-slate-400 text-lg">Your {CURRENT_YEAR} Coding Story</p>
          </div>

          <div className="w-full space-y-4 bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl animate-fade-in-up delay-100">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {isAuthLoading ? (
              <div className="flex flex-col items-center py-8">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                <p className="text-slate-400">Authenticating with GitHub...</p>
              </div>
            ) : (
              <>
                {!authSession ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">GitHub Username</label>
                      <input
                        type="text"
                        placeholder="Public user..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={inputUser}
                        onChange={(e) => setInputUser(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => startWrapped(false)}
                      className="w-full bg-slate-700/50 text-white font-medium py-3 rounded-lg hover:bg-slate-700 transition-colors border border-slate-600"
                    >
                      Search Public Profile
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-700"></div>
                      <span className="flex-shrink mx-4 text-slate-500 text-xs">SECURE LOGIN</span>
                      <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    <button
                      onClick={initiateLogin}
                      className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group"
                    >
                      <Github className="w-5 h-5" /> Login with GitHub
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4 space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <img src={authSession.avatarUrl} className="w-10 h-10 rounded-full border border-purple-500" alt="" />
                      <div className="text-left">
                        <p className="text-sm text-slate-400">Logged in as</p>
                        <p className="font-bold text-white">@{authSession.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startWrapped(false)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Generate My Wrapped <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1 w-full">
                      <LogOut size={12} /> Sign Out
                    </button>
                  </div>
                )}
              </>
            )}

            {!authSession && (
              <>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-xs">OR</span>
                  <div className="flex-grow border-t border-slate-700"></div>
                </div>

                <button
                  onClick={() => startWrapped(true)}
                  className="w-full bg-transparent text-slate-400 font-medium py-3 rounded-lg hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  View Random Demo
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500">Built by</p>
            <a
              href={CREATOR_X_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              <Twitter size={14} /> @{CREATOR_X_HANDLE}
            </a>
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-bold text-white animate-pulse">Analyzing Profile...</h2>
          <p className="text-slate-400 mt-2">Crunching {CURRENT_YEAR} data</p>
        </div>
      )}

      {phase === 'wrapped' && data && (
        <div
          className="relative z-10 h-screen w-full flex flex-col md:flex-row max-w-6xl mx-auto overflow-hidden cursor-pointer select-none"
          onClick={handleScreenTap}
        >

          <div className="absolute top-0 left-0 right-0 z-50 flex p-2 gap-1 pointer-events-none">
            {Array.from({ length: MAX_SLIDES }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= slideIndex ? 'bg-white' : 'bg-white/20'}`}
              />
            ))}
          </div>

          <div className="flex-1 relative h-full w-full bg-black md:rounded-3xl md:my-8 md:border md:border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">

            <Slide active={slideIndex === 0} className="bg-gradient-to-br from-indigo-900 to-slate-900 text-center">
              <img
                src={data.avatarUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-2xl mb-6 animate-bounce-slow"
              />
              <h2 className="text-3xl md:text-5xl font-bold mb-2">Hello, <span className="text-purple-400">@{data.username}</span>!</h2>
              <p className="text-xl text-slate-300 mb-8 max-w-md">{CURRENT_YEAR} was a year of code, caffeine, and closed issues. Ready to see your impact?</p>

              {!data.isAccurate && !data.username.includes("demo") && (
                <div className="mb-6 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-200 text-xs max-w-sm mx-auto flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Viewing public mode. Data estimated from recent activity. Use a Token for 100% accuracy.
                  </span>
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                Let's Dive In <ArrowRight size={20} />
              </button>
            </Slide>

            <Slide active={slideIndex === 1} className="bg-gradient-to-bl from-slate-900 to-emerald-900">
              <h2 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-8">{data.heroStat.title}</h2>
              <div className="text-center mb-10">
                <h1 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter counter-animation">
                  {data.heroStat.value.toLocaleString()}
                </h1>
                <p className="text-2xl text-emerald-200">{data.heroStat.label}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <StatCard label="Public Repos" value={data.publicRepos} icon={Book} delay={100} />
                <StatCard label="Followers" value={data.followers} icon={Users} delay={200} />
                <StatCard label="Pull Requests" value={data.totalPRs} icon={GitPullRequest} delay={300} />
                <StatCard label="Stars Earned" value={data.totalStars} icon={Star} delay={400} />
              </div>
            </Slide>

            <Slide active={slideIndex === 2} className="bg-gradient-to-tr from-slate-900 to-pink-900">
              <h2 className="text-sm font-bold tracking-widest text-pink-400 uppercase mb-4">Your Stack</h2>
              {data.topLanguages.length > 0 ? (
                <>
                  <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">You spoke in <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{data.topLanguages.length} different languages</span>.</h3>

                  <div className="w-full max-w-md bg-black/20 p-6 rounded-2xl backdrop-blur-md">
                    {data.topLanguages.map((lang, idx) => (
                      <ProgressBar
                        key={lang.name}
                        label={lang.name}
                        percentage={lang.percentage}
                        color={lang.color}
                        delay={idx * 150}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-slate-300">No language data found.</h3>
                  <p className="text-slate-500 mt-2">You might be a documentation wizard!</p>
                </div>
              )}
            </Slide>

            <Slide active={slideIndex === 3} className="bg-gradient-to-b from-blue-900 to-slate-900">
              <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-8">Top Projects</h2>

              {data.topRepos.length > 0 ? (
                <div className="space-y-4 w-full max-w-lg">
                  {data.topRepos.map((repo, idx) => (
                    <div
                      key={repo.name}
                      className="group bg-slate-800/80 p-6 rounded-xl border border-slate-700 hover:border-blue-400 transition-all animate-fade-in-right hover:scale-[1.02]"
                      style={{ animationDelay: `${idx * 200}ms` }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{repo.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-mono">{repo.stars}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <GitCommit className="w-4 h-4" />
                        <span>Recent Updates</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No public repositories found.</p>
                </div>
              )}
            </Slide>

            <Slide active={slideIndex === 4} className="bg-slate-950">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-10 z-10">Hall of Fame</h2>

              <div className="grid grid-cols-1 gap-6 w-full max-w-md z-10">
                {data.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg animate-pop-in"
                    style={{ animationDelay: `${idx * 300}ms` }}
                  >
                    <div className="p-3 bg-slate-950 rounded-full border border-slate-700 shadow-inner">
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{ach.title}</h3>
                      <p className="text-sm text-slate-400">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center z-10 animate-fade-in delay-1000">
                <p className="text-slate-500 mb-2">Coding Persona</p>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-bold text-white shadow-lg shadow-purple-500/30 text-xl">
                  {data.persona}
                </div>
              </div>
            </Slide>

            <Slide active={slideIndex === 5} className="bg-black text-white relative ">
              <div className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-60">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest rotate-90 whitespace-nowrap animate-pulse">
                  Tap Right to Start Over ↻
                </p>
              </div>

              <div className="relative w-full max-w-md h-full aspect-[9/16] md:aspect-[4/5] bg-gradient-to-br from-slate-800 to-black p-8 rounded-2xl border-4 border-slate-800 shadow-2xl flex flex-col items-center text-center justify-between overflow-hidden" id="share-card">
                <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[50%] bg-purple-600/30 rounded-full blur-[80px]"></div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                    <Github size={20} />
                    <span className="font-bold tracking-widest uppercase text-xs">GitWrapped {CURRENT_YEAR}</span>
                  </div>
                  <img src={data.avatarUrl} className="w-24 h-24 rounded-full border-4 border-white/10 mx-auto shadow-xl mb-4" alt="avatar" />
                  <h1 className="text-3xl font-black mb-1">@{data.username}</h1>
                  <div className="text-sm text-slate-400 font-mono mb-6">{data.heroStat.value} {data.heroStat.label}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-slate-400">Top Lang</div>
                    <div className="font-bold text-lg text-purple-400 truncate">{data.topLanguages[0]?.name || 'N/A'}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-slate-400">Stats</div>
                    <div className="font-bold text-lg text-emerald-400">{data.publicRepos} Repos</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-slate-400">Top Repo</div>
                    <div className="font-bold text-lg text-blue-400 truncate">{data.topRepos[0]?.name || 'N/A'}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                    <div className="text-xs text-slate-400">Persona</div>
                    <div className="font-bold text-lg text-pink-400 truncate">{data.persona.split(' ').pop()}</div>
                  </div>
                </div>

                <div className="w-full">
                  <p className="text-sm italic text-slate-500 mb-2">Built by @{CREATOR_X_HANDLE}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6 w-full max-w-xs z-20">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareToTwitter}
                    className="w-full bg-[#1da1f2] hover:bg-[#1a91da] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Twitter size={18} fill="currentColor" /> Post on X
                  </button>
                  <button
                    onClick={shareToLinkedIn}
                    className="w-full bg-[#0077b5] hover:bg-[#00669c] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Linkedin size={18} fill="currentColor" /> LinkedIn
                  </button>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 font-medium py-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy Stats Text"}
                </button>

                <div className="mt-2 text-center">
                  <a
                    href={CREATOR_X_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <span>Follow creator</span>
                    <span className="font-bold text-purple-400 group-hover:underline">@{CREATOR_X_HANDLE}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </Slide>

          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grow-width {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; opacity: 0; }
        .animate-grow-width { animation: grow-width 1s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
      `}</style>
    </div>
  );
}