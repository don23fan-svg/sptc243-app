import { useState, useEffect, useRef } from "react";

const MODULES = [
  {
    id: 1,
    title: "The Convergence Wave",
    subtitle: "Why Everything Is About to Change — Fast",
    icon: "⚡",
    color: "#FF3B30",
    week: "Weeks 2–3",
    book: "Ch 1–4: Convergence, Exponential Tech, Acceleration of Acceleration",
    bookNote: "Part 1 lays the foundation: Moore's Law, exponential vs linear thinking, key technologies growing exponentially. The holy shit moment: it's not any single tech — it's what happens when they CONVERGE.",
    events: [
      "Track Moore's Law: latest GPU vs 5 years ago",
      "ChatGPT adoption — 2 months to 100M users",
      "Diamandis's Moonshots podcast weekly",
      "CES 2025 sports tech vs book's 2020 predictions"
    ],
    concepts: [
      {
        name: "Exponential vs Linear Thinking",
        desc: "30 linear steps = 30 meters. 30 exponential steps = around Earth 26 times. Technologies reshaping your career grow exponentially, not linearly.",
        sport: "2019: AI couldn't write a recap. 2023: AP generates thousands of minor league summaries. 2025: personalized highlights, multilingual commentary, and real-time analytics simultaneously.",
        insight: "The book opens with this because everything depends on it. Moore's Law repeats across AI, sensors, bandwidth, and storage."
      },
      {
        name: "The Power of Convergence",
        desc: "When AI converges with sensors, VR, networks, and robotics simultaneously, the result is multiplicative, not additive.",
        sport: "One NFL broadcast in 2025: AI cameras + RFID tracking + AR overlays + auto highlights + personalized betting feeds. None existed together a decade ago.",
        insight: "Central thesis: don't study technologies in isolation — study how they crash into each other."
      },
      {
        name: "The Six D's of Disruption",
        desc: "Digitization → Deception → Disruption → Demonetization → Dematerialization → Democratization.",
        sport: "Sports journalism: Digitized → Deceptive (blogs minor) → Disrupted (layoffs) → Demonetized (free content) → Dematerialized → Democratized (anyone with phone + AI = creator).",
        insight: "Most sports media is in Disruption-to-Demonetization. Know where your career sits on this curve."
      }
    ],
    quiz: [
      { q: "Technology doubling yearly — power after 10 years?", o: ["10x", "100x", "~1,000x", "20x"], a: 2 },
      { q: "What makes convergence powerful?", o: ["Cheaper", "Multiple exponentials = multiplicative change", "Slower", "One industry"], a: 1 },
      { q: "'Deception' in Six D's means:", o: ["Companies lying", "Early growth that looks flat", "Consumers tricked", "AI misinfo"], a: 1 }
    ]
  },
  {
    id: 2,
    title: "AI Foundations for Sports Media",
    subtitle: "What AI Actually Is — and Isn't",
    icon: "🧠",
    color: "#007AFF",
    week: "Weeks 3–5",
    book: "Ch 5–8: Shopping, Advertising, Entertainment, Education",
    bookNote: "Every transformation in retail, advertising, entertainment is ALSO happening in sports — often faster due to live data, passionate fans, massive economics.",
    events: [
      "Compare ChatGPT/Grok/Gemini/Claude on same sports prompt",
      "ESPN, Fox, The Athletic deploying AI in newsrooms",
      "AI sports market: $8.9B (2024) → $27B (2030)",
      "WEF 2025 paper: AI in Media & Sport"
    ],
    concepts: [
      {
        name: "The 'AI or Not AI' Test",
        desc: "AI = pattern recognition at scale. ML learns from data. GenAI creates content. Most sports 'AI' claims are marketing — know the difference.",
        sport: "Hawk-Eye = real AI. AI recaps = real GenAI. 'AI picks' averaging stats = hype.",
        insight: "AI's real power: personalization at scale — different content for every fan simultaneously."
      },
      {
        name: "AI Use Cases in Sports Media",
        desc: "AI across the value chain: content creation, production, distribution, analytics, business ops.",
        sport: "FOX CTO at CES 2025: natural language queries against footage. AWS: 1M+ data points per F1 race. 81% of execs expanded AI in 2025.",
        insight: "Not experimental — operational. 75% of pro teams use real-time AI analytics."
      },
      {
        name: "AI as Co-Pilot",
        desc: "AI eliminates commodity work, amplifies creativity. AP uses AI for recaps no human would write — best storytelling is more valued than ever.",
        sport: "Teams need humans to interpret data, tell stories, build relationships, make judgment calls. Roles changed, didn't disappear.",
        insight: "Course AI Scale (Levels 1–5) mirrors the industry: know when AI brainstorms, edits, or co-pilots."
      }
    ],
    quiz: [
      { q: "Core function of machine learning:", o: ["Pre-programmed rules", "Learning patterns from data", "Replacing workers", "Text only"], a: 1 },
      { q: "'AI picks' using simple averages is:", o: ["Cutting-edge", "Marketing hype", "ML at work", "GenAI"], a: 1 },
      { q: "% of execs expanding AI in 2025:", o: ["~25%", "~50%", "~81%", "~95%"], a: 2 }
    ]
  },
  {
    id: 3,
    title: "AI Presentations & Hands-On",
    subtitle: "From Theory to Practice",
    icon: "🎯",
    color: "#5856D6",
    week: "Weeks 5–7",
    book: "Ch 9–14: Healthcare, Food, Finance, Threats, Migrations",
    bookNote: "Later chapters expand the lens. Same pattern everywhere: exponential + convergence = disruption. Ch 13–14 on threats and migrations: it's not all positive.",
    events: [
      "Students present use cases from Sportico/SportsTechie",
      "Guest speakers: ground truth vs hype",
      "Hands-on: AI tools for a broadcast package",
      "Sportradar acquires Vaix for AI highlights (2025)"
    ],
    concepts: [
      {
        name: "Building an AI Use Case",
        desc: "Framework: Problem → AI solution → Evidence → Risks. Identify real value vs hype.",
        sport: "WSC Sports: AI generates personalized highlights across NBA, NFL, hundreds of leagues. Solves content-at-scale humans can't.",
        insight: "Great analysis = understanding business models. WHO pays? WHY better? HOW scales?"
      },
      {
        name: "AI Tool Fluency",
        desc: "Using AI ≠ knowing about AI. Fluency = prompting, comparing tools, evaluating outputs.",
        sport: "Same game, same prompt, four tools. Compare accuracy, engagement, hallucinations.",
        insight: "Ch 13: AI hallucinates. Verifying output is YOUR value."
      },
      {
        name: "Cross-Industry Convergence",
        desc: "Healthcare/food/finance disruption patterns hit sports too. Don't just see the sports angle.",
        sport: "Healthcare AI → Zone7 injury prediction. Food tech → automated concessions. Fintech → betting + tokenized ownership.",
        insight: "Disruption doesn't stay in its lane. Cross-industry awareness = competitive advantage."
      }
    ],
    quiz: [
      { q: "Strong AI use case includes:", o: ["Cool tech only", "Problem, solution, evidence, limits", "Marketing copy", "Tech details only"], a: 1 },
      { q: "Test same prompt across tools because:", o: ["Waste time", "Compare accuracy & catch hallucinations", "Identical answers", "One is correct"], a: 1 },
      { q: "Other industry chapters matter because:", o: ["They don't", "Same patterns disrupt all industries", "Sports is immune", "Only finance"], a: 1 }
    ]
  },
  {
    id: 4,
    title: "Blockchain, NFTs & Creators",
    subtitle: "Owning the Game — New Value Models",
    icon: "⛓️",
    color: "#FF9500",
    week: "Week 9",
    book: "Ch 3 (Blockchain) & Ch 12 (Finance)",
    bookNote: "Blockchain as exponential tech disrupting finance. In sports: NFTs (hype wave), tokenized engagement (ongoing), creator economy (structural shift).",
    events: [
      "NBA Top Shot: peak → sustainable model",
      "Athlete media: LeBron, Durant, McAfee",
      "PlayersTV + AI ad-insertion (2024)",
      "Socios fan tokens in European football"
    ],
    concepts: [
      {
        name: "Blockchain Beyond Hype",
        desc: "Trustless verification — no intermediary needed. Sports: collectibles, tickets, revenue sharing, achievements.",
        sport: "NBA Top Shot: $700M+ in highlight NFTs. Bubble burst, but digital ownership evolved into sustainable models.",
        insight: "Followed Six D's: Digitized → Deceptive → Disrupted → Demonetizing. Democratization next."
      },
      {
        name: "The Creator Economy",
        desc: "Structural shift: athletes/creators reach audiences directly, bypassing traditional media.",
        sport: "McAfee → ESPN. LeBron (Uninterrupted), Durant (Boardroom) compete with traditional outlets.",
        insight: "One creator with AI in 2025 = a full production team in 2020."
      },
      {
        name: "Tokenized Fan Engagement",
        desc: "Fans with verifiable stakes: voting, rewards, ownership. Already live in European football.",
        sport: "Socios: Barcelona, Juventus, PSG, 100+ orgs. Token holders vote on club decisions.",
        insight: "Digital ownership stakes shift the power dynamic between leagues, media, and fans."
      }
    ],
    quiz: [
      { q: "Blockchain's key capability:", o: ["Speed", "Trustless verification without intermediaries", "Video quality", "Payments only"], a: 1 },
      { q: "Creator economy is structural because:", o: ["Better writing", "Athletes bypass gatekeepers entirely", "Media shut down", "Temporary"], a: 1 },
      { q: "NBA Top Shot & Six D's:", o: ["No pattern", "Digitized → Deceptive → Disrupted → Demonetizing", "Stable", "Only Disruption"], a: 1 }
    ]
  },
  {
    id: 5,
    title: "Immersive: AR, VR & Metaverse",
    subtitle: "The Future of Being a Fan",
    icon: "🥽",
    color: "#AF52DE",
    week: "Week 10",
    book: "Ch 2–3 (VR/AR) & Ch 8 (Entertainment)",
    bookNote: "VR/AR approaching tipping point. Entertainment chapter predicts immersive, personalized experiences replacing one-size-fits-all broadcasts.",
    events: [
      "Apple Vision Pro sports viewing",
      "Cosm LED dome venues (2024, LA)",
      "Meta AR glasses + NFL (2025)",
      "Fortnite/Roblox sports activations"
    ],
    concepts: [
      {
        name: "VR/AR Inflection Point",
        desc: "Years of 'deceptive' phase → rapid explosion. Quality, content, price converging.",
        sport: "NBA VR via Meta Quest. Apple Vision Pro spatial multi-game. Cosm 360° dome. Products, not prototypes.",
        insight: "Better displays + 5G + AI adaptation + spatial computing = new medium beyond TV or attending."
      },
      {
        name: "Digital Twins & Virtual Venues",
        desc: "AI replicas of stadiums, players, scenarios for simulation and new fan experiences.",
        sport: "NFL 'Digital Athlete' predicts injuries. Digital stadiums = infinite seats.",
        insight: "Dematerialization: digital copies dissolve physical constraints."
      },
      {
        name: "Virtual-First Fandom",
        desc: "Gen Z/Alpha found sports through gaming. EA Sports FC IS soccer for many.",
        sport: "Fortnite: tens of millions at live events. Roblox has league partnerships. Fans who may never watch traditional broadcasts.",
        insight: "Your future audience may never have experienced sports primarily through broadcast TV."
      }
    ],
    quiz: [
      { q: "VR/AR inflection because:", o: ["Dying", "Quality + content + price + networks converging", "Gaming only", "Too expensive"], a: 1 },
      { q: "Digital twin:", o: ["Backup player", "AI replica for simulation", "Duplicate feed", "Social account"], a: 1 },
      { q: "Virtual-first fandom matters:", o: ["TV dominates", "Younger fans may never use broadcasts", "No spending", "Esports only"], a: 1 }
    ]
  },
  {
    id: 6,
    title: "Disrupting Sports Business",
    subtitle: "How Money Moves Now",
    icon: "💰",
    color: "#34C759",
    week: "Weeks 11–12",
    book: "Full book synthesis applied to sports business",
    bookNote: "Apply the complete framework: how convergence reshapes money flows in sports. Midterm territory.",
    events: [
      "NFL $113B rights across 8+ platforms",
      "Netflix live sports push",
      "AI dynamic pricing → 2026 World Cup",
      "Betting integration everywhere"
    ],
    concepts: [
      {
        name: "Unbundling Sports Rights",
        desc: "One-network exclusivity → multi-platform. More total revenue, more complexity.",
        sport: "NFL 2025: CBS, Fox, NBC, ESPN, Amazon, Netflix, Peacock, YouTube. ~$113B through 2033.",
        insight: "Old model Demonetizes per-viewer while ecosystem generates more total."
      },
      {
        name: "Betting as Content",
        desc: "Changed what content IS. Every broadcast integrates odds and AI probability.",
        sport: "DraftKings/FanDuel billions in content. In-game micro-betting fastest segment.",
        insight: "AI + mobile + sensors + legalization = entirely new industry from nothing in 10 years."
      },
      {
        name: "Athletes as Media Companies",
        desc: "Leagues/teams/athletes build direct audiences, capture broadcaster revenue.",
        sport: "Every league has its own platform. Athletes with massive followings ARE media companies.",
        insight: "Democratization: accessible tools → gatekeepers lose power."
      }
    ],
    quiz: [
      { q: "Unbundling is significant:", o: ["Less revenue", "More revenue, fragmented audiences", "NFL only", "Free sports"], a: 1 },
      { q: "Betting changed content:", o: ["No change", "Data/probability = core content", "Gambling only", "Shorter"], a: 1 },
      { q: "Athletes as media companies:", o: ["Quit sports", "Direct audiences, no intermediaries", "Instagram only", "Always existed"], a: 1 }
    ]
  },
  {
    id: 7,
    title: "Ethics, Deepfakes & Dark Side",
    subtitle: "Chapter 13 — What Could Go Wrong",
    icon: "⚖️",
    color: "#FF2D55",
    week: "Weeks 11–12",
    book: "Chapter 13: Threats",
    bookNote: "Reality check after 12 optimistic chapters. Deepfakes, displacement, privacy, bias — all manifesting in sports.",
    events: [
      "Deepfake athlete videos spreading",
      "EU AI Act (2025) + sports biometrics",
      "22% of sports AI uploads = sensitive data",
      "AI bias: under-representing women's sports"
    ],
    concepts: [
      {
        name: "Deepfakes in Sports",
        desc: "Realistic fake athlete video/audio. Risks: betting manipulation, defamation, trust erosion.",
        sport: "Deepfake athlete statements gone viral. Fake injury reports could move billion-dollar markets.",
        insight: "Same tech enabling content enables deception at scale. Media literacy = survival."
      },
      {
        name: "Data Privacy & Athlete Rights",
        desc: "24/7 tracking via wearables. Performance vs ownership. Legal frameworks lag.",
        sport: "22% of sports AI uploads = sensitive biometrics. Unions push back. EU AI Act adds complexity.",
        insight: "Collection tech accelerates faster than governance. Bridging = invaluable skill."
      },
      {
        name: "Algorithmic Bias",
        desc: "AI trained on biased history inherits bias. Under-represents women's sports, smaller leagues.",
        sport: "Highlight algorithms deprioritize women's sports because training data reflects decades of unequal coverage.",
        insight: "Technology isn't neutral. Inclusive AI = larger audiences + regulatory compliance."
      }
    ],
    quiz: [
      { q: "Deepfakes dangerous in sports:", o: ["Bad highlights", "Manipulate betting & erode trust", "Too expensive", "Amateur only"], a: 1 },
      { q: "Core privacy tension:", o: ["No useful data", "Tech faster than legal frameworks", "Only owners care", "Not a concern"], a: 1 },
      { q: "AI bias:", o: ["Always neutral", "Biased data → self-reinforcing cycles", "Human only", "By design"], a: 1 }
    ]
  },
  {
    id: 8,
    title: "Convergence & Your Career",
    subtitle: "Five Migrations — Your Place In It",
    icon: "🚀",
    color: "#00C7BE",
    week: "Weeks 12–15",
    book: "Ch 14: Five Migrations + Full Synthesis",
    bookNote: "Five migrations: virtual worlds and meta-intelligence are happening NOW in sports. Final presentations synthesize the entire framework.",
    events: [
      "Future job board: postings that didn't exist 5 years ago",
      "Score Diamandis's 2020 predictions",
      "AI agents managing athlete media autonomously?"
    ],
    concepts: [
      {
        name: "Five Migrations & Sports",
        desc: "Virtual worlds + meta-intelligence directly predict current sports trends.",
        sport: "Gen Alpha in gaming. AI coaching merges humans with machines. Smart cities with AI sports infrastructure.",
        insight: "Position where human creativity meets AI capability."
      },
      {
        name: "Emerging Roles",
        desc: "New careers blending tech, media, business, domain expertise.",
        sport: "Sports AI PM, Fan Experience Technologist, Data Ethicist, Athlete Brand Strategist — none existed 2019.",
        insight: "Build versatile skill stacks for roles not yet invented. T-shaped professional."
      },
      {
        name: "Build in Public — Start Now",
        desc: "Portfolio > credentials. Same disruption = your tools to build.",
        sport: "Sports analytics blog, AI content, niche podcast. Tools are free. Barrier = willingness.",
        insight: "Same forces disrupting industry lower barriers to building your own."
      }
    ],
    quiz: [
      { q: "Which migration reshapes fandom?", o: ["Climate", "Space", "Virtual worlds", "None"], a: 2 },
      { q: "T-shaped professional:", o: ["Tech only", "Deep + broad across fields", "No specialization", "Multiple sports"], a: 1 },
      { q: "Key career takeaway:", o: ["All jobs gone", "One AI tool", "Skills at human creativity × AI", "Doesn't apply"], a: 2 }
    ]
  }
];

