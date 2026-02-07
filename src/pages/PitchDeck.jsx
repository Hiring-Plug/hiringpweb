import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const PitchDeck = () => {
    const containerRef = useRef(null);

    const [selectedTeamMember, setSelectedTeamMember] = useState(null);

    useEffect(() => {
        // Disable main body scroll when component mounts
        document.body.style.overflow = 'hidden';

        return () => {
            // Re-enable main body scroll when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, []);

    const scrollToSlide = (index) => {
        if (containerRef.current) {
            const slideWidth = containerRef.current.clientWidth;
            containerRef.current.scrollTo({
                left: index * slideWidth,
                behavior: 'smooth'
            });
        }
    };

    const slides = [
        { title: "Title", id: "title" },
        { title: "Intro", id: "intro" },
        { title: "Problem", id: "problem" },
        { title: "Solution", id: "solution" },
        { title: "Market", id: "market" },
        { title: "Competition", id: "competition" },
        { title: "Defensibility", id: "moat" },
        { title: "Team", id: "team" },
        { title: "Product", id: "product" },
        { title: "Business Model", id: "business" },
        { title: "Go-to-Market", id: "gtm" },
        { title: "Traction", id: "traction" },
        { title: "Financials", id: "financials" },
        { title: "Exit Strategy", id: "exit" },
        { title: "The Ask", id: "ask" },
    ];

    return (
        <div className="pitch-deck-wrapper"> {/* Changed to wrapper to avoid conflict with inner container */}
            <style>{`
        .pitch-deck-container {
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at 10% 20%, #1a1a1a 0%, #000000 80%);
          color: #ffffff;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          scroll-snap-type: x mandatory;
          display: flex;
          font-family: 'Work Sans', sans-serif;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .pitch-deck-container::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .pitch-deck-container {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        .slide {
          min-width: 100vw;
          height: 100vh;
          scroll-snap-align: start;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 4rem; /* Increased padding */
          box-sizing: border-box;
          position: relative;
          vertical-align: top; 
          border-right: 1px solid rgba(255, 255, 255, 0.05); /* Softer separator */
          white-space: normal;
        }
        
        .slide-content {
           max-width: 1400px; /* Wider container */
           width: 100%;
           height: 100%; /* Full height for layouts */
           display: flex;
           flex-direction: column;
           justify-content: center;
        }

        /* Typography */
        h1, h2, h3, h4, .font-heading {
          font-family: 'Prompt', sans-serif;
          font-weight: 600;
        }

        p, .font-body {
            font-family: 'Work Sans', sans-serif;
            font-weight: 300; /* Lighter body text */
        }

        .text-orange {
            color: #ED5000;
        }
        
        .bg-orange {
            background-color: #ED5000;
        }
        
        .border-orange {
            border-color: #ED5000;
        }

        .gradient-text {
            background: linear-gradient(90deg, #ffffff, #ED5000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        /* Glassmorphic Card Refinement */
        .card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 0.25rem; /* Sharper corners like reference */
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            border-color: rgba(237, 80, 0, 0.5);
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-2px);
        }
        
        .stat-number {
             font-family: 'Prompt', sans-serif;
             font-size: 3rem;
             font-weight: 700;
             color: #ED5000;
             line-height: 1;
        }

        .text-dim {
            color: #888;
        }

        /* Navigation Grid Specifics */
        .nav-grid-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end; /* Text at bottom like reference */
            height: 140px; /* Fixed height for uniformity */
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.02);
            text-align: left;
            cursor: pointer;
            position: relative;
        }

        .nav-grid-item:hover {
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.08);
        }

        .nav-grid-item .nav-label {
            font-family: 'Work Sans', sans-serif;
            font-size: 1rem;
            color: #ccc;
            font-weight: 500;
        }

        .nav-grid-item.active {
            background: #ED5000;
            border-color: #ED5000;
        }
        
        .nav-grid-item.active .nav-label {
            color: #000;
            font-weight: 700;
        }
        
        .nav-grid-item.active .arrow-icon {
            color: #000;
        }

        .ambient-glow {
            position: absolute;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(237, 80, 0, 0.08) 0%, rgba(0,0,0,0) 60%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            filter: blur(100px);
        }
        
        /* Slide specific adjustments */
        #title .ambient-glow {
            top: 20%;
            left: 20%;
            background: radial-gradient(circle, rgba(237, 80, 0, 0.1) 0%, rgba(0,0,0,0) 70%);
        }

      `}</style>

            <div ref={containerRef} className="pitch-deck-container">

                {/* Slide 1: Title & Navigation (Redesigned) */}
                <section className="slide" id="title">
                    <div className="ambient-glow" style={{ left: '25%', top: '40%' }}></div>

                    {/* Explicit Flex Row Container with override styles to ensure it doesn't stack */}
                    <div className="slide-content relative z-10 w-full max-w-[1600px] mx-auto px-12" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', display: 'flex' }}>

                        {/* Left Column: Branding & Headlines */}
                        <div className="flex-1 flex flex-col justify-between py-12 pr-20">
                            {/* Brand Top Left - Small Logo */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-orange rounded-full"></div>
                                </div>
                                <span className="font-heading font-medium tracking-wide text-xl uppercase tracking-widest text-dim">Hiring Plug</span>
                            </div>

                            {/* Main Title Center-Left */}
                            <div>
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                                    {/* Play Button Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>

                                <h1 className="text-8xl font-bold tracking-tighter mb-6 leading-none text-white">
                                    HIRING PLUG <span className="text-orange">.</span>
                                </h1>

                                <p className="text-2xl text-gray-400 max-w-xl leading-relaxed font-light">
                                    The trust layer for the decentralized workforce. <br />
                                    <span className="text-lg text-dim mt-2 block">Connect. Verify. Work.</span>
                                </p>
                            </div>

                            {/* Footer Left */}
                            <div className="text-sm text-dim font-mono tracking-widest uppercase border-t border-zinc-800 pt-6 inline-block w-max">
                                Pre-Seed Round • 2026
                            </div>
                        </div>

                        {/* Right Column: Navigation Grid */}
                        <div className="w-[600px] flex-shrink-0 flex flex-col justify-center py-12">
                            <div className="grid grid-cols-2 gap-4 h-full w-full">
                                {/* Grid Item 1: The Problem */}
                                <button onClick={() => scrollToSlide(2)} className="nav-grid-item">
                                    <span className="nav-label">The Problem</span>
                                </button>
                                {/* Grid Item 2: The Solution */}
                                <button onClick={() => scrollToSlide(3)} className="nav-grid-item">
                                    <span className="nav-label">The Solution</span>
                                </button>

                                {/* Grid Item 3: Product */}
                                <button onClick={() => scrollToSlide(8)} className="nav-grid-item">
                                    <span className="nav-label">Product</span>
                                </button>
                                {/* Grid Item 4: Traction */}
                                <button onClick={() => scrollToSlide(11)} className="nav-grid-item">
                                    <span className="nav-label">Traction</span>
                                </button>

                                {/* Grid Item 5: Market */}
                                <button onClick={() => scrollToSlide(4)} className="nav-grid-item">
                                    <span className="nav-label">The Market</span>
                                </button>
                                {/* Grid Item 6: Team */}
                                <button onClick={() => scrollToSlide(7)} className="nav-grid-item">
                                    <span className="nav-label">Meet the Team</span>
                                </button>

                                {/* Grid Item 7: Roadmap/Ask */}
                                <button onClick={() => scrollToSlide(13)} className="nav-grid-item">
                                    <span className="nav-label">Exit Strategy</span>
                                </button>
                                {/* Grid Item 8: Action */}
                                <button onClick={() => scrollToSlide(1)} className="nav-grid-item active">
                                    <div className="h-full flex flex-col justify-between">
                                        <span className="nav-label">Get Started</span>
                                        <span className="arrow-icon text-right text-2xl">&rarr;</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 2: Intro (Overview, Mission, Vision) */}
                <section className="slide" id="intro">
                    <div className="ambient-glow" style={{ right: '20%', bottom: '20%' }}></div>
                    <div className="slide-content grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <span className="text-orange font-mono mb-2 block">01. INTRODUCTION</span>
                            <h2 className="text-5xl mb-6 leading-tight">We are redefining the future of <span className="text-orange">work</span>.</h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                Hiring Plug is a Web3-powered ecosystem that connects talent with decentralized opportunities, eliminating intermediaries and fostering a trust-based economy.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <div className="card">
                                <h3 className="text-2xl mb-2 text-white">Our Mission</h3>
                                <p className="text-gray-400">To democratize access to global opportunities by building a transparent, skill-verified hiring infrastructure.</p>
                            </div>
                            <div className="card">
                                <h3 className="text-2xl mb-2 text-white">Our Vision</h3>
                                <p className="text-gray-400">A world where talent is the only currency that matters, and boundaries do not limit potential.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 3: Problem */}
                <section className="slide" id="problem">
                    <div className="ambient-glow" style={{ left: '20%', top: '20%' }}></div>
                    <div className="slide-content relative z-10">
                        <span className="text-orange font-mono mb-2 block">02. THE PROBLEM</span>
                        <h2 className="text-5xl mb-12">Getting a job is broken.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="card">
                                <div className="stat-number mb-2">72%</div>
                                <p className="text-gray-400">of employers struggle to find skilled talent despite high unemployment numbers.</p>
                            </div>
                            <div className="card">
                                <div className="stat-number mb-2">45d</div>
                                <p className="text-gray-400">Average time to hire for technical roles, costing companies thousands in lost productivity.</p>
                            </div>
                            <div className="card">
                                <div className="stat-number mb-2">30%</div>
                                <p className="text-gray-400">Fees charged by traditional recruitment agencies and platforms.</p>
                            </div>
                        </div>

                        <div className="card border-l-4 border-l-orange bg-zinc-900 border-t-0 border-r-0 border-b-0 max-w-3xl mx-auto">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0"></div>
                                <div>
                                    <p className="italic text-lg text-white mb-2">"Applying for jobs today feels like shouting into a void. I've sent 100+ applications and ghosted by 95% of them. The system is rigged."</p>
                                    <p className="text-sm text-dim">— @DevSarah on X (formerly Twitter)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 4: Solution */}
                <section className="slide" id="solution">
                    <div className="ambient-glow" style={{ left: '30%', bottom: '10%' }}></div>
                    <div className="slide-content grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <span className="text-orange font-mono mb-2 block">03. THE SOLUTION</span>
                            <h2 className="text-5xl mb-6">A Decentralized Hiring Ecosystem</h2>
                            <p className="text-xl text-gray-400 mb-8">
                                We solve trust and efficiency issues with blockchain-verified profiles and smart-contract based payments.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center mt-1 mr-4 text-black font-bold">1</div>
                                    <div>
                                        <h3 className="text-xl text-white mb-1">On-Chain Reputation</h3>
                                        <p className="text-gray-400">Verified work history and skills that cannot be faked.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center mt-1 mr-4 text-black font-bold">2</div>
                                    <div>
                                        <h3 className="text-xl text-white mb-1">Instant Payments</h3>
                                        <p className="text-gray-400">Smart contracts ensure talent gets paid immediately upon milestone completion.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center mt-1 mr-4 text-black font-bold">3</div>
                                    <div>
                                        <h3 className="text-xl text-white mb-1">Lower Fees</h3>
                                        <p className="text-gray-400">By removing middlemen, we reduce fees to &lt; 2%, saving money for both sides.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 relative">
                            {/* Abstract Visual Representation of Solution */}
                            <div className="absolute -top-4 -right-4 bg-orange text-black px-4 py-2 font-bold rounded">VS Traditional</div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-400">Verification</span>
                                    <div className="flex gap-8">
                                        <span className="text-red-500">Manual (Slow)</span>
                                        <span className="text-green-500 font-bold">Automated (Instant)</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-400">Fees</span>
                                    <div className="flex gap-8">
                                        <span className="text-red-500">15-30%</span>
                                        <span className="text-green-500 font-bold">1-2%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                    <span className="text-gray-400">Payment</span>
                                    <div className="flex gap-8">
                                        <span className="text-red-500">Net 30/60</span>
                                        <span className="text-green-500 font-bold">Instant</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 5: Market Opportunity */}
                <section className="slide" id="market">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">04. MARKET OPPORTUNITY</span>
                        <h2 className="text-5xl mb-12">A Massive, Growing Market</h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            {/* TAM Circle */}
                            <div className="text-center relative">
                                <div className="w-80 h-80 rounded-full border-2 border-zinc-800 flex flex-col items-center justify-center mx-auto relative z-0">
                                    <div className="absolute top-4 text-dim text-sm font-mono">TAM</div>
                                    <div className="absolute top-12 text-3xl font-bold bg-black px-2 z-10">$450B</div>
                                    <p className="absolute top-24 text-xs text-gray-500 w-48">Global Recruitment Market</p>

                                    {/* SAM Circle */}
                                    <div className="w-56 h-56 rounded-full border-2 border-zinc-600 flex flex-col items-center justify-center bg-black absolute bottom-0 z-10">
                                        <div className="absolute top-4 text-dim text-sm font-mono">SAM</div>
                                        <div className="absolute top-10 text-2xl font-bold text-white">$85B</div>
                                        <p className="absolute top-20 text-xs text-gray-500 w-32">Remote Tech Hiring</p>

                                        {/* SOM Circle */}
                                        <div className="w-32 h-32 rounded-full bg-orange flex flex-col items-center justify-center absolute bottom-0 z-20 text-black shadow-lg shadow-orange/20">
                                            <div className="text-xs font-bold font-mono text-black mb-1">SOM</div>
                                            <div className="text-2xl font-bold text-black">$500M</div>
                                            <p className="text-[10px] text-zinc-900 font-bold leading-tight mt-1">Web3/DeFi Niche</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md space-y-6">
                                <div className="border-l-2 border-orange pl-4">
                                    <h3 className="text-xl text-white mb-1">Total Addressable Market (TAM)</h3>
                                    <p className="text-gray-400 text-sm">The global recruitment industry is projected to reach $450B by 2028.</p>
                                </div>
                                <div className="border-l-2 border-gray-600 pl-4">
                                    <h3 className="text-xl text-white mb-1">Serviceable Available Market (SAM)</h3>
                                    <p className="text-gray-400 text-sm">Focusing on remote-first technology roles which are the fastest growing segment.</p>
                                </div>
                                <div className="border-l-2 border-gray-700 pl-4">
                                    <h3 className="text-xl text-white mb-1">Serviceable Obtainable Market (SOM)</h3>
                                    <p className="text-gray-400 text-sm">Immediate target: Web3, DeFi, and Blockchain development roles where verification is critical.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 6: Competition */}
                <section className="slide" id="competition">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">05. COMPETITION</span>
                        <h2 className="text-5xl mb-12">Why We Win</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Columns headers */}
                            <div className="col-span-1"></div>
                            <div className="col-span-1 text-center font-bold text-gray-500">Traditional (Indeed, LinkedIn)</div>
                            <div className="col-span-1 text-center font-bold text-gray-500">Freelance (Upwork, Fiverr)</div>
                            <div className="col-span-1 text-center font-bold text-orange text-xl">HIRING PLUG</div>

                            {/* Row 1: Verification */}
                            <div className="font-bold text-white border-b border-gray-800 py-4">Verification</div>
                            <div className="text-center text-gray-400 border-b border-gray-800 py-4">None/Weak</div>
                            <div className="text-center text-gray-400 border-b border-gray-800 py-4">Platform specific</div>
                            <div className="text-center text-orange font-bold border-b border-zinc-800 py-4 bg-zinc-900 rounded-t">On-Chain Proof</div>

                            {/* Row 2: Fees */}
                            <div className="font-bold text-white border-b border-gray-800 py-4">Fees</div>
                            <div className="text-center text-gray-400 border-b border-gray-800 py-4">High (Ads/Subs)</div>
                            <div className="text-center text-gray-400 border-b border-gray-800 py-4">10-20%</div>
                            <div className="text-center text-orange font-bold border-b border-zinc-800 py-4 bg-zinc-900">1-2%</div>

                            {/* Row 3: Payments */}
                            <div className="font-bold text-white border-b border-gray-800 py-4">Payments</div>
                            <div className="text-center text-gray-400 border-b border-gray-800 py-4">Manual</div>
                            <div className="text-center text-gray-400 border-b border-gray-800 py-4">Held in Escrow (Slow)</div>
                            <div className="text-center text-orange font-bold border-b border-zinc-800 py-4 bg-zinc-900">Instant Smart Contracts</div>

                            {/* Row 4: Data Ownership */}
                            <div className="font-bold text-white py-4">Data Ownership</div>
                            <div className="text-center text-gray-400 py-4">Platform Owned</div>
                            <div className="text-center text-gray-400 py-4">Platform Owned</div>
                            <div className="text-center text-orange font-bold py-4 bg-zinc-900 rounded-b">User Owned</div>
                        </div>
                    </div>
                </section>

                {/* Slide 7: MOAT */}
                <section className="slide" id="moat">
                    <div className="slide-content text-center">
                        <span className="text-orange font-mono mb-2 block">06. STRATEGIC MOAT</span>
                        <h2 className="text-5xl mb-16">Long-term Defensibility</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card text-left group hover:border-orange transition-all duration-500">
                                <div className="w-12 h-12 bg-zinc-900 text-orange border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">Network Effects</h3>
                                <p className="text-gray-500 text-sm">As more talent joins and verifies skills, the database becomes more valuable to recruiters, attracting more recruiters, which attracts more talent.</p>
                            </div>

                            <div className="card text-left group hover:border-orange transition-all duration-500">
                                <div className="w-12 h-12 bg-zinc-900 text-orange border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">Data Lock-in</h3>
                                <p className="text-gray-500 text-sm">Once a user builds a verified on-chain reputation with us, the switching cost to a platform without that history is high.</p>
                            </div>

                            <div className="card text-left group hover:border-orange transition-all duration-500">
                                <div className="w-12 h-12 bg-zinc-900 text-orange border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">High Trust</h3>
                                <p className="text-gray-500 text-sm">Verification reduces "hiring risk", making our platform the designated safe haven for high-stakes technical hiring.</p>
                            </div>

                            <div className="card text-left group hover:border-orange transition-all duration-500">
                                <div className="w-12 h-12 bg-zinc-900 text-orange border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">Economies of Scale</h3>
                                <p className="text-gray-500 text-sm">Automated smart contracts allow us to scale infinite transactions with near-zero marginal cost compared to manual agency models.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 8: Team */}
                <section className="slide" id="team">
                    <div className="slide-content relative">
                        <span className="text-orange font-mono mb-2 block">07. THE TEAM</span>
                        <h2 className="text-5xl mb-12">Builders & Visionaries</h2>

                        <div className="flex justify-center gap-12 flex-wrap">
                            {/* Benjamin Abena - Founder */}
                            <div className="text-center group relative">
                                <div className="w-48 h-48 rounded-full bg-zinc-800 border-2 border-zinc-700 mx-auto mb-6 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                    {/* Placeholder Avatar */}
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-6xl text-zinc-600 font-bold">BA</div>

                                    {/* Plus Button */}
                                    <button
                                        onClick={() => setSelectedTeamMember({
                                            name: "Benjamin Abena",
                                            role: "Founder",
                                            bio: "Founder with hands-on experience in different projects since 2017. Building the future of decentralized work.",
                                            vision: "To create a world where skills are the only currency.",
                                            socials: { linkedin: "#", github: "#", x: "#" }
                                        })}
                                        className="absolute bottom-4 right-8 w-10 h-10 bg-orange rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer z-10 shadow-lg border-2 border-black"
                                    >
                                        <span className="text-2xl font-bold leading-none mb-1">+</span>
                                    </button>
                                </div>
                                <h3 className="text-2xl text-white font-bold">Benjamin Abena</h3>
                                <p className="text-orange font-mono text-sm">Founder</p>
                            </div>

                            {/* Placeholder Member 2 - Growing Team */}
                            <div className="text-center group relative opacity-50">
                                <div className="w-40 h-40 rounded-full bg-zinc-900 border-2 border-zinc-800 border-dashed mx-auto mb-6 flex items-center justify-center relative">
                                    <span className="text-4xl text-zinc-700">+</span>
                                </div>
                                <h3 className="text-xl text-gray-500 font-bold">Hiring</h3>
                                <p className="text-gray-600 font-mono text-sm">CTO / Lead Dev</p>
                            </div>
                        </div>

                        {/* Team Member Modal/Overlay */}
                        {selectedTeamMember && (
                            <div className="absolute top-0 left-0 w-full h-full bg-black/90 backdrop-blur-md z-50 flex items-center justify-center rounded-xl border border-zinc-800 p-8" onClick={() => setSelectedTeamMember(null)}>
                                <div className="max-w-2xl bg-zinc-900 p-8 rounded-lg border border-orange shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => setSelectedTeamMember(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                                    <div className="flex gap-8 items-start">
                                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-orange flex-shrink-0 flex items-center justify-center text-4xl text-zinc-500 font-bold">
                                            {selectedTeamMember.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl text-white font-bold mb-1">{selectedTeamMember.name}</h3>
                                            <p className="text-orange font-mono mb-4">{selectedTeamMember.role}</p>
                                            <p className="text-gray-300 mb-4">{selectedTeamMember.bio}</p>
                                            <div className="bg-black/50 p-4 rounded border-l-2 border-orange mb-6">
                                                <p className="text-sm text-gray-400 italic">"{selectedTeamMember.vision}"</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">In</div>
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">X</div>
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">Git</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Slide 9: Product */}
                <section className="slide" id="product">
                    <div className="slide-content text-center">
                        <span className="text-orange font-mono mb-2 block">08. THE PRODUCT</span>
                        <h2 className="text-5xl mb-12">Live & Functional</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <div className="group">
                                <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-4 relative hover:border-orange transition-colors">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold text-lg">Talent Profile UI</div>
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-orange/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <p className="text-white font-bold">Verified Profiles</p>
                                <p className="text-sm text-gray-500">Clean, data-rich talent visualization</p>
                            </div>

                            <div className="group">
                                <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-4 relative hover:border-orange transition-colors transform md:-translate-y-8 shadow-2xl">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold text-lg">Smart Contracts</div>
                                    <div className="absolute inset-0 bg-orange/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <p className="text-white font-bold">Escrow System</p>
                                <p className="text-sm text-gray-500">Trustless payment automation</p>
                            </div>

                            <div className="group">
                                <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mb-4 relative hover:border-orange transition-colors">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold text-lg">Job Board</div>
                                    <div className="absolute inset-0 bg-orange/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <p className="text-white font-bold">Marketplace</p>
                                <p className="text-sm text-gray-500">Seamless discovery and matching</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <button className="text-orange border-b border-orange hover:text-white hover:border-white transition-colors pb-1">View Live Prototype &rarr;</button>
                        </div>
                    </div>
                </section>

                {/* Slide 10: Business Model */}
                <section className="slide" id="business">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">09. BUSINESS MODEL</span>
                        <h2 className="text-5xl mb-12">How We Monetize</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card border-t-4 border-t-orange">
                                <h3 className="text-2xl text-white mb-2">Transaction Fee</h3>
                                <div className="text-4xl font-bold text-orange mb-4">1-2%</div>
                                <p className="text-gray-400 mb-4">Charged on successful payments between client and talent. Significantly lower than industry average (15-20%).</p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li>✓ Automates revenue collection</li>
                                    <li>✓ Volume-based scalability</li>
                                </ul>
                            </div>

                            <div className="card border-t-4 border-t-zinc-700">
                                <h3 className="text-2xl text-white mb-2">Premium Listings</h3>
                                <div className="text-4xl font-bold text-white mb-4">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                                <p className="text-gray-400 mb-4">Featured job posts and enhanced visibility for urgent hiring needs.</p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li>✓ Top of search results</li>
                                    <li>✓ Social media amplification</li>
                                </ul>
                            </div>

                            <div className="card border-t-4 border-t-zinc-700">
                                <h3 className="text-2xl text-white mb-2">Enterprise</h3>
                                <div className="text-4xl font-bold text-white mb-4">Custom</div>
                                <p className="text-gray-400 mb-4">White-label solutions for DAOs and large protocols to manage internal bounties and payroll.</p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li>✓ Custom integrations</li>
                                    <li>✓ Dedicated support</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 bg-zinc-900 border border-zinc-800 p-6 rounded-lg flex justify-between items-center max-w-4xl mx-auto">
                            <div>
                                <span className="text-gray-400 block text-sm">Payback Period (CAC Recovery)</span>
                                <span className="text-2xl text-white font-bold">3 Months</span>
                            </div>
                            <div className="h-8 w-px bg-zinc-700"></div>
                            <div>
                                <span className="text-gray-400 block text-sm">LTV / CAC Ratio</span>
                                <span className="text-2xl text-orange font-bold">4.5x</span>
                            </div>
                            <div className="h-8 w-px bg-zinc-700"></div>
                            <div>
                                <span className="text-gray-400 block text-sm">Customer Segment</span>
                                <span className="text-2xl text-white font-bold">Web3 Startups & DAOs</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 11: Go-to-Market */}
                <section className="slide" id="gtm">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">10. GO-TO-MARKET</span>
                        <h2 className="text-5xl mb-12">Growth Strategy</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl text-white mb-6 border-b border-zinc-800 pb-2">Customer Acquisition</h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center font-bold text-orange flex-shrink-0">01</div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Direct Sales (B2B)</h4>
                                            <p className="text-gray-400 text-sm">Targeting Web3 Accelerators, Venture Capital portfolios, and DAO governance forums.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center font-bold text-orange flex-shrink-0">02</div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Developer Communities</h4>
                                            <p className="text-gray-400 text-sm">Strategic partnerships with hackathons (ETHGlobal, Solana Hacker House) to onboard top talent.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center font-bold text-orange flex-shrink-0">03</div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">Content & SEO</h4>
                                            <p className="text-gray-400 text-sm">"How to hire in Web3" educational content series to drive organic organic traffic.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
                                <h3 className="text-xl text-white mb-6">Milestones</h3>
                                <div className="space-y-8 border-l-2 border-zinc-700 ml-3 pl-8 relative">
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-orange border-4 border-zinc-900"></div>
                                        <span className="text-orange text-xs font-mono mb-1 block">Q1 2026</span>
                                        <h4 className="text-white font-bold">Launch MVP</h4>
                                        <p className="text-gray-500 text-xs">Core profile & escrow live. First 50 hires.</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-zinc-700 border-4 border-zinc-900"></div>
                                        <span className="text-gray-500 text-xs font-mono mb-1 block">Q3 2026</span>
                                        <h4 className="text-white font-bold">Ecosystem Partnerships</h4>
                                        <p className="text-gray-500 text-xs">Integration with major DAO tooling.</p>
                                    </div>
                                    <div className="relative opacity-50">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-zinc-700 border-4 border-zinc-900"></div>
                                        <span className="text-gray-500 text-xs font-mono mb-1 block">2027</span>
                                        <h4 className="text-white font-bold">Global Expansion</h4>
                                        <p className="text-gray-500 text-xs">Expansion into AI and Fintech verticals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 12: Traction */}
                <section className="slide" id="traction">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">11. TRACTION</span>
                        <h2 className="text-5xl mb-12">Early Signals</h2>

                        <div className="flex flex-wrap gap-8 justify-center mb-12">
                            <div className="card text-center w-64 border-orange">
                                <div className="text-5xl font-bold text-white mb-2">30+</div>
                                <p className="text-gray-400">New LinkedIn Followers<br /><span className="text-xs text-dim">(Last 7 Days)</span></p>
                            </div>
                            <div className="card text-center w-64 border-orange">
                                <div className="text-5xl font-bold text-white mb-2">100+</div>
                                <p className="text-gray-400">Total Followers<br /><span className="text-xs text-dim">(Organic Growth)</span></p>
                            </div>
                            <div className="card text-center w-64 border-orange">
                                <div className="text-5xl font-bold text-white mb-2">5+</div>
                                <p className="text-gray-400">Active Partnership Discussions<br /><span className="text-xs text-dim">(Founders & Communities)</span></p>
                            </div>
                        </div>

                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-xl text-gray-300 italic mb-4">
                                "We achieved these numbers with zero marketing spend in less than 30 days."
                            </p>
                            <div className="h-1 w-24 bg-orange mx-auto rounded"></div>
                        </div>
                    </div>
                </section>

                {/* Slide 13: Financials */}
                <section className="slide" id="financials">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">12. FINANCIALS</span>
                        <h2 className="text-5xl mb-12">Path to Profitability</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <p className="text-xl text-gray-400 mb-8">
                                    Our model focuses on capital efficiency. With high margins and low overhead through automation, we project breaking even by Month 18.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                        <span className="text-white">Year 1 Revenue goal</span>
                                        <span className="text-orange font-bold font-mono">$500k ARR</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                        <span className="text-white">Year 3 Projection</span>
                                        <span className="text-orange font-bold font-mono">$5M+ ARR</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                        <span className="text-white">Gross Margin</span>
                                        <span className="text-orange font-bold font-mono">85%+</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                                {/* Simple Bar Chart Visualization using CSS */}
                                <div className="flex items-end gap-8 h-64 border-b border-gray-600 pb-4 px-4">
                                    <div className="w-1/3 bg-zinc-700 h-1/4 rounded-t relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-400 text-xs">$0.5M</span>
                                        <div className="absolute bottom-0 w-full bg-orange h-[10%] opacity-50"></div> {/* Cost */}
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-bold">Year 1</span>
                                    </div>
                                    <div className="w-1/3 bg-zinc-700 h-1/2 rounded-t relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-400 text-xs">$2.2M</span>
                                        <div className="absolute bottom-0 w-full bg-orange h-[20%] opacity-50"></div>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-bold">Year 2</span>
                                    </div>
                                    <div className="w-1/3 bg-orange h-full rounded-t relative group shadow-[0_0_20px_rgba(237,80,0,0.3)]">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-orange font-bold text-sm">$5.1M</span>
                                        <div className="absolute bottom-0 w-full bg-black/30 h-[30%]"></div>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-bold">Year 3</span>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-center gap-6 text-xs">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-700"></div>Revenue</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange"></div>Projected</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 14: Exit Strategy */}
                <section className="slide" id="exit">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">13. EXIT STRATEGY</span>
                        <h2 className="text-5xl mb-12">Liquidity Opportunities</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="card hover:bg-zinc-900 cursor-default">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="text-2xl text-white mb-2">M&A</h3>
                                <p className="text-gray-400 text-sm">Acquisition by major HR tech giants (LinkedIn, Indeed) looking to enter Web3, or large crypto exchanges (Coinbase, Binance) needing ecosystem infrastructure.</p>
                            </div>

                            <div className="card hover:bg-zinc-900 cursor-default">
                                <div className="text-4xl mb-4">📈</div>
                                <h3 className="text-2xl text-white mb-2">IPO</h3>
                                <p className="text-gray-400 text-sm">Listing on public markets as the premier decentralized professional network.</p>
                            </div>

                            <div className="card hover:bg-zinc-900 cursor-default">
                                <div className="text-4xl mb-4">🔄</div>
                                <h3 className="text-2xl text-white mb-2">Secondary/Token</h3>
                                <p className="text-gray-400 text-sm">Potential for community ownership transition or secondary market liquidity events for early stakeholders.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 15: The Ask */}
                <section className="slide" id="ask">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">14. THE ASK</span>
                        <h2 className="text-5xl mb-12">Join Our Journey</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="mb-12">
                                    <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-2">Raising</h3>
                                    <div className="text-7xl font-bold text-white mb-4">$1M <span className="text-2xl text-orange font-normal">Pre-Seed</span></div>
                                    <p className="text-xl text-dim">12-18 Months Runway</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                        <span className="text-gray-300">Instrument</span>
                                        <span className="text-white font-bold">SAFE + Token Warrant</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                        <span className="text-gray-300">Target Phase</span>
                                        <span className="text-white font-bold text-right">MVP &rarr; Early Revenue</span>
                                    </div>
                                    <div className="bg-zinc-900 border border-zinc-700 p-4 rounded mt-8">
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            "This round reduces execution risk and unlocks ecosystem validation. We are offering a flexible structure aligned with both Web2 (Equity) and Web3 (Token) value capture."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl text-white mb-6">Use of Funds</h3>
                                <div className="space-y-6">
                                    {/* Development */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white font-bold">Product & Engineering</span>
                                            <span className="text-orange">45%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-orange h-full rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>

                                    {/* Team */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white font-bold">Core Team</span>
                                            <span className="text-orange">30%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-orange h-full rounded-full" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>

                                    {/* Go to Market */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white font-bold">Go-To-Market</span>
                                            <span className="text-orange">20%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-orange h-full rounded-full" style={{ width: '20%' }}></div>
                                        </div>
                                    </div>

                                    {/* Legal/Ops */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-white font-bold">Legal & Ops</span>
                                            <span className="text-orange">5%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-orange h-full rounded-full" style={{ width: '5%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 text-center">
                                    <a href="mailto:benjamin@hiringplug.xyz" className="inline-block bg-white text-black font-bold py-4 px-12 rounded hover:bg-orange transition-colors">
                                        Contact Founder
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Placeholder for remaining slides */}
                {slides.slice(14).map((slide, i) => (
                    <section key={slide.id} className="slide" id={slide.id}>
                        <div className="slide-content">
                            <span className="text-orange font-mono mb-2 block">1{i + 4}. {slide.title.toUpperCase()}</span>
                            <h2 className="text-4xl mb-6 text-white">{slide.title}</h2>
                            <p className="text-xl text-gray-400">Content for {slide.title} coming soon.</p>
                        </div>
                    </section>
                ))}

            </div>

            {/* Persistent Top Left Logo (Watermark) */}
            <div className="fixed top-8 left-8 z-50 flex items-center gap-2 opacity-50 pointer-events-none">
                <div className="w-6 h-6 rounded-full border border-orange flex items-center justify-center text-orange text-xs font-bold">HP</div>
            </div>

            {/* Navigation Indicators */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-zinc-800 absolute">
                <button onClick={() => containerRef.current.scrollBy({ left: -window.innerWidth, behavior: 'smooth' })} className="text-gray-400 hover:text-white">&larr;</button>
                <span className="text-xs text-gray-500 self-center font-mono">SCROLL TO NAVIGATE</span>
                <button onClick={() => containerRef.current.scrollBy({ left: window.innerWidth, behavior: 'smooth' })} className="text-gray-400 hover:text-white">&rarr;</button>
            </div>
        </div>
    );
};

export default PitchDeck;
