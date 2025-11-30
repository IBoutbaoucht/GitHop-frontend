import { useState, useEffect, useRef, useMemo } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// --- TYPES ---
type SlideType = 'title' | 'simple' | 'list' | 'image' | 'code';

interface Quote {
  text: string;
  author: string;
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
}

// --- DATA: GITHOP DESIGN PATTERNS ---
const slides: SlideData[] = [
  {
    type: 'title',
    title: 'GitHop',
    subtitle: 'Design Patterns & Architecture',
    developers: ['Oussama Yaqdane', 'Mohamed Taib Lkanit']
  },
  {
    type: 'simple',
    title: 'Architecture Overview',
    content: 'A deep dive into the structural, behavioral, and creational patterns that power GitHop.'
  },
  {
    type: 'code',
    title: 'Singleton Pattern',
    language: 'typescript',
    description: [
      'Type: Creational',
      'Ensures a class has only one instance and provides a global point of access.',
      'Used for GitHubService and Database Pool to prevent resource exhaustion.'
    ],
    code: `// src/services/githubService.ts
class GitHubService {
  // ... Implementation ...
}
// THE SINGLETON INSTANTIATION
export default new GitHubService(); 

// src/db.ts
const pool = new Pool({ ... });
// THE SINGLETON EXPORT
export default pool;`
  },
  {
    type: 'code',
    title: 'Strategy Pattern',
    language: 'typescript',
    description: [
      'Type: Behavioral',
      'Defines a family of algorithms and makes them interchangeable.',
      'The Context (WorkerService) dynamically chooses between full refresh vs partial update strategies.'
    ],
    code: `// THE STRATEGIES (Different Algorithms)
import readmeWorker from "./fetchings/readmeWorker";
import commitWorker from "./fetchings/commitWorker";

// THE CONTEXT (src/services/workerService.ts)
public async runAllJobs(forceUpdateAll = false): Promise<void> {
    await this.hydrateStubs(); // Strategy 1
    
    if (forceUpdateAll) {
        await this.updateAllRecentCommits(); // Strategy 2
        await this.updateAllCommitActivity(); // Strategy 3
    } else {
        await this.updateMissingRecentCommits(); // Strategy 2 (Variant)
    }
}`
  },
  {
    type: 'code',
    title: 'Adapter Pattern',
    language: 'typescript',
    description: [
      'Type: Structural',
      'Converts the interface of a class into another interface the client expects.',
      'Translates raw BigQuery data (star_count) into our internal domain model (stargazers_count).'
    ],
    code: `// src/services/newService.ts
public async syncTrendsFromGHArchive(days: number, tag: string): Promise<void> {
    // 1. THE ADAPTEE (Raw BigQuery Data)
    const [rows] = await job.getQueryResults();

    // 2. THE ADAPTER LOGIC (Transform)
    const rawRepos = rows.map((row: any) => ({
        full_name: row.full_name,
        // Mapping 'star_count' to 'stargazers_count'
        stargazers_count: row.star_count 
    }));

    // 3. TARGET INTERFACE (DB Saver)
    await this.fetchDetailsAndSave(rawRepos, tag);
}`
  },
  {
    type: 'code',
    title: 'Observer Pattern',
    language: 'typescript',
    description: [
      'Type: Behavioral',
      'Defines a subscription mechanism to notify multiple objects about events.',
      'The logging system subscribes to database states (connect/error) for real-time visibility.'
    ],
    code: `// src/db.ts

// THE SUBJECT (The Database Pool)
const pool = new Pool({ ... });

// THE OBSERVERS (Event Listeners)
pool.on('connect', () => {
  console.log("✅ Database client connected");
});

pool.on('error', (err) => {
  console.error("❌ Unexpected error on idle client", err);
});`
  },
  {
    type: 'code',
    title: 'Chain of Responsibility',
    language: 'typescript',
    description: [
      'Type: Behavioral',
      'Passes a request along a chain of handlers.',
      'AI Service tries the fast "Flash" model first. If it fails, it falls back to the robust "Pro" model.'
    ],
    code: `// src/services/aiServices/aiService.ts
try {
    // HANDLER 1: Fast/Cheap Model
    return await tryModel("gemini-2.0-flash");
} catch (error: any) {
    console.warn(\`⚠️ Flash failed... Retrying...\`);
    
    try {
        // HANDLER 2: Fallback Model
        return await tryModel("gemini-pro");
    } catch (fallbackError: any) {
        console.error("❌ All AI models failed.");
        return "Summary unavailable...";
    }
}`
  },
  {
    type: 'code',
    title: 'Builder Pattern',
    language: 'typescript',
    description: [
      'Type: Creational',
      'Constructs complex objects (SQL Queries) step-by-step.',
      'Dynamically appends WHERE clauses based on user intent rather than using one monolithic query.'
    ],
    code: `// src/services/aiServices/searchAgentService.ts

// 1. BASE
let sql = \`SELECT ... FROM repositories WHERE 1=1\`;
const params: any[] = [JSON.stringify(queryEmbedding)];

// 2. STEP-BY-STEP CONSTRUCTION
if (intent.filters.language) {
    sql += \` AND language ILIKE $\${idx}\`;
    params.push(intent.filters.language);
}
if (intent.filters.minStars) {
    sql += \` AND stars_count >= $\${idx}\`;
    params.push(intent.filters.minStars);
}

// 3. FINALIZE
sql += \` ORDER BY similarity DESC LIMIT 30\`;`
  },
  {
    type: 'code',
    title: 'Template Method',
    language: 'typescript',
    description: [
      'Type: Behavioral',
      'Defines the skeleton of an algorithm in a method, deferring some steps to subclasses or parameters.',
      'Weekly and Monthly syncs reuse the same core logic structure.'
    ],
    code: `// src/services/newService.ts

// THE TEMPLATE (The Skeleton)
public async syncTrends(days: number, tag: string): Promise<void> {
    // Step 1: Calculate Date Range
    // Step 2: Query BigQuery
    // Step 3: Enrich and Save Data
}

// THE IMPLEMENTATIONS
public async syncWeekly() { 
    await this.syncTrends(7, 'trending_weekly'); 
}
public async syncMonthly() { 
    await this.syncTrends(30, 'trending_monthly'); 
}`
  },
  {
    type: 'code',
    title: 'Facade Pattern',
    language: 'typescript',
    description: [
      'Type: Structural',
      'Provides a simplified interface to a complex system.',
      'WorkerService hides the complexity of managing 4 different worker types, hydration, and update modes.'
    ],
    code: `// src/services/workerService.ts

// THE FACADE INTERFACE
public async runAllJobs(forceUpdateAll = false): Promise<void> {
    console.log(\`🚀 Starting ALL background jobs...\`);
    
    // Complex logic hidden behind one method call
    await this.hydrateStubs();
    
    if (forceUpdateAll) {
        await this.updateAllRecentCommits();
        await this.updateAllContributors();
    }
    // ...
}`
  },
  {
    type: 'simple',
    title: 'Summary',
    content: 'Robust Architecture = Scalable Software. Thank you.'
  }
];

