import React, { useState, useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { 
  Code2, Terminal, Activity, GitBranch, Database, Server, 
  Shield, Zap, Layout, Filter, CheckCircle2, List, 
  ChevronRight, ChevronLeft, Maximize2, Minimize2, 
  Sparkles, Layers, GitCommit, Search, Share2 
} from 'lucide-react';

// --- TYPES ---
type SlideType = 'title' | 'simple' | 'split' | 'list' | 'code' | 'table' | 'grid' | 'image' | 'workflow';

interface Quote {
  text: string;
  author: string;
}

interface GridItem {
  title: string;
  icon: string; // Lucide icon key
  description: string;
}

interface WorkflowStep {
    step: number;
    title: string;
    description: string;
    codeFocus: string;
    colorKey: 'blue' | 'yellow' | 'purple' | 'green' | 'pink' | 'cyan';
}

interface SlideData {
  type: SlideType;
  title: string;
  subtitle?: string;
  developers?: string[];
  content?: string;
  items?: string[];
  quote?: Quote;
  language?: string;
  description?: string[];
  code?: string;
  imageSrc?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  gridItems?: GridItem[];
  workflowSteps?: WorkflowStep[];
  theme?: 'analysis' | 'architecture';
  link?: string; // <--- ADD THIS LINE
  leftContent?: { title: string; text?: string ; listItems?: string[]};
  rightContent?: { title: string; text?: string ; listItems?: string[] };
}

// --- WORKFLOW DATA ---
const dataProcessingWorkflow: WorkflowStep[] = [
    { step: 1, title: 'Target Identification', description: 'Scouts run queries to identify new candidate repositories.', codeFocus: 'Scouting ts scripts.', colorKey: 'blue' },
    { step: 2, title: 'Stub Initialization', description: 'Targets inserted with minimal metadata (ID, Name).', codeFocus: 'db.ts', colorKey: 'yellow' },
    { step: 3, title: 'Stub Hydration', description: 'Worker identifies incomplete repos for enrichment.', codeFocus: 'hydrateStubs()', colorKey: 'purple' },
    { step: 4, title: 'Deep GraphQL Fetch', description: 'Fetches complex metrics in one optimized query.', codeFocus: 'fetchAndEnrichRepo', colorKey: 'green' },
    { step: 5, title: 'Hybrid Contributor Check', description: 'Fast REST fetch first, fallback to GraphQL scan.', codeFocus: 'MissingContributors()', colorKey: 'pink' },
    { step: 6, title: 'Scoring & Ranking', description: 'Algorithms calculate Exploration Score & Velocity.', codeFocus: 'Algorithms !', colorKey: 'cyan' },
    { step: 7, title: 'Final DB Commit', description: 'Updates row, sets sync_status = "complete".', codeFocus: 'db.ts', colorKey: 'blue' },
];

const historicalVelocityWorkflow: WorkflowStep[] = [
    { step: 1, title: 'Trigger & Timeframe', description: 'Admin endpoint defines Growth Delta timeframe.', codeFocus: 'Service ts Script', colorKey: 'blue' },
    { step: 2, title: 'BigQuery Scan', description: 'SQL query executed against GH Archive dataset.', codeFocus: 'GH Archive SQL', colorKey: 'yellow' },
    { step: 3, title: 'Growth Delta Extraction', description: 'Returns Growth Delta (new stars) in memory.', codeFocus: 'Map<FullName, Delta>', colorKey: 'purple' },
    { step: 4, title: 'Repo Lookup', description: 'Validates names against database to find IDs.', codeFocus: 'db.findReposByNames', colorKey: 'green' },
    { step: 5, title: 'Hydration Reuse', description: 'Standard GraphQL logic re-used for context.', codeFocus: 'GraphQL reuse', colorKey: 'pink' },
    { step: 6, title: 'Storage Commit', description: 'Saves historical growth metrics (7d, 30d).', codeFocus: 'repository_stats', colorKey: 'cyan' },
];

// --- SLIDE DATA ARRAY ---
const slides: SlideData[] = [
  // ... (Your original slide data here - unchanged for brevity, reusing the structure)
  // PHASE 1: ANALYSIS & REQUIREMENTS
  {
    type: 'title',
    title: 'GitHop',
    subtitle: 'From Requirements to Reality',
    developers: ['Imad BOUTBAOUCHT', 'Ilyass SKIRIBA'],
    content: 'Project Analysis & Implementation Review ',
    theme: 'analysis'
  },
  {
    type: 'simple',
    title: 'What is GitHop?',
    content: 'A social intelligence engine that transforms scattered GitHub activity into a curated feed of trends and developer insights.',
    theme: 'analysis'
  },
  {
    type: 'split',
    title: 'Project Motivation',
    subtitle: 'Gap Analysis',
    theme: 'analysis',
    leftContent: {
      title: 'The Problem',
      // We use listItems now instead of text
      listItems: [
        'Getting news in the Open-Source world is hard.',
        'GitHub Trending is too superficial and lacks deep semantic filtering.',
        'Finding developers in a specific tech stack feels like mining in a dark cave.'
      ]
    },
    rightContent: {
      title: 'The Solution',
      listItems: [
        'A unified feed for the entire open-source ecosystem.',
        'AI Vector Search for semantic discovery.',
        'Topic-level insights.'
      ]
    }
  },
  {
    type: 'grid',
    title: 'Market Validation',
    subtitle: 'Feasibility Study Results',
    theme: 'analysis',
    gridItems: [
      { title: 'Usage Frequency', icon: 'chart', description: '87.5% of surveyed developers use GitHub tools weekly.' },
      { title: 'Feature Demand', icon: 'filter', description: '100% requested advanced filtering (Topic/Language).' },
      { title: 'UX Preference', icon: 'layout', description: '62.5% preferred a combined "Feed + Dashboard" view.' },
      { title: 'Verdict', icon: 'check', description: 'Greenlit. Vision validated by user research.' }
    ]
  },
  {
    type: 'table',
    title: 'FR: Data Aggregation',
    subtitle: 'SRS Section 3.1',
    theme: 'analysis',
    tableHeaders: ['ID', 'Requirement', 'Status', 'Implementation Detail'],
    tableRows: [
      ['FR-1.1', 'Hybrid API (REST+GraphQL)', 'PASSED', 'githubService.ts uses fetch & graphql-request'],
      ['FR-1.2', 'Calculate Ranking Metrics', 'PASSED', 'Custom Scoring Algo in githubService.ts'],
      ['FR-1.3', 'Handle Rate Limiting', 'PASSED', 'Sleep/Retry logic in commitWorker.ts']
    ]
  },
  {
    type: 'table',
    title: 'FR: Repo Intelligence',
    subtitle: 'SRS Section 3.2',
    theme: 'analysis',
    tableHeaders: ['ID', 'Requirement', 'Status', 'Implementation Detail'],
    tableRows: [
      ['FR-2.1', 'Exploration Score', 'PASSED', 'Weighted: Stars(100x) + Forks(50x)'],
      ['FR-3.1', 'Growth Velocity', 'PASSED', 'Score = stargazers / ageInDays'],
      ['FR-X', 'README Analysis', 'PASSED', 'readmeWorkerService.ts fetches context']
    ]
  },
  {
    type: 'table',
    title: 'FR: Dev Intelligence',
    subtitle: 'SRS Section 3.3',
    theme: 'analysis',
    tableHeaders: ['ID', 'Requirement', 'Status', 'Implementation Detail'],
    tableRows: [
      ['FR-4.1', 'Rank Devs by Topic', 'PASSED', 'Regex Keyword Analysis in devWorker.ts'],
      ['FR-5.1', 'Identify Trends', 'PASSED', 'BigQuery Integration (newService.ts)'],
      ['FR-5.2', 'Auto-Tagging', 'PASSED', 'Badges (GDE, MVP) assigned via Bio']
    ]
  },
  {
    type: 'code',
    title: 'Advanced Features',
    subtitle: 'Semantic Search Agent',
    theme: 'analysis',
    description: [
        'Requirement: "Advanced Filtering"',
        'Implementation: Google Gemini AI + Vector Embeddings',
        'Result: Natural Language Querying'
    ],
    code: `// searchAgentService.ts
// User: "Find me a React starter kit for AI"

// 1. AI Parsing (Gemini Flash)
const intent = await gemini.parse(query);
// Result: { language: 'React', topic: 'AI' }

// 2. Vector Search (pgvector)
const embeddings = await embed(query);
const results = await db.vectorQuery(embeddings, intent);`
  },
  {
    type: 'table',
    title: 'Non-Functional Reqs',
    subtitle: 'SRS Section 7',
    theme: 'analysis',
    tableHeaders: ['Requirement', 'Target', 'Status', 'Evidence'],
    tableRows: [
      ['Performance', '< 2s Load Time', 'PASSED', 'Pre-fetched JSON data'],
      ['Reliability', 'API Outage Safety', 'PASSED', 'Try/Catch blocks in Workers'],
      ['Scalability', 'Concurrent Users', 'PASSED', 'DB Connection Pooling (db.ts)'],
      ['Security', 'Secure Creds', 'PASSED', 'dotenv & gitignore used']
    ]
  },
  {
    type: 'grid',
    title: 'Tech Feasibility',
    subtitle: 'Plan vs Reality',
    theme: 'analysis',
    gridItems: [
      { title: 'Backend', icon: 'server', description: 'Plan: Node.js\nReality: Node + Express + TypeScript' },
      { title: 'Database', icon: 'database', description: 'Plan: PostgreSQL\nReality: PG + pgvector (AI)' },
      { title: 'Data Sources', icon: 'network', description: 'Plan: GitHub API\nReality: REST + GraphQL + BigQuery' },
      { title: 'Verdict', icon: 'shield', description: 'Architecture Exceeded Expectations.' }
    ]
  },
  {
    type: 'list',
    title: 'Schedule & Process',
    subtitle: 'Timeline: 6 Weeks',
    theme: 'analysis',
    items: [
      '<b>Foundation:</b> Setup DB & CI/CD ✅',
      '<b>Data Arch:</b> Designed Repo/Dev Schemas ✅',
      '<b>Backend Core:</b> Implemented Workers & Services ✅',
      '<b>Risk Mitigation:</b> Implement "Stub Hydration" to bypass API Rate Limits ✅'
    ]
  },
  {
    type: 'simple',
    title: 'Analysis Conclusion',
    content: '100% of Critical Requirements Met. Proceeding to Technical Deep Dive.',
    theme: 'analysis'
  },
  
  // PHASE 1.5: WORKFLOW PIPELINES
  {
    type: 'workflow',
    title: 'Hybrid Data Ingestion Pipeline',
    subtitle: '7-Step Sequential Workflow of Background Worker Service',
    theme: 'architecture',
    workflowSteps: dataProcessingWorkflow
  },
  {
    type: 'workflow',
    title: 'Historical Velocity Pipeline',
    subtitle: 'Extracting Growth Delta from BigQuery',
    theme: 'architecture',
    workflowSteps: historicalVelocityWorkflow
  },

  // PHASE 2: ARCHITECTURE & DESIGN
  {
    type: 'code',
    title: 'Smart Rate Limiting : Deep Dive Example',
    subtitle: 'Special Case : Contributor Fetch Fallback Strategy',
    theme: 'architecture',
    description: [
      'Problem: Naive fetching hits API limits .',
      'Solution: Use Strategy Pattern .',
      'Execution: Twos Tiers.'
    ],
    code: `// The "Smart" Fetching Logic
private async fetchAndSaveContributors(repoGithubId: string, fullName: string): Promise<void> {
  // STRATEGY 1: Try Standard REST API (Fast, Cheap)
  const response = await fetch(\`https://api.github.com/repos/\${fullName}/contributors?per_page=30\`);

  if (response.ok) {
    // ✅ Success - Exit early
    return await this.saveContributorsToDB(repoGithubId, await response.json(), 'all_time');
  }

  // STRATEGY 2: Fallback Logic (The "Safety Net")
  if (response.status === 403 || response.status === 204) {
    console.warn(\`⚠️ REST failed for \${fullName}. Switching to GraphQL History Scan...\`);
    
    // Call the heavy-duty GraphQL scraper
    await this.fetchAndSaveRecentContributorsGraphQL(repoGithubId, fullName);
  }
}`
  },
  {
    type: 'code',
    title: 'Deep Metric Enrichment : Optimizing Credits Usage',
    subtitle: 'Optimized GraphQL Hydration Query',
    theme: 'architecture',
    language: 'graphql',
    description: [
      'Goal: Gather disparate data points into one database schema in a single request.',
      'Efficiency: GraphQL is optimized for single-call deep dives, crucial for avoiding API round-trips.',
      'Data Points: Includes Metadata, Health Metrics, and Content for AI Analysis (README).'
    ],
    code: `# The "Hydration" Query (src/services/workerService.ts)
query RepoHydrate($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    # 1. Basic Metadata
    name, description, stargazerCount, forkCount
    
    # 2. Tech Stack Analysis
    primaryLanguage { name }
    languages(first: 10) { edges { size, node { name } } }
    
    # 3. Health Metrics
    issues(states: OPEN) { totalCount }
    releases(first: 1) { nodes { publishedAt } }
    
    # 4. Content for AI Analysis
    readme: object(expression: "HEAD:README.md") {
      ... on Blob { text }
    }
  }
}`
  },
  {
    type: 'code',
    title: 'Low-Latency Frontend Retrieval',
    subtitle: 'All Processing for a Simple, Direct API Call',
    theme: 'architecture',
    language: 'javascript',
    description: [
      'The goal is eliminating runtime API latency.',
      'Result: The frontend only needs to fetch pre-calculated data (score, growth, persona, metadata) from PostgreSQL, ensuring sub-100ms response times.',
      'Evidence: All complex calculations (scoring, persona classification) are pushed to the background workers.'
    ],
    code: `// FRONTEND REACT COMPONENT
useEffect(() => {
  const fetchFeed = async () => {
    // Single, direct query to our optimized PostgreSQL database
    const response = await fetch('/api/feed/latest?sort=score&limit=20');
    
    // Data is ready to render instantly (No further calculation needed)
    const feed = await response.json();
    setRepos(feed);
  };
  fetchFeed();
}, []);`
  },
  {
    type: 'simple',
    title: 'Technical Architecture',
    content: 'Exploring the Design Patterns and Testing Strategy behind the requirements.',
    theme: 'architecture'
  },
  // DESIGN PATTERNS
  {
    type: 'code',
    title: 'Singleton Pattern',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Creational',
      'Ensures a class has only one instance.',
      'Critical for managing the Database Connection Pool.'
    ],
    code: `// src/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20 // Limit connections
});

// The single instance export
export default pool;`
  },
  {
    type: 'code',
    title: 'Strategy Pattern',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Behavioral',
      'Swaps algorithms at runtime.',
      'Context: Deciding between a "Full Refresh" vs "Quick Update".'
    ],
    code: `// src/services/workerService.ts
public async runJobs(strategy: 'FULL' | 'QUICK') {
    if (strategy === 'FULL') {
        // Strategy A: Heavy resource usage
        await this.updateAllHistories();
    } else {
        // Strategy B: Optimized for speed
        await this.updateRecentOnly();
    }
}`
  },
  {
    type: 'code',
    title: 'Adapter Pattern',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Structural',
      'Makes incompatible interfaces work together.',
      'Adapts BigQuery data shapes to our PostgreSQL schema.'
    ],
    code: `// BigQuery returns: { star_count: 500 }
// App expects: { stargazers_count: 500 }

const adapter = (bqRow: any): Repo => ({
    name: bqRow.repo_name,
    // The adaptation layer
    stargazers_count: bqRow.star_count,
    updated_at: new Date()
});`
  },
  {
    type: 'code',
    title: 'Observer Pattern',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Behavioral',
      'Notifies subscribers of state changes.',
      'Used for real-time system logging and error tracking.'
    ],
    code: `// src/db.ts
// Subject: The DB Pool
pool.on('connect', (client) => {
  // Observer 1: Logger
  console.log("✅ Client Connected");
});

pool.on('error', (err) => {
  // Observer 2: Error Tracker
  console.error("❌ Unexpected Error", err);
});`
  },
  {
    type: 'code',
    title: 'Chain of Responsibility',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Behavioral',
      'Passes requests along a chain of handlers.',
      'AI Fallback Logic: Tries Cheap Model (Flash) -> Fails -> Tries Strong Model (Pro).'
    ],
    code: `try {
    // Link 1: Fast Model
    return await askGeminiFlash(prompt);
} catch (e) {
    console.warn("Flash failed, escalating...");
    // Link 2: Strong Model
    return await askGeminiPro(prompt);
}`
  },
  {
    type: 'code',
    title: 'Builder Pattern',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Creational',
      'Constructs complex objects step-by-step.',
      'Used to build dynamic SQL queries for the Smart Search.'
    ],
    code: `// Start with base
let query = new QueryBuilder('repos');

// Step-by-step construction
if (filter.lang) query.where('language', filter.lang);
if (filter.stars) query.where('stars', '>', filter.stars);

// Finalize
const sql = query.build();`
  },
  {
    type: 'code',
    title: 'Template Method',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Behavioral',
      'Defines the skeleton of an algorithm.',
      'Standardizes how we sync Weekly vs Monthly trends.'
    ],
    code: `abstract class TrendSync {
    // The Template (Fixed steps)
    async sync() {
        const data = await this.fetchData(); // Abstract
        await this.save(data); // Concrete
    }
}

class WeeklySync extends TrendSync {
    fetchData() { return ghArchive.getDays(7); }
}`
  },
  {
    type: 'code',
    title: 'Facade Pattern',
    language: 'typescript',
    theme: 'architecture',
    description: [
      'Type: Structural',
      'Hides complexity behind a simple interface.',
      'The WorkerService wraps complex background job logic.'
    ],
    code: `// Complex Subsystems:
// - RedisQueue
// - GitHubAPI
// - DB Update Logic

// Facade:
export class WorkerFacade {
    static async startAll() {
        // Orchestrates all subsystems effortlessly
        await queue.clean();
        await api.hydrate();
    }
}`
  },
  // TESTING SLIDES
  {
    type: 'code',
    title: 'Unit Testing',
    subtitle: 'White-Box Testing',
    language: 'typescript',
    theme: 'architecture',
    description: [
        'Method: White-Box Testing (Internal Logic Known)',
        'Target: Developer Persona Engine',
        'Goal: Verify logic isolation.'
    ],
    code: `describe('Persona Engine', () => {
  test('classifies AI Whisperer', () => {
    const bio = "I love LLMs and GPT";
    const result = calculatePersona(bio);
    
    expect(result.ai_whisperer).toBeGreaterThan(0);
    expect(result.frontend_wizard).toBe(0);
  });
});

/* TERMINAL OUTPUT:
 PASS tests/persona.test.ts
 ✓ classifies AI Whisperer (4ms)
*/`
  },
  {
    type: 'code',
    title: 'Boundary Value Analysis',
    subtitle: 'Edge Case Validation',
    language: 'typescript',
    theme: 'architecture',
    description: [
        'Method: Boundary Testing',
        'Target: Scoring Algorithm',
        'Goal: Handle 0 inputs (New Repo).'
    ],
    code: `test('Handles Zero-State Repo', () => {
    const zeroRepo = { stars: 0, forks: 0 };
    const score = calculateScore(zeroRepo);
    
    // Boundary Check
    expect(score).toBe(0);
    expect(Number.isNaN(score)).toBe(false);
});

/* TERMINAL OUTPUT:
 PASS tests/scoring.test.ts
 ✓ Handles Zero-State Repo (2ms)
*/`
  },
  {
    type: 'table',
    title: 'Test Case Artifacts',
    subtitle: 'Black-Box Testing',
    theme: 'architecture',
    tableHeaders: ['ID', 'Input', 'Expected', 'Actual', 'Status'],
    tableRows: [
        ['TC-01', '"React Twitter Clone"', 'List of React Repos', '5 Results Found', 'PASS ✅'],
        ['TC-02', '"" (Empty String)', 'Error 400', 'Error 400', 'PASS ✅'],
        ['TC-03', '"Cobol Mainframe"', 'Empty List []', 'Empty List []', 'PASS ✅']
    ]
  },

  // MODIFIED CLOSING SEQUENCE
  {
    type: 'simple',
    title: 'Mission Status',
    content: 'All systems are nominal. CI/CD pipelines are green. The architecture has passed all validation checks.',
    theme: 'architecture'
  },
  {
    type: 'title', // Reusing the title layout for the big reveal
    title: '🚀 Live Deployment',
    subtitle: 'It is available now.',
    link: 'https://githop-frontend.pages.dev', // The Link
    content: 'Navigate to the live application on your device.',
    developers: ['Live Demo', 'Production Env'], // Using this prop for badges
    theme: 'architecture'
  }
];