const DISCUSSIONS = [
  { p: "If AI generates a perfect recap in 3 seconds, what unique value does a human journalist bring?", w: "Weeks 2–3", t: "AI & Content" },
  { p: "Walk your favorite sport through the Six D's. Where on the curve?", w: "Weeks 2–3", t: "Framework" },
  { p: "Pick one 2019 prediction from Ch 1–8. Right, wrong, or partial?", w: "Weeks 3–5", t: "Book Analysis" },
  { p: "$1M budget: AI tools, immersive tech, analytics, or talent?", w: "Weeks 5–7", t: "Strategy" },
  { p: "Should athletes veto commercial use of biometric data?", w: "Week 9", t: "Ethics" },
  { p: "Pat McAfee: replicable model or one-time? What would YOU build?", w: "Week 9", t: "Creator Economy" },
  { p: "Gen Alpha: screens or stadiums? Business implications?", w: "Week 10", t: "Immersive" },
  { p: "Deepfakes: existential or overblown? Position with examples.", w: "Weeks 11–12", t: "Ethics" },
  { p: "Design your ideal job 5 years out. Title, skills, exists today?", w: "Weeks 12–15", t: "Career" },
  { p: "60-second course thesis for someone who hasn't taken it.", w: "Week 15", t: "Synthesis" }
];

