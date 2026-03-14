import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, push, remove, update } from "firebase/database";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB4BFDRuCHUg9fPT9PIMpChd4_FbiS2ITQ",
  authDomain: "sptc243.firebaseapp.com",
  databaseURL: "https://sptc243-default-rtdb.firebaseio.com",
  projectId: "sptc243",
  storageBucket: "sptc243.firebasestorage.app",
  messagingSenderId: "274091952679",
  appId: "1:274091952679:web:140b9abb01f5c9b62b9c02"
};

let db = null;
try { const app = initializeApp(firebaseConfig); db = getDatabase(app); } catch(e) { console.warn("Firebase init failed:", e); }

const fbKey = (name) => name.toLowerCase().replace(/\s+/g,"-").replace(/[.#$[\]]/g,"_");

const MASTERY_THRESHOLD = 75;

const MODULES = [
  {
    id: 1, title: "The Future is Faster Than You Think", subtitle: "The Frameworks That Explain What's Coming", icon: "📖", color: "#E8A838",
    desc: "The big ideas from Diamandis & Kotler that explain why every industry — especially sports — is being transformed faster than anyone expects.",
    goDeeper: [
      { q: "A sports league's digital content strategy followed the Six D's perfectly: they digitized highlights, entered the deceptive phase, then disrupted traditional broadcasters. Apply the REMAINING three D's (Demonetization, Dematerialization, Democratization) to predict what happens next for their content business.", type: "open" },
      { q: "You're advising a Division III athletic conference. Using the concepts of convergence and accelerating returns, build a 3-year roadmap for how they should invest in technology. Which exponential technologies should they prioritize and why?", type: "open" },
      { q: "Identify a technology currently in its 'deceptive phase' for sports media. Make the case for why it will disrupt an incumbent within 5 years, citing specific exponential trends.", type: "open" }
    ],
    segments: [
      { title: "Moore's Law: The Engine Under Everything", content: "In 1965, Gordon Moore observed that computing power doubles roughly every two years while cost stays flat or drops. This has held for 60 years. Your smartphone has more computing power than the systems that landed astronauts on the moon. But here's what makes it profound: the pattern isn't limited to chips. The same doubling shows up in storage capacity, bandwidth, sensor resolution, and AI capability. Every digital technology inherits this exponential curve. When people say 'AI is moving fast,' Moore's Law is the underlying engine.", keyTerm: "Moore's Law: Computing power doubles approximately every two years at the same cost. This pattern has held for 60 years and drives the acceleration of every digital technology.", exercise: "Look up the price of 1 GB of storage in 2000, 2010, and 2024. Does the curve look linear or exponential? What does that mean for a league that wants to store and analyze every frame of every game?" },
      { title: "The Law of Accelerating Returns", content: "Ray Kurzweil extended Moore's observation into a broader principle: the rate of technological improvement itself accelerates. Each generation of technology builds the next generation faster. The internet was built on computers. AI was built on the internet's data. Now AI designs better AI. This compounding creates a curve that bends upward more steeply over time. The gap between 2020 and 2025 feels bigger than 2010 to 2015, even though both are five years. The pace isn't constant — it's accelerating.", keyTerm: "Law of Accelerating Returns: The rate of progress speeds up over time because each generation of technology enables the next to be built faster. Progress compounds on progress.", exercise: "Think about sports broadcasting in 2005, 2015, and 2025. List what was possible in each era. Is the 2015-2025 gap bigger than 2005-2015? What does that predict about 2025-2035?" },
      { title: "Exponential vs. Linear Thinking", content: "Humans think linearly — our brains evolved for a world where things changed slowly. 30 linear steps = 30 meters. But 30 exponential (doubling) steps = 26 trips around Earth. This mismatch between how we instinctively think and how technology actually grows is the single biggest reason people underestimate disruption. Executives, journalists, even technologists consistently predict the future by drawing a straight line from today. The future isn't a straight line. It's a hockey stick.", keyTerm: "Exponential Growth: Doubling at regular intervals. Feels slow at first (1, 2, 4, 8) but quickly becomes enormous (... 512, 1024, 2048). Human brains are wired to think linearly, making us systematically underestimate exponential change.", exercise: "Take a piece of paper. Fold it in half 42 times (conceptually). How thick would it be? Answer: it would reach the moon. Now apply that intuition to AI capability doubling every 12-18 months." },
      { title: "The Six D's of Disruption", content: "Diamandis identifies a chain reaction that happens once a product or service becomes digital. It's predictable and unstoppable: Digitization (becomes information) → Deception (early growth looks flat) → Disruption (incumbents collapse) → Demonetization (cost drops toward zero) → Dematerialization (physical form disappears) → Democratization (everyone gets access). This isn't theory — it's a pattern that has played out across music, photography, publishing, maps, and now sports media.", keyTerm: "The Six D's: Digitization → Deception → Disruption → Demonetization → Dematerialization → Democratization. Once something becomes digital, this chain is unstoppable.", exercise: "Walk sports journalism through all Six D's. Where is it on the chain right now? Then do the same for sports broadcasting. Are they at the same stage?" },
      { title: "The Deceptive Phase", content: "This is the most dangerous D because it's where people get blindsided. When an exponential technology first appears, its early growth doubles look tiny: 0.01, 0.02, 0.04, 0.08. Easy to dismiss. 'It's a toy.' 'It'll never work.' But doubling doesn't stop. 0.08 becomes 0.16, then 0.32, then suddenly 1, 2, 4, 8, 16 — and by then it's too late for incumbents. The iPhone seemed like a gimmick to BlackBerry in 2007. AI-generated content seemed like a novelty in 2021. The deceptive phase is where fortunes are made by those paying attention — and lost by those who aren't.", keyTerm: "Deceptive Phase: The early period of exponential growth where doublings are small and easy to dismiss. By the time the technology is obviously powerful, the disruption window for incumbents has already closed.", exercise: "AI-generated sports recaps were laughably bad in 2020. By 2023, the AP was publishing thousands of AI game summaries. Were there any signals in the 'deceptive' 2020-2022 period that this was coming? What technology today looks like a toy but might be in its deceptive phase?" },
      { title: "Demonetization & Dematerialization", content: "Once something is digitized and disrupts the incumbent model, costs crash toward zero (demonetization) and physical products disappear (dematerialization). Think about what your smartphone replaced: camera, GPS, map, calculator, flashlight, compass, level, recorder, scanner, alarm clock, stopwatch, dictionary, encyclopedia, music player, video player, game console, newspaper, boarding pass, wallet. Dozens of physical products and the industries behind them — demonetized and dematerialized. In sports: producing a highlight reel once required an edit bay, a producer, tape stock, and hours of work. Now an AI platform does it in seconds at near-zero cost.", keyTerm: "Demonetization: The cost of a product or service drops toward zero as technology improves. Dematerialization: Physical products disappear into software. Combined, they eliminate entire industries while creating new ones.", exercise: "List everything a sports media professional used in 2005 that has been dematerialized into software or AI. What jobs existed to operate that equipment? What replaced those jobs?" },
      { title: "Democratization", content: "The final D: once something is demonetized and dematerialized, it becomes accessible to everyone. You don't need a TV network to broadcast. You don't need a production team to create highlights. You don't need a printing press to publish. The tools that were once gated behind millions of dollars in infrastructure are now available to anyone with a laptop and an internet connection. This is the most consequential D for your career: the same forces that disrupted industries create unprecedented opportunity for individuals. A single person with AI tools in 2025 can produce what required a full team in 2020.", keyTerm: "Democratization: When powerful tools become accessible to everyone, not just those with capital and infrastructure. The final stage of the Six D's — and the source of both massive opportunity and massive disruption.", exercise: "Find a creator, athlete, or small sports organization that's producing professional-quality content without a traditional production team. What tools are they using? Could they have done this five years ago?" },
      { title: "Convergence: Where the Real Disruption Lives", content: "Individual exponential technologies are powerful on their own. But the book's central thesis is that the real disruption happens at the CONVERGENCE — when multiple exponential technologies crash into each other simultaneously. AI alone is powerful. AI + 5G networks + cheap sensors + cloud computing + smartphone ubiquity hitting sports media at the same time is transformative. A single NFL broadcast in 2025 uses AI cameras, RFID player tracking, real-time AR graphics, automated highlights, and personalized betting feeds. None existed together a decade ago.", keyTerm: "Technological Convergence: Multiple independently advancing technologies combining to create capabilities none could achieve alone. The result is multiplicative, not additive — and it's where the biggest disruptions originate.", exercise: "Pick a sports moment from last week. List every technology involved in how it reached your phone — cameras, networks, AI, apps, algorithms, social platforms. How many separate exponential technologies converged?" },
      { title: "The Eight Exponential Technologies", content: "Diamandis identifies eight technologies all on exponential curves and all beginning to converge: (1) Artificial Intelligence, (2) Robotics, (3) Virtual/Augmented Reality, (4) 3D Printing, (5) Blockchain, (6) Sensors & IoT, (7) Networks (5G and beyond), (8) Quantum Computing. You don't need to be an expert in all eight. But you need to understand that sports media is being directly impacted by at least five of them right now: AI (content creation, analytics), VR/AR (immersive fan experiences), sensors (player tracking, biometrics), networks (mobile streaming, real-time data), and blockchain (digital collectibles, ticketing).", keyTerm: "Eight Exponential Technologies: AI, Robotics, VR/AR, 3D Printing, Blockchain, Sensors/IoT, Networks, Quantum Computing. Each on its own exponential curve. Their convergence is reshaping every industry.", exercise: "For each of the five technologies directly hitting sports (AI, VR/AR, sensors, networks, blockchain), name one specific product or company in sports that uses it. Which convergence of two or more of these do you think will be most disruptive in the next five years?" },
      { title: "Network Effects & Platforms", content: "A network effect occurs when a product becomes more valuable as more people use it. The telephone was useless with one user. With a billion users, it's indispensable. Social media platforms, streaming services, and sports apps all benefit from network effects. This concept is critical for understanding why certain platforms become dominant and why disruption can happen so suddenly: once a new platform hits critical mass, the network effect creates explosive growth while the incumbent's network effect works in reverse as users leave.", keyTerm: "Network Effect: A product or service becomes more valuable as more people use it. This creates winner-take-most dynamics and explains why platform shifts happen suddenly rather than gradually.", exercise: "Why did ESPN's cable bundle resist disruption for so long? (Hint: network effects — every bar, gym, and waiting room had ESPN because everyone expected it.) What happens when that network effect reverses?" },
      { title: "Industries Transformed: The Pattern", content: "Chapters 5 through 12 of the book walk through industry after industry — retail, advertising, entertainment, education, healthcare, food, finance — showing the same pattern: exponential technology + convergence = total disruption of the existing model. Every single one has a sports parallel. Healthcare AI → sports medicine and injury prediction. Entertainment disruption → streaming wars. Education transformation → how fans learn and engage. Finance disruption → betting and tokenized ownership. The lesson: disruption doesn't stay in its lane.", keyTerm: "Cross-Industry Convergence: The same exponential technologies disrupting healthcare, finance, and entertainment are simultaneously disrupting sports — often in interconnected ways.", exercise: "Pick one non-sports industry from the book (healthcare, finance, education, retail). Identify how AI is disrupting it, then find the direct parallel in sports. How are the patterns similar?" },
      { title: "The Dark Side: Threats", content: "After twelve optimistic chapters, Diamandis confronts what can go wrong: deepfakes eroding trust, job displacement from automation, privacy erosion through ubiquitous sensors, algorithmic bias reinforcing inequity, and dangerous concentration of power among those who control AI. All of these are already manifesting in sports: deepfake athlete videos manipulating betting markets, biometric data controversies, AI-generated coverage that systematically under-represents women's sports.", keyTerm: "Exponential Threats: The same technologies enabling extraordinary progress also enable extraordinary harm — deepfakes, surveillance, bias, job displacement, and power concentration.", exercise: "Pick one threat from this segment. Find a real example of it happening in sports right now. How would you mitigate it if you were running a sports media company?" },
      { title: "The Five Migrations", content: "The book closes with five Great Migrations reshaping civilization: (1) Climate migration — populations moving due to environmental change, (2) Urban migration — smart cities and urbanization, (3) Virtual migration — life and work moving into digital spaces, (4) Space migration — commercialization beyond Earth, (5) Meta-intelligence migration — humans merging with AI tools. For sports, two are immediately relevant: virtual migration (Gen Alpha experiences sports primarily through gaming and social, not broadcast TV) and meta-intelligence (AI coaching, scouting, content creation, and analytics merging with human expertise).", keyTerm: "Five Great Migrations: Climate, Urban, Virtual, Space, Meta-intelligence. The virtual and meta-intelligence migrations are actively reshaping how sports are experienced, produced, and consumed.", exercise: "How does Gen Alpha discover and follow sports differently than you did? If their primary entry point is gaming (EA FC, NBA 2K) and social media rather than TV, what does that mean for every sports media company's strategy?" }
    ],
    quiz: [
      { q: "Moore's Law matters because:", o: ["Only about chips", "Drives exponential improvement in computing, storage, bandwidth — all digital tech", "Predicts failures", "Only hardware"], a: 1 },
      { q: "The Law of Accelerating Returns means:", o: ["Steady improvement", "The rate of improvement itself speeds up — progress compounds on progress", "Financial returns increase", "Technology plateaus"], a: 1 },
      { q: "30 exponential (doubling) steps equals:", o: ["30 meters", "300 meters", "About 26 trips around Earth", "1 kilometer"], a: 2 },
      { q: "The 'Deceptive' phase is dangerous because:", o: ["Companies lie", "Early doublings look tiny, so people dismiss the technology until it's too late", "It's always deceptive", "Only affects startups"], a: 1 },
      { q: "Demonetization + Dematerialization means:", o: ["Everything is free", "Costs crash toward zero and physical products disappear into software", "Companies lose money", "Only digital products"], a: 1 },
      { q: "Democratization in the Six D's means:", o: ["Political democracy", "Powerful tools become accessible to everyone, not just those with capital", "Everyone votes on technology", "Government controls tech"], a: 1 },
      { q: "Convergence creates disruption because:", o: ["One technology improves", "Multiple exponentials hitting simultaneously = multiplicative change", "Companies merge", "It slows things down"], a: 1 },
      { q: "The two 'Five Migrations' most reshaping sports:", o: ["Climate and space", "Virtual worlds and meta-intelligence", "Urban and climate", "Space and meta-intelligence"], a: 1 }
    ]
  },
  {
    id: 2, title: "AI Foundations & Your Toolkit", subtitle: "Understanding AI and Mastering the Tools", icon: "🧠", color: "#007AFF",
    desc: "What AI actually is, how it works, and hands-on mastery of the major models. From definitions to practical fluency.",
    goDeeper: [
      { q: "Design a complete AI-powered workflow for a sports media role of your choice (social media manager, content producer, analyst). Map every task in a typical day to the best AI tool, explain WHY that tool fits, and identify which tasks still require human judgment.", type: "open" },
      { q: "A sports league executive says: 'We tried ChatGPT and it hallucinated stats, so AI doesn't work for us.' Using concepts from this module, write a 200-word response explaining what went wrong and how to use AI correctly.", type: "open" },
      { q: "Recursive self-improvement means AI is getting better at making AI better. Project this forward 3 years. What specific sports media tasks that currently require human expertise will be fully automated? What new roles will emerge?", type: "open" }
    ],
    segments: [
      { title: "What Is Artificial Intelligence?", content: "AI is pattern recognition at scale. It refers to computer systems performing tasks that typically require human intelligence — recognizing images, understanding language, making predictions, generating content. Key distinction: AI doesn't 'think' like you. It identifies statistical patterns in massive data and uses those patterns to generate outputs. When someone says 'AI wrote this article' or 'AI generated that highlight,' what actually happened is a system found patterns in millions of examples and produced something statistically similar.", keyTerm: "Artificial Intelligence (AI): Computer systems performing tasks requiring human intelligence by identifying patterns in large datasets. Not thinking — pattern matching at extraordinary scale.", exercise: "Think of three things you did today. Which could AI do by recognizing patterns? Which require something AI can't replicate yet?" },
      { title: "Machine Learning & Deep Learning", content: "Machine Learning is how AI learns — instead of explicit rules, the system learns from examples. Show it 10,000 basketball highlights labeled 'dunk' and it learns to identify dunks in footage it's never seen. Deep Learning is a type of ML using 'neural networks' — layers of math loosely inspired by the brain. Deep learning is what made the current revolution possible because it can handle unstructured data like images, audio, and video — the raw material of sports media.", keyTerm: "Machine Learning: AI learning from data examples rather than rules. Deep Learning: ML using layered neural networks, enabling processing of images, video, and language.", exercise: "If you showed an ML system 50,000 hours of NBA footage labeled with player names, what could it learn? What couldn't it learn from that data alone?" },
      { title: "Large Language Models (LLMs)", content: "An LLM is trained on enormous text — books, websites, code — to predict the next word. That's it. ChatGPT, Claude, Gemini, Grok are all sophisticated next-word-prediction machines. But at massive scale, emergent behavior appears: writing, analysis, summarization, coding, reasoning. The 'Large' refers to parameters (adjustable knobs in the model) — GPT-4 has over a trillion. The key insight: LLMs don't 'know' things the way you do. They predict statistically likely sequences of words, which at scale resembles knowledge and reasoning.", keyTerm: "Large Language Model (LLM): Deep learning model trained on massive text to predict the next word. At sufficient scale, produces emergent capabilities like reasoning and content generation.", exercise: "Open ChatGPT or Claude. Ask it to explain the offside rule. Then ask it to explain to a 5-year-old. Notice how the same underlying capability produces different outputs based on your prompt." },
      { title: "Vision Language Models & Multimodal AI", content: "LLMs process text. The frontier is multimodal AI — models processing text, images, video, and audio simultaneously. Vision Language Models (VLMs) can 'see' an image and discuss it intelligently. This is what enables AI to analyze game footage, identify plays from video, read stadium crowd density, and generate highlights from raw broadcast streams. This is where sports media gets disrupted hardest — because sports IS visual.", keyTerm: "Multimodal AI: Systems processing multiple input types (text, image, video, audio) simultaneously. VLM: A model combining vision and language understanding.", exercise: "Take a photo of a sports scene — a game on TV, a stadium, a scoreboard. Upload to ChatGPT or Claude and ask it to describe what it sees. How accurate? What does it miss?" },
      { title: "Training vs. Inference", content: "Training is the expensive part — feeding massive datasets through the model over weeks using thousands of GPUs, costing millions. This happens once (or periodically). Inference is cheap — using the trained model for your specific prompt. When you ask Claude a question, that's inference. Critical economics: training costs drop roughly 10x per year. Tasks costing $100 in 2023 cost about $1 in 2025. This is why AI is expanding so fast and why small organizations can now afford tools that were enterprise-only two years ago.", keyTerm: "Training: Expensive one-time process of teaching a model. Inference: Cheap real-time use of the trained model. Training costs drop ~10x/year.", exercise: "If training costs drop 10x/year, what does that mean for a small sports media company that couldn't afford AI in 2023? What about in 2026?" },
      { title: "Hallucinations & the Limits of AI", content: "AI generates confident, plausible nonsense — called hallucinations. It doesn't 'know' facts; it predicts statistically likely word sequences. It can fabricate statistics, invent quotes, misattribute information — all while sounding authoritative. Guardrails are safety measures built into models to prevent harmful outputs. Understanding both is essential: your job in any AI-assisted role is to be the quality filter. AI generates; humans verify. That skill separates valuable professionals from people who get replaced.", keyTerm: "Hallucination: AI generating plausible but factually incorrect content. Guardrails: Safety measures preventing harmful outputs. Your value = knowing when to trust and when to verify.", exercise: "Ask an AI the top 5 scorers in last night's NBA games. Check against a real source. How many right? What does this teach you about using AI for factual claims in sports media?" },
      { title: "Recursive Self-Improvement", content: "AI is increasingly used to improve AI itself. Models help design better training data, better architectures, better evaluation methods. This creates a feedback loop: better AI → faster AI improvement → even better AI. Combined with the Law of Accelerating Returns from Module 1, this means AI capability growth is accelerating, not plateauing. The AI you're using today will look primitive within two years. Planning your career around today's AI capabilities is like planning around 2015's smartphone.", keyTerm: "Recursive Self-Improvement: AI accelerating the development of more capable AI, creating a compounding feedback loop that drives faster and faster progress.", exercise: "Claude launched early 2023. Compare its capabilities then vs now. Project that improvement rate 2 years forward. What becomes possible in sports media that isn't possible today?" },
      { title: "The Foundation Model Landscape", content: "There are now several world-class AI models competing, each with different strengths. The major players: OpenAI (ChatGPT/GPT-4o), Anthropic (Claude), Google (Gemini), xAI (Grok), and Perplexity (search-focused). Think of them like different networks covering the same game — same sport, different commentary, different camera angles, different strengths. No single model is best at everything. The skill isn't picking one — it's knowing which to use when.", keyTerm: "Foundation Model: A large AI model trained on broad data that can be adapted to many tasks. The 'foundation' that specialized applications build on top of.", exercise: "Open ChatGPT, Claude, and Gemini. Ask each: 'Biggest sports media story this week?' Compare: which is most current? Most detailed? Most accurate?" },
      { title: "ChatGPT (OpenAI)", content: "The model that started the mainstream AI era. Strengths: broad general knowledge, strong coding, image generation (DALL-E), voice conversations, massive plugin ecosystem, widest user base, most polished consumer experience. Weaknesses: can be confidently wrong, tends toward people-pleasing answers, knowledge cutoff limitations. Best for: first drafts, brainstorming, image creation, general-purpose tasks where you need breadth over depth.", keyTerm: "GPT (Generative Pre-trained Transformer): OpenAI's architecture. 'Pre-trained' = learned from data before you ever interacted with it.", exercise: "Ask ChatGPT for a 200-word NBA game recap. Then rewrite it for a betting audience vs a casual fan. Notice how it adapts tone and emphasis based on your instruction." },
      { title: "Claude (Anthropic)", content: "Built with a focus on being helpful, harmless, and honest. Strengths: longest context window (processes entire books or massive documents at once), strongest at nuanced analysis and writing, most careful about accuracy, excellent at following complex multi-step instructions. Best for: deep analysis, long document processing, writing that requires nuance, research synthesis, tasks where getting it RIGHT matters more than getting it fast. This course app was built entirely with Claude.", keyTerm: "Context Window: How much text a model can process at once. Claude's is among the largest — enabling analysis of entire reports, books, or datasets in a single conversation.", exercise: "Upload a long article about a sports business topic into Claude. Ask for three career implications. Compare the depth of analysis to the same task in ChatGPT." },
      { title: "Gemini, Grok & Perplexity", content: "Gemini (Google): integrated with Search, YouTube, Gmail. Always current via Google Search, multimodal from the ground up. Best for current events and Google ecosystem tasks. Grok (xAI): integrated with X/Twitter. Real-time social trends, less filtered, strong at internet culture and sports discourse. Best for real-time fan sentiment. Perplexity: AI-powered search that cites sources. Transparent sourcing reduces hallucination. Best for research where you need verifiable claims.", keyTerm: "Grounded AI: Models tying responses to verifiable sources (like Perplexity), reducing hallucination by anchoring outputs to real documents and citations.", exercise: "Ask Perplexity about AI in sports broadcasting — read its cited sources. Ask Grok the same. How does sourced research compare to social-media-informed analysis?" },
      { title: "Choosing the Right Tool: AI Orchestration", content: "The most valuable skill isn't mastering one AI — it's orchestrating multiple models for different parts of your workflow. Quick framework: Need a first draft or brainstorm? → ChatGPT. Deep analysis of a long document? → Claude. Current information? → Gemini. Real-time social pulse? → Grok. Sourced research? → Perplexity. The best professionals in sports media won't use one AI. They'll move between models the way a chef uses different knives — right tool, right task, right moment.", keyTerm: "AI Orchestration: Strategically using multiple AI models for different tasks within a single workflow, rather than relying on one model for everything.", exercise: "Design a complete post-game social media workflow: Which AI for the written recap? Image creation? Stat verification? Fan sentiment? Historical context? Map each task to the best tool." }
    ],
    quiz: [
      { q: "AI fundamentally works by:", o: ["Thinking like a brain", "Pre-programmed rules for every scenario", "Identifying statistical patterns in large datasets", "Connecting to the internet"], a: 2 },
      { q: "Training vs inference:", o: ["Same thing", "Training = expensive/once; inference = cheap/every use", "Training fast; inference slow", "Only big companies do both"], a: 1 },
      { q: "An LLM is fundamentally:", o: ["A fact database", "Next-word prediction at massive scale", "A search engine", "A rule-based chatbot"], a: 1 },
      { q: "AI hallucinations are dangerous because:", o: ["They crash systems", "AI generates confident, plausible content that's factually wrong", "Only affect cheap models", "They're easy to identify"], a: 1 },
      { q: "VLMs matter most for sports media because:", o: ["They're cheaper", "They process video/images, enabling automated analysis of game footage", "They only work with text", "They replace cameras"], a: 1 },
      { q: "Claude's biggest advantage:", o: ["It's free", "Largest context window + strongest nuanced analysis", "Best images", "Fastest responses"], a: 1 },
      { q: "For real-time fan sentiment during a game:", o: ["Claude", "Gemini", "Grok (X/Twitter integration)", "Perplexity"], a: 2 },
      { q: "AI Orchestration means:", o: ["Using one AI for everything", "Strategically using different models for different tasks", "Making AI play music", "Letting AI manage your calendar"], a: 1 }
    ]
  },
  {
    id: 3, title: "The Sports Business Revolution", subtitle: "From ESPN's Monopoly to Every Rights Holder as a Media Company", icon: "📡", color: "#FF3B30",
    desc: "The sports media business is being fundamentally restructured. This is the industry you're entering.",
    goDeeper: [
      { q: "You're the Head of Digital for a mid-market NBA team. The league provides AI-generated highlights via WSC Sports. Build a complete Fan Continuum strategy: what content for new fans, casual fans, and hardcore fans? What platforms? What CTAs move fans down the funnel?", type: "open" },
      { q: "ESPN's affiliate fee model generated ~$10B/year from 100M subscribers. Model what happens as they drop to 50M subscribers but launch a $25/month standalone streaming product. At what subscriber count does streaming revenue replace cable? What are the risks?", type: "open" },
      { q: "A D-III conference hires you as a consultant. They have zero media infrastructure and a $50K annual budget. Using every concept from this module, design their media strategy from scratch. What tools, what platforms, what content, what metrics?", type: "open" }
    ],
    segments: [
      { title: "The ESPN Era: How We Got Here", content: "In 1979, ESPN launched 24-hour sports TV. Over three decades, live sports became the most valuable content in media — the only programming watched live, in real time, with commercials. ESPN became the most profitable cable network in history. Here's how the money actually works: ESPN's revenue comes from two main sources — advertising and affiliate fees. Advertising is straightforward: brands pay to run commercials during live games. But the real money machine is affiliate fees. Every cable company — Comcast, Charter, DirecTV — pays ESPN a per-subscriber fee for the right to carry the channel. At its peak, that fee was roughly $9 per subscriber per month — the highest of any cable channel by far. The critical part: every cable household paid this fee whether they watched ESPN or not. If you had cable to watch HGTV, you were still paying $9/month for ESPN. Multiply $9 by 100 million cable households and you get roughly $10 billion per year in affiliate fees alone — before a single ad was sold. This is why ESPN could afford to pay billions for NFL, NBA, MLB, and college football rights. The entire model depended on one thing: the bundle. As long as cable companies bundled ESPN into their basic packages, and as long as most American households subscribed to cable, the money machine was unstoppable. Every household was effectively subsidizing ESPN whether they wanted to or not.", keyTerm: "Affiliate Fees: The per-subscriber fee that cable companies pay to carry a channel. ESPN's ~$9/month fee was the highest in cable — paid by every cable household regardless of whether they watched sports. At 100M subscribers, that's ~$10B/year before ad revenue.", exercise: "ESPN charges cable companies ~$9/subscriber/month. A niche channel might charge $0.25. If 40% of cable subscribers actually watch ESPN, what is each actual viewer effectively paying? What does this tell you about why the bundle was so valuable to ESPN — and so vulnerable to cord-cutting?" },
      { title: "The Great Unbundling", content: "Cord-cutting broke the bundle. ESPN dropped from ~100M subscribers (2011) to below 70M (2024). But total sports rights spending INCREASED. The NFL signed ~$113B through 2033 across CBS, Fox, NBC, ESPN, Amazon, Netflix, Peacock, YouTube. More platforms paying more money. The pie got bigger but shattered into pieces.", keyTerm: "Cord-Cutting: Canceling cable for streaming. Broke the economic model that made ESPN the most profitable network in TV.", exercise: "List every platform showing NFL games. How many subs for every game? Cost vs a single cable package?" },
      { title: "The Streaming Wars", content: "Amazon has Thursday Night Football. Apple has MLS. Netflix streamed NFL on Christmas 2024. YouTube has Sunday Ticket. Peacock carries exclusive playoff games. ESPN launching standalone streaming. Every tech and media company concluded: live sports is the last way to aggregate massive, engaged audiences in real time.", keyTerm: "Rights Fragmentation: Live sports distributed across increasing platforms, requiring multiple subscriptions to follow your teams.", exercise: "You're a league commissioner. Amazon, Apple, Netflix, ESPN all want your rights. Beyond price, what factors matter?" },
      { title: "Direct-to-Consumer: The Real Revolution", content: "The streaming shift isn't just about where games air — it's about who owns the customer relationship. Cable era: Comcast owned the viewer data. D2C flips this. When you subscribe to ESPN+ or a league app, the content provider owns YOUR data directly. They know who you are, what you watch, when you stop, what you'll pay for. This is transformative.", keyTerm: "Direct-to-Consumer (D2C): Distributing directly to viewers, gaining access to subscriber data and payment relationships without cable middlemen.", exercise: "Disney owns ESPN, ABC, Hulu, Disney+. If they know you watched every Yankees game, visited Disney World twice, and stream Marvel — what can they offer that Comcast never could?" },
      { title: "Data Unlocks New Experiences", content: "D2C isn't just data collection — it enables entirely new products. FuboTV integrates live betting into viewing. Disney connects ESPN habits to personalized park experiences. A league app offers your favorite player's camera angle, your language commentary, fantasy stats — simultaneously. AI powers all of this personalization at scale. The Diamandis frameworks from Module 1 are playing out in real time.", keyTerm: "Personalization at Scale: AI delivering individually customized content to millions simultaneously — impossible in the broadcast era, now the foundation of sports media's future.", exercise: "Design your ideal viewing experience if the platform knew everything about you. What's different from today? What data would it need?" },
      { title: "Every Rights Holder Is a Media Company", content: "The marginal cost of content creation and distribution has collapsed — and it happened because of multiple cost curves crashing simultaneously. Start with production: twenty years ago, creating a professional highlight package required a linear tape edit suite ($50K+), a trained editor (hours of labor), and physical distribution infrastructure. Today, AI content platforms like WSC Sports ingest live game feeds, use computer vision to identify key moments (goals, dunks, touchdowns, big plays), and automatically generate hundreds of highlight clips — tagged, formatted for every platform, personalized by team or player — in seconds, with no human editor. Then distribution: social media platforms (Instagram, TikTok, X, YouTube) gave every rights holder an essentially free means to develop and reach an audience — casual fans discovering a sport for the first time, hardcore fans who want every clip, and everyone in between. The cost of reaching a fan went from millions (buying airtime) to virtually zero (posting a clip). Cloud computing (AWS, Google Cloud) replaced on-premise servers. A league doesn't need a data center — they rent compute by the hour. Mobile-first cameras and production tools mean a single person with an iPhone and software like Riverside or StreamYard can produce broadcast-quality content that would have required a truck and crew of 20 in 2010. Layer these together: AI creates the content automatically, social platforms provide free audience reach across every fan segment, cloud handles the infrastructure, and mobile tools handle everything in between. The result: every rights holder — NFL to a D-III conference — is now a media company. They don't need ESPN to reach fans. They can do it themselves, own the audience data, and capture the revenue directly.", keyTerm: "Zero Marginal Cost Content: The convergence of AI content platforms (WSC Sports), free social distribution (TikTok, Instagram, YouTube), cloud computing (AWS), and mobile production tools collapsed the cost of creating and distributing professional sports content to near zero — enabling any rights holder to become a media company.", exercise: "Find a D-II or D-III school's social media. How sophisticated is their content? Now list the tools they'd need to produce it: an AI highlight platform, a social media scheduler, a smartphone, a Canva account. Total cost vs. what a broadcast production would have cost in 2010?" },
      { title: "The Fan Continuum", content: "VISUALIZE_FUNNEL", keyTerm: "Fan Continuum: The strategic framework for how sports rights holders grow and monetize their audience — moving fans from discovery (new) to engagement (casual) to conversion (hardcore) through progressively deeper content and direct relationships.", exercise: "Pick a sports league or team you follow. Find one piece of their content on social media that seems designed for NEW fans (viral, shareable, no context needed). Then find one designed for CASUAL fans (team-specific, requires some knowledge). Then find their app or OTT platform aimed at HARDCORE fans. How does the content differ at each level? What's the call-to-action at each stage?" },
      { title: "The WSC Sports Model", content: "WSC Sports sits at the center of this transformation. Using AI, the platform ingests live footage, identifies key moments, generates highlights, and distributes personalized clips across every platform — in real time. Leagues that relied entirely on broadcasters now do it themselves, at scale. NBA, NFL, hundreds of organizations worldwide. This is 'every rights holder is a media company' in practice — powered by the exponential technologies and convergence we covered in Module 1.", keyTerm: "AI-Enabled Content Platform: Technology using computer vision and ML to automatically ingest, analyze, create, and distribute sports content — replacing hours of manual work with seconds of automation.", exercise: "Check three leagues' social accounts. How much looks AI-generated (auto highlights, stat graphics)? How much human-created? What does the ratio tell you about where the industry is heading?" }
    ],
    quiz: [
      { q: "ESPN's cable model was profitable because:", o: ["Great programming", "Every household paid whether they watched or not (bundle economics)", "Low production costs", "No competition"], a: 1 },
      { q: "After cord-cutting, sports rights spending:", o: ["Collapsed", "Stayed flat", "Increased — more platforms, more money, but fragmented", "Only decreased for small leagues"], a: 2 },
      { q: "The most significant thing about D2C:", o: ["Lower prices", "Who owns the customer relationship and data", "Better quality", "More channels"], a: 1 },
      { q: "Disney's D2C advantage:", o: ["Nothing beyond streaming", "Connect viewing to parks, merch, personalized offers across entire ecosystem", "Only competes with Netflix", "Only helps ESPN"], a: 1 },
      { q: "Every rights holder can be a media company because:", o: ["More money", "Content creation/distribution costs collapsed — AI enables near-zero marginal cost", "ESPN shut down", "Fans prefer amateur content"], a: 1 },
      { q: "AI's role in the sports business revolution:", o: ["Minor", "Central — powers personalization and automation making D2C and rights-holder-as-media-company viable", "Only highlights", "Overhyped"], a: 1 }
    ]
  }
];

// ═══════════════════════════════════════════════════
// INDUSTRY DEEP DIVE — The Future Is Faster Than You Think
// ═══════════════════════════════════════════════════
const BOOK_CHAPTERS = [
  // Part I: The Power of Convergence
  { id: 1, part: "Part I: The Power of Convergence", title: "Convergence", topic: "How exponential technologies crash into each other to create disruption no single technology could achieve alone",
    keyThemes: ["Exponential technologies don't advance in isolation", "Convergence creates multiplicative, not additive, disruption", "Flying cars as a case study in convergence", "The gap between sci-fi and reality is closing faster than anyone expects"],
    summary: "The book opens with its central thesis: the real disruption doesn't come from any single technology improving on its own. It comes from convergence \u2014 the moment when multiple exponential technologies collide simultaneously. Diamandis and Kotler argue that while individual technologies like AI, sensors, and robotics are each impressive alone, their true power emerges at the intersections. When AI meets sensors, when 3D printing meets materials science, when networks meet robotics \u2014 capabilities emerge that none could achieve alone. The result is multiplicative, not additive. The authors use Uber's flying car initiative (Uber Elevate) as the signature example: creating a viable eVTOL required simultaneous breakthroughs in machine learning, battery technology, materials science, 3D-printed engine components, sensor arrays, and air traffic management software. No single technology made it possible. Their convergence did. This convergence framework becomes the lens through which the entire book examines the future.",
    futureVision: "Imagine ordering a flying rideshare as easily as you call an Uber today. By the late 2020s, Diamandis and Kotler envision eVTOLs whisking commuters between rooftop 'mega-skyports' that handle a thousand takeoffs per hour. Uber's specifications require these skyports to recharge vehicles in seven to fifteen minutes and occupy no more than three acres \u2014 small enough to sit atop old parking garages. The convergence of lightweight materials, AI-powered navigation, advanced batteries, and 5G networks turns urban air mobility from science fiction into a commuter option.",
    sportsConnection: "Think about how many exponential technologies converge in a single modern sports broadcast: AI cameras, RFID player tracking, real-time AR graphics, automated highlights, personalized betting feeds, 5G mobile delivery. None existed together a decade ago."
  },
  { id: 2, part: "Part I: The Power of Convergence", title: "The Jump to Lightspeed: Exponential Technologies, Part I", topic: "Deep dives into quantum computing, artificial intelligence, robotics, nanotechnology, and biotechnology",
    keyThemes: ["Quantum computing solving previously impossible problems", "AI progressing from narrow intelligence toward general capability", "Robotics moving from factories into everyday life", "Nanotechnology and biotechnology converging to reshape the physical world"],
    summary: "This chapter provides a detailed tour of five foundational exponential technologies. Quantum computing: by exploiting quantum mechanics (superposition and entanglement), quantum computers can solve problems that classical computers never will \u2014 from drug discovery to materials science to cryptography. Artificial intelligence: the authors trace AI's rapid evolution from narrow task-specific systems toward increasingly general capabilities, powered by deep learning, massive datasets, and accelerating hardware. They note that AI is the most important of the exponential technologies because it amplifies all the others. Robotics: robots are moving out of factories and into homes, hospitals, warehouses, and streets \u2014 driven by cheaper sensors, better AI, and improved actuators. Nanotechnology: engineering at the molecular scale enables new materials, targeted drug delivery, and manufacturing precision impossible at human scale. Biotechnology: CRISPR gene editing, synthetic biology, and genomics are giving humans the ability to read, write, and edit the code of life itself. The chapter emphasizes that each of these is powerful individually but transformative when they converge.",
    futureVision: null,
    sportsConnection: "AI is already the most impactful exponential technology in sports: from computer vision analyzing game footage, to natural language models writing recaps, to machine learning optimizing training loads. Every other technology in this chapter amplifies what AI can do for sports."
  },
  { id: 3, part: "Part I: The Power of Convergence", title: "The Turbo-Boost: Exponential Technologies, Part II", topic: "Deep dives into networks, energy, 3D printing, augmented/virtual reality, and blockchain",
    keyThemes: ["5G and satellite networks connecting the entire planet", "Solar energy and batteries reaching cost tipping points", "3D printing enabling distributed, on-demand manufacturing", "AR/VR approaching holodeck-level immersion", "Blockchain creating trustless systems"],
    summary: "The second technology deep dive covers five more exponential technologies. Networks: 5G and satellite constellations (like SpaceX's Starlink) are bringing gigabit connectivity to every corner of the planet, connecting the next several billion people and enabling real-time data transfer for autonomous vehicles, telemedicine, and IoT. Energy: solar costs have dropped 200x in 40 years and batteries are on a similar curve, making clean energy cheaper than fossil fuels and enabling energy abundance. 3D printing: also called additive manufacturing, this technology is moving from prototyping to production \u2014 printing everything from rocket engines to houses to human organs. AR/VR: augmented and virtual reality are converging toward what the authors call the holodeck \u2014 fully immersive environments indistinguishable from physical reality. Blockchain: a decentralized, tamper-proof ledger enabling trustless transactions, smart contracts, and new organizational structures without intermediaries. Together with the technologies from Chapter 2, these ten exponentials form the raw ingredients for the convergences explored in the rest of the book.",
    futureVision: "SpaceX's Starlink and similar satellite constellations beam high-speed internet to every square meter of the planet. A farmer in rural sub-Saharan Africa has the same connectivity as a developer in Silicon Valley. Combined with AI translation, cheap smartphones, and mobile banking, billions of people gain access to the global economy for the first time \u2014 creating an unprecedented wave of entrepreneurship, education, and economic growth.",
    sportsConnection: "5G networks are already reshaping live sports: multi-angle streaming, in-stadium AR experiences on your phone, real-time betting integration. 3D printing is creating custom-fit protective equipment. VR is transforming how fans attend games remotely."
  },
  { id: 4, part: "Part I: The Power of Convergence", title: "The Acceleration of Acceleration", topic: "Why the pace of change itself is speeding up, driven by compounding forces beyond technology alone",
    keyThemes: ["Seven forces accelerating the rate of change", "Saved time creates more time for innovation", "Falling costs of capital and experimentation", "The abundance of genius: more connected minds than ever before"],
    summary: "Having established the ten exponential technologies, this chapter explains why the pace of change itself is accelerating \u2014 not just because of the technologies, but because of seven compounding forces. First, saved time: technology frees up hours in our day (think GPS replacing map-reading, or AI replacing manual research), and that freed time gets reinvested into more innovation. Second, more available capital: crowdfunding, venture capital, and falling startup costs mean more ideas get funded than ever before. Third, demonetization: as products become digital, their marginal cost drops toward zero, lowering barriers to experimentation. Fourth, more genius: global connectivity means the world's smartest people can find each other, collaborate, and build on each other's work. Fifth, increased communication: ideas spread faster than ever. Sixth, longer lifespans mean more productive years per person. Seventh, the convergence of all the above creates a meta-acceleration \u2014 the rate of change compounds on itself. The authors argue this is why experts consistently underestimate how fast disruption arrives: they project linearly in an exponential world.",
    futureVision: null,
    sportsConnection: "This chapter explains why sports media disruption feels like it's accelerating: it's not just one technology changing the game. It's cheaper tools, more connected creators, democratized distribution, and AI capability all compounding simultaneously. The gap between 2020 and 2025 in sports tech is bigger than the gap between 2010 and 2020."
  },
  // Part II: The Rebirth of Everything
  { id: 5, part: "Part II: The Rebirth of Everything", title: "The Future of Shopping", topic: "Retail reinvented by AI, AR, drones, and data",
    keyThemes: ["AI-driven personalization at scale", "The death of traditional retail and rise of the experience economy", "Cashierless stores and smart shelves", "3D printing enabling on-demand manufacturing"],
    summary: "Diamandis and Kotler argue that shopping will split into two paths. Path A: physical retail reinvents itself as an 'experience economy' \u2014 stores become hyper-personalized destinations combining entertainment, wellness, and education. Smart mirrors show you wearing clothes you haven't tried on. Eye scanners create personalized fast lanes based on purchase history. Stores become places you go for the experience, not just the product. Path B: shopping disappears entirely into AI. Your personal AI knows your preferences, body measurements, schedule, and budget. It orders what you need before you know you need it. Drone delivery and autonomous vehicles bring it to your door. The authors describe Westfield's 'Destination 2028' concept \u2014 a hyper-connected micro-city with sensory gardens, smart bathrooms offering nutrition tips, and magic mirrors. They also discuss how 3D printing enables zero-waste, on-demand manufacturing: a body scan at a store produces a perfectly fitted garment printed on the spot.",
    futureVision: "It's 2028 in Chicago. You forgot your coat on a rainy day. During your autonomous Uber ride, your AI finds a nearby shop selling lab-grown vegan leather jackets. You walk in, a full-body scan takes your measurements in seconds, and the jacket is 3D-printed to your exact fit while you grab a coffee next door. You walk out wearing it \u2014 no inventory, no waste, no wrong sizes. The store didn't stock the jacket. It manufactured it for you in minutes.",
    sportsConnection: "Sports merchandising is already moving this direction. AI personalization recommends gear based on your team, player preferences, and viewing habits. On-demand manufacturing could mean customized jerseys printed in-arena."
  },
  { id: 6, part: "Part II: The Rebirth of Everything", title: "The Future of Advertising", topic: "Attention economies, personalization, and the death of mass marketing",
    keyThemes: ["The attention economy and its limits", "AI enabling hyper-personalized ad targeting", "AR overlays replacing physical billboards", "The end of mass marketing as we know it"],
    summary: "The advertising industry is being completely restructured by AI and AR. Diamandis and Kotler describe a world where mass-market advertising \u2014 the same commercial shown to millions \u2014 becomes obsolete. AI enables ads tailored not just to demographics but to individual behavior, mood, location, and real-time context. Augmented reality takes this further: physical billboards become dynamic digital overlays that show different ads to different people looking at the same space. The authors explore how attention itself becomes the scarce resource. As AI gets better at predicting what you want, advertising evolves from interruption to anticipation \u2014 showing you things you didn't know you wanted at the exact moment you're most receptive. The chapter also covers the ethical tensions: hyper-personalization creates extraordinary value for consumers and brands, but it requires unprecedented access to personal data.",
    futureVision: "You're walking down the street wearing AR glasses. The billboard on the corner shows you an ad for running shoes in your size and preferred color \u2014 because your AI knows you ran a 10K last weekend and your current shoes have 400 miles on them. The person next to you sees an ad for a restaurant their spouse would love, because their anniversary is this week. Same billboard, completely different ads, both eerily relevant.",
    sportsConnection: "Sports broadcasting already leads in targeted advertising. Dynamic ad insertion means the same game shows different commercials to different streaming viewers. AR-powered virtual signage means courtside ads can change by market in real time."
  },
  { id: 7, part: "Part II: The Rebirth of Everything", title: "The Future of Entertainment", topic: "Immersive experiences, spatial computing, and the creator economy",
    keyThemes: ["VR and AR creating the experiential age", "The holodeck as an achievable near-term goal", "AI-generated content and interactive storytelling", "Flow states and addictive immersion"],
    summary: "Entertainment is converging toward full immersion. Diamandis and Kotler trace a path from passive consumption (watching a screen) to active participation (living inside the story). VR headsets are getting lighter, cheaper, and more realistic every year. Haptic suits add touch. AI generates responsive narratives that adapt to your choices in real time. The authors argue we're heading toward a real-life holodeck \u2014 Star Trek's immersive entertainment room \u2014 within a generation. They also explore the neuroscience: VR is uniquely powerful at triggering flow states (deep, focused immersion), making it potentially more engaging \u2014 and more addictive \u2014 than any previous medium. The chapter addresses the democratization of entertainment creation too. AI tools mean a single creator can produce content that once required a full studio, fundamentally reshaping who can tell stories and how they're distributed.",
    futureVision: "You put on a lightweight headset and step into a fully realized world \u2014 not watching a movie, but living inside one. The AI-driven narrative adapts to your decisions. Haptic feedback lets you feel rain and wind. You're not an audience member; you're the protagonist. When you remove the headset an hour later, the 'real' world feels flat by comparison. The authors warn this immersive pull will be one of the great challenges of the coming decades.",
    sportsConnection: "Imagine attending an NBA game courtside from your living room in full VR \u2014 looking around the arena, hearing the crowd, choosing your own camera angles. Sports is the killer app for immersive tech because it's live, emotional, and inherently visual."
  },
  { id: 8, part: "Part II: The Rebirth of Everything", title: "The Future of Education", topic: "AI tutors, personalized learning, and the end of one-size-fits-all",
    keyThemes: ["AI tutors adapting to individual learning styles", "VR enabling experiential learning", "The end of one-size-fits-all classrooms", "Gamification and flow-state learning"],
    summary: "The authors argue that the current education model \u2014 one teacher lecturing 30 students at the same pace \u2014 is a relic of the industrial age and is about to be disrupted as fundamentally as retail or media. AI enables personalized tutoring at scale: every student gets an AI tutor that adapts to their learning pace, style, and interests in real time. If a student learns math better through sports examples, the AI teaches math through sports. VR adds experiential learning: instead of reading about ancient Rome, you walk through it. Instead of memorizing the water cycle, you fly through a rainstorm as a water molecule. Gamification layers add engagement mechanics that trigger flow states. The result is education that's more engaging, more effective, and radically more accessible \u2014 a child in rural Kenya gets the same quality AI tutor as a student at an elite prep school.",
    futureVision: "A student struggles with photosynthesis. Their AI tutor notices they learn best through visual-spatial interaction and love soccer. The next lesson shrinks the student down to molecular size inside a VR leaf, where they play a game: as a water molecule, they navigate the plant's vascular system, collect sunlight energy, and 'score goals' by completing the chemical reactions of photosynthesis. They master in 20 minutes what a textbook couldn't teach in a week.",
    sportsConnection: "Sports analytics training is already moving this direction. VR quarterback training lets players read defenses from inside the play. AI coaching tools adapt practice drills to individual player weaknesses."
  },
  { id: 9, part: "Part II: The Rebirth of Everything", title: "The Future of Healthcare", topic: "Diagnostics, wearables, robotic surgery, and the shift to predictive medicine",
    keyThemes: ["AI outperforming human doctors in diagnostics", "Continuous monitoring via wearable sensors", "The shift from reactive to predictive medicine", "Genome sequencing at near-zero cost"],
    summary: "Healthcare is shifting from reactive ('you feel sick, you see a doctor') to proactive and predictive ('your devices detect illness before you have symptoms'). Diamandis and Kotler describe a convergence of AI diagnostics, wearable biosensors, genome sequencing, and robotic surgery that will fundamentally transform medicine. AI already matches or exceeds human doctors in reading radiology scans, pathology slides, and retinal images. Wearable sensors continuously monitor blood chemistry, heart rhythm, sleep quality, and stress hormones. Genome sequencing \u2014 which cost $2.7 billion for the first human genome \u2014 now costs under $200, enabling personalized medicine tailored to your DNA. The authors describe a near-future where your bathroom mirror, toilet, and wearables form a continuous health monitoring system that detects cancer, heart disease, or infection weeks or months before symptoms appear.",
    futureVision: "You step onto your bathroom scale in the morning. It doesn't just weigh you \u2014 it analyzes your gait for neurological changes, checks your body composition, and sends data to your AI health system. Your smart mirror scans your face for micro-expressions indicating pain or fatigue. Your toilet analyzes biomarkers in your urine. Before you finish brushing your teeth, your AI alerts you: 'Your inflammatory markers have trended up for three days. Based on your genome and these patterns, there's a 40% probability of a respiratory infection developing. I've scheduled a telemedicine consult and prepped a preventive protocol.'",
    sportsConnection: "Sports medicine is the testing ground for predictive health tech. Wearable sensors already track player load, sleep, and biometrics. AI predicts injury risk before it happens. The same technology is coming to the general population."
  },
  { id: 10, part: "Part II: The Rebirth of Everything", title: "The Future of Longevity", topic: "Extending healthspan, biotech, and the economics of aging",
    keyThemes: ["Extending healthspan, not just lifespan", "Stem cell therapies and organ regeneration", "Senolytics and aging as a treatable condition", "The longevity escape velocity concept"],
    summary: "This chapter argues that aging itself will increasingly be treated as a disease rather than an inevitability. Diamandis and Kotler explore breakthroughs in stem cell therapy, gene editing (CRISPR), senolytics (drugs that clear damaged senescent cells), and organ regeneration through 3D bioprinting. The concept of 'longevity escape velocity' is central: the point at which science extends your life by more than one year for every year you're alive. The authors believe we're approaching this threshold. They discuss Ray Kurzweil's prediction that by the mid-2030s, nanobots in our bloodstream will continuously repair damage at the cellular level. The economic implications are staggering: if people routinely live to 120 or beyond, every institution \u2014 retirement, pensions, career planning, marriage \u2014 must be reinvented.",
    futureVision: "You're 70 years old but biologically 50. A quarterly visit to a longevity clinic includes a full-body MRI read by AI, a blood draw analyzed for thousands of biomarkers, a stem cell infusion to regenerate worn joints, and a senolytic treatment to clear aging cells. Your 3D-bioprinted replacement kidney, grown from your own cells, has been functioning perfectly for five years. Your doctor \u2014 an AI \u2014 tells you that at current rates of medical advancement, your expected remaining healthspan is another 50 years.",
    sportsConnection: "Professional athletes are the earliest adopters of longevity science. Tom Brady's TB12 method, LeBron James spending $1.5M/year on body maintenance, PRP therapy, cryotherapy \u2014 these are primitive versions of what's coming for everyone."
  },
  { id: 11, part: "Part II: The Rebirth of Everything", title: "The Future of Insurance, Finance, and Real Estate", topic: "How converging technologies reshape risk, money, and where we live",
    keyThemes: ["Real-time risk data replacing actuarial tables and eliminating insurance uncertainty", "AI financial advisors and blockchain smart contracts replacing banks and middlemen", "Remote work and VR severing the link between where you work and where you live", "3D-printed homes, autonomous vehicles, and smart cities reshaping urban planning"],
    summary: "This chapter examines three interconnected industries through the lens of convergence. Insurance: fundamentally a bet on uncertainty, but converging technologies are destroying uncertainty itself. Autonomous vehicles could eliminate 90%+ of car accidents, devastating the $260 billion auto insurance industry. Continuous health monitoring via wearables gives insurers real-time risk profiles, not statistical approximations. Smart home sensors detect problems before they cause damage. Finance: AI-powered robo-advisors are outperforming human advisors. Blockchain enables trustless transactions without banks or clearinghouses. Mobile banking reaches billions of previously unbanked people. Smart contracts execute automatically when conditions are met, no lawyers required. Crowdfunding democratizes access to capital globally. Real estate: high-bandwidth networks and VR sever the historic link between where you work and where you live. If your virtual office feels identical to being there, why live in an expensive city? 3D-printed houses (built in 24 hours for under $10,000) could solve housing affordability. Smart cities use AI and IoT to optimize everything. Autonomous vehicles eliminate parking lots, freeing land for housing and parks.",
    futureVision: "Your home insurance premium adjusts monthly based on real-time sensor data. Your auto insurance costs almost nothing because your self-driving car hasn't had an incident in years. Your AI financial advisor manages your entire portfolio, negotiates your mortgage by shopping 200 lenders in milliseconds, and files your taxes automatically. When you buy a house, a blockchain smart contract handles the closing in minutes, not weeks. Meanwhile, you live on a 10-acre property in rural Vermont that cost less than a Manhattan studio \u2014 because you 'commute' to your San Francisco office in VR every morning. Your house was 3D-printed in 48 hours.",
    sportsConnection: "Sports finance is being disrupted by blockchain fan tokens, NFT collectibles, fractional team ownership, and athlete NIL marketplaces. Smart stadiums with IoT sensors optimize every aspect of the venue experience. And the real estate implications are huge: if fans can attend games in VR from anywhere, what happens to the economics of stadium location?"
  },
  { id: 12, part: "Part II: The Rebirth of Everything", title: "The Future of Food", topic: "Lab-grown meat, vertical farms, AI agriculture, and supply chains",
    keyThemes: ["Cultured meat grown from stem cells without slaughtering animals", "Vertical farms using 95% less water and zero pesticides", "AI-optimized precision agriculture monitoring individual plants", "CRISPR gene editing for crop resilience"],
    summary: "The food system is one of the most resource-intensive industries on Earth, and Diamandis and Kotler argue it's about to be transformed by convergence. Lab-grown (cultured) meat, produced from animal stem cells without slaughtering animals, could be cost-competitive with conventional meat by the late 2020s. Vertical farms \u2014 indoor facilities stacking crops in layers under LED lights \u2014 use 95% less water, zero pesticides, and can operate year-round in any climate, including food deserts and urban centers. AI-optimized precision agriculture uses drones, sensors, and machine learning to monitor individual plants, applying exactly the right amount of water and nutrients at exactly the right time. CRISPR gene editing creates crops resistant to drought, disease, and pests without traditional GMO techniques. The result: more food, less land, less water, fewer chemicals, lower costs.",
    futureVision: "A robotic kitchen in your home stores ingredients from a vertical farm three blocks away, delivered by autonomous vehicle that morning. You tell your AI what you feel like eating. It considers your nutritional needs (from your wearable data), what's fresh, your dietary preferences, and what your family enjoyed last week. It suggests three options. You pick one. A robotic arm system \u2014 essentially a pair of chef-quality mechanical hands \u2014 prepares the meal from scratch while you relax. The 'steak' is cultured meat, indistinguishable from conventional beef, produced without a single cow. Total cost: about $3.",
    sportsConnection: "Athlete nutrition is already being transformed by precision food science. AI-driven meal plans optimized for performance, recovery, and body composition are primitive versions of what's coming for everyone."
  },
  // Part III: The Faster Future
  { id: 13, part: "Part III: The Faster Future", title: "Threats and Solutions", topic: "Deepfakes, job displacement, bias, surveillance, power concentration \u2014 and what can be done",
    keyThemes: ["Technological unemployment and the great displacement", "Deepfakes eroding trust in information", "Algorithmic bias and systemic inequity", "Surveillance capitalism and concentration of power", "Potential solutions: UBI, retraining, regulation, and new governance models"],
    summary: "After the optimistic vision of Part II, Diamandis and Kotler confront what can go wrong. The same exponential technologies enabling extraordinary progress also enable extraordinary harm. AI-powered automation could displace millions of jobs faster than new ones are created, with truck driving, retail, food service, and office administration most at risk. Deepfakes \u2014 AI-generated fake video and audio \u2014 erode trust in media and could destabilize elections, markets, and public discourse. Algorithmic bias means AI systems trained on historical data can perpetuate and amplify racial, gender, and socioeconomic discrimination at scale. Surveillance technology gives governments and corporations unprecedented ability to monitor individuals. And perhaps most concerning: the benefits of exponential technology tend to concentrate among those who control the platforms, potentially creating a new class of technology oligarchs with more power than nation-states. Critically, this chapter isn't just about threats \u2014 it's 'Threats and Solutions.' The authors explore potential responses including universal basic income (UBI), massive retraining programs, new regulatory frameworks, incentive prizes for solving global challenges, and governance models adapted to the speed of technological change.",
    futureVision: null,
    sportsConnection: "These threats are already manifesting in sports: deepfake athlete videos manipulating betting markets, biometric surveillance controversies in stadiums, AI-generated coverage that systematically under-represents women's sports, algorithmic bias in scouting and recruiting tools, and power concentration as tech platforms control sports distribution."
  },
  { id: 14, part: "Part III: The Faster Future", title: "The Five Great Migrations", topic: "Climate, urban, virtual, space, and meta-intelligence \u2014 five forces reshaping civilization",
    keyThemes: ["Climate migration: hundreds of millions relocating due to environmental disruption", "Urban migration: smart mega-cities of 50+ million people", "Virtual migration: humanity spending increasing time in digital worlds", "Space migration: Moon bases, Mars colonization, commercial space access", "Meta-intelligence: humans merging with AI through brain-computer interfaces"],
    summary: "The book closes with five massive migrations that will reshape civilization over the coming century. Climate migration: rising seas, extreme weather, and agricultural disruption will force hundreds of millions to relocate, creating political and humanitarian crises on an unprecedented scale. Urban migration: smart cities optimized by AI will attract populations with superior services, creating mega-cities of 50+ million people with AI-managed infrastructure. Virtual migration: as VR and AR become indistinguishable from reality, humanity will spend increasing time in digital worlds \u2014 working, socializing, and playing in virtual spaces that feel more compelling than physical reality. Space migration: SpaceX and Blue Origin are making space access cheaper by orders of magnitude, with Moon bases and Mars colonization becoming tangible goals within decades, not centuries. Meta-intelligence migration: the most profound \u2014 humans augmenting their cognitive capabilities through brain-computer interfaces, effectively merging with AI. Elon Musk's Neuralink and similar efforts aim to create a direct neural connection between human brains and the cloud, creating what the authors call a collective consciousness that may be the only way humans remain relevant alongside superintelligent AI.",
    futureVision: "Combining brain-computer interfaces with cloud-connected AI, Diamandis and Kotler envision a future where human intelligence is no longer bounded by biology. You don't search for information; you simply know it, because your neural interface accesses the entire knowledge base of humanity in real time. A group of linked minds collaborates on a problem simultaneously, each contributing a piece of the cognitive work. The boundary between 'you' and 'the network' blurs. The authors call this meta-intelligence \u2014 a collective consciousness that may be the only way humans remain relevant in a world of superintelligent AI.",
    sportsConnection: "For sports, virtual migration is the most immediate: Gen Alpha experiences sports primarily through gaming and social media, not broadcast TV. The virtual and meta-intelligence migrations will reshape how sports are experienced, produced, and consumed. If fans can attend games in full-immersion VR, what does 'home field advantage' even mean?"
  }
];

function Bg() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d"); let frame, ps = [];
    const rs = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; }; rs(); window.addEventListener("resize", rs);
    for (let i = 0; i < 30; i++) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15, r:Math.random()*.8+.3, o:Math.random()*.12+.03 });
    const d = () => { ctx.clearRect(0,0,c.width,c.height); ps.forEach((p,i) => { p.x+=p.vx;p.y+=p.vy; if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0; ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${p.o})`;ctx.fill(); for(let j=i+1;j<ps.length;j++){const dd=Math.hypot(p.x-ps[j].x,p.y-ps[j].y);if(dd<100){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(ps[j].x,ps[j].y);ctx.strokeStyle=`rgba(255,255,255,${.025*(1-dd/100)})`;ctx.stroke();}}}); frame=requestAnimationFrame(d); }; d();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", rs); };
  }, []); return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} />;
}

function Ring({p,size=48,sw=4,color="#fff"}) { const r=(size-sw)/2,c=2*Math.PI*r; return <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c-(p/100)*c} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.5s"}}/></svg>; }
function Tag({children,color:cl="#666",bg="rgba(255,255,255,0.05)"}) { return <span style={{display:"inline-block",background:bg,color:cl,padding:"3px 10px",borderRadius:16,fontSize:10,fontWeight:700,letterSpacing:.3}}>{children}</span>; }
function SegProg({cur,total,color}) { return <div style={{display:"flex",gap:4,marginBottom:20}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=cur?color:"rgba(255,255,255,0.08)",transition:"background 0.3s"}}/>)}</div>; }

const gs={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#888",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"};
const bs=(bg)=>({background:bg,border:"none",color:"#fff",padding:"12px 24px",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"});

const INSTRUCTOR_PASSCODE = "MSU12345!";

export default function App() {
  // ── Hash-based URL routing ──
  const parseHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/").filter(Boolean);
    if(parts[0]==="module" && parts[1]) {
      const modNum = parseInt(parts[1]);
      if(modNum>=1 && modNum<=MODULES.length) {
        if(parts[2]==="quiz") return { view:"quiz", mi:modNum-1 };
        if(parts[2]==="results") return { view:"results", mi:modNum-1 };
        return { view:"module", mi:modNum-1 };
      }
    }
    if(parts[0]==="deepdive") {
      if(parts[1]==="results") return { view:"ddresults" };
      if(parts[1]==="chapter" && parts[2]) { const chNum=parseInt(parts[2]); if(chNum>=1&&chNum<=BOOK_CHAPTERS.length) return { view:"chapter", chapterId:chNum }; }
      return { view:"deepdive" };
    }
    if(parts[0]==="instructor") return { view:"instructor" };
    return { view:"home" };
  };

  const initial = parseHash();
  const [view,setView]=useState(initial.view);
  const [mi,setMi]=useState(initial.mi||0);
  const [chapterId,setChapterId]=useState(initial.chapterId||null);
  const [si,setSi]=useState(0);
  const [ans,setAns]=useState({});
  const [done,setDone]=useState({});
  const [scores,setScores]=useState({});
  const [fade,setFade]=useState(true);
  const [showDeeper,setShowDeeper]=useState(false);
  const [studentName,setStudentName]=useState(null);
  const [nameInput,setNameInput]=useState("");
  const [confirmingName,setConfirmingName]=useState(null);
  const [loading,setLoading]=useState(true);
  const [dashPass,setDashPass]=useState("");
  const [dashData,setDashData]=useState([]);
  const [dashLoading,setDashLoading]=useState(false);
  const [dashTab,setDashTab]=useState("progress");
  const [dashMod,setDashMod]=useState(0);
  const [expanded,setExpanded]=useState({});
  const [dashAuthed,setDashAuthed]=useState(()=>{try{return localStorage.getItem("sptc243-instructor")==="true";}catch(e){return false;}});
  const [intakeComplete,setIntakeComplete]=useState(()=>{try{return localStorage.getItem("sptc243-intake-done")==="true";}catch(e){return false;}});
  const [intakeAnswers,setIntakeAnswers]=useState({});
  const [intakeStep,setIntakeStep]=useState(0);

  // Deep Dive state
  const [ddChapterAssignments,setDdChapterAssignments]=useState({}); // {chapterId: {students:["name",...], presentDate:""}}
  const [ddQuizQuestions,setDdQuizQuestions]=useState([]); // [{id,chapterId,studentName,type,question,options,answer,status:"pending"|"approved"|"rejected"}]
  const [ddRollingQuiz,setDdRollingQuiz]=useState(null); // current quiz session
  const [ddQuizHistory,setDdQuizHistory]=useState([]); // past quiz results for this student
  const [ddSubmitQ,setDdSubmitQ]=useState({type:"mc",question:"",options:["","","",""],answer:"",chapterId:null});
  const [ddQuizAns,setDdQuizAns]=useState({});

  // Roster state
  const [roster,setRoster]=useState([]); // ["First Last", ...]
  const [showNameEntry,setShowNameEntry]=useState(false); // for "I don't see my name"
  const [rosterNewName,setRosterNewName]=useState(""); // instructor adding to roster

  // Load student identity from localStorage, progress from Firebase
  useEffect(()=>{
    (async()=>{
      try {
        const saved = localStorage.getItem("sptc243-student");
        if(saved){
          const parsed = JSON.parse(saved);
          setStudentName(parsed.name);
          if(db){
            try {
              const snap = await get(child(ref(db), "students/"+fbKey(parsed.name)));
              if(snap.exists()){
                const p = snap.val();
                if(p.done) setDone(p.done);
                if(p.scores) setScores(p.scores);
                if(p.intake) { setIntakeComplete(true); setIntakeAnswers(p.intake); try{localStorage.setItem("sptc243-intake-done","true");}catch(e2){} }
                if(p.ddQuizHistory) setDdQuizHistory(p.ddQuizHistory);
              }
            } catch(e){}
            // Load deep dive chapter assignments
            try {
              const ddSnap = await get(child(ref(db), "deepdive/chapters"));
              if(ddSnap.exists()) setDdChapterAssignments(ddSnap.val());
            } catch(e){}
            // Load deep dive quiz questions
            try {
              const qqSnap = await get(child(ref(db), "deepdive/quizQuestions"));
              if(qqSnap.exists()) {
                const qs = qqSnap.val();
                setDdQuizQuestions(Object.keys(qs).map(k=>({id:k,...qs[k]})));
              }
            } catch(e){}
          }
        }
      } catch(e){}
      // Always load roster for the dropdown (even before login)
      if(db){
        try {
          const rosterSnap = await get(child(ref(db), "roster"));
          if(rosterSnap.exists()) {
            const r = rosterSnap.val();
            setRoster(Array.isArray(r) ? r : Object.values(r));
          }
        } catch(e){}
      }
      setLoading(false);
    })();
  },[]);

  // Sync progress to Firebase
  const syncProgress = async (newDone, newScores) => {
    if(!studentName||!db) return;
    const data = { name: studentName, done: newDone, scores: newScores, lastActive: new Date().toISOString() };
    try { await set(ref(db, "students/"+fbKey(studentName)), data); } catch(e){ console.error("Sync failed:", e); }
  };

  // Register student
  // Normalize name: trim, collapse spaces, capitalize each word
  const normalizeName = (name) => name.trim().replace(/\s+/g," ").split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(" ");

  // Step 1: validate and show confirmation
  const startRegistration = () => {
    const trimmed = nameInput.trim();
    if(!trimmed) return;
    const parts = trimmed.split(/\s+/);
    if(parts.length < 2) { alert("Please enter your first and last name."); return; }
    setConfirmingName(normalizeName(trimmed));
  };

  // Step 2: confirmed — save to localStorage + Firebase
  const registerStudent = async (name) => {
    const onRoster = roster.includes(name);
    try {
      localStorage.setItem("sptc243-student", JSON.stringify({ name }));
      if(db) await set(ref(db, "students/"+fbKey(name)), { name, onRoster, done: {}, scores: {}, lastActive: new Date().toISOString() });
      setStudentName(name);
      setConfirmingName(null);
      setNameInput("");
      setShowNameEntry(false);
    } catch(e){ console.error("Registration failed:", e); setStudentName(name); setConfirmingName(null); }
  };

  // Logout (reset local identity)
  const logoutStudent = () => {
    localStorage.removeItem("sptc243-student");
    localStorage.removeItem("sptc243-intake-done");
    setStudentName(null);
    setDone({});
    setScores({});
    setNameInput("");
    setConfirmingName(null);
    setIntakeComplete(false);
    setIntakeAnswers({});
    setIntakeStep(0);
  };

  const INTAKE_SECTIONS = [
    { title: "Where Are You Right Now?", subtitle: "No wrong answers — this helps calibrate the course to you.", questions: [
      { id:"ai_understanding", q:"How would you rate your understanding of artificial intelligence?", type:"single", opts:["No idea what it really is","Heard of it, haven't used it","Used ChatGPT a few times","Use AI tools regularly","Could explain how LLMs work"] },
      { id:"ai_tools_used", q:"Which of these AI tools have you used?", type:"multi", opts:["ChatGPT","Claude","Gemini","Grok","Perplexity","Midjourney / DALL-E","None of these"] },
      { id:"exponential_check", q:"If a technology doubles in capability every year, how much better is it after 10 years?", type:"single", opts:["10 times better","20 times better","About 100 times better","Over 1,000 times better"] },
      { id:"cord_cutting", q:"What does 'cord-cutting' refer to in media?", type:"single", opts:["Editing video clips shorter","Canceling cable TV for streaming services","Cutting production costs","Not sure"] },
      { id:"espn_model", q:"ESPN's cable business was primarily built on:", type:"single", opts:["Advertising revenue only","Subscription fees paid by every cable household","Government funding for sports","Not sure"] },
      { id:"ai_confidence", q:"How confident are you in your ability to use AI tools in a professional work setting?", type:"single", opts:["Not at all confident","Slightly confident","Moderately confident","Very confident","Extremely confident"] },
    ]},
    { title: "How Do You Engage?", subtitle: "Help us understand what you follow and how you consume content.", questions: [
      { id:"sports_followed", q:"Which sports do you actively follow?", type:"multi", opts:["NFL","NBA","MLB","NHL","MLS / Soccer","College Football","College Basketball","Tennis","Golf","F1 / NASCAR","Combat Sports (UFC/Boxing)","Women's Sports (WNBA/NWSL)","Esports","Other"] },
      { id:"content_consumption", q:"How do you primarily consume sports content?", type:"multi", opts:["TV broadcast","Streaming apps","Social media clips","Podcasts","Sports betting apps","Gaming (EA FC, 2K, etc.)","Highlights on YouTube","Reddit / forums"] },
      { id:"social_platforms", q:"Which social platforms do you use most?", type:"multi", opts:["Instagram","TikTok","X / Twitter","YouTube","Snapchat","Reddit","LinkedIn","Threads"] },
      { id:"sports_moment", q:"When you see an incredible sports moment, what do you do first?", type:"single", opts:["Watch the replay on TV","Search for it on social media","Text or message someone about it","Check betting implications","Post or share it online","Look for the highlight clip"] },
      { id:"learning_style", q:"How do you prefer to learn new concepts?", type:"single", opts:["Reading / text","Video","Hands-on practice","Group discussion","A mix depending on the topic"] },
      { id:"class_activities", q:"What kind of class activities get you most engaged?", type:"multi", opts:["Building real projects","Debating ideas","Analyzing real companies","Guest speakers from the industry","Competitive challenges","Working in small groups"] },
      { id:"tech_comfort", q:"What's your comfort level with technology in general?", type:"single", opts:["Struggle with the basics","Can usually figure things out","Comfortable with most tools","Power user","I build things"] },
    ]},
    { title: "Your Ambition", subtitle: "What brought you here and where you're headed.", questions: [
      { id:"career_path", q:"What career path interests you most right now?", type:"single", opts:["Sports journalism","Social media management","Sports marketing","Broadcasting / production","Analytics / data","Sports business / management","Content creation","Not sure yet","Other"] },
      { id:"why_class", q:"Why did you take this class?", type:"multi", opts:["Required for my major","Interested in AI","Interested in sports media","Thought it sounded different","Want practical career skills","Professor recommendation","Other"] },
      { id:"class_success", q:"What would make this class a success for you?", type:"text" },
      { id:"skill_hope", q:"What's one skill you hope to have by the end of this course?", type:"text" },
      { id:"ai_attitude", q:"How would you describe your attitude toward AI's impact on your future career?", type:"single", opts:["Worried it will replace me","Uncertain about what it means","Cautiously optimistic","Excited about the opportunity","Already using it to get ahead"] },
    ]}
  ];

  const allIntakeQs = INTAKE_SECTIONS.flatMap(s=>s.questions);
  const intakeReady = allIntakeQs.every(q=>q.type==="text"?(intakeAnswers[q.id]||"").trim().length>0:intakeAnswers[q.id]!==undefined&&(Array.isArray(intakeAnswers[q.id])?intakeAnswers[q.id].length>0:true));
  const sectionReady = (secIdx) => INTAKE_SECTIONS[secIdx].questions.every(q=>q.type==="text"?(intakeAnswers[q.id]||"").trim().length>0:intakeAnswers[q.id]!==undefined&&(Array.isArray(intakeAnswers[q.id])?intakeAnswers[q.id].length>0:true));

  const submitIntake = async () => {
    if(!studentName||!db) return;
    try {
      const snap = await get(child(ref(db), "students/"+fbKey(studentName)));
      const existing = snap.exists() ? snap.val() : {};
      await set(ref(db, "students/"+fbKey(studentName)), { ...existing, intake: intakeAnswers, lastActive: new Date().toISOString() });
      setIntakeComplete(true);
      try{localStorage.setItem("sptc243-intake-done","true");}catch(e){}
    } catch(e){ console.error("Intake submit failed:", e); setIntakeComplete(true); try{localStorage.setItem("sptc243-intake-done","true");}catch(e2){} }
  };

  // ═══════════════════════════════════════════════════
  // DEEP DIVE FUNCTIONS
  // ═══════════════════════════════════════════════════

  // Get this student's assigned chapter(s)
  const myChapters = Object.entries(ddChapterAssignments).filter(([,v])=>(v.students||[]).includes(studentName)).map(([k,v])=>({chapterId:parseInt(k),...v}));
  // Auto-set chapter for quiz submission when single assignment
  useEffect(()=>{if(myChapters.length===1&&!ddSubmitQ.chapterId)setDdSubmitQ(p=>({...p,chapterId:myChapters[0].chapterId}));},[JSON.stringify(myChapters)]);

  // Submit a quiz question
  const submitQuizQuestion = async () => {
    if(!studentName||!db) return;
    const q = ddSubmitQ;
    if(!q.question.trim()) return;
    if(!q.chapterId) { alert("Select which chapter this question is from."); return; }
    const data = { chapterId: q.chapterId, studentName, type: q.type, question: q.question.trim(), status: "pending", submittedAt: new Date().toISOString() };
    if(q.type==="mc") {
      const validOpts = q.options.filter(o=>o.trim());
      if(validOpts.length<2) { alert("Multiple choice needs at least 2 options."); return; }
      if(!q.answer.trim()) { alert("Indicate the correct answer."); return; }
      data.options = validOpts;
      data.answer = q.answer.trim();
    } else if(q.type==="short") {
      if(!q.answer.trim()) { alert("Provide the expected answer."); return; }
      data.answer = q.answer.trim();
    } else {
      data.answer = q.answer.trim() || "(Open-ended)";
    }
    try {
      const newRef = push(ref(db, "deepdive/quizQuestions"));
      await set(newRef, data);
      setDdQuizQuestions(prev=>[...prev,{id:newRef.key,...data}]);
      setDdSubmitQ({type:"mc",question:"",options:["","","",""],answer:"",chapterId:myChapters.length===1?myChapters[0].chapterId:null});
      alert("Question submitted for review!");
    } catch(e){ console.error("Submit Q failed:", e); }
  };

  // Instructor: approve/reject question
  const reviewQuestion = async (qId, newStatus) => {
    if(!db) return;
    try {
      await update(ref(db, "deepdive/quizQuestions/"+qId), { status: newStatus });
      setDdQuizQuestions(prev=>prev.map(q=>q.id===qId?{...q,status:newStatus}:q));
    } catch(e){ console.error("Review failed:", e); }
  };

  // Instructor: assign chapter to students
  const assignChapter = async (chapterId, studentNames, presentDate) => {
    if(!db) return;
    const data = { students: studentNames, presentDate: presentDate || "" };
    try {
      await set(ref(db, "deepdive/chapters/"+chapterId), data);
      setDdChapterAssignments(prev=>({...prev,[chapterId]:data}));
    } catch(e){ console.error("Assign failed:", e); }
  };

  // Roster management
  const addToRoster = async (name) => {
    const normalized = normalizeName(name);
    if(!normalized || roster.includes(normalized)) return;
    const newRoster = [...roster, normalized].sort((a,b)=>a.localeCompare(b));
    setRoster(newRoster);
    if(db) { try { await set(ref(db, "roster"), newRoster); } catch(e){ console.error("Roster save failed:", e); } }
  };

  const removeFromRoster = async (name) => {
    const newRoster = roster.filter(n=>n!==name);
    setRoster(newRoster);
    if(db) { try { await set(ref(db, "roster"), newRoster); } catch(e){ console.error("Roster save failed:", e); } }
  };

  const isOnRoster = (name) => roster.includes(name);

  // Start a rolling quiz (grab approved questions)
  const startRollingQuiz = () => {
    const approved = ddQuizQuestions.filter(q=>q.status==="approved" && (q.type==="mc" || q.type==="short"));
    if(approved.length < 3) { alert("Not enough approved questions yet. Need at least 3."); return; }
    // Pick up to 5 random questions
    const shuffled = [...approved].sort(()=>Math.random()-0.5).slice(0,5);
    setDdRollingQuiz(shuffled);
    setDdQuizAns({});
  };

  // Submit rolling quiz
  const submitRollingQuiz = async () => {
    if(!ddRollingQuiz||!studentName||!db) return;
    let correct = 0;
    ddRollingQuiz.forEach((q,i)=>{
      if(q.type==="mc") { if(ddQuizAns[i]===q.answer) correct++; }
      else if(q.type==="short") { if((ddQuizAns[i]||"").trim().toLowerCase()===q.answer.trim().toLowerCase()) correct++; }
    });
    const result = { date: new Date().toISOString(), score: correct, total: ddRollingQuiz.length, questions: ddRollingQuiz.map(q=>q.question) };
    const newHistory = [...ddQuizHistory, result];
    setDdQuizHistory(newHistory);
    try {
      const snap = await get(child(ref(db), "students/"+fbKey(studentName)));
      const existing = snap.exists() ? snap.val() : {};
      await set(ref(db, "students/"+fbKey(studentName)), { ...existing, ddQuizHistory: newHistory, lastActive: new Date().toISOString() });
    } catch(e){}
    setDdRollingQuiz(null);
    setDdQuizAns({});
    go("ddresults");
  };

  // Load instructor dashboard data
  // Load instructor dashboard data from Firebase
  const loadDashboard = async () => {
    setDashAuthed(true);
    try{localStorage.setItem("sptc243-instructor","true");}catch(e){}
    setDashLoading(true);
    try {
      if(!db){setDashData([]);setDashLoading(false);return;}
      const snap = await get(ref(db, "students"));
      const students = [];
      if(snap.exists()){
        const data = snap.val();
        Object.keys(data).forEach(k=>{ if(data[k].name) students.push(data[k]); });
      }
      students.sort((a,b)=>(a.name||"").localeCompare(b.name||""));
      setDashData(students);
      // Load roster
      try {
        const rosterSnap = await get(ref(db, "roster"));
        if(rosterSnap.exists()) {
          const r = rosterSnap.val();
          setRoster(Array.isArray(r) ? r : Object.values(r));
        }
      } catch(e){}
      // Load deep dive data for dashboard
      try {
        const ddChSnap = await get(ref(db, "deepdive/chapters"));
        if(ddChSnap.exists()) setDdChapterAssignments(ddChSnap.val());
      } catch(e){}
      try {
        const ddQSnap = await get(ref(db, "deepdive/quizQuestions"));
        if(ddQSnap.exists()) {
          const qs = ddQSnap.val();
          setDdQuizQuestions(Object.keys(qs).map(k=>({id:k,...qs[k]})));
        }
      } catch(e){}
    } catch(e){ console.error("Dashboard load failed:", e); setDashData([]); }
    setDashLoading(false);
  };

  const toggle=(key)=>setExpanded(p=>({...p,[key]:!p[key]}));

  const LESSON_PLANS = [
    {
      title: "The Future is Faster Than You Think",
      goal: "Students understand why exponential change is the defining force of their careers — and why most people consistently underestimate it.",
      hooks: [
        { name: "“The Folding Paper Problem”", icon: "📌", content: "Start with: “If I fold a piece of paper in half 42 times, how thick is it?” Take guesses. Most will say a few feet. Answer: it reaches the moon. Let the silence land.\n\nThen: “That’s exponential growth. Your brain just failed you — it drew a straight line when the reality is a curve. AI capability is on that same doubling curve. The question isn’t whether this will disrupt sports media. It’s whether you’ll be the one doing the disrupting or the one getting disrupted.”" },
        { name: "“What’s in Your Pocket?”", icon: "📱", content: "Hold up your phone. Ask: “How many separate devices is this replacing?” Write them on the board: camera, GPS, map, calculator, flashlight, compass, recorder, scanner, alarm clock, stopwatch, music player, game console, newspaper, boarding pass, wallet. 20+.\n\n“Every one of those was an industry with companies, employees, business models. They’re gone — not because the phone was better day one, but because it was on an exponential curve. The same thing is happening right now in sports media. By the end of this module you’ll understand the framework that predicts which industries survive and which don’t.”" },
        { name: "“The Story I Saw Firsthand” (WSC Sports)", icon: "🎬", content: "Tell a specific story from your time at WSC Sports where you watched an exponential shift happen in real time. Maybe the moment you realized AI could generate in seconds what took a production team hours. Be specific: names, dates, the look on someone’s face.\n\nEnd with: “What I saw happen to sports media production is what Diamandis calls the Six D’s. By the end of today, you’ll name all six and predict where the NEXT disruption is coming.”" }
      ],
      unanswerable: "Name a technology in sports media currently in its ‘deceptive phase’ — something that looks like a toy today but will be transformative in 3 years.",
      timeline: [
        { time: "5:20–5:35", activity: "The Hook", desc: "Tell the story, show something current, pose the unanswerable question.", note: "The paper folding hook is the most interactive for a first class." },
        { time: "5:35–5:40", activity: "App Orientation", desc: "Show the app on projector. Walk through registration, segments, quiz, mastery gate.", note: "First class only. Remind: 75% to unlock Module 2." },
        { time: "5:40–7:10", activity: "Module 1 App Work", desc: "Students work through 13 segments at their own pace. You circulate as guide.", note: "Challenge fast finishers (“Which D is Netflix in right now?”). Help stuck students." },
        { time: "7:10–7:20", activity: "Break", desc: "10-minute break.", note: "Check instructor dashboard — who’s passed?" },
        { time: "7:20–8:00", activity: "Group Discussion", desc: "2–3 discussion prompts. Small groups first (5 min), then full class.", note: "Connect answers to real industry examples. Your career experience IS the content." },
        { time: "8:00–8:05", activity: "Preview + Close", desc: "Tease Module 2: “Next week we get hands-on with the AI tools themselves.”", note: "Remind: Module 1 quiz must be passed before next class." }
      ],
      discussions: [
        { title: "The Deceptive Phase", prompt: "What technology in sports media looks like a toy right now but might be in its deceptive phase? VR game attendance? AI play-by-play? Holographic displays? Make your case." },
        { title: "Convergence Spotting", prompt: "Pick a moment from last weekend’s sports. How many exponential technologies converged to bring that moment to your phone?" },
        { title: "The Dark Side", prompt: "A deepfake video of an NFL quarterback saying something controversial goes viral during a playoff game. It’s fake. How does the league respond? How fast?" },
        { title: "Career Implications", prompt: "If AI can generate highlights, recaps, and stat graphics automatically — what’s the human’s job? What skills become MORE valuable?" }
      ],
      guideTips: [
        "The paper folding exercise works best when you let students commit to a wrong answer before revealing. The surprise IS the lesson.",
        "During app work, watch for students lingering on the Six D’s segment — it’s the most conceptually dense. Walk over and ask them to apply it to a sport they care about.",
        "For discussion, “The Deceptive Phase” prompt generates the best debate. Let students argue — don’t resolve it. The framework matters more than the answer."
      ]
    },
    {
      title: "AI Foundations & Your Toolkit",
      goal: "Students go from “I’ve used ChatGPT” to understanding what AI actually is, how it works, and how to choose the right tool for the right task.",
      hooks: [
        { name: "“The Live Hallucination Demo”", icon: "💥", content: "Pull up ChatGPT on the projector. Ask: “Who scored the most points in last night’s NBA games?” Read the answer aloud. Then pull up the actual box scores. High chance it’s confidently wrong.\n\n“This tool just lied to your face with total confidence. If you published that in a game recap, you’d be fired. So why is every sports media company still adopting AI? Because the value isn’t in trusting it blindly — it’s in knowing how it works, what it’s good at, where it fails, and which tool to use when.”" },
        { name: "“The Same Prompt, Five Models”", icon: "🔍", content: "Before class, run the same prompt through ChatGPT, Claude, Gemini, Grok, and Perplexity: “Summarize the biggest sports media story this week in 100 words.” Screenshot all five.\n\nShow side by side. Different stories, angles, accuracy levels. “These are all ‘AI’ but they’re not the same tool. Choosing the right one matters as much as knowing how to use them.”" },
        { name: "“The $0.01 Task”", icon: "💰", content: "Show: “In 2023, asking AI to summarize a 10-page document cost about $1 in compute. In 2025, about a penny. What does that mean for every entry-level task that involves reading, summarizing, or rewriting content?” Pause.\n\n“This isn’t about whether AI replaces you. It’s about what happens when the cost of doing your current job approaches zero. The people who thrive understand HOW these tools work — not just that they exist.”" }
      ],
      unanswerable: "Design a complete workflow for producing post-game social media content for an NBA team. Which AI tool handles each step — and which step still needs a human?",
      timeline: [
        { time: "5:20–5:40", activity: "The Hook", desc: "Live demo or screenshots. Make it interactive — ask students to predict what the AI got wrong.", note: "Hallucination demo is most engaging. Bring backup screenshots in case AI happens to nail it." },
        { time: "5:40–7:10", activity: "Module 2 App Work", desc: "12 segments. Encourage students to open AI tools during exercises.", note: "Works best if students test ChatGPT, Claude, Perplexity side by side on their own devices." },
        { time: "7:10–7:20", activity: "Break", desc: "Let students keep experimenting if they want.", note: "Dashboard check: who’s passed? Common sticking points?" },
        { time: "7:20–7:45", activity: "Live Workshop", desc: "Same task in 2+ models: “Write a 3-sentence pitch for why the Big East should invest in AI highlights.” Compare results.", note: "Have students share best and worst outputs. Identify which tool won and why." },
        { time: "7:45–8:00", activity: "Group Discussion", desc: "Focus on the orchestration concept — right tool, right task.", note: "Push past “I like ChatGPT” toward “I use ChatGPT for X and Claude for Y because...”" },
        { time: "8:00–8:05", activity: "Preview + Close", desc: "“Next week: how all of this is reshaping the business of sports. The economics will surprise you.”", note: "Mastery reminder: Module 2 quiz at 75%+ for next week’s workshop." }
      ],
      discussions: [
        { title: "Cheat vs. Tool", prompt: "Alpha Schools says: using AI chat during academics is cheating, but NOT using it during workshops is failing. Where’s that line for sports communication professionals?" },
        { title: "Workflow Design", prompt: "You’re a one-person social media team for a minor league baseball club. Map your daily workflow to specific AI tools. Defend every choice." },
        { title: "The Hallucination Problem", prompt: "Your AI draft says a player scored 28 points when they scored 18. It’s published for 6 minutes. What’s the damage? What’s the prevention process?" },
        { title: "Recursive Self-Improvement", prompt: "If AI capability doubles every 12–18 months, what tasks that need a human today won’t in 2028? What does that mean for your career?" }
      ],
      guideTips: [
        "The hallucination demo occasionally backfires — AI gets it right. Have pre-screenshotted failures as backup.",
        "During app work, Module 2’s “Orchestration” segment is the payoff. If students are running short on time, have them skip to it after the foundations.",
        "The live workshop comparing model outputs is usually the highlight of this class. Give students enough time — don’t rush it for discussion."
      ]
    },
    {
      title: "The Sports Business Revolution",
      goal: "Students understand the economic forces reshaping sports media — from ESPN’s cable monopoly to the model where every rights holder is a media company.",
      hooks: [
        { name: "“How Much to Watch Every NFL Game?”", icon: "🏈", content: "Ask: “If you wanted to watch every NFL game this season, how many subscriptions would you need?” Write platforms on the board as they call them: ESPN/ABC, Fox, CBS, NBC, Amazon Prime, Netflix, Peacock, YouTube TV.\n\n“Ten years ago: one cable subscription, everything. Your parents subsidized ESPN whether they watched or not. Now? The bundle is gone. The pie is bigger but shattered. This isn’t an accident — it’s the inevitable outcome of the exponential forces from Module 1.”" },
        { name: "“The $9 You Never Knew You Were Paying”", icon: "💵", content: "Write $9.00 on the board. Ask: “Who knows what this number is?” Nobody will.\n\n“This is what your family paid ESPN every month through cable — whether anyone watched a single game. Multiply by 100 million households. That’s $10 billion/year BEFORE ads. That’s how ESPN could pay $2B/year for Monday Night Football. Now those 100M households are 68M and dropping. But total rights spending went UP. How is that possible? That paradox is the entire story of the sports business revolution.”" },
        { name: "“The D-III School That’s a Media Company”", icon: "🏫", content: "Find a small college or minor league team with surprisingly good social content before class. Show their TikTok/Instagram.\n\n“This would have cost $50K to produce in 2012. Full edit suite, trained editor, distribution infrastructure. Today? One person, a laptop, an AI tool, and Canva. The tools gated behind millions are now free. That’s not a slogan — it’s a business model.”" }
      ],
      unanswerable: "If you were hired as Head of Digital for a mid-market NBA team, what’s your Fan Continuum strategy? How do you move someone who’s never heard of your team to buying season tickets?",
      timeline: [
        { time: "5:20–5:45", activity: "The Hook", desc: "Slightly longer hook — the economics are counterintuitive. Use the $9 hook.", note: "Write affiliate fee math step by step. $9 × 100M = $10B. Let students react. The cognitive dissonance IS the hook." },
        { time: "5:45–7:00", activity: "Module 3 App Work", desc: "8 segments including Fan Continuum visualization. Circulate and guide.", note: "ESPN affiliate fees and Fan Continuum generate the most questions. Be ready to expand." },
        { time: "7:00–7:10", activity: "Break", desc: "Shorter app time because discussion is richer for this module.", note: "ESPN economics are the most common quiz stumbling point." },
        { time: "7:10–7:50", activity: "Workshop: Build a Fan Continuum", desc: "Groups of 3–4 pick a real sports property. Design content for Discovery, Engagement, Conversion tiers. Present.", note: "20 min to build, 15 min to present and critique. Push for specifics: platform, format, CTA." },
        { time: "7:50–8:00", activity: "Career Connection", desc: "“Where do YOU fit in this landscape? What role? What skills from this course make you hireable?”", note: "Connect frameworks to actual job postings and career paths. Make it personal." },
        { time: "8:00–8:05", activity: "Course Wrap", desc: "Celebrate completions. Tease what’s next if more modules coming.", note: "Check dashboard. Acknowledge students who completed all three modules." }
      ],
      discussions: [
        { title: "The Bundle Dilemma", prompt: "You’re ESPN’s CEO. Cable subs drop 5%/year. Launch standalone streaming that cannibalizes cable revenue, or wait? What data do you need?" },
        { title: "Fan Continuum in the Wild", prompt: "Find a piece of sports content on your phone right now. Where on the Fan Continuum? New fans, casual, or hardcore? How can you tell?" },
        { title: "The WSC Sports Question", prompt: "If AI generates hundreds of personalized highlights in seconds, what happens to the highlight editor role? Disappear or transform?" },
        { title: "D2C Economics", prompt: "Disney knows you watched every Yankees game, visited Disney World twice, stream Marvel. Design the personalized offer they could send. Why couldn’t Comcast do this?" }
      ],
      guideTips: [
        "The $9 affiliate fee hook lands hardest when you write the math on the board slowly. Let students do the multiplication themselves.",
        "The Fan Continuum workshop is the capstone exercise of the entire course. Give it the most time. Real presentations > more discussion.",
        "For the career connection segment, pull up actual job postings in sports media beforehand. Highlight the skills this course covers."
      ]
    }
  ];

  // Build hash from view state
  const buildHash = (v, m) => {
    if(v==="module" && m!==undefined) return "#/module/"+(m+1);
    if(v==="quiz") return "#/module/"+(m!==undefined?m+1:mi+1)+"/quiz";
    if(v==="results") return "#/module/"+(m!==undefined?m+1:mi+1)+"/results";
    if(v==="deepdive") return "#/deepdive";
    if(v==="chapter" && m!==undefined) return "#/deepdive/chapter/"+m;
    if(v==="ddresults") return "#/deepdive/results";
    if(v==="instructor") return "#/instructor";
    return "#/";
  };

  const go=(v,m)=>{setFade(false);setTimeout(()=>{setView(v);if(m!==undefined){if(v==="chapter")setChapterId(m);else setMi(m);}setSi(0);setAns({});setShowDeeper(false);setFade(true);window.scrollTo({top:0});const hash=buildHash(v,m);if(window.location.hash!==hash)window.history.pushState(null,"",hash);},120);};

  // Listen for browser back/forward
  useEffect(()=>{
    const onHashChange=()=>{
      const parsed=parseHash();
      setView(parsed.view);
      if(parsed.mi!==undefined) setMi(parsed.mi);
      if(parsed.chapterId!==undefined) setChapterId(parsed.chapterId);
      setSi(0);setAns({});setShowDeeper(false);
      window.scrollTo({top:0});
    };
    window.addEventListener("hashchange",onHashChange);
    return ()=>window.removeEventListener("hashchange",onHashChange);
  },[]);

  // Set initial hash if none present
  useEffect(()=>{if(!window.location.hash)window.history.replaceState(null,"","#/");},[]);

  // Auto-load dashboard data when navigating to instructor view while already authed
  useEffect(()=>{if(view==="instructor"&&dashAuthed&&dashData.length===0&&!dashLoading){loadDashboard();}},[view,dashAuthed]);
  const isUnlocked=(i)=>i===0||(done[i-1]&&Math.round((scores[i-1]/MODULES[i-1].quiz.length)*100)>=MASTERY_THRESHOLD);
  const progress=Math.round(Object.keys(done).length/MODULES.length*100);
  const F={opacity:fade?1:0,transform:fade?"translateY(0)":"translateY(6px)",transition:"opacity .15s,transform .15s"};
  const W={maxWidth:880,margin:"0 auto",padding:"0 20px",position:"relative",zIndex:2};
  const S={fontFamily:"'DM Sans',sans-serif",background:"#06060a",color:"#ddd",minHeight:"100vh"};
  const font=<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>;

  if(loading) return <div style={S}>{font}<Bg/><div style={{...W,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><p style={{color:"#444",fontSize:14}}>Loading...</p></div></div>;

  // Student registration screen
  if(!studentName && view!=="instructor") return(
    <div style={S}>{font}<Bg/><div style={{...W,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>🎓</div>
        <h1 style={{fontSize:28,fontWeight:800,margin:"0 0 8px",color:"#fff"}}>Welcome to SPTC 243</h1>
        <p style={{fontSize:14,color:"#555",margin:"0 0 28px",lineHeight:1.6}}>AI & Emerging Technologies in Sports Communication<br/>Professor Ben Fairclough · Montclair State University</p>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:24,textAlign:"left"}}>
          {!confirmingName?<>
            {!showNameEntry?<>
              <label style={{fontSize:11,fontWeight:700,color:"#666",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:8}}>Select your name</label>
              {roster.length>0?<>
                <select value="" onChange={e=>{if(e.target.value)setConfirmingName(e.target.value);}} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:14,boxSizing:"border-box",appearance:"none",cursor:"pointer"}}>
                  <option value="" style={{background:"#111",color:"#666"}}>Choose your name...</option>
                  {roster.map(name=><option key={name} value={name} style={{background:"#111",color:"#fff"}}>{name}</option>)}
                </select>
                <button onClick={()=>setShowNameEntry(true)} style={{background:"none",border:"none",color:"#555",fontSize:11,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",display:"block",margin:"0 auto"}}>I don't see my name</button>
              </>:<>
                <p style={{fontSize:13,color:"#666",margin:"0 0 14px",lineHeight:1.5}}>No class roster has been loaded yet. Enter your full name to get started.</p>
                <input value={nameInput} onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")startRegistration();}} placeholder="First Last" style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
                <button onClick={startRegistration} disabled={!nameInput.trim()} style={{...bs(nameInput.trim()?"linear-gradient(135deg,#34C759,#30D158)":"#333"),width:"100%",cursor:nameInput.trim()?"pointer":"default"}}>Continue →</button>
              </>}
            </>:<>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <label style={{fontSize:11,fontWeight:700,color:"#FF9500",letterSpacing:2,textTransform:"uppercase"}}>Enter your name</label>
                <button onClick={()=>{setShowNameEntry(false);setNameInput("");}} style={{background:"none",border:"none",color:"#555",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>← Back to list</button>
              </div>
              <p style={{fontSize:11,color:"#666",margin:"0 0 10px",lineHeight:1.5}}>If you're not on the class roster, enter your full name below. Your professor will see a flag to add you.</p>
              <input value={nameInput} onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")startRegistration();}} placeholder="First Last" style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
              <button onClick={startRegistration} disabled={!nameInput.trim()} style={{...bs(nameInput.trim()?"linear-gradient(135deg,#FF9500,#FF6B00)":"#333"),width:"100%",cursor:nameInput.trim()?"pointer":"default"}}>Continue →</button>
            </>}
          </>:<>
            <div style={{fontSize:10,fontWeight:700,color:roster.includes(confirmingName)?"#34C759":"#FF9500",letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>{roster.includes(confirmingName)?"Confirm your name":"Not on roster — Continue anyway?"}</div>
            <p style={{fontSize:13,color:"#999",margin:"0 0 6px",lineHeight:1.5}}>You'll be registered as:</p>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"14px 16px",marginBottom:8}}>
              <p style={{fontSize:20,fontWeight:800,color:"#fff",margin:0}}>{confirmingName}</p>
            </div>
            {!roster.includes(confirmingName)&&<p style={{fontSize:11,color:"#FF9500",margin:"0 0 12px",lineHeight:1.5}}>⚠ This name is not on the class roster. You can still proceed, and your professor will see a flag to add you.</p>}
            <p style={{fontSize:11,color:"#666",margin:"0 0 16px",lineHeight:1.5}}>This name will be visible to your instructor. Make sure it matches your name on the class roster.</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setConfirmingName(null);setShowNameEntry(false);}} style={{...gs,flex:1,textAlign:"center"}}>← Back</button>
              <button onClick={()=>registerStudent(confirmingName)} style={{...bs(roster.includes(confirmingName)?"linear-gradient(135deg,#34C759,#30D158)":"linear-gradient(135deg,#FF9500,#FF6B00)"),flex:2}}>{roster.includes(confirmingName)?"That's me — Start Learning →":"Continue without roster →"}</button>
            </div>
          </>}
        </div>
        <button onClick={()=>go("instructor")} style={{background:"none",border:"none",color:"#333",fontSize:11,cursor:"pointer",marginTop:16,fontFamily:"inherit"}}>Instructor Dashboard →</button>
      </div>
    </div></div>
  );

  // Intake form — required before accessing modules
  if(studentName && !intakeComplete && view!=="instructor") {
    const sec = INTAKE_SECTIONS[intakeStep];
    return(
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:40,paddingBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#666"}}>Student Intake</span>
          <span style={{fontSize:11,color:"#444",fontFamily:"'DM Mono',monospace"}}>Section {intakeStep+1} of {INTAKE_SECTIONS.length}</span>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:24}}>{INTAKE_SECTIONS.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=intakeStep?"#FF9500":"rgba(255,255,255,0.08)",transition:"background 0.3s"}}/>)}</div>
        <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>{sec.title}</h2>
        <p style={{fontSize:13,color:"#666",margin:"0 0 24px"}}>{sec.subtitle}</p>
        {sec.questions.map((q,qi)=>(
          <div key={q.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:18,marginBottom:12}}>
            <p style={{fontSize:13,fontWeight:700,margin:"0 0 10px",color:"#ddd"}}>{qi+1}. {q.q}</p>
            {q.type==="single"&&q.opts.map((opt,oi)=><button key={oi} onClick={()=>setIntakeAnswers(p=>({...p,[q.id]:opt}))} style={{display:"block",width:"100%",textAlign:"left",background:intakeAnswers[q.id]===opt?"rgba(255,149,0,0.12)":"rgba(255,255,255,0.02)",border:"1px solid "+(intakeAnswers[q.id]===opt?"#FF9500":"rgba(255,255,255,0.06)"),color:intakeAnswers[q.id]===opt?"#fff":"#777",padding:"9px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:intakeAnswers[q.id]===opt?600:400,marginBottom:5}}>{opt}</button>)}
            {q.type==="multi"&&q.opts.map((opt,oi)=>{const sel=(intakeAnswers[q.id]||[]).includes(opt); return <button key={oi} onClick={()=>setIntakeAnswers(p=>{const cur=p[q.id]||[];return{...p,[q.id]:sel?cur.filter(x=>x!==opt):[...cur,opt]};})} style={{display:"block",width:"100%",textAlign:"left",background:sel?"rgba(0,122,255,0.12)":"rgba(255,255,255,0.02)",border:"1px solid "+(sel?"#007AFF":"rgba(255,255,255,0.06)"),color:sel?"#fff":"#777",padding:"9px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:sel?600:400,marginBottom:5}}>
              <span style={{display:"inline-block",width:16,height:16,borderRadius:4,border:"2px solid "+(sel?"#007AFF":"rgba(255,255,255,0.15)"),background:sel?"#007AFF":"transparent",marginRight:8,verticalAlign:"middle",textAlign:"center",lineHeight:"14px",fontSize:10,color:"#fff"}}>{sel?"✓":""}</span>{opt}
            </button>;})}
            {q.type==="text"&&<textarea value={intakeAnswers[q.id]||""} onChange={e=>setIntakeAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder="Type your answer..." rows={3} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>}
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,paddingBottom:16,gap:8}}>
          {intakeStep>0?<button onClick={()=>setIntakeStep(intakeStep-1)} style={gs}>← Previous</button>:<div/>}
          {intakeStep<INTAKE_SECTIONS.length-1
            ?<button onClick={()=>{if(sectionReady(intakeStep)){setIntakeStep(intakeStep+1);window.scrollTo({top:0});}}} disabled={!sectionReady(intakeStep)} style={{...bs(sectionReady(intakeStep)?"linear-gradient(135deg,#FF9500,#FF6B00)":"#333"),cursor:sectionReady(intakeStep)?"pointer":"default"}}>Next Section →</button>
            :<button onClick={()=>{if(intakeReady){submitIntake();}}} disabled={!intakeReady} style={{...bs(intakeReady?"linear-gradient(135deg,#34C759,#30D158)":"#333"),cursor:intakeReady?"pointer":"default"}}>Submit & Start the Course →</button>}
        </div>
        <div style={{textAlign:"center",paddingBottom:40}}>
          <button onClick={()=>{setIntakeComplete(true);try{localStorage.setItem("sptc243-intake-done","true");}catch(e){}}} style={{background:"none",border:"none",color:"#333",fontSize:11,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>Skip for now →</button>
        </div>
      </div>
    </div></div>
  );}

  // Collapsible section helper
  const Section=({id,title,icon,color,children})=>{const open=expanded[id]; return <div style={{marginBottom:10}}>
    <button onClick={()=>toggle(id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:open?(color||"rgba(255,255,255,0.04)"):"rgba(255,255,255,0.02)",border:"1px solid "+(open?(color?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.08)"):"rgba(255,255,255,0.05)"),borderRadius:10,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",color:"#ddd",fontSize:13,fontWeight:700}}>
      <span>{icon}</span><span style={{flex:1}}>{title}</span><span style={{color:"#555",fontSize:11}}>{open?"▲":"▼"}</span>
    </button>
    {open&&<div style={{border:"1px solid rgba(255,255,255,0.05)",borderTop:"none",borderRadius:"0 0 10px 10px",padding:16,background:"rgba(255,255,255,0.015)"}}>{children}</div>}
  </div>;};

  // Instructor Dashboard
  if(view==="instructor") return(
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:40,paddingBottom:20}}>
        <button onClick={()=>{go("home");setDashPass("");setDashData([]);setExpanded({});}} style={gs}>← Back</button>
        <button onClick={()=>{setDashAuthed(false);setDashPass("");setDashData([]);setExpanded({});try{localStorage.removeItem("sptc243-instructor");}catch(e){}}} style={{...gs,marginLeft:8,color:"#FF3B30"}}>Sign Out</button>
      </div>
      {!dashAuthed?<div style={{maxWidth:420,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>📊</div>
        <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 8px",color:"#fff"}}>Instructor Dashboard</h2>
        <p style={{fontSize:13,color:"#555",margin:"0 0 24px"}}>Enter passcode to access</p>
        <input value={dashPass} onChange={e=>setDashPass(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&dashPass===INSTRUCTOR_PASSCODE){loadDashboard();}}} type="password" placeholder="Passcode" style={{width:"100%",maxWidth:280,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:14,textAlign:"center",boxSizing:"border-box"}}/>
        <br/>
        <button onClick={()=>{if(dashPass===INSTRUCTOR_PASSCODE)loadDashboard();}} style={bs(dashPass?"linear-gradient(135deg,#007AFF,#5856D6)":"#333")}>{dashPass===INSTRUCTOR_PASSCODE?"Load Dashboard":"Enter Passcode"}</button>
        {dashPass&&dashPass!==INSTRUCTOR_PASSCODE&&dashPass.length>3&&<p style={{color:"#FF3B30",fontSize:12,marginTop:10}}>Incorrect passcode</p>}
      </div>:dashLoading?<p style={{textAlign:"center",color:"#555"}}>Loading student data...</p>:<div>
        {/* Tab bar */}
        <div style={{display:"flex",gap:4,marginBottom:20,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:4}}>
          {[["progress","📊 Progress"],["roster","📋 Roster"],["profiles","👥 Profiles"],["intake","📋 Intake"],["lessons","📖 Lessons"],["deepdive","🔬 Deep Dive"],["tips","⚙️ Guide Tips"]].map(([k,label])=>
            <button key={k} onClick={()=>setDashTab(k)} style={{flex:1,padding:"10px 12px",borderRadius:8,border:"none",background:dashTab===k?"rgba(255,255,255,0.08)":"transparent",color:dashTab===k?"#fff":"#555",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{label}</button>
          )}
        </div>

        {/* TAB: Class Progress */}
        {dashTab==="progress"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
            <div>
              <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>Class Progress</h2>
              <p style={{fontSize:13,color:"#555",margin:0}}>{dashData.length} student{dashData.length!==1?"s":""} registered</p>
            </div>
            <button onClick={loadDashboard} style={gs}>↻ Refresh</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:20}}>
            {MODULES.map((m,i)=>{
              const completed=dashData.filter(s=>s.done&&s.done[i]).length;
              const passed=dashData.filter(s=>s.scores&&s.scores[i]!==undefined&&Math.round((s.scores[i]/m.quiz.length)*100)>=MASTERY_THRESHOLD).length;
              return <div key={i} style={{background:m.color+"08",border:"1px solid "+m.color+"20",borderRadius:10,padding:14}}>
                <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Module {m.id}</div>
                <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{passed}<span style={{fontSize:12,color:"#555",fontWeight:400}}>/{dashData.length}</span></div>
                <div style={{fontSize:10,color:"#666"}}>passed ({completed} attempted)</div>
              </div>;
            })}
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                  <th style={{textAlign:"left",padding:"10px 12px",color:"#666",fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}}>Student</th>
                  {MODULES.map((m,i)=><th key={i} style={{textAlign:"center",padding:"10px 8px",color:m.color,fontWeight:700,fontSize:10,letterSpacing:1}}>M{m.id}</th>)}
                  <th style={{textAlign:"right",padding:"10px 12px",color:"#666",fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {dashData.map((s,si2)=><tr key={si2} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <td style={{padding:"10px 12px",color:"#ddd",fontWeight:600}}>{s.name}</td>
                  {MODULES.map((m,i)=>{
                    const attempted=s.done&&s.done[i];
                    const sc=s.scores&&s.scores[i]!==undefined?s.scores[i]:null;
                    const pct2=sc!==null?Math.round((sc/m.quiz.length)*100):null;
                    const p2=pct2!==null&&pct2>=MASTERY_THRESHOLD;
                    return <td key={i} style={{textAlign:"center",padding:"10px 8px"}}>
                      {!attempted?<span style={{color:"#333"}}>—</span>:
                      <span style={{background:p2?"rgba(52,199,89,0.15)":"rgba(255,149,0,0.15)",color:p2?"#34C759":"#FF9500",padding:"3px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{pct2}%</span>}
                    </td>;
                  })}
                  <td style={{textAlign:"right",padding:"10px 12px",color:"#555",fontSize:11}}>{s.lastActive?new Date(s.lastActive).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):""}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
          {dashData.length===0&&<p style={{textAlign:"center",color:"#555",padding:20}}>No student data yet.</p>}
        </div>}

        {/* TAB: Roster Management */}
        {dashTab==="roster"&&<div>
          <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>Class Roster</h2>
          <p style={{fontSize:13,color:"#555",margin:"0 0 20px"}}>{roster.length} student{roster.length!==1?"s":""} on roster. This is the single source of truth for your class.</p>

          {/* Add student */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <input value={rosterNewName} onChange={e=>setRosterNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&rosterNewName.trim()){addToRoster(rosterNewName);setRosterNewName("");}}} placeholder="First Last" style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 14px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            <button onClick={()=>{if(rosterNewName.trim()){addToRoster(rosterNewName);setRosterNewName("");}}} disabled={!rosterNewName.trim()} style={{...bs(rosterNewName.trim()?"linear-gradient(135deg,#34C759,#30D158)":"#333"),padding:"10px 20px",fontSize:12}}>+ Add</button>
          </div>

          {/* Unrostered students alert */}
          {(()=>{
            const unrostered = dashData.filter(s=>s.name && !roster.includes(s.name));
            if(unrostered.length===0) return null;
            return <div style={{background:"rgba(255,149,0,0.06)",border:"1px solid rgba(255,149,0,0.2)",borderRadius:12,padding:16,marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:"#FF9500",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>⚠ UNROSTERED STUDENTS ({unrostered.length})</div>
              <p style={{fontSize:11,color:"#888",margin:"0 0 10px"}}>These students registered but are not on your roster. Add them or investigate.</p>
              {unrostered.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<unrostered.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div>
                  <span style={{fontSize:13,fontWeight:600,color:"#FF9500"}}>{s.name}</span>
                  <span style={{fontSize:10,color:"#666",marginLeft:8}}>Joined {s.lastActive?new Date(s.lastActive).toLocaleDateString("en-US",{month:"short",day:"numeric"}):""}</span>
                </div>
                <button onClick={()=>addToRoster(s.name)} style={{background:"rgba(52,199,89,0.12)",border:"1px solid rgba(52,199,89,0.3)",color:"#34C759",padding:"4px 12px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>+ Add to Roster</button>
              </div>)}
            </div>;
          })()}

          {/* Roster list */}
          {roster.length===0
            ?<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:28,textAlign:"center"}}>
              <p style={{fontSize:14,color:"#555",margin:"0 0 8px"}}>No students on the roster yet.</p>
              <p style={{fontSize:12,color:"#444",margin:0}}>Add students one at a time using the field above. Students will select their name from a dropdown when they open the app.</p>
            </div>
            :<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,overflow:"hidden"}}>
              {roster.map((name,i)=>{
                const studentData = dashData.find(s=>s.name===name);
                const hasLoggedIn = !!studentData;
                const hasIntake = studentData && studentData.intake;
                const modulesCompleted = studentData && studentData.done ? Object.keys(studentData.done).length : 0;
                return <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:i<roster.length-1?"1px solid rgba(255,255,255,0.04)":"none",flexWrap:"wrap",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:hasLoggedIn?"#34C759":"#333",flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:600,color:"#ddd"}}>{name}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {hasLoggedIn
                      ?<>
                        <span style={{fontSize:10,color:"#34C759",fontWeight:600}}>{modulesCompleted}/{MODULES.length} modules</span>
                        {hasIntake&&<span style={{fontSize:9,color:"#007AFF",background:"rgba(0,122,255,0.1)",padding:"2px 6px",borderRadius:6}}>Intake done</span>}
                      </>
                      :<span style={{fontSize:10,color:"#555"}}>Not started</span>
                    }
                    <button onClick={()=>{if(confirm("Remove "+name+" from the roster?"))removeFromRoster(name);}} style={{background:"none",border:"none",color:"#333",fontSize:10,cursor:"pointer",fontFamily:"inherit",padding:"4px"}}>✕</button>
                  </div>
                </div>;
              })}
            </div>
          }
        </div>}

        {/* TAB: Student Profiles */}
        {dashTab==="profiles"&&<div>
          <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>Student Profiles</h2>
          <p style={{fontSize:13,color:"#555",margin:"0 0 20px"}}>Auto-categorized from intake responses. {dashData.filter(s=>s.intake).length} of {dashData.length} profiled.</p>
          {(()=>{
            const withIntake=dashData.filter(s=>s.intake);
            if(withIntake.length===0) return <p style={{color:"#555",textAlign:"center",padding:20}}>No intake data yet. Students will be profiled after completing the intake form.</p>;

            // Scoring functions
            const scoreAI=(intake)=>{
              let s=0;
              const u=intake.ai_understanding||"";
              if(u.includes("explain")) s+=4; else if(u.includes("regularly")) s+=3; else if(u.includes("few times")) s+=2; else if(u.includes("Heard")) s+=1;
              const tools=(intake.ai_tools_used||[]);
              if(tools.includes("None")) s+=0; else s+=Math.min(tools.length,3);
              const c=intake.ai_confidence||"";
              if(c.includes("Extremely")) s+=4; else if(c.includes("Very")) s+=3; else if(c.includes("Moderately")) s+=2; else if(c.includes("Slightly")) s+=1;
              return s; // 0-11
            };
            const scoreBiz=(intake)=>{
              let s=0;
              const e=intake.exponential_check||"";
              if(e.includes("1,000")) s+=3; else if(e.includes("100")) s+=2; else if(e.includes("20")) s+=1;
              const cc=intake.cord_cutting||"";
              if(cc.includes("Canceling")) s+=3; else if(cc.includes("Not sure")) s+=0; else s+=1;
              const espn=intake.espn_model||"";
              if(espn.includes("every cable")) s+=3; else if(espn.includes("Not sure")) s+=0; else s+=1;
              return s; // 0-9
            };
            const tierOf=(aiScore,bizScore)=>{
              const total=aiScore+bizScore; // 0-20
              if(total>=14) return {tier:"Ahead",color:"#34C759",icon:"🟢",desc:"Strong foundation. Challenge them, use as peer mentors."};
              if(total>=7) return {tier:"On Track",color:"#FF9500",icon:"🟡",desc:"Solid base to build on. Your core group."};
              return {tier:"Needs Support",color:"#FF3B30",icon:"🔴",desc:"New to these concepts. Extra attention during app work."};
            };

            // Build profiles
            const profiles=withIntake.map(s=>{
              const ai=scoreAI(s.intake);
              const biz=scoreBiz(s.intake);
              const t=tierOf(ai,biz);
              return {...s,aiScore:ai,bizScore:biz,...t};
            }).sort((a,b)=>(b.aiScore+b.bizScore)-(a.aiScore+a.bizScore));

            const ahead=profiles.filter(p=>p.tier==="Ahead");
            const onTrack=profiles.filter(p=>p.tier==="On Track");
            const needsSupport=profiles.filter(p=>p.tier==="Needs Support");

            const tierCard=(label,icon,color,students,desc)=><div style={{background:color+"08",border:"1px solid "+color+"25",borderRadius:12,padding:16,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{icon}</span>
                  <span style={{fontSize:14,fontWeight:800,color}}>{label}</span>
                  <span style={{fontSize:20,fontWeight:800,color:"#fff",marginLeft:4}}>{students.length}</span>
                </div>
              </div>
              <p style={{fontSize:11,color:"#888",margin:"0 0 12px"}}>{desc}</p>
              {students.length===0?<p style={{fontSize:11,color:"#444"}}>No students in this tier.</p>:
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {students.map((st,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:"#ddd"}}>{st.name}</span>
                    <div style={{display:"flex",gap:6,marginTop:4}}>
                      <span style={{fontSize:9,fontWeight:700,background:"rgba(0,122,255,0.12)",color:"#007AFF",padding:"2px 7px",borderRadius:8}}>AI: {st.aiScore}/11</span>
                      <span style={{fontSize:9,fontWeight:700,background:"rgba(255,149,0,0.12)",color:"#FF9500",padding:"2px 7px",borderRadius:8}}>Biz: {st.bizScore}/9</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,color:"#888"}}>{st.intake.career_path||"Undecided"}</div>
                    <div style={{fontSize:10,color:"#666"}}>{st.intake.ai_attitude||""}</div>
                  </div>
                </div>)}
              </div>}
            </div>;

            // Class-level insights
            const avgAI=Math.round(profiles.reduce((a,p)=>a+p.aiScore,0)/profiles.length*10)/10;
            const avgBiz=Math.round(profiles.reduce((a,p)=>a+p.bizScore,0)/profiles.length*10)/10;
            const topSports={};
            withIntake.forEach(s=>(s.intake.sports_followed||[]).forEach(sp=>{topSports[sp]=(topSports[sp]||0)+1;}));
            const topSportsSorted=Object.entries(topSports).sort((a,b)=>b[1]-a[1]).slice(0,5);
            const topPlatforms={};
            withIntake.forEach(s=>(s.intake.social_platforms||[]).forEach(sp=>{topPlatforms[sp]=(topPlatforms[sp]||0)+1;}));
            const topPlatSorted=Object.entries(topPlatforms).sort((a,b)=>b[1]-a[1]).slice(0,5);
            const topActivities={};
            withIntake.forEach(s=>(s.intake.class_activities||[]).forEach(a=>{topActivities[a]=(topActivities[a]||0)+1;}));
            const topActSorted=Object.entries(topActivities).sort((a,b)=>b[1]-a[1]).slice(0,4);
            const topCareers={};
            withIntake.forEach(s=>{if(s.intake.career_path)topCareers[s.intake.career_path]=(topCareers[s.intake.career_path]||0)+1;});
            const topCarSorted=Object.entries(topCareers).sort((a,b)=>b[1]-a[1]).slice(0,5);

            return <div>
              {/* Class Snapshot */}
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:18,marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,color:"#FF9500",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>CLASS SNAPSHOT</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
                  <div>
                    <div style={{fontSize:10,color:"#666",marginBottom:4}}>Avg AI Readiness</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:8}}><div style={{background:"#007AFF",height:"100%",width:Math.round(avgAI/11*100)+"%",borderRadius:4}}/></div>
                      <span style={{fontSize:12,fontWeight:700,color:"#007AFF"}}>{avgAI}/11</span>
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#666",marginBottom:4}}>Avg Business Awareness</div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:8}}><div style={{background:"#FF9500",height:"100%",width:Math.round(avgBiz/9*100)+"%",borderRadius:4}}/></div>
                      <span style={{fontSize:12,fontWeight:700,color:"#FF9500"}}>{avgBiz}/9</span>
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#666",marginBottom:4}}>Top Sports</div>
                    <p style={{fontSize:11,color:"#bbb",margin:0}}>{topSportsSorted.map(([s,c])=>s+" ("+c+")").join(", ")}</p>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#666",marginBottom:4}}>Top Platforms</div>
                    <p style={{fontSize:11,color:"#bbb",margin:0}}>{topPlatSorted.map(([s,c])=>s+" ("+c+")").join(", ")}</p>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#666",marginBottom:4}}>Preferred Activities</div>
                    <p style={{fontSize:11,color:"#bbb",margin:0}}>{topActSorted.map(([s,c])=>s+" ("+c+")").join(", ")}</p>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#666",marginBottom:4}}>Career Interests</div>
                    <p style={{fontSize:11,color:"#bbb",margin:0}}>{topCarSorted.map(([s,c])=>s+" ("+c+")").join(", ")}</p>
                  </div>
                </div>
              </div>

              {/* Pairing Suggestions */}
              {ahead.length>0&&needsSupport.length>0&&<div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,color:"#A855F7",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>💡 SUGGESTED PAIRINGS</div>
                <p style={{fontSize:11,color:"#999",margin:"0 0 8px"}}>Pair Ahead students with Needs Support students during app work and group activities:</p>
                {needsSupport.map((ns,i)=>{const mentor=ahead[i%ahead.length]; return <div key={i} style={{fontSize:12,color:"#bbb",marginBottom:3}}>
                  <span style={{color:"#34C759",fontWeight:700}}>{mentor.name}</span> → <span style={{color:"#FF3B30",fontWeight:700}}>{ns.name}</span>
                </div>;})}
              </div>}

              {/* Tier Cards */}
              {tierCard("Ahead","🟢","#34C759",ahead,"Strong AI experience + business awareness. Challenge with Go Deeper questions. Use as peer mentors during app work.")}
              {tierCard("On Track","🟡","#FF9500",onTrack,"Some exposure, solid foundation. Your core group — the module pacing is designed for them.")}
              {tierCard("Needs Support","🔴","#FF3B30",needsSupport,"New to AI and/or business concepts. Check in during app work. Pair with Ahead students for discussions.")}
            </div>;
          })()}
        </div>}

        {/* TAB: Intake Responses */}
        {dashTab==="intake"&&<div>
          <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>Student Intake Responses</h2>
          <p style={{fontSize:13,color:"#555",margin:"0 0 20px"}}>{dashData.filter(s=>s.intake).length} of {dashData.length} students completed</p>
          {dashData.length>0&&(()=>{
            // Aggregate data for overview
            const withIntake=dashData.filter(s=>s.intake);
            if(withIntake.length===0) return <p style={{color:"#555",textAlign:"center",padding:20}}>No intake responses yet.</p>;
            return <div>
              {/* Aggregate view */}
              <Section id="intake-agg" title={"Class Overview ("+withIntake.length+" responses)"} icon="📊">
                {INTAKE_SECTIONS.flatMap(s=>s.questions).filter(q=>q.type!=="text").map(q=>{
                  const counts={};
                  withIntake.forEach(s=>{
                    const a=s.intake[q.id];
                    if(Array.isArray(a)){a.forEach(v=>{counts[v]=(counts[v]||0)+1;});}
                    else if(a){counts[a]=(counts[a]||0)+1;}
                  });
                  const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
                  return <div key={q.id} style={{marginBottom:16}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#ddd",margin:"0 0 6px"}}>{q.q}</p>
                    {sorted.map(([val,ct])=><div key={val} style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:18,overflow:"hidden"}}>
                        <div style={{background:"rgba(255,149,0,0.3)",height:"100%",width:Math.round(ct/withIntake.length*100)+"%",borderRadius:4,transition:"width 0.3s"}}/>
                      </div>
                      <span style={{fontSize:10,color:"#888",minWidth:100,textAlign:"right"}}>{val}</span>
                      <span style={{fontSize:10,color:"#FF9500",fontWeight:700,minWidth:30,textAlign:"right"}}>{ct}</span>
                    </div>)}
                  </div>;
                })}
                {/* Open-ended responses */}
                {INTAKE_SECTIONS.flatMap(s=>s.questions).filter(q=>q.type==="text").map(q=><div key={q.id} style={{marginBottom:16}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#ddd",margin:"0 0 6px"}}>{q.q}</p>
                  {withIntake.filter(s=>s.intake[q.id]).map((s,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:6,padding:"8px 12px",marginBottom:4}}>
                    <span style={{fontSize:10,color:"#FF9500",fontWeight:700}}>{s.name}: </span>
                    <span style={{fontSize:11,color:"#aaa"}}>{s.intake[q.id]}</span>
                  </div>)}
                </div>)}
              </Section>
              {/* Individual student responses */}
              <div style={{fontSize:10,fontWeight:700,color:"#444",letterSpacing:2,textTransform:"uppercase",marginTop:16,marginBottom:10}}>INDIVIDUAL RESPONSES</div>
              {withIntake.map((s,si3)=><Section key={si3} id={"intake-"+si3} title={s.name} icon="👤">
                {INTAKE_SECTIONS.map((sec,secI)=><div key={secI}>
                  <p style={{fontSize:10,fontWeight:700,color:"#FF9500",letterSpacing:1.5,textTransform:"uppercase",margin:"10px 0 6px"}}>{sec.title}</p>
                  {sec.questions.map(q=>{
                    const a=s.intake[q.id];
                    return <div key={q.id} style={{marginBottom:8}}>
                      <p style={{fontSize:10,color:"#666",margin:"0 0 2px"}}>{q.q}</p>
                      <p style={{fontSize:12,color:"#ccc",margin:0,fontWeight:600}}>{Array.isArray(a)?a.join(", "):(a||"—")}</p>
                    </div>;
                  })}
                </div>)}
              </Section>)}
            </div>;
          })()}
        </div>}

        {/* TAB: Lesson Plans */}
        {dashTab==="lessons"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {MODULES.map((m,i)=><button key={i} onClick={()=>{setDashMod(i);setExpanded({});}} style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid "+(dashMod===i?m.color+"50":"rgba(255,255,255,0.06)"),background:dashMod===i?m.color+"12":"transparent",color:dashMod===i?m.color:"#555",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{m.icon} M{m.id}</button>)}
          </div>
          {(()=>{const lp=LESSON_PLANS[dashMod],m=MODULES[dashMod]; return <div>
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>{lp.title}</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 6px",lineHeight:1.5}}>{lp.goal}</p>
            <div style={{background:m.color+"08",border:"1px solid "+m.color+"20",borderRadius:8,padding:"8px 12px",marginBottom:20}}>
              <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>❓ UNANSWERABLE QUESTION</div>
              <p style={{fontSize:12,color:"#bbb",margin:0,lineHeight:1.5,fontStyle:"italic"}}>{lp.unanswerable}</p>
            </div>

            <Section id="hooks" title={"Hook Options ("+lp.hooks.length+")"} icon="🎣" color="rgba(232,168,56,0.08)">
              {lp.hooks.map((h,hi)=><div key={hi} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:9,padding:14,marginBottom:hi<lp.hooks.length-1?10:0}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:6}}>{h.icon} {h.name}</div>
                {h.content.split("\n\n").map((p,pi)=><p key={pi} style={{fontSize:12,color:"#999",margin:pi<h.content.split("\n\n").length-1?"0 0 10px":"0",lineHeight:1.65}}>{p}</p>)}
              </div>)}
            </Section>

            <Section id="timeline" title="Class Timeline" icon="🕒">
              {lp.timeline.map((t,ti)=><div key={ti} style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:10,padding:"10px 0",borderBottom:ti<lp.timeline.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{fontSize:11,fontWeight:700,color:m.color,fontFamily:"'DM Mono',monospace"}}>{t.time}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:2}}>{t.activity}</div>
                  <p style={{fontSize:11,color:"#888",margin:"0 0 4px",lineHeight:1.5}}>{t.desc}</p>
                  <p style={{fontSize:11,color:"#666",margin:0,fontStyle:"italic",lineHeight:1.5}}>💡 {t.note}</p>
                </div>
              </div>)}
            </Section>

            <Section id="discussions" title={"Discussion Prompts ("+lp.discussions.length+")"} icon="💬">
              {lp.discussions.map((d,di)=><div key={di} style={{padding:"10px 0",borderBottom:di<lp.discussions.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{fontSize:11,fontWeight:700,color:m.color,marginBottom:3}}>{d.title}</div>
                <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.6}}>{d.prompt}</p>
              </div>)}
            </Section>
          </div>;})()}
        </div>}

        {/* TAB: Deep Dive — Chapter Assignment & Quiz Management */}
        {dashTab==="deepdive"&&<div>
          <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>Industry Deep Dive</h2>
          <p style={{fontSize:13,color:"#555",margin:"0 0 20px"}}>The Future Is Faster Than You Think — Chapter assignments, presentations & rolling quiz management</p>

          {/* Chapter Assignment Manager */}
          <div style={{fontSize:10,fontWeight:700,color:"#A855F7",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>CHAPTER ASSIGNMENTS</div>
          <p style={{fontSize:12,color:"#666",margin:"0 0 14px"}}>Assign pairs/small groups to each chapter. Students will see their assignment and can submit quiz questions.</p>
          {BOOK_CHAPTERS.map(ch=>{
            const assignment = ddChapterAssignments[ch.id] || { students: [], presentDate: "" };
            const isAssigned = assignment.students && assignment.students.length > 0;
            const questionsForChapter = ddQuizQuestions.filter(q=>q.chapterId===ch.id);
            return <div key={ch.id} style={{background:isAssigned?"rgba(168,85,247,0.05)":"rgba(255,255,255,0.02)",border:"1px solid "+(isAssigned?"rgba(168,85,247,0.2)":"rgba(255,255,255,0.05)"),borderRadius:12,padding:16,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#A855F7",background:"rgba(168,85,247,0.15)",padding:"2px 8px",borderRadius:8}}>Ch. {ch.id}</span>
                    <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{ch.title}</span>
                  </div>
                  <p style={{fontSize:11,color:"#666",margin:"0 0 8px"}}>{ch.topic}</p>
                  {isAssigned && <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                    {assignment.students.map((s,si2)=><span key={si2} style={{fontSize:10,fontWeight:600,color:"#A855F7",background:"rgba(168,85,247,0.1)",padding:"3px 8px",borderRadius:10}}>{s}</span>)}
                  </div>}
                  {assignment.presentDate && <span style={{fontSize:10,color:"#888"}}>Presenting: {assignment.presentDate}</span>}
                  {questionsForChapter.length>0 && <span style={{fontSize:10,color:"#34C759",marginLeft:8}}>{questionsForChapter.filter(q=>q.status==="approved").length}/{questionsForChapter.length} Qs approved</span>}
                </div>
                <button onClick={()=>{
                  const names = prompt("Enter student names (comma separated):", (assignment.students||[]).join(", "));
                  if(names===null) return;
                  const date = prompt("Presentation date (e.g., 'Oct 15' or leave blank):", assignment.presentDate||"");
                  const studentList = names.split(",").map(n=>n.trim()).filter(n=>n);
                  assignChapter(ch.id, studentList, date||"");
                }} style={{...gs,fontSize:10,padding:"6px 12px"}}>{isAssigned?"Edit":"Assign"}</button>
              </div>
            </div>;
          })}

          {/* Quiz Question Review */}
          <div style={{fontSize:10,fontWeight:700,color:"#FF9500",letterSpacing:2,textTransform:"uppercase",margin:"28px 0 10px"}}>QUIZ QUESTION REVIEW</div>
          {(()=>{
            const pending = ddQuizQuestions.filter(q=>q.status==="pending");
            const approved = ddQuizQuestions.filter(q=>q.status==="approved");
            const rejected = ddQuizQuestions.filter(q=>q.status==="rejected");
            const renderQ = (q) => <div key={q.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:14,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:9,fontWeight:700,color:"#A855F7",background:"rgba(168,85,247,0.15)",padding:"2px 6px",borderRadius:6}}>Ch. {q.chapterId}</span>
                    <span style={{fontSize:9,fontWeight:700,color:"#007AFF",background:"rgba(0,122,255,0.12)",padding:"2px 6px",borderRadius:6}}>{q.type==="mc"?"Multiple Choice":q.type==="short"?"Short Answer":"Open-Ended"}</span>
                    <span style={{fontSize:9,color:"#666"}}>by {q.studentName}</span>
                  </div>
                  <p style={{fontSize:13,fontWeight:600,color:"#ddd",margin:"0 0 4px"}}>{q.question}</p>
                  {q.type==="mc" && q.options && <div style={{marginBottom:4}}>
                    {q.options.map((o,oi)=><p key={oi} style={{fontSize:11,color:o===q.answer?"#34C759":"#888",margin:"1px 0",fontWeight:o===q.answer?700:400}}>{o===q.answer?"✓ ":"  "}{o}</p>)}
                  </div>}
                  {q.type==="short" && <p style={{fontSize:11,color:"#34C759",margin:"0 0 4px"}}>Answer: {q.answer}</p>}
                </div>
                {q.status==="pending"&&<div style={{display:"flex",gap:4}}>
                  <button onClick={()=>reviewQuestion(q.id,"approved")} style={{background:"rgba(52,199,89,0.15)",border:"1px solid rgba(52,199,89,0.3)",color:"#34C759",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>✓ Approve</button>
                  <button onClick={()=>reviewQuestion(q.id,"rejected")} style={{background:"rgba(255,59,48,0.1)",border:"1px solid rgba(255,59,48,0.2)",color:"#FF3B30",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>✗ Reject</button>
                </div>}
                {q.status==="approved"&&<span style={{fontSize:10,fontWeight:700,color:"#34C759",background:"rgba(52,199,89,0.1)",padding:"4px 10px",borderRadius:8}}>✓ Approved</span>}
                {q.status==="rejected"&&<span style={{fontSize:10,fontWeight:700,color:"#FF3B30",background:"rgba(255,59,48,0.1)",padding:"4px 10px",borderRadius:8}}>✗ Rejected</span>}
              </div>
            </div>;
            return <div>
              {pending.length>0&&<div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:"#FF9500",marginBottom:6}}>Pending Review ({pending.length})</div>
                {pending.map(renderQ)}
              </div>}
              {pending.length===0&&<p style={{color:"#444",fontSize:12,marginBottom:16}}>No questions pending review.</p>}
              {approved.length>0&&<Section id="dd-approved" title={"Approved Questions ("+approved.length+")"} icon="✓">
                {approved.map(renderQ)}
              </Section>}
              {rejected.length>0&&<Section id="dd-rejected" title={"Rejected Questions ("+rejected.length+")"} icon="✗">
                {rejected.map(renderQ)}
              </Section>}
            </div>;
          })()}

          {/* Rolling Quiz Results */}
          <div style={{fontSize:10,fontWeight:700,color:"#34C759",letterSpacing:2,textTransform:"uppercase",margin:"28px 0 10px"}}>ROLLING QUIZ RESULTS</div>
          {(()=>{
            const studentsWithHistory = dashData.filter(s=>s.ddQuizHistory&&s.ddQuizHistory.length>0);
            if(studentsWithHistory.length===0) return <p style={{color:"#444",fontSize:12}}>No quiz attempts yet.</p>;
            return <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                  <th style={{textAlign:"left",padding:"10px 12px",color:"#666",fontWeight:700,fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}}>Student</th>
                  <th style={{textAlign:"center",padding:"10px 8px",color:"#666",fontWeight:700,fontSize:10}}>Quizzes</th>
                  <th style={{textAlign:"center",padding:"10px 8px",color:"#666",fontWeight:700,fontSize:10}}>Avg Score</th>
                  <th style={{textAlign:"right",padding:"10px 12px",color:"#666",fontWeight:700,fontSize:10}}>Last Attempt</th>
                </tr></thead>
                <tbody>{studentsWithHistory.map((s,i)=>{
                  const h = s.ddQuizHistory;
                  const avg = Math.round(h.reduce((a,r)=>a+(r.score/r.total*100),0)/h.length);
                  return <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <td style={{padding:"10px 12px",color:"#ddd",fontWeight:600}}>{s.name}</td>
                    <td style={{textAlign:"center",padding:"10px 8px",color:"#bbb"}}>{h.length}</td>
                    <td style={{textAlign:"center",padding:"10px 8px"}}><span style={{color:avg>=70?"#34C759":"#FF9500",fontWeight:700}}>{avg}%</span></td>
                    <td style={{textAlign:"right",padding:"10px 12px",color:"#555",fontSize:11}}>{new Date(h[h.length-1].date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>;
          })()}
        </div>}

        {/* TAB: Guide Tips */}
        {dashTab==="tips"&&<div>
          <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 16px",color:"#fff"}}>Guide Mode: Your Playbook</h2>

          <Section id="philosophy" title="Teaching Philosophy" icon="🧭">
            <p style={{fontSize:13,color:"#bbb",margin:"0 0 12px",lineHeight:1.7}}>The app delivers content. You deliver context, motivation, and real-world connection. Your WSC Sports experience is your superpower — a 2-minute story from your career will land harder than any textbook chapter.</p>
            <p style={{fontSize:13,color:"#bbb",margin:0,lineHeight:1.7}}>Every class follows the 30/90/60 rhythm: 30 minutes of your hook, 90 minutes of app work + workshop (you circulating as guide), 60 minutes of discussion where you connect everything to careers and current events.</p>
          </Section>

          <Section id="during-app" title="During App Work Time" icon="🚶">
            <p style={{fontSize:12,color:"#999",margin:"0 0 12px",lineHeight:1.6}}>This looks like you’re doing nothing. You’re not. You’re circulating, observing, intervening at the right moments:</p>
            <div style={{background:"rgba(52,199,89,0.05)",border:"1px solid rgba(52,199,89,0.15)",borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#34C759",marginBottom:3}}>FAST FINISHERS</div>
              <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}>Challenge with Go Deeper questions. Ask them to explain a concept to a struggling classmate. Have them start exercises before discussion.</p>
            </div>
            <div style={{background:"rgba(255,149,0,0.05)",border:"1px solid rgba(255,149,0,0.15)",borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#FF9500",marginBottom:3}}>STUCK STUDENTS</div>
              <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}>Don’t explain the content — the app does that. Ask: “Which segment are you on? Have you read the key term? What part is confusing?” Coach HOW to learn, not WHAT to learn.</p>
            </div>
            <div style={{background:"rgba(255,59,48,0.05)",border:"1px solid rgba(255,59,48,0.15)",borderRadius:8,padding:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#FF3B30",marginBottom:3}}>DISENGAGED STUDENTS</div>
              <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}>Walk over casually. Ask what they’re on. Often stuck but not asking. Quick motivational nudge: “You’re 3 segments from the quiz. Crush it and you’ll be first to unlock Module 2.”</p>
            </div>
          </Section>

          <Section id="dashboard-tips" title="Using Your Dashboard" icon="📊">
            <p style={{fontSize:12,color:"#999",margin:"0 0 10px",lineHeight:1.6}}>Check the Class Progress tab during breaks and at end of class:</p>
            <p style={{fontSize:12,color:"#aaa",margin:"0 0 6px",lineHeight:1.5}}><strong style={{color:"#34C759"}}>Passed students</strong> should be doing workshop activities, not sitting idle.</p>
            <p style={{fontSize:12,color:"#aaa",margin:"0 0 6px",lineHeight:1.5}}><strong style={{color:"#FF9500"}}>Failed attempts</strong> — these students need targeted help. Which questions they missed tells you which concepts to emphasize.</p>
            <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}><strong style={{color:"#555"}}>No attempt</strong> — may not have finished segments. Check in directly.</p>
          </Section>

          <Section id="mastery-mgmt" title="Mastery Gate as Classroom Management" icon="🔒">
            <p style={{fontSize:13,color:"#bbb",margin:0,lineHeight:1.7}}>The 75% threshold is your classroom management tool. Students who pass before class earn the workshop (the fun part). Students who haven’t passed work through the module while others build projects and discuss. Natural incentive to prepare, without being punitive. The message: “Mastery unlocks access to the best parts of this class.”</p>
          </Section>

          <Section id="adapting" title="Adapting Week to Week" icon="🔄">
            <p style={{fontSize:13,color:"#bbb",margin:"0 0 12px",lineHeight:1.7}}>These lesson plans are frameworks, not scripts. The best hooks come from what happened THAT WEEK. Train yourself to notice: every headline about streaming rights, AI in sports, a deepfake, a social media moment — screenshot it. That’s next week’s hook.</p>
            <p style={{fontSize:13,color:"#bbb",margin:0,lineHeight:1.7}}>The more current your examples, the more students feel like this course is about the world they’re living in, not a textbook they’re reading.</p>
          </Section>

          <div style={{fontSize:10,fontWeight:700,color:"#444",letterSpacing:2,textTransform:"uppercase",marginTop:20,marginBottom:10}}>MODULE-SPECIFIC TIPS</div>
          {LESSON_PLANS.map((lp,i)=><Section key={i} id={"modtip-"+i} title={"Module "+(i+1)+": "+lp.title} icon={MODULES[i].icon} color={MODULES[i].color+"08"}>
            {lp.guideTips.map((tip,ti)=><p key={ti} style={{fontSize:12,color:"#aaa",margin:ti<lp.guideTips.length-1?"0 0 10px":"0",lineHeight:1.6,paddingLeft:12,borderLeft:"2px solid "+MODULES[i].color+"30"}}>{tip}</p>)}
          </Section>)}
        </div>}
      </div>}
    </div></div>
  );

  if(view==="home") return(
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:52,paddingBottom:40}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:"#FF3B30",boxShadow:"0 0 12px #FF3B3088"}}/>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#666"}}>SPTC 243 · Montclair State</span>
          <span style={{marginLeft:"auto",fontSize:12,color:"#555"}}>{studentName} <button onClick={logoutStudent} style={{background:"none",border:"none",color:"#444",fontSize:10,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>Not you?</button></span>
        </div>
        <h1 style={{fontSize:"clamp(28px,5vw,52px)",fontWeight:800,lineHeight:1.05,margin:"0 0 14px",color:"#fff"}}>AI & Emerging Tech<br/><span style={{color:"#FF3B30"}}>in Sports Communication</span></h1>
        <p style={{fontSize:16,color:"#555",maxWidth:520,lineHeight:1.65,margin:"0 0 12px"}}>Your guided course companion. Each module builds on the last — from the big ideas driving disruption, to understanding AI, to seeing how it's reshaping the business of sports.</p>
        <div style={{background:"rgba(255,149,0,0.06)",border:"1px solid rgba(255,149,0,0.15)",borderRadius:10,padding:"12px 16px",marginBottom:28,maxWidth:520}}>
          <div style={{fontSize:9,fontWeight:700,color:"#FF9500",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>⚡ HOW THIS WORKS</div>
          <p style={{fontSize:12,color:"#999",margin:0,lineHeight:1.6}}>Complete each module's segments, then pass the quiz with <strong style={{color:"#FF9500"}}>{MASTERY_THRESHOLD}%+</strong> to unlock the next module. Mastery unlocks access — not seat time. Students who complete modules before class earn workshop time.</p>
        </div>
        <button onClick={()=>go("module",0)} style={bs("linear-gradient(135deg,#E8A838,#D4872E)")}>Start Module 1 →</button>
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,padding:20,marginBottom:32,border:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"#444"}}>Course Progress</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Ring p={progress} size={30} sw={3} color="#34C759"/><span style={{fontWeight:800,fontSize:17}}>{progress}%</span></div>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:6,height:5}}><div style={{background:"linear-gradient(90deg,#34C759,#30D158)",height:"100%",width:progress+"%",borderRadius:6,transition:"width 0.5s"}}/></div>
      </div>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#444",marginBottom:10}}>COURSE MODULES</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12,paddingBottom:32}}>
        {MODULES.map((m,i)=>{const unlocked=isUnlocked(i); const pct=done[i]?Math.round((scores[i]/m.quiz.length)*100):0; const passed=pct>=MASTERY_THRESHOLD; return(
          <div key={m.id} onClick={()=>{if(unlocked)go("module",i);}} style={{background:done[i]?(passed?m.color+"0a":"rgba(255,59,48,0.05)"):"rgba(255,255,255,0.015)",border:"1px solid "+(done[i]?(passed?m.color+"25":"rgba(255,59,48,0.15)"):"rgba(255,255,255,0.04)"),borderRadius:14,padding:22,cursor:unlocked?"pointer":"default",transition:"all 0.2s",position:"relative",opacity:unlocked?1:.45}}
            onMouseEnter={e=>{if(unlocked){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=m.color+"40";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=done[i]?(passed?m.color+"25":"rgba(255,59,48,0.15)"):"rgba(255,255,255,0.04)";}}>
            {!unlocked&&<div style={{position:"absolute",top:12,right:12,fontSize:14}}>🔒</div>}
            {done[i]&&<div style={{position:"absolute",top:12,right:12,background:passed?"#34C759":"#FF9500",borderRadius:14,padding:"3px 9px",fontSize:9,fontWeight:700,color:"#fff"}}>{passed?"✓ ":"⟳ "}{scores[i]}/{m.quiz.length} ({pct}%)</div>}
            <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
            <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
              <Tag color={m.color} bg={m.color+"15"}>Module {m.id}</Tag>
              <Tag>{m.segments.length} segments</Tag>
              {!unlocked&&<Tag color="#FF9500" bg="rgba(255,149,0,0.1)">Pass Module {i} to unlock</Tag>}
              {done[i]&&passed&&m.goDeeper&&<Tag color="#A855F7" bg="rgba(168,85,247,0.1)">Go Deeper unlocked</Tag>}
              {done[i]&&!passed&&<Tag color="#FF9500" bg="rgba(255,149,0,0.1)">Retake — need {MASTERY_THRESHOLD}%</Tag>}
            </div>
            <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 3px",color:unlocked?"#fff":"#555"}}>{m.title}</h3>
            <p style={{fontSize:12,color:"#555",margin:0,lineHeight:1.5}}>{m.subtitle}</p>
          </div>
        );})}
      </div>

      {/* INDUSTRY DEEP DIVE — standalone section */}
      <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#A855F7",marginBottom:10}}>📚 COURSE-WIDE</div>
      <div onClick={()=>go("deepdive")} style={{background:"linear-gradient(135deg,rgba(168,85,247,0.08),rgba(120,60,200,0.04))",border:"1px solid rgba(168,85,247,0.25)",borderRadius:14,padding:24,cursor:"pointer",transition:"all 0.2s",marginBottom:32,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor="rgba(168,85,247,0.5)";e.currentTarget.style.boxShadow="0 8px 32px rgba(168,85,247,0.1)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="rgba(168,85,247,0.25)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{fontSize:36}}>🔬</div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
            <Tag color="#A855F7" bg="rgba(168,85,247,0.15)">Ongoing</Tag>
            <Tag>{BOOK_CHAPTERS.length} chapters</Tag>
            {myChapters.length>0&&<Tag color="#34C759" bg="rgba(52,199,89,0.1)">You: Ch. {myChapters.map(c=>c.chapterId).join(", ")}</Tag>}
            {ddQuizQuestions.filter(q=>q.status==="approved").length>0&&<Tag color="#FF9500" bg="rgba(255,149,0,0.1)">{ddQuizQuestions.filter(q=>q.status==="approved").length} quiz Qs live</Tag>}
          </div>
          <h3 style={{fontSize:18,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>Industry Deep Dive</h3>
          <p style={{fontSize:13,color:"#888",margin:0,lineHeight:1.5}}>The Future Is Faster Than You Think — Chapter presentations, student-created quiz questions & rolling quizzes</p>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:"#A855F7",whiteSpace:"nowrap"}}>Open →</div>
      </div>

      <div style={{borderTop:"1px solid rgba(255,255,255,0.03)",padding:"24px 0 40px",textAlign:"center"}}>
        <p style={{color:"#2a2a2a",fontSize:11}}>Professor Ben Fairclough · Fall 2025 · Wed 5:20-8:05 PM</p>
        <button onClick={()=>go("instructor")} style={{background:"none",border:"none",color:"#222",fontSize:10,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>Instructor Dashboard</button>
      </div>
    </div></div>
  );

  // ═══════════════════════════════════════════════════
  // DEEP DIVE — Student View
  // ═══════════════════════════════════════════════════
  if(view==="deepdive") {
    const approvedQs = ddQuizQuestions.filter(q=>q.status==="approved"&&(q.type==="mc"||q.type==="short"));
    return (
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:20,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",paddingBottom:12}}>
        <button onClick={()=>go("home")} style={gs}>← Home</button>
        <Tag color="#A855F7" bg="rgba(168,85,247,0.15)">Industry Deep Dive</Tag>
      </div>

      <h2 style={{fontSize:"clamp(22px,4vw,36px)",fontWeight:800,margin:"0 0 4px",color:"#fff"}}>The Future Is Faster<br/><span style={{color:"#A855F7"}}>Than You Think</span></h2>
      <p style={{fontSize:13,color:"#555",margin:"0 0 6px"}}>Diamandis & Kotler — Industry Deep Dive</p>
      <p style={{fontSize:12,color:"#666",margin:"0 0 24px",lineHeight:1.6}}>Your group presents a chapter to the class. Everyone submits quiz questions from their chapter. Rolling quizzes draw from the class's approved question pool.</p>

      {/* Your Assignment */}
      <div style={{fontSize:10,fontWeight:700,color:"#A855F7",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>YOUR ASSIGNMENT</div>
      {myChapters.length===0
        ?<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:20,marginBottom:24,textAlign:"center"}}>
          <p style={{fontSize:13,color:"#555",margin:0}}>No chapter assigned yet. Your professor will assign your group a chapter.</p>
        </div>
        :myChapters.map(mc=>{
          const ch = BOOK_CHAPTERS.find(c=>c.id===mc.chapterId);
          if(!ch) return null;
          const assignment = ddChapterAssignments[mc.chapterId] || {};
          return <div key={mc.chapterId} style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:14,padding:20,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:10,fontWeight:700,color:"#A855F7",background:"rgba(168,85,247,0.2)",padding:"3px 10px",borderRadius:8}}>Chapter {ch.id}</span>
              {assignment.presentDate&&<span style={{fontSize:10,color:"#FF9500",fontWeight:600}}>Present: {assignment.presentDate}</span>}
            </div>
            <h3 style={{fontSize:20,fontWeight:800,color:"#fff",margin:"0 0 4px"}}>{ch.title}</h3>
            <p style={{fontSize:12,color:"#888",margin:"0 0 8px"}}>{ch.topic}</p>
            {assignment.students&&assignment.students.length>1&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              <span style={{fontSize:10,color:"#666"}}>Your group:</span>
              {assignment.students.map((s,si2)=><span key={si2} style={{fontSize:10,fontWeight:600,color:s===studentName?"#A855F7":"#888",background:s===studentName?"rgba(168,85,247,0.12)":"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:8}}>{s}</span>)}
            </div>}
          </div>;
        })
      }

      {/* Submit Quiz Question */}
      {myChapters.length>0&&<>
        <div style={{fontSize:10,fontWeight:700,color:"#FF9500",letterSpacing:2,textTransform:"uppercase",margin:"8px 0 10px"}}>SUBMIT A QUIZ QUESTION</div>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:20,marginBottom:24}}>
          <p style={{fontSize:11,color:"#666",margin:"0 0 14px"}}>Create questions from your assigned chapter for the rolling quiz pool. Professor Fairclough reviews before they go live.</p>

          {myChapters.length>1&&<div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:700,color:"#666",letterSpacing:1,display:"block",marginBottom:4}}>CHAPTER</label>
            <div style={{display:"flex",gap:4}}>{myChapters.map(mc=><button key={mc.chapterId} onClick={()=>setDdSubmitQ(p=>({...p,chapterId:mc.chapterId}))} style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(ddSubmitQ.chapterId===mc.chapterId?"#A855F7":"rgba(255,255,255,0.08)"),background:ddSubmitQ.chapterId===mc.chapterId?"rgba(168,85,247,0.12)":"transparent",color:ddSubmitQ.chapterId===mc.chapterId?"#A855F7":"#666",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ch. {mc.chapterId}</button>)}</div>
          </div>}

          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:700,color:"#666",letterSpacing:1,display:"block",marginBottom:4}}>QUESTION TYPE</label>
            <div style={{display:"flex",gap:4}}>
              {[["mc","Multiple Choice"],["short","Short Answer"],["open","Open-Ended"]].map(([t,l])=><button key={t} onClick={()=>setDdSubmitQ(p=>({...p,type:t}))} style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(ddSubmitQ.type===t?"#FF9500":"rgba(255,255,255,0.08)"),background:ddSubmitQ.type===t?"rgba(255,149,0,0.12)":"transparent",color:ddSubmitQ.type===t?"#FF9500":"#666",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:700,color:"#666",letterSpacing:1,display:"block",marginBottom:4}}>YOUR QUESTION</label>
            <textarea value={ddSubmitQ.question} onChange={e=>setDdSubmitQ(p=>({...p,question:e.target.value}))} placeholder="Write your question..." rows={2} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
          </div>

          {ddSubmitQ.type==="mc"&&<div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:700,color:"#666",letterSpacing:1,display:"block",marginBottom:4}}>ANSWER CHOICES (mark the correct one)</label>
            {ddSubmitQ.options.map((o,oi)=><div key={oi} style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
              <button onClick={()=>setDdSubmitQ(p=>({...p,answer:p.options[oi]}))} style={{width:22,height:22,borderRadius:"50%",border:"2px solid "+(ddSubmitQ.answer===o&&o?"#34C759":"rgba(255,255,255,0.15)"),background:ddSubmitQ.answer===o&&o?"#34C759":"transparent",cursor:"pointer",fontSize:10,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ddSubmitQ.answer===o&&o?"✓":""}</button>
              <input value={o} onChange={e=>{const newOpts=[...ddSubmitQ.options];newOpts[oi]=e.target.value;setDdSubmitQ(p=>({...p,options:newOpts}));}} placeholder={"Option "+(oi+1)} style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:12,fontFamily:"inherit",outline:"none"}}/>
            </div>)}
          </div>}

          {ddSubmitQ.type==="short"&&<div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:700,color:"#666",letterSpacing:1,display:"block",marginBottom:4}}>EXPECTED ANSWER</label>
            <input value={ddSubmitQ.answer} onChange={e=>setDdSubmitQ(p=>({...p,answer:e.target.value}))} placeholder="The correct answer..." style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
          </div>}

          <button onClick={submitQuizQuestion} style={bs(ddSubmitQ.question.trim()?"linear-gradient(135deg,#A855F7,#7C3AED)":"#333")}>Submit Question for Review</button>

          {/* My submitted questions */}
          {(()=>{
            const mine = ddQuizQuestions.filter(q=>q.studentName===studentName);
            if(mine.length===0) return null;
            return <div style={{marginTop:16,borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"#666",marginBottom:8}}>YOUR SUBMISSIONS ({mine.length})</div>
              {mine.map((q,qi)=><div key={qi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:qi<mine.length-1?"1px solid rgba(255,255,255,0.03)":"none"}}>
                <span style={{fontSize:12,color:"#aaa",flex:1}}>{q.question.slice(0,60)}{q.question.length>60?"...":""}</span>
                <span style={{fontSize:10,fontWeight:700,color:q.status==="approved"?"#34C759":q.status==="rejected"?"#FF3B30":"#FF9500",background:q.status==="approved"?"rgba(52,199,89,0.1)":q.status==="rejected"?"rgba(255,59,48,0.1)":"rgba(255,149,0,0.1)",padding:"3px 8px",borderRadius:8}}>{q.status==="approved"?"✓ Approved":q.status==="rejected"?"✗ Rejected":"⏳ Pending"}</span>
              </div>)}
            </div>;
          })()}
        </div>
      </>}

      {/* Rolling Quiz */}
      <div style={{fontSize:10,fontWeight:700,color:"#34C759",letterSpacing:2,textTransform:"uppercase",margin:"8px 0 10px"}}>ROLLING QUIZ</div>
      {!ddRollingQuiz
        ?<div style={{background:"rgba(52,199,89,0.04)",border:"1px solid rgba(52,199,89,0.15)",borderRadius:14,padding:20,marginBottom:24}}>
          <p style={{fontSize:13,color:"#bbb",margin:"0 0 8px"}}>Test yourself on questions created by your classmates. Each quiz pulls from the approved pool — different every time.</p>
          <p style={{fontSize:11,color:"#666",margin:"0 0 14px"}}>{approvedQs.length} approved question{approvedQs.length!==1?"s":""} in the pool{approvedQs.length<3?" (need at least 3 to start)":""}</p>
          <button onClick={startRollingQuiz} disabled={approvedQs.length<3} style={bs(approvedQs.length>=3?"linear-gradient(135deg,#34C759,#30D158)":"#333")}>Start Quiz →</button>
          {ddQuizHistory.length>0&&<div style={{marginTop:14,borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:12}}>
            <div style={{fontSize:10,fontWeight:700,color:"#666",marginBottom:6}}>YOUR HISTORY</div>
            {ddQuizHistory.map((h,hi)=><div key={hi} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11}}>
              <span style={{color:"#888"}}>{new Date(h.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
              <span style={{color:Math.round(h.score/h.total*100)>=70?"#34C759":"#FF9500",fontWeight:700}}>{h.score}/{h.total} ({Math.round(h.score/h.total*100)}%)</span>
            </div>)}
          </div>}
        </div>
        :<div style={{marginBottom:24}}>
          {ddRollingQuiz.map((q,qi)=>(
            <div key={qi} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:18,marginBottom:12}}>
              <div style={{display:"flex",gap:6,marginBottom:6}}>
                <span style={{fontSize:9,fontWeight:700,color:"#A855F7",background:"rgba(168,85,247,0.12)",padding:"2px 6px",borderRadius:6}}>Ch. {q.chapterId}</span>
                <span style={{fontSize:9,color:"#666"}}>by {q.studentName}</span>
              </div>
              <p style={{fontSize:13,fontWeight:700,margin:"0 0 10px"}}>{qi+1}. {q.question}</p>
              {q.type==="mc"&&q.options.map((opt,oi)=><button key={oi} onClick={()=>setDdQuizAns(p=>({...p,[qi]:opt}))} style={{display:"block",width:"100%",textAlign:"left",background:ddQuizAns[qi]===opt?"rgba(168,85,247,0.12)":"rgba(255,255,255,0.02)",border:"1px solid "+(ddQuizAns[qi]===opt?"#A855F7":"rgba(255,255,255,0.06)"),color:ddQuizAns[qi]===opt?"#fff":"#777",padding:"9px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:ddQuizAns[qi]===opt?600:400,marginBottom:5}}>{opt}</button>)}
              {q.type==="short"&&<input value={ddQuizAns[qi]||""} onChange={e=>setDdQuizAns(p=>({...p,[qi]:e.target.value}))} placeholder="Your answer..." style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"10px 13px",color:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>}
            </div>
          ))}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setDdRollingQuiz(null);setDdQuizAns({});}} style={gs}>Cancel</button>
            <button onClick={submitRollingQuiz} disabled={Object.keys(ddQuizAns).length<ddRollingQuiz.length} style={{...bs(Object.keys(ddQuizAns).length>=ddRollingQuiz.length?"linear-gradient(135deg,#34C759,#30D158)":"#333"),flex:1}}>Submit Quiz</button>
          </div>
        </div>
      }

      {/* All Chapters Overview */}
      <div style={{fontSize:10,fontWeight:700,color:"#666",letterSpacing:2,textTransform:"uppercase",margin:"8px 0 10px"}}>ALL CHAPTERS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8,paddingBottom:40}}>
        {BOOK_CHAPTERS.map(ch=>{
          const assignment = ddChapterAssignments[ch.id];
          const isMyChapter = myChapters.some(mc=>mc.chapterId===ch.id);
          return <div key={ch.id} onClick={()=>go("chapter",ch.id)} style={{background:isMyChapter?"rgba(168,85,247,0.06)":"rgba(255,255,255,0.015)",border:"1px solid "+(isMyChapter?"rgba(168,85,247,0.2)":"rgba(255,255,255,0.04)"),borderRadius:10,padding:14,cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.borderColor=isMyChapter?"rgba(168,85,247,0.4)":"rgba(255,255,255,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=isMyChapter?"rgba(168,85,247,0.2)":"rgba(255,255,255,0.04)";}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:10,fontWeight:700,color:isMyChapter?"#A855F7":"#555"}}>Ch. {ch.id}</span>
              {assignment&&assignment.presentDate&&<span style={{fontSize:9,color:"#888"}}>{assignment.presentDate}</span>}
            </div>
            <p style={{fontSize:12,fontWeight:600,color:isMyChapter?"#fff":"#999",margin:"0 0 2px"}}>{ch.title}</p>
            <p style={{fontSize:10,color:"#555",margin:0}}>{ch.topic}</p>
            {assignment&&assignment.students&&assignment.students.length>0&&<div style={{marginTop:6,display:"flex",gap:3,flexWrap:"wrap"}}>
              {assignment.students.map((s,si2)=><span key={si2} style={{fontSize:9,color:s===studentName?"#A855F7":"#666",fontWeight:s===studentName?700:400}}>{s}</span>)}
            </div>}
          </div>;
        })}
      </div>
    </div></div>
  );}

  // Deep Dive Quiz Results
  if(view==="ddresults") {
    const lastResult = ddQuizHistory.length>0 ? ddQuizHistory[ddQuizHistory.length-1] : null;
    if(!lastResult) { go("deepdive"); return null; }
    const pct = Math.round(lastResult.score/lastResult.total*100);
    return (
    <div style={S}>{font}<Bg/><div style={{...W,...F,textAlign:"center",paddingTop:48}}>
      <Ring p={pct} size={90} sw={6} color={pct>=70?"#34C759":"#FF9500"}/>
      <h2 style={{fontSize:34,fontWeight:800,margin:"12px 0 4px"}}>{lastResult.score}/{lastResult.total}</h2>
      <p style={{color:pct>=70?"#34C759":"#FF9500",fontSize:16,fontWeight:700,margin:"0 0 4px"}}>{pct}%</p>
      <p style={{color:"#555",fontSize:14,margin:"0 0 16px"}}>{pct>=70?"Great work on the rolling quiz!":"Keep studying — try again anytime."}</p>
      <p style={{fontSize:11,color:"#666",margin:"0 0 24px"}}>Quiz #{ddQuizHistory.length} · {new Date(lastResult.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",paddingBottom:40}}>
        <button onClick={()=>go("deepdive")} style={gs}>← Deep Dive</button>
        <button onClick={()=>go("home")} style={gs}>Home</button>
      </div>
    </div></div>
  );}

  // ═══════════════════════════════════════════════════
  // CHAPTER DETAIL VIEW
  // ═══════════════════════════════════════════════════
  if(view==="chapter" && chapterId) {
    const ch = BOOK_CHAPTERS.find(c=>c.id===chapterId);
    if(!ch) { go("deepdive"); return null; }
    const assignment = ddChapterAssignments[ch.id] || {};
    const isMyChapter = myChapters.some(mc=>mc.chapterId===ch.id);
    const prevCh = ch.id > 1 ? ch.id - 1 : null;
    const nextCh = ch.id < BOOK_CHAPTERS.length ? ch.id + 1 : null;
    return (
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:20,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",paddingBottom:12}}>
        <button onClick={()=>go("deepdive")} style={gs}>← Deep Dive</button>
        <Tag color="#A855F7" bg="rgba(168,85,247,0.15)">Chapter {ch.id} of {BOOK_CHAPTERS.length}</Tag>
        {isMyChapter&&<Tag color="#34C759" bg="rgba(52,199,89,0.1)">Your Chapter</Tag>}
      </div>

      <h2 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:800,margin:"0 0 4px",color:"#fff"}}>{ch.title}</h2>
      <p style={{fontSize:14,color:"#A855F7",margin:"0 0 6px",fontWeight:600}}>The Future Is Faster Than You Think</p>
      {ch.part&&<p style={{fontSize:11,color:"#666",margin:"0 0 4px",fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{ch.part}</p>}
      <p style={{fontSize:13,color:"#666",margin:"0 0 24px"}}>{ch.topic}</p>

      {assignment.students&&assignment.students.length>0&&<div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:10,padding:14,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:700,color:"#A855F7",letterSpacing:1}}>PRESENTING:</span>
            {assignment.students.map((s,i)=><span key={i} style={{fontSize:12,fontWeight:600,color:s===studentName?"#A855F7":"#bbb"}}>{s}{i<assignment.students.length-1?",":""}</span>)}
          </div>
          {assignment.presentDate&&<span style={{fontSize:11,color:"#FF9500",fontWeight:600}}>{assignment.presentDate}</span>}
        </div>
      </div>}

      {/* Chapter Summary */}
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"clamp(18px,3vw,28px)",marginBottom:16}}>
        <div style={{fontSize:9,fontWeight:700,color:"#A855F7",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>CHAPTER SUMMARY</div>
        {ch.summary.split("\u2014").length > 3
          ? ch.summary.split(". ").reduce((acc, sentence, i, arr) => {
              const midpoint = Math.floor(arr.length / 2);
              if(i === 0) acc.push(sentence);
              else if(i === midpoint) { acc[acc.length-1] += "."; acc.push(sentence); }
              else acc[acc.length-1] += ". " + sentence;
              return acc;
            }, []).map((para, pi) => <p key={pi} style={{fontSize:15,lineHeight:1.75,color:"#bbb",margin:pi===0?"0 0 16px":"16px 0 0"}}>{para}{!para.endsWith(".")?"":""}</p>)
          : <p style={{fontSize:15,lineHeight:1.75,color:"#bbb",margin:0}}>{ch.summary}</p>
        }
      </div>

      {/* Key Themes */}
      <div style={{background:"rgba(168,85,247,0.04)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:12,padding:18,marginBottom:16}}>
        <div style={{fontSize:9,fontWeight:700,color:"#A855F7",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>KEY THEMES</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ch.keyThemes.map((t,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{color:"#A855F7",fontWeight:800,fontSize:14,lineHeight:"20px",flexShrink:0}}>{i+1}</span>
            <p style={{fontSize:13,color:"#ccc",margin:0,lineHeight:1.55}}>{t}</p>
          </div>)}
        </div>
      </div>

      {/* Future Vision */}
      {ch.futureVision&&<div style={{background:"linear-gradient(135deg,rgba(0,122,255,0.06),rgba(88,86,214,0.04))",border:"1px solid rgba(0,122,255,0.2)",borderRadius:14,padding:"clamp(18px,3vw,28px)",marginBottom:16}}>
        <div style={{fontSize:9,fontWeight:700,color:"#007AFF",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>🔮 FUTURE VISION</div>
        <p style={{fontSize:14,lineHeight:1.75,color:"#bbb",margin:0,fontStyle:"italic"}}>{ch.futureVision}</p>
      </div>}

      {/* Sports Connection */}
      {ch.sportsConnection&&<div style={{background:"rgba(255,59,48,0.04)",border:"1px solid rgba(255,59,48,0.15)",borderRadius:12,padding:18,marginBottom:24}}>
        <div style={{fontSize:9,fontWeight:700,color:"#FF3B30",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>🏟️ SPORTS CONNECTION</div>
        <p style={{fontSize:13,lineHeight:1.65,color:"#aaa",margin:0}}>{ch.sportsConnection}</p>
      </div>}

      {/* Chapter Navigation */}
      <div style={{display:"flex",justifyContent:"space-between",paddingBottom:40,gap:8,flexWrap:"wrap"}}>
        {prevCh?<button onClick={()=>go("chapter",prevCh)} style={gs}>← Ch. {prevCh}</button>:<div/>}
        {nextCh?<button onClick={()=>go("chapter",nextCh)} style={bs("linear-gradient(135deg,#A855F7,#7C3AED)")}>Ch. {nextCh}: {BOOK_CHAPTERS.find(c=>c.id===nextCh).title} →</button>
        :<button onClick={()=>go("deepdive")} style={bs("linear-gradient(135deg,#A855F7,#7C3AED)")}>← Back to Deep Dive</button>}
      </div>
    </div></div>
  );}

  if(view==="module"){const m=MODULES[mi],seg=m.segments[si]; return(
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:20,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",paddingBottom:12}}>
        <button onClick={()=>go("home")} style={gs}>← Home</button>
        <Tag color={m.color} bg={m.color+"15"}>Module {m.id}</Tag>
        <span style={{fontSize:11,color:"#444",marginLeft:"auto",fontFamily:"'DM Mono',monospace"}}>{si+1}/{m.segments.length}</span>
      </div>
      <SegProg cur={si} total={m.segments.length} color={m.color}/>
      <h2 style={{fontSize:"clamp(20px,3.5vw,30px)",fontWeight:800,margin:"0 0 4px",color:"#fff"}}>{seg.title}</h2>
      <p style={{fontSize:12,color:m.color,margin:"0 0 20px",fontWeight:600}}>{m.title} — Segment {si+1}</p>
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:"clamp(16px,3vw,28px)",marginBottom:14}}>
        {seg.content === "VISUALIZE_FUNNEL" ? <>
          <p style={{fontSize:15,lineHeight:1.75,color:"#bbb",margin:"0 0 24px"}}>Every sports rights holder — from the NFL to a college conference — is trying to grow its fan base. The fan continuum is the strategic framework for how they do it: move people from never having heard of your sport, to casually engaged, to deeply invested and spending money. Social media, AI content, and owned digital platforms each play a specific role at each stage.</p>
          <div style={{maxWidth:480,margin:"0 auto 28px",position:"relative"}}>
            <svg viewBox="0 0 400 320" style={{width:"100%",height:"auto"}}>
              <polygon points="20,10 380,10 330,105 70,105" fill="rgba(255,149,0,0.15)" stroke="#FF9500" strokeWidth="1.5"/>
              <text x="200" y="42" textAnchor="middle" fill="#FF9500" fontSize="13" fontWeight="800" fontFamily="DM Sans,sans-serif">NEW FANS</text>
              <text x="200" y="62" textAnchor="middle" fill="#999" fontSize="9.5" fontFamily="DM Sans,sans-serif">Social algorithms surface content to people</text>
              <text x="200" y="76" textAnchor="middle" fill="#999" fontSize="9.5" fontFamily="DM Sans,sans-serif">who never sought it out — viral discovery</text>
              <text x="200" y="93" textAnchor="middle" fill="#666" fontSize="8" fontFamily="DM Mono,monospace">TikTok · Instagram Reels · YouTube Shorts · X</text>
              <polygon points="70,115 330,115 280,210 120,210" fill="rgba(0,122,255,0.15)" stroke="#007AFF" strokeWidth="1.5"/>
              <text x="200" y="147" textAnchor="middle" fill="#007AFF" fontSize="13" fontWeight="800" fontFamily="DM Sans,sans-serif">CASUAL FANS</text>
              <text x="200" y="167" textAnchor="middle" fill="#999" fontSize="9.5" fontFamily="DM Sans,sans-serif">Follow leagues, teams, players on social —</text>
              <text x="200" y="181" textAnchor="middle" fill="#999" fontSize="9.5" fontFamily="DM Sans,sans-serif">opted in to receive content regularly</text>
              <text x="200" y="198" textAnchor="middle" fill="#666" fontSize="8" fontFamily="DM Mono,monospace">Follows · Subscribes · Engages · Shares</text>
              <polygon points="120,220 280,220 220,310 180,310" fill="rgba(255,59,48,0.15)" stroke="#FF3B30" strokeWidth="1.5"/>
              <text x="200" y="252" textAnchor="middle" fill="#FF3B30" fontSize="13" fontWeight="800" fontFamily="DM Sans,sans-serif">HARDCORE FANS</text>
              <text x="200" y="270" textAnchor="middle" fill="#999" fontSize="9.5" fontFamily="DM Sans,sans-serif">Driven to owned platforms —</text>
              <text x="200" y="284" textAnchor="middle" fill="#999" fontSize="9.5" fontFamily="DM Sans,sans-serif">subscribe, buy, attend</text>
              <text x="200" y="301" textAnchor="middle" fill="#666" fontSize="8" fontFamily="DM Mono,monospace">Apps · OTT · Tickets · Merch · Subscriptions</text>
              <line x1="200" y1="107" x2="200" y2="113" stroke="#555" strokeWidth="1.5" markerEnd="url(#arrow)"/>
              <line x1="200" y1="212" x2="200" y2="218" stroke="#555" strokeWidth="1.5" markerEnd="url(#arrow)"/>
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#555"/></marker></defs>
            </svg>
          </div>
          <div style={{background:"rgba(255,149,0,0.05)",border:"1px solid rgba(255,149,0,0.15)",borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#FF9500",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>🔍 NEW FANS — DISCOVERY</div>
            <p style={{fontSize:13,lineHeight:1.65,color:"#bbb",margin:0}}>This is where social media's recommendation algorithms are transformative. A highlight clip of an incredible play doesn't just reach existing followers — platforms like TikTok, Instagram Reels, and YouTube Shorts actively surface it to people who have never followed the sport, team, or league. The content goes viral not because fans share it (though they do), but because the algorithm identifies it as engaging and pushes it to millions of non-followers. This is how a rugby clip reaches someone who's never watched rugby, or how an MLS goal reaches a soccer-curious teenager. The rights holder didn't pay for this reach — the algorithm delivered it for free based on engagement signals.</p>
          </div>
          <div style={{background:"rgba(0,122,255,0.05)",border:"1px solid rgba(0,122,255,0.15)",borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#007AFF",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>📱 CASUAL FANS — ENGAGEMENT</div>
            <p style={{fontSize:13,lineHeight:1.65,color:"#bbb",margin:0}}>Once that viral moment hooks someone, the next step is opting in. They follow the league's Instagram, subscribe to the team's YouTube channel, turn on notifications for a player they like. Now they're receiving content regularly — highlights, behind-the-scenes, storylines — without actively searching for it. They've moved from accidental discovery to intentional engagement. The rights holder now has a direct content relationship with this fan through social channels. AI-generated content is critical here because the volume of personalized clips needed to keep millions of casual fans engaged across every platform would be impossible to produce manually.</p>
          </div>
          <div style={{background:"rgba(255,59,48,0.05)",border:"1px solid rgba(255,59,48,0.15)",borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#FF3B30",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>💰 HARDCORE FANS — CONVERSION</div>
            <p style={{fontSize:13,lineHeight:1.65,color:"#bbb",margin:0}}>The ultimate goal: drive casual fans off of social media platforms (which you don't own) and onto owned-and-operated properties where real monetization happens. Marketing calls-to-action embedded in social content push fans to download the league app, subscribe to the OTT streaming platform, buy tickets, purchase merchandise, or sign up for a fantasy game. These fans have purchase intent — they've been warmed up through the discovery and engagement stages. On owned platforms, the rights holder captures first-party data, owns the customer relationship directly (the D2C model from earlier in this module), and captures revenue without sharing it with a social media middleman.</p>
          </div>
        </> : <p style={{fontSize:15,lineHeight:1.75,color:"#bbb",margin:0}}>{seg.content}</p>}
      </div>
      <div style={{background:m.color+"08",border:"1px solid "+m.color+"20",borderRadius:12,padding:16,marginBottom:14}}>
        <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>📌 KEY TERM</div>
        <p style={{fontSize:13,lineHeight:1.65,color:"#ccc",margin:0,fontFamily:"'DM Mono',monospace"}}>{seg.keyTerm}</p>
      </div>
      <div style={{background:"rgba(52,199,89,0.04)",border:"1px solid rgba(52,199,89,0.12)",borderRadius:12,padding:16,marginBottom:22}}>
        <div style={{fontSize:9,fontWeight:700,color:"#34C759",letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>🎯 TRY IT NOW</div>
        <p style={{fontSize:13,lineHeight:1.65,color:"#aaa",margin:0}}>{seg.exercise}</p>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",paddingBottom:36,gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>{if(si>0){setSi(si-1);window.scrollTo({top:0});}}} disabled={si===0} style={{...gs,opacity:si===0?.35:1}}>← Previous</button>
        {si<m.segments.length-1
          ?<button onClick={()=>{setSi(si+1);window.scrollTo({top:0});}} style={bs(m.color)}>Next Segment →</button>
          :<button onClick={()=>go("quiz")} style={bs("linear-gradient(135deg,#FF9500,#FF3B30)")}>Take the Quiz →</button>}
      </div>
    </div></div>
  );}

  if(view==="quiz"){const m=MODULES[mi],ok=Object.keys(ans).length>=m.quiz.length; return(
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:20,paddingBottom:12}}><button onClick={()=>go("module")} style={gs}>← Back</button></div>
      <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 4px"}}>Knowledge Check</h2>
      <p style={{color:"#555",fontSize:13,margin:"0 0 6px"}}>{m.title} — {m.quiz.length} questions</p>
      <p style={{color:"#FF9500",fontSize:11,fontWeight:600,margin:"0 0 24px"}}>You need {MASTERY_THRESHOLD}% to pass and unlock the next module.</p>
      {m.quiz.map((q,qi)=>(
        <div key={qi} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:18,marginBottom:12}}>
          <p style={{fontSize:13,fontWeight:700,margin:"0 0 10px"}}>{qi+1}. {q.q}</p>
          {q.o.map((opt,oi)=><button key={oi} onClick={()=>setAns(p=>({...p,[qi]:oi}))} style={{display:"block",width:"100%",textAlign:"left",background:ans[qi]===oi?m.color+"15":"rgba(255,255,255,0.02)",border:"1px solid "+(ans[qi]===oi?m.color:"rgba(255,255,255,0.06)"),color:ans[qi]===oi?"#fff":"#777",padding:"9px 13px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:ans[qi]===oi?600:400,marginBottom:5}}>{opt}</button>)}
        </div>
      ))}
      <button onClick={()=>{let s=0;MODULES[mi].quiz.forEach((q,i)=>{if(ans[i]===q.a)s++;});const nd={...done,[mi]:true};const ns={...scores,[mi]:s};setScores(ns);setDone(nd);syncProgress(nd,ns);go("results");}} disabled={!ok} style={{...bs(ok?"linear-gradient(135deg,#34C759,#30D158)":"#333"),width:"100%",marginBottom:36,cursor:ok?"pointer":"default"}}>Submit</button>
    </div></div>
  );}

  if(view==="results"){const m=MODULES[mi],sc=scores[mi]||0,t=m.quiz.length,pct=Math.round(sc/t*100),passed=pct>=MASTERY_THRESHOLD; return(
    <div style={S}>{font}<Bg/><div style={{...W,...F,textAlign:"center",paddingTop:48}}>
      <Ring p={pct} size={90} sw={6} color={passed?"#34C759":"#FF9500"}/>
      <h2 style={{fontSize:34,fontWeight:800,margin:"12px 0 4px"}}>{sc}/{t}</h2>
      <p style={{color:passed?"#34C759":"#FF9500",fontSize:16,fontWeight:700,margin:"0 0 4px"}}>{pct}%</p>
      <p style={{color:"#555",fontSize:14,margin:"0 0 8px"}}>{passed?(pct===100?"Perfect mastery.":"You've demonstrated mastery."):"You need "+MASTERY_THRESHOLD+"% to unlock the next module."}</p>
      {passed&&<div style={{display:"inline-block",background:"rgba(52,199,89,0.1)",border:"1px solid rgba(52,199,89,0.2)",borderRadius:10,padding:"8px 16px",marginBottom:8}}>
        <span style={{color:"#34C759",fontSize:12,fontWeight:700}}>✓ Module {mi+2<=MODULES.length?"Module "+(mi+2)+" unlocked":""}{m.goDeeper?" · Go Deeper unlocked":""}</span>
      </div>}
      {!passed&&<div style={{display:"inline-block",background:"rgba(255,149,0,0.1)",border:"1px solid rgba(255,149,0,0.2)",borderRadius:10,padding:"8px 16px",marginBottom:8}}>
        <span style={{color:"#FF9500",fontSize:12,fontWeight:700}}>Review the segments below and retake the quiz</span>
      </div>}
      <div style={{textAlign:"left",maxWidth:560,margin:"16px auto 28px"}}>
        {m.quiz.map((q,qi)=>{const ok2=ans[qi]===q.a; return(
          <div key={qi} style={{background:ok2?"rgba(52,199,89,0.05)":"rgba(255,59,48,0.05)",border:"1px solid "+(ok2?"rgba(52,199,89,0.15)":"rgba(255,59,48,0.15)"),borderRadius:9,padding:13,marginBottom:7}}>
            <p style={{fontSize:11,fontWeight:700,margin:"0 0 3px"}}>{qi+1}. {q.q}</p>
            <p style={{fontSize:11,margin:"0 0 1px",color:ok2?"#34C759":"#FF3B30"}}>You: {q.o[ans[qi]]} {ok2?"✓":"✗"}</p>
            {!ok2&&<p style={{fontSize:11,margin:0,color:"#34C759"}}>Correct: {q.o[q.a]}</p>}
          </div>
        );})}
      </div>
      {/* Go Deeper Section */}
      {passed&&m.goDeeper&&<div style={{textAlign:"left",maxWidth:560,margin:"0 auto 28px"}}>
        <button onClick={()=>setShowDeeper(!showDeeper)} style={{...bs("linear-gradient(135deg,#A855F7,#7C3AED)"),width:"100%",marginBottom:16}}>
          {showDeeper?"Hide":"🚀 Go Deeper — Challenge Questions"}
        </button>
        {showDeeper&&<div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:12,padding:20}}>
          <p style={{fontSize:10,fontWeight:700,color:"#A855F7",letterSpacing:2,textTransform:"uppercase",margin:"0 0 6px"}}>ADVANCED APPLICATION</p>
          <p style={{fontSize:12,color:"#777",margin:"0 0 16px"}}>These open-ended challenges test whether you can APPLY the concepts, not just recall them. Use these as class discussion prep or portfolio pieces.</p>
          {m.goDeeper.map((gd,gi)=>(
            <div key={gi} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9,padding:14,marginBottom:10}}>
              <p style={{fontSize:12,fontWeight:600,color:"#ccc",margin:0}}>{gi+1}. {gd.q}</p>
            </div>
          ))}
        </div>}
      </div>}
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",paddingBottom:40}}>
        <button onClick={()=>go("home")} style={gs}>Home</button>
        {!passed&&<button onClick={()=>{setAns({});go("module",mi);}} style={bs("linear-gradient(135deg,#FF9500,#FF6B00)")}>Review & Retake →</button>}
        {passed&&mi<MODULES.length-1&&<button onClick={()=>go("module",mi+1)} style={bs("linear-gradient(135deg,#007AFF,#5856D6)")}>Next Module →</button>}
      </div>
    </div></div>
  );}

  return null;
}