// --- ICONS (LUCIDE MAPPING) ---
const Icons: Record<string, React.ReactNode> = {
  chart: <Activity className="w-8 h-8" />,
  filter: <Filter className="w-8 h-8" />,
  layout: <Layout className="w-8 h-8" />,
  check: <CheckCircle2 className="w-8 h-8" />,
  server: <Server className="w-8 h-8" />,
  database: <Database className="w-8 h-8" />,
  network: <Share2 className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />
};

function Slides() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (slides[currentSlideIndex].type !== 'workflow') {
      setActiveStep(1);
    }
  }, [currentSlideIndex]);

  const currentSlide = slides[currentSlideIndex];
  // Determine gradient based on theme, using App colors
  const isAnalysis = currentSlide.theme === 'analysis';
  // RepositoryList uses purple-600 to pink-600 mostly
  const accentGradient = isAnalysis
    ? 'from-blue-500 to-green-400'
    : 'from-purple-600 to-pink-600';
    
  const accentText = isAnalysis ? 'text-blue-400' : 'text-purple-400';
  const accentBorder = isAnalysis ? 'border-blue-500/30' : 'border-purple-500/30';
  const accentBg = isAnalysis ? 'bg-blue-500/10' : 'bg-purple-500/10';

  const progressPercentage = ((currentSlideIndex + 1) / slides.length) * 100;

  const highlightedCode = useMemo(() => {
    if (currentSlide.type !== 'code' || !currentSlide.code) return '';
    if (currentSlide.language) {
      try {
        return hljs.highlight(currentSlide.code, { language: currentSlide.language }).value;
      } catch (e) {
        return currentSlide.code;
      }
    }
    return hljs.highlightAuto(currentSlide.code).value;
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide.type === 'workflow' && currentSlide.workflowSteps && activeStep < currentSlide.workflowSteps.length) {
        setActiveStep(prev => prev + 1);
        return;
    }
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setActiveStep(1);
    }
  };

  const prevSlide = () => {
    if (currentSlide.type === 'workflow' && activeStep > 1) {
        setActiveStep(prev => prev - 1);
        return;
    }
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setActiveStep(1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    window.addEventListener('keydown', handleKeydown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [currentSlideIndex, activeStep]);

  return (
    <>
      <style>{`
        .slide-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .slide-scroll::-webkit-scrollbar-track { background: transparent; }
        .slide-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
        .hljs { background: transparent !important; color: #abb2bf; }
        .hljs-keyword, .hljs-operator { color: #c678dd; } /* Purple */
        .hljs-title, .hljs-function { color: #61afef; } /* Blue */
        .hljs-string { color: #98c379; } /* Green */
        .hljs-comment { color: #5c6370; font-style: italic; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-enter { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* --- APP SHELL BACKGROUND (Matched to RepositoryList) --- */}
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#0B0C15] p-4 font-sans text-white relative overflow-hidden">
        
        {/* Ambient Blobs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        {/* --- MAIN SLIDE CONTAINER (Glassmorphism Card Style) --- */}
        <div
          ref={containerRef}
          className={`flex flex-col bg-[#13141F]/80 backdrop-blur-xl border border-white/5 shadow-2xl transition-all duration-500 overflow-hidden relative ${
            isFullscreen
              ? 'w-full h-full rounded-none border-0'
              : 'w-full max-w-7xl aspect-video rounded-2xl'
          }`}
        >
          {/* HEADER / PROGRESS BAR */}
          <div className="h-1.5 w-full bg-[#0B0C15] shrink-0 relative">
            <div
              className={`h-full bg-gradient-to-r ${accentGradient} shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col relative z-10 overflow-hidden">
            <div key={currentSlideIndex} className="h-full flex flex-col w-full animate-enter">
              
              {/* --- 1. TITLE SLIDE --- */}
{/* --- 1. TITLE / LAUNCH SLIDE --- */}
              {currentSlide.type === 'title' && (
                <div className="h-full flex flex-col justify-center items-center text-center relative">

                  {/* ADD THIS CHECK: Only render icon if it is NOT the first slide (index 0) */}
                  {currentSlideIndex !== 0 && (
                    <div className={`mb-8 w-20 h-20 bg-gradient-to-br ${currentSlide.link ? 'from-green-500 to-emerald-600' : 'from-purple-600 to-pink-600'} rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/10 ${currentSlide.link ? 'shadow-green-500/20 animate-pulse' : 'shadow-purple-500/20'}`}>
                      {currentSlide.link ? <Zap className="w-10 h-10 text-white" /> : <Code2 className="w-10 h-10 text-white" />}
                    </div>
                  )}
                   {/* <div className={`mb-8 w-20 h-20 bg-gradient-to-br ${currentSlide.link ? 'from-green-500 to-emerald-600' : 'from-purple-600 to-pink-600'} rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/10 ${currentSlide.link ? 'shadow-green-500/20 animate-pulse' : 'shadow-purple-500/20'}`}>
                      {currentSlide.link ? <Zap className="w-10 h-10 text-white" /> : <Code2 className="w-10 h-10 text-white" />}
                   </div> */}

                  <h1 className={`font-black tracking-tight mb-4 text-white drop-shadow-sm ${
                    isFullscreen ? 'text-8xl' : 'text-7xl'
                  }`}>
                    {currentSlide.title}
                  </h1>

                  {/* LINK RENDERING LOGIC */}
                  {currentSlide.link ? (
                    <a 
                      href={currentSlide.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className={`group relative inline-flex items-center gap-3 px-8 py-4 mb-8 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer`}
                    >
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-bold tracking-wide ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
                        {currentSlide.link.replace('https://', '')}
                      </span>
                      <Share2 className="w-8 h-8 text-emerald-400 group-hover:rotate-45 transition-transform" />
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full ring-2 ring-green-500/20 group-hover:ring-green-500/50 animate-pulse"></div>
                    </a>
                  ) : (
                    <h2 className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient} mb-8 font-bold tracking-wide ${
                      isFullscreen ? 'text-4xl' : 'text-3xl'
                    }`}>
                      {currentSlide.subtitle}
                    </h2>
                  )}
                  
                  <p className="text-gray-500 font-medium mb-12 text-lg">{currentSlide.content}</p>

                  <div className="flex gap-8 mt-4">
                    {currentSlide.developers?.map(dev => (
                      <div key={dev} className="flex flex-col items-center group">
                        <span className="text-sm font-bold tracking-wider text-gray-300 group-hover:text-white transition-colors uppercase">{dev}</span>
                        <span className={`text-[10px] ${currentSlide.link ? 'text-green-400' : accentText} uppercase font-bold`}>
                          {currentSlide.link ? 'Status: Active' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- 2. SIMPLE SLIDE --- */}
              {currentSlide.type === 'simple' && (
                 <div className="h-full flex flex-col justify-center items-center text-center px-12 relative">
                    <div className="w-24 h-24 bg-gray-800/30 rounded-full flex items-center justify-center mb-8 ring-1 ring-white/5">
                         <Sparkles className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className={`font-bold mb-8 text-white tracking-tight ${isFullscreen ? 'text-6xl' : 'text-5xl'}`}>
                       {currentSlide.title}
                    </h2>
                    {currentSlide.content && (
                      <p className={`text-gray-400 max-w-4xl font-normal leading-relaxed ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
                          {currentSlide.content}
                      </p>
                    )}
                 </div>
              )}

              {/* --- 3. SPLIT SLIDE --- */}
              {currentSlide.type === 'split' && (
                <div className="h-full flex flex-col">
                  <div className="mb-8 border-b border-white/5 pb-4 flex items-end justify-between">
                     <h2 className={`font-bold text-white ${isFullscreen ? 'text-5xl' : 'text-4xl'}`}>
                        {currentSlide.title}
                     </h2>
                     <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <GitBranch className={`w-4 h-4 ${accentText}`} />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{currentSlide.subtitle}</span>
                     </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-8 items-center">
                      {/* Left: Problem */}
                      <div className="bg-[#0f1016] border border-red-500/10 p-8 rounded-2xl h-full flex flex-col relative group hover:border-red-500/30 transition-colors">
                          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                            <Activity className="w-6 h-6 text-red-400" />
                          </div>
                          <h3 className="text-xl font-bold text-red-400 mb-4 uppercase tracking-wider">
                             {currentSlide.leftContent?.title}
                          </h3>
                          
                          {/* NEW LOGIC: Check for listItems, otherwise show text */}
                          {currentSlide.leftContent?.listItems ? (
                            <ul className="text-gray-400 text-lg leading-relaxed flex-1 list-disc pl-5 space-y-3">
                              {currentSlide.leftContent.listItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-400 text-lg leading-relaxed flex-1">
                                {currentSlide.leftContent?.text}
                            </p>
                          )}
                      </div>

                      {/* Right: Solution */}
                      <div className={`bg-[#0f1016] border ${accentBorder} p-8 rounded-2xl h-full flex flex-col relative group`}>
                          <div className={`w-12 h-12 ${accentBg} rounded-xl flex items-center justify-center mb-6`}>
                            <CheckCircle2 className={`w-6 h-6 ${accentText}`} />
                          </div>
                          <h3 className={`text-xl font-bold mb-4 uppercase tracking-wider ${accentText}`}>
                             {currentSlide.rightContent?.title}
                          </h3>
                          
                          {/* 👇 NEW LOGIC: Check for listItems on the Right side */}
                          {currentSlide.rightContent?.listItems ? (
                            <ul className="text-gray-300 text-lg leading-relaxed flex-1 list-disc pl-5 space-y-3">
                              {currentSlide.rightContent.listItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-300 text-lg leading-relaxed flex-1">
                                {currentSlide.rightContent?.text}
                            </p>
                          )}
                      </div>
                  </div>
                </div>
              )}

              {/* --- 4. GRID SLIDE --- */}
              {currentSlide.type === 'grid' && (
                <div className="h-full flex flex-col">
                  <div className="mb-10 border-b border-white/5 pb-4">
                     <h2 className={`font-bold text-white mb-2 ${isFullscreen ? 'text-5xl' : 'text-4xl'}`}>
                        {currentSlide.title}
                     </h2>
                     <p className={`${accentText} font-bold text-sm uppercase tracking-wider`}>{currentSlide.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 h-full content-start">
                     {currentSlide.gridItems?.map((item, i) => (
                        <div key={i} className={`bg-[#0f1016] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex items-start gap-5 group hover:bg-[#151620]`}>
                           <div className={`p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300 text-gray-300 group-hover:${accentText}`}>
                              {Icons[item.icon]}
                           </div>
                           <div>
                              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                              <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              )}

              {/* --- 5. LIST SLIDE --- */}
              {currentSlide.type === 'list' && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <List className="w-8 h-8 text-gray-400" />
                     </div>
                     <div>
                        <h2 className={`font-bold text-white ${isFullscreen ? 'text-5xl' : 'text-4xl'}`}>
                           {currentSlide.title}
                        </h2>
                        <p className={`${accentText} font-bold text-sm uppercase tracking-wide`}>{currentSlide.subtitle}</p>
                     </div>
                  </div>
                  
                  <ul className={`space-y-4 text-gray-300 flex-1 overflow-y-auto slide-scroll pr-2 ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>
                    {currentSlide.items?.map((item, idx) => (
                      <li key={idx} className="flex items-start p-5 bg-[#0f1016] rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                          <span className={`${accentText} mr-6 font-mono font-bold opacity-60 group-hover:opacity-100`}>0{idx + 1}</span>
                          <span dangerouslySetInnerHTML={{ __html: item }} className="text-gray-200"></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- 6. CODE SLIDE --- */}
              {currentSlide.type === 'code' && (
                <div className="h-full flex flex-col">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-6">
                      <div>
                          <h2 className={`font-bold text-white ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
                             {currentSlide.title}
                          </h2>
                          {currentSlide.subtitle && <span className={`${accentText} font-bold text-xs mt-1 block uppercase tracking-wider`}>{currentSlide.subtitle}</span>}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
                         {currentSlide.language?.toUpperCase() || 'CODE'}
                      </span>
                   </div>
                  
                   <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-6">
                      <div className={`md:w-1/3 overflow-y-auto slide-scroll pr-2 space-y-3 ${isFullscreen ? 'text-lg' : 'text-base'}`}>
                         {currentSlide.description?.map((desc, idx) => (
                           <div key={idx} className={`p-4 bg-purple-500/5 border-l-2 ${accentBorder} text-sm font-medium text-gray-400 leading-relaxed`}>
                             {desc}
                           </div>
                         ))}
                      </div>

                      <div className="md:w-2/3 flex flex-col rounded-xl border border-white/10 bg-[#0B0C15] shadow-inner relative group">
                         <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-1.5">
                               <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <Terminal className="w-3 h-3 text-gray-600" />
                         </div>
                         <div className="flex-1 overflow-auto slide-scroll p-6">
                           <pre className={`font-mono leading-relaxed ${isFullscreen ? 'text-base' : 'text-sm'}`} dangerouslySetInnerHTML={{ __html: highlightedCode }}></pre>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* --- 7. TABLE SLIDE --- */}
              {currentSlide.type === 'table' && (
                <div className="h-full flex flex-col">
                  <h2 className={`font-bold text-white mb-2 ${isFullscreen ? 'text-5xl' : 'text-4xl'}`}>
                      {currentSlide.title}
                  </h2>
                  <p className={`${accentText} mb-6 font-bold text-sm uppercase tracking-wider`}>{currentSlide.subtitle}</p>

                   <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#0f1016]">
                       <div className="overflow-auto h-full slide-scroll">
                           <table className="w-full text-left border-collapse">
                               <thead className="sticky top-0 bg-[#1A1B26] z-10 shadow-sm">
                                   <tr>
                                       {currentSlide.tableHeaders?.map((header, idx) => (
                                           <th key={idx} className={`p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5`}>{header}</th>
                                       ))}
                                   </tr>
                               </thead>
                               <tbody className="text-gray-300 font-medium text-sm">
                                   {currentSlide.tableRows?.map((row, rIdx) => (
                                       <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                           {row.map((cell, cIdx) => (
                                               <td key={cIdx} className={`p-4 ${cell.includes('PASSED') ? 'text-green-400 font-bold' : ''}`}>
                                                   {cell.includes('PASSED') && <CheckCircle2 className="w-3 h-3 inline mr-2" />}
                                                   {cell}
                                               </td>
                                           ))}
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
                </div>
              )}

              {/* --- 8. IMAGE SLIDE --- */}
              {currentSlide.type === 'image' && (
                 <div className="h-full flex flex-col">
                    <div className="mb-6 border-b border-white/5 pb-4">
                       <h2 className={`font-bold text-white ${isFullscreen ? 'text-5xl' : 'text-4xl'}`}>
                          {currentSlide.title}
                       </h2>
                       {currentSlide.subtitle && <p className={`${accentText} font-bold text-sm mt-1 block uppercase tracking-wider`}>{currentSlide.subtitle}</p>}
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center bg-[#0B0C15] rounded-xl border border-white/5 p-8 overflow-hidden relative">
                         {/* Subtle grid pattern for diagram background */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        
                        <img
                            src={currentSlide.imageSrc}
                            alt={currentSlide.title}
                            className="max-h-full max-w-full object-contain shadow-2xl rounded-lg relative z-10"
                        />
                    </div>
                    {currentSlide.description && (
                        <div className="mt-4 p-4 bg-[#0f1016] border border-white/5 rounded-xl flex items-center gap-3">
                            <Zap className={`w-5 h-5 ${accentText}`} />
                            <p className="text-sm font-medium text-gray-400">{currentSlide.description[0]}</p>
                        </div>
                    )}
                 </div>
              )}

              {/* --- 9. WORKFLOW SLIDE --- */}
              {currentSlide.type === 'workflow' && (
                <div className="h-full flex flex-col">
                  <div className="mb-8 border-b border-white/5 pb-4">
                     <h2 className={`font-bold text-white mb-2 ${isFullscreen ? 'text-5xl' : 'text-4xl'}`}>
                        {currentSlide.title}
                     </h2>
                     <p className={`${accentText} font-bold text-sm uppercase tracking-wider`}>{currentSlide.subtitle}</p>
                  </div>

                  <div className="flex-1 grid grid-cols-7 gap-3 h-full content-start relative pt-8">
                    {/* Visual Connector Line */}
                    <div className="absolute top-[21%] left-10 right-10 h-0.5 bg-gray-800"></div>
                    
                    {currentSlide.workflowSteps?.map((step, i) => {
                      const isActive = i + 1 === activeStep;
                      const isPast = i + 1 < activeStep;
                      
                      const colorClass = {
                        blue: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
                        yellow: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
                        purple: 'text-purple-400 border-purple-500/50 bg-purple-500/10',
                        green: 'text-green-400 border-green-500/50 bg-green-500/10',
                        pink: 'text-pink-400 border-pink-500/50 bg-pink-500/10',
                        cyan: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
                      }[step.colorKey];

                      return (
                        <div key={i} className={`flex flex-col items-center text-center transition-all duration-500 relative group ${
                          isActive || isPast ? 'opacity-100' : 'opacity-40 blur-[1px]'
                        } ${isActive ? 'scale-105 z-10' : 'scale-100'}`}>
                          
                          {/* Step Circle */}
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm relative z-20 transition-all duration-300 ${
                            isActive ? 'bg-[#0B0C15] border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 
                            isPast ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-[#0B0C15] border-gray-800 text-gray-600'
                          }`}>
                              {isPast ? <CheckCircle2 className="w-5 h-5" /> : step.step}
                          </div>
                          
                          {/* Card */}
                          <div className={`mt-6 p-4 rounded-xl border w-full h-56 flex flex-col justify-between transition-all duration-300 bg-[#0f1016] ${
                            isActive ? `${colorClass} shadow-lg` : 'border-white/5 text-gray-500'
                          }`}>
                              <div>
                                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>{step.title}</h3>
                                  <p className="text-[11px] leading-relaxed font-medium">{step.description}</p>
                              </div>
                              <div className="mt-2 pt-2 border-t border-white/5">
                                <code className="text-[9px] font-mono block truncate opacity-70">
                                  {step.codeFocus}
                                </code>
                              </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Controls hint */}
                  <div className="mt-auto text-center text-xs text-gray-600 font-mono">
                    Use Arrow Keys to navigate workflow steps ({activeStep}/{currentSlide.workflowSteps?.length})
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* FOOTER METADATA (App Status Bar Style) */}
          <div className="bg-[#0f1016] border-t border-white/5 px-6 py-3 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest z-20">
             <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 ${accentText}`}>
                   <Layers className="w-3 h-3" />
                   <span>{isAnalysis ? 'Phase: Analysis' : 'Phase: Architecture'}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                   <GitCommit className="w-3 h-3" />
                   <span>Branch: main</span>
                </div>
             </div>
            
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/5">
                  <button onClick={prevSlide} className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30">
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="mx-2 text-white tabular-nums">
                    {currentSlide.type === 'workflow' ? `${activeStep}.${currentSlide.workflowSteps!.length}` : `${currentSlideIndex + 1} / ${slides.length}`}
                  </span>
                  
                  <button onClick={nextSlide} className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-30">
                     <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <button onClick={toggleFullscreen} className="hover:text-white transition-colors" title="Toggle Fullscreen">
                   {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Slides;