const SOURCES = [
  { n: "Techmeme", d: "Real-time tech news", u: "techmeme.com" },
  { n: "Sportico", d: "Sports business intelligence", u: "sportico.com" },
  { n: "SportsTechie", d: "Sports tech coverage", u: "sportstechie.com" },
  { n: "Sports Business Journal", d: "Industry reporting", u: "sportsbusinessjournal.com" },
  { n: "Moonshots Podcast", d: "Diamandis on exponential tech", u: "diamandis.com/podcast" },
  { n: "Sports Video Group", d: "Broadcast & production tech", u: "sportsvideo.org" },
  { n: "WEF AI in Sport", d: "2025 white paper", u: "weforum.org" }
];

function Bg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let frame;
    const ps = [];
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 35; i++) {
      ps.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, r: Math.random() + 0.5, o: Math.random() * 0.15 + 0.05 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + p.o + ")";
        ctx.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const d = Math.hypot(p.x - ps[j].x, p.y - ps[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = "rgba(255,255,255," + (0.03 * (1 - d / 100)) + ")";
            ctx.stroke();
          }
        }
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function Ring({ p, size = 48, sw = 4, color = "#fff" }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c - (p / 100) * c} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
    </svg>
  );
}

function Tag({ children, color = "#666", bg = "rgba(255,255,255,0.05)" }) {
  return <span style={{ display: "inline-block", background: bg, color: color, padding: "3px 10px", borderRadius: 16, fontSize: 10, fontWeight: 700 }}>{children}</span>;
}

