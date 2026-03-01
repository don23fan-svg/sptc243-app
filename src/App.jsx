import { useState, useEffect, useRef } from "react";

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
    id: 2, title: "AI Foundations & Your Toolkit", subtitle: "Understanding AI and Mastering the Tools", icon: "\u{1F9E0}", color: "#007AFF",
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
    id: 3, title: "The Sports Business Revolution", subtitle: "From ESPN's Monopoly to Every Rights Holder as a Media Company", icon: "\u{1F4E1}", color: "#FF3B30",
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
  const [view,setView]=useState("home");
  const [mi,setMi]=useState(0);
  const [si,setSi]=useState(0);
  const [ans,setAns]=useState({});
  const [done,setDone]=useState({});
  const [scores,setScores]=useState({});
  const [fade,setFade]=useState(true);
  const [showDeeper,setShowDeeper]=useState(false);
  const [studentName,setStudentName]=useState(null);
  const [nameInput,setNameInput]=useState("");
  const [loading,setLoading]=useState(true);
  const [dashPass,setDashPass]=useState("");
  const [dashData,setDashData]=useState([]);
  const [dashLoading,setDashLoading]=useState(false);
  const [dashTab,setDashTab]=useState("progress");
  const [dashMod,setDashMod]=useState(0);
  const [expanded,setExpanded]=useState({});

  // Load student identity and progress from storage on mount
  useEffect(()=>{
    (async()=>{
      try {
        const id = await window.storage.get("student-identity");
        if(id){
          const parsed = JSON.parse(id.value);
          setStudentName(parsed.name);
          // Load their progress
          try {
            const prog = await window.storage.get("progress:"+parsed.name.toLowerCase().replace(/\s+/g,"-"));
            if(prog){
              const p = JSON.parse(prog.value);
              if(p.done) setDone(p.done);
              if(p.scores) setScores(p.scores);
            }
          } catch(e){}
        }
      } catch(e){}
      setLoading(false);
    })();
  },[]);

  // Sync progress to storage
  const syncProgress = async (newDone, newScores) => {
    if(!studentName) return;
    const key = "progress:"+studentName.toLowerCase().replace(/\s+/g,"-");
    const data = { name: studentName, done: newDone, scores: newScores, lastActive: new Date().toISOString() };
    try {
      await window.storage.set(key, JSON.stringify(data));
      // Also sync to shared storage so instructor can see
      await window.storage.set("class:"+studentName.toLowerCase().replace(/\s+/g,"-"), JSON.stringify(data), true);
    } catch(e){ console.error("Sync failed:", e); }
  };

  // Register student
  const registerStudent = async (name) => {
    const trimmed = name.trim();
    if(!trimmed) return;
    try {
      await window.storage.set("student-identity", JSON.stringify({ name: trimmed, registered: new Date().toISOString() }));
      setStudentName(trimmed);
    } catch(e){ console.error("Registration failed:", e); setStudentName(trimmed); }
  };

  // Load instructor dashboard data
  const loadDashboard = async () => {
    setDashLoading(true);
    try {
      const keys = await window.storage.list("class:", true);
      const students = [];
      if(keys && keys.keys) {
        for(const k of keys.keys) {
          try {
            const r = await window.storage.get(k, true);
            if(r) students.push(JSON.parse(r.value));
          } catch(e){}
        }
      }
      students.sort((a,b)=>(a.name||"").localeCompare(b.name||""));
      setDashData(students);
    } catch(e){ console.error("Dashboard load failed:", e); setDashData([]); }
    setDashLoading(false);
  };

  const toggle=(key)=>setExpanded(p=>({...p,[key]:!p[key]}));

  const LESSON_PLANS = [
    {
      title: "The Future is Faster Than You Think",
      goal: "Students understand why exponential change is the defining force of their careers \u2014 and why most people consistently underestimate it.",
      hooks: [
        { name: "\u201CThe Folding Paper Problem\u201D", icon: "\u{1F4CC}", content: "Start with: \u201CIf I fold a piece of paper in half 42 times, how thick is it?\u201D Take guesses. Most will say a few feet. Answer: it reaches the moon. Let the silence land.\n\nThen: \u201CThat\u2019s exponential growth. Your brain just failed you \u2014 it drew a straight line when the reality is a curve. AI capability is on that same doubling curve. The question isn\u2019t whether this will disrupt sports media. It\u2019s whether you\u2019ll be the one doing the disrupting or the one getting disrupted.\u201D" },
        { name: "\u201CWhat\u2019s in Your Pocket?\u201D", icon: "\u{1F4F1}", content: "Hold up your phone. Ask: \u201CHow many separate devices is this replacing?\u201D Write them on the board: camera, GPS, map, calculator, flashlight, compass, recorder, scanner, alarm clock, stopwatch, music player, game console, newspaper, boarding pass, wallet. 20+.\n\n\u201CEvery one of those was an industry with companies, employees, business models. They\u2019re gone \u2014 not because the phone was better day one, but because it was on an exponential curve. The same thing is happening right now in sports media. By the end of this module you\u2019ll understand the framework that predicts which industries survive and which don\u2019t.\u201D" },
        { name: "\u201CThe Story I Saw Firsthand\u201D (WSC Sports)", icon: "\u{1F3AC}", content: "Tell a specific story from your time at WSC Sports where you watched an exponential shift happen in real time. Maybe the moment you realized AI could generate in seconds what took a production team hours. Be specific: names, dates, the look on someone\u2019s face.\n\nEnd with: \u201CWhat I saw happen to sports media production is what Diamandis calls the Six D\u2019s. By the end of today, you\u2019ll name all six and predict where the NEXT disruption is coming.\u201D" }
      ],
      unanswerable: "Name a technology in sports media currently in its \u2018deceptive phase\u2019 \u2014 something that looks like a toy today but will be transformative in 3 years.",
      timeline: [
        { time: "5:20\u20135:35", activity: "The Hook", desc: "Tell the story, show something current, pose the unanswerable question.", note: "The paper folding hook is the most interactive for a first class." },
        { time: "5:35\u20135:40", activity: "App Orientation", desc: "Show the app on projector. Walk through registration, segments, quiz, mastery gate.", note: "First class only. Remind: 75% to unlock Module 2." },
        { time: "5:40\u20137:10", activity: "Module 1 App Work", desc: "Students work through 13 segments at their own pace. You circulate as guide.", note: "Challenge fast finishers (\u201CWhich D is Netflix in right now?\u201D). Help stuck students." },
        { time: "7:10\u20137:20", activity: "Break", desc: "10-minute break.", note: "Check instructor dashboard \u2014 who\u2019s passed?" },
        { time: "7:20\u20138:00", activity: "Group Discussion", desc: "2\u20133 discussion prompts. Small groups first (5 min), then full class.", note: "Connect answers to real industry examples. Your career experience IS the content." },
        { time: "8:00\u20138:05", activity: "Preview + Close", desc: "Tease Module 2: \u201CNext week we get hands-on with the AI tools themselves.\u201D", note: "Remind: Module 1 quiz must be passed before next class." }
      ],
      discussions: [
        { title: "The Deceptive Phase", prompt: "What technology in sports media looks like a toy right now but might be in its deceptive phase? VR game attendance? AI play-by-play? Holographic displays? Make your case." },
        { title: "Convergence Spotting", prompt: "Pick a moment from last weekend\u2019s sports. How many exponential technologies converged to bring that moment to your phone?" },
        { title: "The Dark Side", prompt: "A deepfake video of an NFL quarterback saying something controversial goes viral during a playoff game. It\u2019s fake. How does the league respond? How fast?" },
        { title: "Career Implications", prompt: "If AI can generate highlights, recaps, and stat graphics automatically \u2014 what\u2019s the human\u2019s job? What skills become MORE valuable?" }
      ],
      guideTips: [
        "The paper folding exercise works best when you let students commit to a wrong answer before revealing. The surprise IS the lesson.",
        "During app work, watch for students lingering on the Six D\u2019s segment \u2014 it\u2019s the most conceptually dense. Walk over and ask them to apply it to a sport they care about.",
        "For discussion, \u201CThe Deceptive Phase\u201D prompt generates the best debate. Let students argue \u2014 don\u2019t resolve it. The framework matters more than the answer."
      ]
    },
    {
      title: "AI Foundations & Your Toolkit",
      goal: "Students go from \u201CI\u2019ve used ChatGPT\u201D to understanding what AI actually is, how it works, and how to choose the right tool for the right task.",
      hooks: [
        { name: "\u201CThe Live Hallucination Demo\u201D", icon: "\u{1F4A5}", content: "Pull up ChatGPT on the projector. Ask: \u201CWho scored the most points in last night\u2019s NBA games?\u201D Read the answer aloud. Then pull up the actual box scores. High chance it\u2019s confidently wrong.\n\n\u201CThis tool just lied to your face with total confidence. If you published that in a game recap, you\u2019d be fired. So why is every sports media company still adopting AI? Because the value isn\u2019t in trusting it blindly \u2014 it\u2019s in knowing how it works, what it\u2019s good at, where it fails, and which tool to use when.\u201D" },
        { name: "\u201CThe Same Prompt, Five Models\u201D", icon: "\u{1F50D}", content: "Before class, run the same prompt through ChatGPT, Claude, Gemini, Grok, and Perplexity: \u201CSummarize the biggest sports media story this week in 100 words.\u201D Screenshot all five.\n\nShow side by side. Different stories, angles, accuracy levels. \u201CThese are all \u2018AI\u2019 but they\u2019re not the same tool. Choosing the right one matters as much as knowing how to use them.\u201D" },
        { name: "\u201CThe $0.01 Task\u201D", icon: "\u{1F4B0}", content: "Show: \u201CIn 2023, asking AI to summarize a 10-page document cost about $1 in compute. In 2025, about a penny. What does that mean for every entry-level task that involves reading, summarizing, or rewriting content?\u201D Pause.\n\n\u201CThis isn\u2019t about whether AI replaces you. It\u2019s about what happens when the cost of doing your current job approaches zero. The people who thrive understand HOW these tools work \u2014 not just that they exist.\u201D" }
      ],
      unanswerable: "Design a complete workflow for producing post-game social media content for an NBA team. Which AI tool handles each step \u2014 and which step still needs a human?",
      timeline: [
        { time: "5:20\u20135:40", activity: "The Hook", desc: "Live demo or screenshots. Make it interactive \u2014 ask students to predict what the AI got wrong.", note: "Hallucination demo is most engaging. Bring backup screenshots in case AI happens to nail it." },
        { time: "5:40\u20137:10", activity: "Module 2 App Work", desc: "12 segments. Encourage students to open AI tools during exercises.", note: "Works best if students test ChatGPT, Claude, Perplexity side by side on their own devices." },
        { time: "7:10\u20137:20", activity: "Break", desc: "Let students keep experimenting if they want.", note: "Dashboard check: who\u2019s passed? Common sticking points?" },
        { time: "7:20\u20137:45", activity: "Live Workshop", desc: "Same task in 2+ models: \u201CWrite a 3-sentence pitch for why the Big East should invest in AI highlights.\u201D Compare results.", note: "Have students share best and worst outputs. Identify which tool won and why." },
        { time: "7:45\u20138:00", activity: "Group Discussion", desc: "Focus on the orchestration concept \u2014 right tool, right task.", note: "Push past \u201CI like ChatGPT\u201D toward \u201CI use ChatGPT for X and Claude for Y because...\u201D" },
        { time: "8:00\u20138:05", activity: "Preview + Close", desc: "\u201CNext week: how all of this is reshaping the business of sports. The economics will surprise you.\u201D", note: "Mastery reminder: Module 2 quiz at 75%+ for next week\u2019s workshop." }
      ],
      discussions: [
        { title: "Cheat vs. Tool", prompt: "Alpha Schools says: using AI chat during academics is cheating, but NOT using it during workshops is failing. Where\u2019s that line for sports communication professionals?" },
        { title: "Workflow Design", prompt: "You\u2019re a one-person social media team for a minor league baseball club. Map your daily workflow to specific AI tools. Defend every choice." },
        { title: "The Hallucination Problem", prompt: "Your AI draft says a player scored 28 points when they scored 18. It\u2019s published for 6 minutes. What\u2019s the damage? What\u2019s the prevention process?" },
        { title: "Recursive Self-Improvement", prompt: "If AI capability doubles every 12\u201318 months, what tasks that need a human today won\u2019t in 2028? What does that mean for your career?" }
      ],
      guideTips: [
        "The hallucination demo occasionally backfires \u2014 AI gets it right. Have pre-screenshotted failures as backup.",
        "During app work, Module 2\u2019s \u201COrchestration\u201D segment is the payoff. If students are running short on time, have them skip to it after the foundations.",
        "The live workshop comparing model outputs is usually the highlight of this class. Give students enough time \u2014 don\u2019t rush it for discussion."
      ]
    },
    {
      title: "The Sports Business Revolution",
      goal: "Students understand the economic forces reshaping sports media \u2014 from ESPN\u2019s cable monopoly to the model where every rights holder is a media company.",
      hooks: [
        { name: "\u201CHow Much to Watch Every NFL Game?\u201D", icon: "\u{1F3C8}", content: "Ask: \u201CIf you wanted to watch every NFL game this season, how many subscriptions would you need?\u201D Write platforms on the board as they call them: ESPN/ABC, Fox, CBS, NBC, Amazon Prime, Netflix, Peacock, YouTube TV.\n\n\u201CTen years ago: one cable subscription, everything. Your parents subsidized ESPN whether they watched or not. Now? The bundle is gone. The pie is bigger but shattered. This isn\u2019t an accident \u2014 it\u2019s the inevitable outcome of the exponential forces from Module 1.\u201D" },
        { name: "\u201CThe $9 You Never Knew You Were Paying\u201D", icon: "\u{1F4B5}", content: "Write $9.00 on the board. Ask: \u201CWho knows what this number is?\u201D Nobody will.\n\n\u201CThis is what your family paid ESPN every month through cable \u2014 whether anyone watched a single game. Multiply by 100 million households. That\u2019s $10 billion/year BEFORE ads. That\u2019s how ESPN could pay $2B/year for Monday Night Football. Now those 100M households are 68M and dropping. But total rights spending went UP. How is that possible? That paradox is the entire story of the sports business revolution.\u201D" },
        { name: "\u201CThe D-III School That\u2019s a Media Company\u201D", icon: "\u{1F3EB}", content: "Find a small college or minor league team with surprisingly good social content before class. Show their TikTok/Instagram.\n\n\u201CThis would have cost $50K to produce in 2012. Full edit suite, trained editor, distribution infrastructure. Today? One person, a laptop, an AI tool, and Canva. The tools gated behind millions are now free. That\u2019s not a slogan \u2014 it\u2019s a business model.\u201D" }
      ],
      unanswerable: "If you were hired as Head of Digital for a mid-market NBA team, what\u2019s your Fan Continuum strategy? How do you move someone who\u2019s never heard of your team to buying season tickets?",
      timeline: [
        { time: "5:20\u20135:45", activity: "The Hook", desc: "Slightly longer hook \u2014 the economics are counterintuitive. Use the $9 hook.", note: "Write affiliate fee math step by step. $9 \u00d7 100M = $10B. Let students react. The cognitive dissonance IS the hook." },
        { time: "5:45\u20137:00", activity: "Module 3 App Work", desc: "8 segments including Fan Continuum visualization. Circulate and guide.", note: "ESPN affiliate fees and Fan Continuum generate the most questions. Be ready to expand." },
        { time: "7:00\u20137:10", activity: "Break", desc: "Shorter app time because discussion is richer for this module.", note: "ESPN economics are the most common quiz stumbling point." },
        { time: "7:10\u20137:50", activity: "Workshop: Build a Fan Continuum", desc: "Groups of 3\u20134 pick a real sports property. Design content for Discovery, Engagement, Conversion tiers. Present.", note: "20 min to build, 15 min to present and critique. Push for specifics: platform, format, CTA." },
        { time: "7:50\u20138:00", activity: "Career Connection", desc: "\u201CWhere do YOU fit in this landscape? What role? What skills from this course make you hireable?\u201D", note: "Connect frameworks to actual job postings and career paths. Make it personal." },
        { time: "8:00\u20138:05", activity: "Course Wrap", desc: "Celebrate completions. Tease what\u2019s next if more modules coming.", note: "Check dashboard. Acknowledge students who completed all three modules." }
      ],
      discussions: [
        { title: "The Bundle Dilemma", prompt: "You\u2019re ESPN\u2019s CEO. Cable subs drop 5%/year. Launch standalone streaming that cannibalizes cable revenue, or wait? What data do you need?" },
        { title: "Fan Continuum in the Wild", prompt: "Find a piece of sports content on your phone right now. Where on the Fan Continuum? New fans, casual, or hardcore? How can you tell?" },
        { title: "The WSC Sports Question", prompt: "If AI generates hundreds of personalized highlights in seconds, what happens to the highlight editor role? Disappear or transform?" },
        { title: "D2C Economics", prompt: "Disney knows you watched every Yankees game, visited Disney World twice, stream Marvel. Design the personalized offer they could send. Why couldn\u2019t Comcast do this?" }
      ],
      guideTips: [
        "The $9 affiliate fee hook lands hardest when you write the math on the board slowly. Let students do the multiplication themselves.",
        "The Fan Continuum workshop is the capstone exercise of the entire course. Give it the most time. Real presentations > more discussion.",
        "For the career connection segment, pull up actual job postings in sports media beforehand. Highlight the skills this course covers."
      ]
    }
  ];

  const go=(v,m)=>{setFade(false);setTimeout(()=>{setView(v);if(m!==undefined)setMi(m);setSi(0);setAns({});setShowDeeper(false);setFade(true);window.scrollTo({top:0});},120);};
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
          <label style={{fontSize:11,fontWeight:700,color:"#666",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:8}}>Enter your full name to get started</label>
          <input value={nameInput} onChange={e=>setNameInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&nameInput.trim())registerStudent(nameInput);}} placeholder="First Last" style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
          <button onClick={()=>registerStudent(nameInput)} disabled={!nameInput.trim()} style={{...bs(nameInput.trim()?"linear-gradient(135deg,#34C759,#30D158)":"#333"),width:"100%",cursor:nameInput.trim()?"pointer":"default"}}>Start Learning →</button>
        </div>
        <button onClick={()=>setView("instructor")} style={{background:"none",border:"none",color:"#333",fontSize:11,cursor:"pointer",marginTop:16,fontFamily:"inherit"}}>Instructor Dashboard →</button>
      </div>
    </div></div>
  );

  // Collapsible section helper
  const Section=({id,title,icon,color,children})=>{const open=expanded[id]; return <div style={{marginBottom:10}}>
    <button onClick={()=>toggle(id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",background:open?(color||"rgba(255,255,255,0.04)"):"rgba(255,255,255,0.02)",border:"1px solid "+(open?(color?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.08)"):"rgba(255,255,255,0.05)"),borderRadius:10,padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",color:"#ddd",fontSize:13,fontWeight:700}}>
      <span>{icon}</span><span style={{flex:1}}>{title}</span><span style={{color:"#555",fontSize:11}}>{open?"\u25B2":"\u25BC"}</span>
    </button>
    {open&&<div style={{border:"1px solid rgba(255,255,255,0.05)",borderTop:"none",borderRadius:"0 0 10px 10px",padding:16,background:"rgba(255,255,255,0.015)"}}>{children}</div>}
  </div>;};

  // Instructor Dashboard
  if(view==="instructor") return(
    <div style={S}>{font}<Bg/><div style={{...W,...F}}>
      <div style={{paddingTop:40,paddingBottom:20}}>
        <button onClick={()=>{setView("home");setDashPass("");setDashData([]);setExpanded({});}} style={gs}>\u2190 Back</button>
      </div>
      {dashData.length===0&&!dashLoading?<div style={{maxWidth:420,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>\u{1F4CA}</div>
        <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 8px",color:"#fff"}}>Instructor Dashboard</h2>
        <p style={{fontSize:13,color:"#555",margin:"0 0 24px"}}>Enter passcode to access</p>
        <input value={dashPass} onChange={e=>setDashPass(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&dashPass===INSTRUCTOR_PASSCODE){loadDashboard();}}} type="password" placeholder="Passcode" style={{width:"100%",maxWidth:280,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:14,textAlign:"center",boxSizing:"border-box"}}/>
        <br/>
        <button onClick={()=>{if(dashPass===INSTRUCTOR_PASSCODE)loadDashboard();}} style={bs(dashPass?"linear-gradient(135deg,#007AFF,#5856D6)":"#333")}>{dashPass===INSTRUCTOR_PASSCODE?"Load Dashboard":"Enter Passcode"}</button>
        {dashPass&&dashPass!==INSTRUCTOR_PASSCODE&&dashPass.length>3&&<p style={{color:"#FF3B30",fontSize:12,marginTop:10}}>Incorrect passcode</p>}
      </div>:dashLoading?<p style={{textAlign:"center",color:"#555"}}>Loading student data...</p>:<div>
        {/* Tab bar */}
        <div style={{display:"flex",gap:4,marginBottom:20,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:4}}>
          {[["progress","\u{1F4CA} Class Progress"],["lessons","\u{1F4D6} Lesson Plans"],["tips","\u2699\uFE0F Guide Tips"]].map(([k,label])=>
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
            <button onClick={loadDashboard} style={gs}>\u21BB Refresh</button>
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
                      {!attempted?<span style={{color:"#333"}}>\u2014</span>:
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

        {/* TAB: Lesson Plans */}
        {dashTab==="lessons"&&<div>
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {MODULES.map((m,i)=><button key={i} onClick={()=>{setDashMod(i);setExpanded({});}} style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid "+(dashMod===i?m.color+"50":"rgba(255,255,255,0.06)"),background:dashMod===i?m.color+"12":"transparent",color:dashMod===i?m.color:"#555",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{m.icon} M{m.id}</button>)}
          </div>
          {(()=>{const lp=LESSON_PLANS[dashMod],m=MODULES[dashMod]; return <div>
            <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px",color:"#fff"}}>{lp.title}</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 6px",lineHeight:1.5}}>{lp.goal}</p>
            <div style={{background:m.color+"08",border:"1px solid "+m.color+"20",borderRadius:8,padding:"8px 12px",marginBottom:20}}>
              <div style={{fontSize:9,fontWeight:700,color:m.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>\u2753 UNANSWERABLE QUESTION</div>
              <p style={{fontSize:12,color:"#bbb",margin:0,lineHeight:1.5,fontStyle:"italic"}}>{lp.unanswerable}</p>
            </div>

            <Section id="hooks" title={"Hook Options ("+lp.hooks.length+")"} icon="\u{1F3A3}" color="rgba(232,168,56,0.08)">
              {lp.hooks.map((h,hi)=><div key={hi} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:9,padding:14,marginBottom:hi<lp.hooks.length-1?10:0}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:6}}>{h.icon} {h.name}</div>
                {h.content.split("\n\n").map((p,pi)=><p key={pi} style={{fontSize:12,color:"#999",margin:pi<h.content.split("\n\n").length-1?"0 0 10px":"0",lineHeight:1.65}}>{p}</p>)}
              </div>)}
            </Section>

            <Section id="timeline" title="Class Timeline" icon="\u{1F552}">
              {lp.timeline.map((t,ti)=><div key={ti} style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:10,padding:"10px 0",borderBottom:ti<lp.timeline.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{fontSize:11,fontWeight:700,color:m.color,fontFamily:"'DM Mono',monospace"}}>{t.time}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#ddd",marginBottom:2}}>{t.activity}</div>
                  <p style={{fontSize:11,color:"#888",margin:"0 0 4px",lineHeight:1.5}}>{t.desc}</p>
                  <p style={{fontSize:11,color:"#666",margin:0,fontStyle:"italic",lineHeight:1.5}}>\u{1F4A1} {t.note}</p>
                </div>
              </div>)}
            </Section>

            <Section id="discussions" title={"Discussion Prompts ("+lp.discussions.length+")"} icon="\u{1F4AC}">
              {lp.discussions.map((d,di)=><div key={di} style={{padding:"10px 0",borderBottom:di<lp.discussions.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{fontSize:11,fontWeight:700,color:m.color,marginBottom:3}}>{d.title}</div>
                <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.6}}>{d.prompt}</p>
              </div>)}
            </Section>
          </div>;})()}
        </div>}

        {/* TAB: Guide Tips */}
        {dashTab==="tips"&&<div>
          <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 16px",color:"#fff"}}>Guide Mode: Your Playbook</h2>

          <Section id="philosophy" title="Teaching Philosophy" icon="\u{1F9ED}">
            <p style={{fontSize:13,color:"#bbb",margin:"0 0 12px",lineHeight:1.7}}>The app delivers content. You deliver context, motivation, and real-world connection. Your WSC Sports experience is your superpower \u2014 a 2-minute story from your career will land harder than any textbook chapter.</p>
            <p style={{fontSize:13,color:"#bbb",margin:0,lineHeight:1.7}}>Every class follows the 30/90/60 rhythm: 30 minutes of your hook, 90 minutes of app work + workshop (you circulating as guide), 60 minutes of discussion where you connect everything to careers and current events.</p>
          </Section>

          <Section id="during-app" title="During App Work Time" icon="\u{1F6B6}">
            <p style={{fontSize:12,color:"#999",margin:"0 0 12px",lineHeight:1.6}}>This looks like you\u2019re doing nothing. You\u2019re not. You\u2019re circulating, observing, intervening at the right moments:</p>
            <div style={{background:"rgba(52,199,89,0.05)",border:"1px solid rgba(52,199,89,0.15)",borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#34C759",marginBottom:3}}>FAST FINISHERS</div>
              <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}>Challenge with Go Deeper questions. Ask them to explain a concept to a struggling classmate. Have them start exercises before discussion.</p>
            </div>
            <div style={{background:"rgba(255,149,0,0.05)",border:"1px solid rgba(255,149,0,0.15)",borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#FF9500",marginBottom:3}}>STUCK STUDENTS</div>
              <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}>Don\u2019t explain the content \u2014 the app does that. Ask: \u201CWhich segment are you on? Have you read the key term? What part is confusing?\u201D Coach HOW to learn, not WHAT to learn.</p>
            </div>
            <div style={{background:"rgba(255,59,48,0.05)",border:"1px solid rgba(255,59,48,0.15)",borderRadius:8,padding:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#FF3B30",marginBottom:3}}>DISENGAGED STUDENTS</div>
              <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}>Walk over casually. Ask what they\u2019re on. Often stuck but not asking. Quick motivational nudge: \u201CYou\u2019re 3 segments from the quiz. Crush it and you\u2019ll be first to unlock Module 2.\u201D</p>
            </div>
          </Section>

          <Section id="dashboard-tips" title="Using Your Dashboard" icon="\u{1F4CA}">
            <p style={{fontSize:12,color:"#999",margin:"0 0 10px",lineHeight:1.6}}>Check the Class Progress tab during breaks and at end of class:</p>
            <p style={{fontSize:12,color:"#aaa",margin:"0 0 6px",lineHeight:1.5}}><strong style={{color:"#34C759"}}>Passed students</strong> should be doing workshop activities, not sitting idle.</p>
            <p style={{fontSize:12,color:"#aaa",margin:"0 0 6px",lineHeight:1.5}}><strong style={{color:"#FF9500"}}>Failed attempts</strong> \u2014 these students need targeted help. Which questions they missed tells you which concepts to emphasize.</p>
            <p style={{fontSize:12,color:"#aaa",margin:0,lineHeight:1.5}}><strong style={{color:"#555"}}>No attempt</strong> \u2014 may not have finished segments. Check in directly.</p>
          </Section>

          <Section id="mastery-mgmt" title="Mastery Gate as Classroom Management" icon="\u{1F512}">
            <p style={{fontSize:13,color:"#bbb",margin:0,lineHeight:1.7}}>The 75% threshold is your classroom management tool. Students who pass before class earn the workshop (the fun part). Students who haven\u2019t passed work through the module while others build projects and discuss. Natural incentive to prepare, without being punitive. The message: \u201CMastery unlocks access to the best parts of this class.\u201D</p>
          </Section>

          <Section id="adapting" title="Adapting Week to Week" icon="\u{1F504}">
            <p style={{fontSize:13,color:"#bbb",margin:"0 0 12px",lineHeight:1.7}}>These lesson plans are frameworks, not scripts. The best hooks come from what happened THAT WEEK. Train yourself to notice: every headline about streaming rights, AI in sports, a deepfake, a social media moment \u2014 screenshot it. That\u2019s next week\u2019s hook.</p>
            <p style={{fontSize:13,color:"#bbb",margin:0,lineHeight:1.7}}>The more current your examples, the more students feel like this course is about the world they\u2019re living in, not a textbook they\u2019re reading.</p>
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
          <span style={{marginLeft:"auto",fontSize:12,color:"#555"}}>{studentName}</span>
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
        <div style={{background:"rgba(255,255,255,0.01)",border:"1px dashed rgba(255,255,255,0.06)",borderRadius:14,padding:22,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <p style={{fontSize:12,color:"#333",textAlign:"center",margin:0}}>More modules coming</p>
        </div>
      </div>
      <div style={{borderTop:"1px solid rgba(255,255,255,0.03)",padding:"24px 0 40px",textAlign:"center"}}>
        <p style={{color:"#2a2a2a",fontSize:11}}>Professor Ben Fairclough · Fall 2025 · Wed 5:20-8:05 PM</p>
        <button onClick={()=>setView("instructor")} style={{background:"none",border:"none",color:"#222",fontSize:10,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>Instructor Dashboard</button>
      </div>
    </div></div>
  );

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