function Slides() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentSlideIndex];
  const progressPercentage = ((currentSlideIndex + 1) / slides.length) * 100;

  // --- LOGIC ---

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
    if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1);
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
  }, [currentSlideIndex]);

  // --- RENDER ---

  return (
    <>
      <style>{`
        /* Scrollbar styled with GitHop Purple/Pink */
        .code-scroll::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .code-scroll::-webkit-scrollbar-track {
          background: #111827; /* Gray-900 */
        }
        .code-scroll::-webkit-scrollbar-thumb {
          background: #374151; /* Gray-700 */
          border-radius: 4px;
        }
        .code-scroll::-webkit-scrollbar-thumb:hover {
          background: #9333ea; /* Purple-600 */
        }
        
        .hljs {
          background: transparent !important;
        }

        /* Glassmorphism Card Style */
        .githop-card {
           background: rgba(17, 24, 39, 0.7); /* gray-900 / 0.7 */
           backdrop-filter: blur(16px);
           -webkit-backdrop-filter: blur(16px);
           border: 1px solid rgba(255, 255, 255, 0.05); /* border-white/5 */
        }

        /* Ambient Background Animation */
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .blob {
          animation: float 10s infinite ease-in-out;
        }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeSlide 0.4s ease-out forwards;
        }
      `}</style>

      {/* MAIN CONTAINER: Global App Background #0B0C15 */}
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#0B0C15] p-4 font-sans text-gray-300 relative overflow-hidden">
        
        {/* AMBIENT BACKGROUND BLOBS (To pop the glass effect) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] blob" style={{ animationDelay: '2s' }}></div>

        {/* SLIDE CARD */}
        <div 
          ref={containerRef}
          className={`flex flex-col githop-card transition-all duration-300 overflow-hidden ${
            isFullscreen 
              ? 'w-full h-full rounded-none' 
              : 'w-full max-w-6xl aspect-video shadow-[0_0_40px_rgba(147,51,234,0.15)] rounded-2xl relative'
          }`}
        >
          {/* Progress Bar Container */}
          <div className="h-1 bg-gray-900 w-full shrink-0">
            {/* Gradient Progress: Purple-600 to Pink-600 */}
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_10px_rgba(192,132,252,0.5)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Slide Content Area */}
          <div className="flex-1 p-12 flex flex-col relative z-10">
            
            <div key={currentSlideIndex} className="h-full flex flex-col w-full animate-fade-in">
              
              {/* === TITLE SLIDE === */}
              {currentSlide.type === 'title' && (
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <div className="mb-6 p-4 rounded-full bg-purple-500/10 border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                     {/* Logo Icon Placeholder */}
                     <svg className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                     </svg>
                  </div>

                  {/* GitHop Gradient Text */}
                  <h1 className={`font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                    isFullscreen ? 'text-9xl' : 'text-8xl'
                  }`}>
                    {currentSlide.title}
                  </h1>

                  <h2 className={`text-blue-400 mb-12 font-medium tracking-wide uppercase transition-all duration-300 ${
                    isFullscreen ? 'text-4xl' : 'text-2xl'
                  }`}>
                    {currentSlide.subtitle}
                  </h2>

                  <div className="flex gap-6">
                    {currentSlide.developers?.map(dev => (
                      <span key={dev} className={`px-6 py-2 bg-gray-800/80 border border-white/5 text-gray-300 rounded-full hover:border-purple-500/50 hover:text-white transition-all duration-300 cursor-default shadow-lg ${
                        isFullscreen ? 'text-2xl' : 'text-base'
                      }`}>
                        {dev}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* === LIST SLIDE === */}
              {currentSlide.type === 'list' && (
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <h2 className={`font-bold mb-8 pb-4 border-b border-white/5 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                    isFullscreen ? 'text-6xl' : 'text-4xl'
                  }`}>
                    {currentSlide.title}
                  </h2>

                  <ul className={`space-y-6 text-gray-300 flex-1 overflow-y-auto transition-all duration-300 ${
                    isFullscreen ? 'text-3xl' : 'text-xl'
                  }`}>
                    {currentSlide.items?.map((item, idx) => (
                      <li key={idx} className="flex items-start group">
                         {/* Bullet: Pink Arrow */}
                         <span className="text-pink-500 mr-4 mt-1 transition-transform group-hover:translate-x-1">➤</span>
                         <span 
                           dangerouslySetInnerHTML={{ __html: item }} 
                           className="group-hover:text-white transition-colors"
                         ></span>
                      </li>
                    ))}
                  </ul>

                  {currentSlide.quote && (
                    <div className={`mt-8 p-6 bg-gray-800/50 border-l-4 border-purple-500 italic text-gray-300 rounded-r-lg shadow-lg transition-all duration-300 backdrop-blur-sm ${
                      isFullscreen ? 'text-2xl' : 'text-base'
                    }`}>
                       <span className="text-purple-400 text-2xl mr-2">"</span>
                       {currentSlide.quote.text}
                       <span className="text-purple-400 text-2xl ml-1">"</span>
                       <div className={`mt-3 font-bold not-italic text-blue-400 uppercase tracking-wide flex items-center gap-2 ${
                         isFullscreen ? 'text-lg' : 'text-sm'
                       }`}>
                          <span className="h-[1px] w-8 bg-blue-400"></span>
                          {currentSlide.quote.author}
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* === CODE SLIDE === */}
              {currentSlide.type === 'code' && (
                <div className="h-full flex flex-col">
                   {/* Header Row */}
                   <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-6">
                      <h2 className={`font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                        isFullscreen ? 'text-5xl' : 'text-3xl'
                      }`}>
                         {currentSlide.title}
                      </h2>
                      {/* Lang Badge */}
                      <span className={`text-blue-400 font-mono bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md ${
                        isFullscreen ? 'text-base' : 'text-xs'
                      }`}>
                         {currentSlide.language || 'AUTO'}
                      </span>
                   </div>
                   
                   <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-8">
                      {/* Description Panel */}
                      <div className={`md:w-4/12 overflow-y-auto text-gray-300 space-y-4 pr-2 transition-all duration-300 ${
                        isFullscreen ? 'text-2xl' : 'text-lg'
                      }`}>
                         {currentSlide.description?.map((desc, idx) => (
                           <div key={idx} className="relative pl-4 border-l-2 border-gray-700 hover:border-pink-500 transition-colors">
                             <p className="leading-relaxed">{desc}</p>
                           </div>
                         ))}
                      </div>

                      {/* Code Editor Window */}
                      <div className="md:w-8/12 bg-[#1f2937] rounded-xl border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                         {/* Editor Header */}
                         <div className="bg-[#111827] px-4 py-3 flex gap-2 border-b border-white/5 items-center">
                           <div className="flex gap-2 mr-4">
                              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                           </div>
                           <span className="text-xs text-gray-500 font-mono">src/{currentSlide.title.toLowerCase().replace(/\s+/g, '-')}.ts</span>
                         </div>

                         {/* Code Content */}
                         <div className="overflow-auto code-scroll flex-1 p-6 bg-[#0d1117]/50">
                           <pre 
                             className={`hljs bg-transparent font-mono whitespace-pre !p-0 transition-all duration-300 ${
                               isFullscreen ? 'text-lg' : 'text-sm'
                             }`}
                             dangerouslySetInnerHTML={{ __html: highlightedCode }}
                           ></pre>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* === IMAGE SLIDE === */}
              {currentSlide.type === 'image' && (
                 <div className="h-full flex flex-col">
                    <h2 className={`font-bold mb-6 border-b border-white/5 pb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
                      isFullscreen ? 'text-5xl' : 'text-3xl'
                    }`}>
                       {currentSlide.title}
                    </h2>
                    <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded-xl border border-white/5 relative group p-2">
                       {/* Corner Accents (Purple/Pink) */}
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500 rounded-tl-lg"></div>
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500 rounded-br-lg"></div>
                       
                       <div className="text-center w-full h-full flex items-center justify-center p-4">
                          <img 
                            src={currentSlide.imageSrc} 
                            alt={currentSlide.title}
                            className="max-h-[60vh] max-w-full object-contain shadow-2xl rounded-lg border border-white/5 group-hover:scale-[1.01] transition-transform duration-500"
                          />
                       </div>
                    </div>
                 </div>
              )}

              {/* === SIMPLE SLIDE === */}
              {currentSlide.type === 'simple' && (
                 <div className="h-full flex flex-col justify-center items-center text-center p-12">
                    <h2 className={`font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 ${
                      isFullscreen ? 'text-8xl' : 'text-6xl'
                    }`}>
                       {currentSlide.title}
                    </h2>
                    {currentSlide.content && (
                      <p className={`text-gray-300 max-w-4xl font-light leading-relaxed border-t border-b border-white/5 py-10 transition-all duration-300 ${
                        isFullscreen ? 'text-5xl' : 'text-3xl'
                      }`}>
                         {currentSlide.content}
                      </p>
                    )}
                 </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-[#111827]/90 border-t border-white/5 p-4 flex justify-between items-center text-gray-500 text-sm font-mono shrink-0 backdrop-blur-md z-20">
             <div className="flex items-center gap-3">
                {/* Active Indicator Pulse (Green-400) */}
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="tracking-widest text-gray-400 uppercase">GITHOP v2.0</span>
             </div>
             
             <div className="flex gap-4 items-center">
                <button 
                  onClick={toggleFullscreen} 
                  className="p-2 rounded-full hover:bg-white/5 hover:text-purple-400 transition-colors duration-200" 
                  title="Toggle Fullscreen (F)"
                >
                   {!isFullscreen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                   )}
                </button>

                <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1 border border-white/5">
                  <button 
                    onClick={prevSlide} 
                    disabled={currentSlideIndex === 0}
                    className="p-1 rounded hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                     </svg>
                  </button>
                  
                  <span className="text-gray-300 mx-2 text-xs">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  
                  <button 
                    onClick={nextSlide} 
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-1 rounded hover:text-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                     </svg>
                  </button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Slides;