const gs = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#999", padding: "7px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" };
const bs = (bg) => ({ background: bg, border: "none", color: "#fff", padding: "11px 22px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });

export default function App() {
  const [view, setView] = useState("home");
  const [mi, setMi] = useState(0);
  const [ci, setCi] = useState(0);
  const [panel, setPanel] = useState(null);
  const [ans, setAns] = useState({});
  const [done, setDone] = useState({});
  const [scores, setScores] = useState({});
  const [fade, setFade] = useState(true);

  const go = (v, m) => {
    setFade(false);
    setTimeout(() => {
      setView(v);
      if (m !== undefined) setMi(m);
      setCi(0);
      setPanel(null);
      setAns({});
      setFade(true);
      window.scrollTo({ top: 0 });
    }, 150);
  };

  const submit = () => {
    const m = MODULES[mi];
    let s = 0;
    m.quiz.forEach((q, i) => { if (ans[i] === q.a) s++; });
    setScores((prev) => ({ ...prev, [mi]: s }));
    setDone((prev) => ({ ...prev, [mi]: true }));
    go("results");
  };

  const tc = Object.keys(done).length;
  const op = Math.round((tc / MODULES.length) * 100);
  const fst = { opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.2s, transform 0.2s" };
  const wrap = { maxWidth: 900, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 2 };
  const shell = { fontFamily: "'Sora', sans-serif", background: "#07070c", color: "#ddd", minHeight: "100vh" };

  // HOME
  if (view === "home") return (
    <div style={shell}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Bg />
      <div style={{ ...wrap, ...fst }}>
        <div style={{ textAlign: "center", paddingTop: 64, paddingBottom: 36 }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg,#b22,#d44)", borderRadius: 12, padding: "8px 20px", marginBottom: 18, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" }}>SPTC 243 · Montclair State University</div>
          <h1 style={{ fontSize: "clamp(26px, 4.5vw, 48px)", fontWeight: 800, lineHeight: 1.08, margin: "0 0 12px", background: "linear-gradient(135deg, #fff 30%, #889)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI & Emerging Technologies<br />in Sports Communication</h1>
          <p style={{ fontSize: 15, color: "#666", maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.6 }}>Your interactive course companion. Explore how exponential technologies transform sports media — and your career.</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => go("module", 0)} style={bs("linear-gradient(135deg,#b22,#d44)")}>Start Learning →</button>
            <button onClick={() => go("discuss")} style={{ ...gs, padding: "11px 22px" }}>💬 Discussions</button>
            <button onClick={() => go("sources")} style={{ ...gs, padding: "11px 22px" }}>📡 Sources</button>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12, padding: 18, marginBottom: 36, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#555" }}>Course Progress</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Ring p={op} size={28} sw={2.5} color="#34C759" /><span style={{ fontWeight: 700, fontSize: 16 }}>{op}%</span></div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 5, height: 5 }}><div style={{ background: "linear-gradient(90deg,#34C759,#30D158)", height: "100%", width: op + "%", borderRadius: 5, transition: "width 0.5s" }} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14, paddingBottom: 36 }}>
          {MODULES.map((m, i) => (
            <div key={m.id} onClick={() => go("module", i)} style={{ background: done[i] ? (m.color + "0a") : "rgba(255,255,255,0.015)", border: "1px solid " + (done[i] ? m.color + "30" : "rgba(255,255,255,0.05)"), borderRadius: 13, padding: 20, cursor: "pointer", transition: "all 0.2s", position: "relative" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = m.color + "50"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = done[i] ? m.color + "30" : "rgba(255,255,255,0.05)"; }}>
              {done[i] && <div style={{ position: "absolute", top: 12, right: 12, background: "#34C759", borderRadius: 14, padding: "2px 8px", fontSize: 9, fontWeight: 700 }}>✓ {scores[i]}/{m.quiz.length}</div>}
              <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ display: "flex", gap: 5, marginBottom: 7, flexWrap: "wrap" }}><Tag color={m.color} bg={m.color + "15"}>Module {m.id}</Tag><Tag>{m.week}</Tag></div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px", color: "#fff" }}>{m.title}</h3>
              <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{m.subtitle}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "28px 0 40px", textAlign: "center" }}>
          <p style={{ color: "#333", fontSize: 11 }}>Professor Ben Fairclough · Fall 2025 · Wed 5:20–8:05 PM<br />Built on <em>The Future is Faster Than You Think</em></p>
        </div>
      </div>
    </div>
  );

  // MODULE
  if (view === "module") {
    const m = MODULES[mi];
    const con = m.concepts[ci];
    return (
      <div style={shell}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Bg />
        <div style={{ ...wrap, ...fst }}>
          <div style={{ paddingTop: 24, display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 10 }}>
            <button onClick={() => go("home")} style={gs}>← Modules</button>
            <Tag color={m.color} bg={m.color + "15"}>Module {m.id}</Tag><Tag>{m.week}</Tag>
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 800, margin: "0 0 4px" }}>{m.title}</h2>
          <p style={{ color: "#555", fontSize: 14, margin: "0 0 16px" }}>{m.subtitle}</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            <button onClick={() => setPanel(panel === "book" ? null : "book")} style={{ ...gs, background: panel === "book" ? "rgba(255,149,0,0.1)" : undefined, color: panel === "book" ? "#FF9500" : "#888" }}>📖 Book Connection</button>
            <button onClick={() => setPanel(panel === "ev" ? null : "ev")} style={{ ...gs, background: panel === "ev" ? "rgba(0,199,190,0.1)" : undefined, color: panel === "ev" ? "#00C7BE" : "#888" }}>📡 Current Events</button>
          </div>
          {panel === "book" && (
            <div style={{ background: "rgba(255,149,0,0.05)", border: "1px solid rgba(255,149,0,0.2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#FF9500", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>📖 CHAPTERS</div>
              <p style={{ fontSize: 13, color: "#ccc", margin: "0 0 10px", fontWeight: 600 }}>{m.book}</p>
              <p style={{ fontSize: 13, color: "#999", margin: 0, lineHeight: 1.7 }}>{m.bookNote}</p>
            </div>
          )}
          {panel === "ev" && (
            <div style={{ background: "rgba(0,199,190,0.05)", border: "1px solid rgba(0,199,190,0.2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#00C7BE", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>📡 TRACK THESE</div>
              {m.events.map((e, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}><span style={{ color: "#00C7BE", fontWeight: 700, fontSize: 12 }}>→</span><span style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{e}</span></div>)}
            </div>
          )}
          <div style={{ display: "flex", gap: 5, marginBottom: 20, flexWrap: "wrap" }}>
            {m.concepts.map((c, i) => (
              <button key={i} onClick={() => setCi(i)} style={{ background: ci === i ? m.color : "rgba(255,255,255,0.03)", border: "1px solid " + (ci === i ? m.color : "rgba(255,255,255,0.07)"), color: ci === i ? "#fff" : "#666", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>{c.name}</button>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "clamp(18px, 3vw, 32px)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 14px" }}>{con.name}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#aaa", margin: "0 0 20px" }}>{con.desc}</p>
            <div style={{ background: m.color + "0a", border: "1px solid " + m.color + "20", borderRadius: 11, padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>🏟️ SPORTS EXAMPLE</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#bbb", margin: 0 }}>{con.sport}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: 18 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#FF9500", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>💡 KEY INSIGHT</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#ddd", margin: 0, fontWeight: 500, fontStyle: "italic" }}>{con.insight}</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 40, gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => ci > 0 && setCi(ci - 1)} disabled={ci === 0} style={{ ...gs, opacity: ci === 0 ? 0.4 : 1 }}>← Previous</button>
            {ci < m.concepts.length - 1
              ? <button onClick={() => setCi(ci + 1)} style={bs(m.color)}>Next Concept →</button>
              : <button onClick={() => go("quiz")} style={bs("linear-gradient(135deg,#FF9500,#FF3B30)")}>Take the Quiz →</button>}
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  if (view === "quiz") {
    const m = MODULES[mi];
    const ok = Object.keys(ans).length >= m.quiz.length;
    return (
      <div style={shell}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Bg />
        <div style={{ ...wrap, ...fst }}>
          <div style={{ paddingTop: 24, paddingBottom: 10 }}><button onClick={() => go("module")} style={gs}>← Back to Module</button></div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>Knowledge Check</h2>
          <p style={{ color: "#555", fontSize: 14, margin: "0 0 28px" }}>{m.title} — {m.quiz.length} questions</p>
          {m.quiz.map((q, qi) => (
            <div key={qi} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 13, padding: 20, marginBottom: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>{qi + 1}. {q.q}</p>
              {q.o.map((opt, oi) => (
                <button key={oi} onClick={() => setAns((p) => ({ ...p, [qi]: oi }))} style={{ display: "block", width: "100%", textAlign: "left", background: ans[qi] === oi ? m.color + "15" : "rgba(255,255,255,0.02)", border: "1px solid " + (ans[qi] === oi ? m.color : "rgba(255,255,255,0.07)"), color: ans[qi] === oi ? "#fff" : "#888", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: ans[qi] === oi ? 600 : 400, marginBottom: 6 }}>{opt}</button>
              ))}
            </div>
          ))}
          <button onClick={submit} disabled={!ok} style={{ ...bs(ok ? "linear-gradient(135deg,#34C759,#30D158)" : "#333"), width: "100%", marginBottom: 40, cursor: ok ? "pointer" : "default" }}>Submit Answers</button>
        </div>
      </div>
    );
  }

  // RESULTS
  if (view === "results") {
    const m = MODULES[mi];
    const sc = scores[mi] || 0;
    const t = m.quiz.length;
    const pct = Math.round((sc / t) * 100);
    return (
      <div style={shell}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Bg />
        <div style={{ ...wrap, ...fst }}>
          <div style={{ textAlign: "center", paddingTop: 56, paddingBottom: 36 }}>
            <Ring p={pct} size={90} sw={6} color={pct >= 75 ? "#34C759" : pct >= 50 ? "#FF9500" : "#FF3B30"} />
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: "14px 0 4px" }}>{sc}/{t}</h2>
            <p style={{ color: "#666", fontSize: 15, margin: "0 0 24px" }}>
              {pct === 100 ? "Perfect!" : pct >= 67 ? "Strong understanding." : "Review the material and try again."}
            </p>
            <div style={{ textAlign: "left", maxWidth: 580, margin: "0 auto 28px" }}>
              {m.quiz.map((q, qi) => {
                const correct = ans[qi] === q.a;
                return (
                  <div key={qi} style={{ background: correct ? "rgba(52,199,89,0.06)" : "rgba(255,59,48,0.06)", border: "1px solid " + (correct ? "rgba(52,199,89,0.2)" : "rgba(255,59,48,0.2)"), borderRadius: 9, padding: 14, marginBottom: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>{qi + 1}. {q.q}</p>
                    <p style={{ fontSize: 11, margin: "0 0 2px", color: correct ? "#34C759" : "#FF3B30" }}>You: {q.o[ans[qi]]} {correct ? "✓" : "✗"}</p>
                    {!correct && <p style={{ fontSize: 11, margin: 0, color: "#34C759" }}>Correct: {q.o[q.a]}</p>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => go("home")} style={gs}>All Modules</button>
              {mi < MODULES.length - 1 && <button onClick={() => go("module", mi + 1)} style={bs("linear-gradient(135deg,#007AFF,#5856D6)")}>Next Module →</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DISCUSSIONS
  if (view === "discuss") return (
    <div style={shell}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Bg />
      <div style={{ ...wrap, ...fst }}>
        <div style={{ paddingTop: 24, paddingBottom: 10 }}><button onClick={() => go("home")} style={gs}>← Back</button></div>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px" }}>Discussion Prompts</h2>
        <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Critical thinking mapped to the course schedule.</p>
        {DISCUSSIONS.map((d, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 11, padding: 18, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}><Tag color="#FF9500" bg="rgba(255,149,0,0.1)">{d.w}</Tag><Tag>{d.t}</Tag></div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#bbb", margin: 0 }}>{d.p}</p>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );

  // SOURCES
  if (view === "sources") return (
    <div style={shell}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Bg />
      <div style={{ ...wrap, ...fst }}>
        <div style={{ paddingTop: 24, paddingBottom: 10 }}><button onClick={() => go("home")} style={gs}>← Back</button></div>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px" }}>Recommended Sources</h2>
        <p style={{ color: "#555", fontSize: 14, margin: "0 0 24px" }}>Stay current with sports & tech. Many paywalled — Prof. Fairclough shares via Canvas.</p>
        {SOURCES.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 11, padding: 18, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div><h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 2px", color: "#fff" }}>{s.n}</h3><p style={{ fontSize: 12, color: "#666", margin: 0 }}>{s.d}</p></div>
            <span style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{s.u}</span>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );

  return null;
}
