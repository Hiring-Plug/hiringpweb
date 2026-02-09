import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import bannerDark from '../assets/banner-dark-transparent.png';

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
          justify-content: flex-start;
          align-items: stretch;
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
        
        .title-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          height: 100%;
          gap: 4rem;
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
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 1.75rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end; /* Text at bottom like reference */
            height: 130px; /* Fixed height for uniformity */
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.01);
            text-align: left;
            cursor: pointer;
            position: relative;
        }

        .nav-grid-item:hover {
            border-color: rgba(255, 255, 255, 0.04);
            background: rgba(255, 255, 255, 0.25);
            transform: none;
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

                {/* Slide 1: TRUE Hero Slide */}
                <section className="slide h-screen flex items-center justify-center p-0" id="title">
                    <div className="ambient-glow animate-pulse" style={{ width: '1000px', height: '1000px', opacity: 0.15 }}></div>

                    <div className="relative z-10 text-center px-12 max-w-6xl mx-auto">
                        <div className="flex justify-center mb-12">
                            <img src={bannerDark} alt="Hiring Plug" className="h-16 w-auto opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                        </div>

                        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter leading-none mb-8 text-white">
                            Hiring <span className="text-orange">Plug</span>
                        </h1>

                        <p className="text-3xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-12">
                            The trust layer for the decentralized workforce.
                        </p>

                        <div className="flex justify-center gap-8 items-center">
                            <div className="flex flex-col items-center">
                                <div className="text-sm font-mono tracking-widest uppercase text-dim mb-2">Series Seed</div>
                                <div className="h-px w-12 bg-orange"></div>
                            </div>
                            <div className="px-8 py-3 border border-zinc-800 rounded-full flex gap-4 items-center bg-white/5 backdrop-blur-sm">
                                <span className="text-sm font-mono text-gray-400">On-chain verification</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange"></span>
                                <span className="text-sm font-mono text-gray-400">Instant escrow</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-sm font-mono tracking-widest uppercase text-dim mb-2">2026</div>
                                <div className="h-px w-12 bg-orange"></div>
                            </div>
                        </div>

                        {/* Hint for scrolling */}
                        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 text-dim animate-bounce">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </div>
                </section>

                {/* Slide 2: Intro (Overview, Mission, Vision) */}
                <section className="slide" id="intro">
                    <div className="ambient-glow" style={{ right: '20%', bottom: '20%' }}></div>
                    <div className="slide-content grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <span className="text-orange font-mono mb-2 block">01. INTRODUCTION</span>
                            <h2 className="text-4xl mb-6 leading-tight">We are redefining the future of <span className="text-orange">work</span>.</h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                Hiring Plug is a Web3-powered ecosystem that connects talent with decentralized opportunities, eliminating intermediaries and fostering a trust-based economy.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <div className="card border-orange/30">
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
                    <div className="ambient-glow" style={{ left: '25%', top: '25%' }}></div>
                    <div className="slide-content relative z-10">
                        <span className="text-orange font-mono mb-2 block">02. THE PROBLEM</span>
                        <h2 className="text-5xl mb-12">Getting a job is broken.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="card border-zinc-800 scale-105 hover:border-orange/50">
                                <div className="stat-number mb-2">72%</div>
                                <p className="text-gray-400 text-sm">of employers struggle to find skilled talent despite high unemployment numbers.</p>
                            </div>
                            <div className="card bg-orange/5 border-orange/20">
                                <div className="stat-number mb-2 text-white">45d</div>
                                <p className="text-gray-200 text-sm">Average time to hire for technical roles, costing companies thousands in lost productivity.</p>
                            </div>
                            <div className="card border-zinc-800">
                                <div className="stat-number mb-2">30%</div>
                                <p className="text-gray-400 text-sm">Fees charged by traditional recruitment agencies and platforms.</p>
                            </div>
                        </div>

                        <div className="card border-l-4 border-l-orange bg-zinc-900 border-t-0 border-r-0 border-b-0 max-w-3xl mx-auto shadow-xl">
                            <div className="flex gap-4 p-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16C10.9124 16 10.017 16.8954 10.017 18L10.017 21H4.01704C3.46476 21 3.01704 20.5523 3.01704 20V4C3.01704 3.44772 3.46476 3 4.01704 3H20.017C20.5693 3 21.017 3.44772 21.017 4V20C21.017 20.5523 20.5693 21 20.017 21H14.017Z" /></svg>
                                </div>
                                <div>
                                    <p className="italic text-lg text-white mb-2 leading-relaxed">"Applying for jobs today feels like shouting into a void. I've sent 100+ applications and ghosted by 95% of them. The system is rigged."</p>
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
                        <h2 className="text-4xl mb-16">Long-term Defensibility</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card text-left group hover:border-orange transition-all duration-500 bg-white/5">
                                <div className="w-12 h-12 bg-zinc-900 text-orange border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">Network Effects</h3>
                                <p className="text-gray-500 text-sm">As more talent joins and verifies skills, the database becomes more valuable to recruiters, attracting more recruiters, which attracts more talent.</p>
                            </div>

                            <div className="card text-left group border-orange/40 scale-105 bg-orange/5 relative z-10">
                                <div className="w-12 h-12 bg-orange text-black rounded flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(237,80,0,0.3)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">On-Chain Reputation</h3>
                                <p className="text-gray-200 text-sm">Once a user builds a verified on-chain reputation with us, the switching cost to a platform without that history is high. It's a non-portable asset.</p>
                            </div>

                            <div className="card text-left group hover:border-orange transition-all duration-500 bg-white/5">
                                <div className="w-12 h-12 bg-zinc-900 text-orange border border-zinc-800 rounded flex items-center justify-center mb-6 group-hover:bg-orange group-hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="text-xl text-white mb-2">Scalable Infrastructure</h3>
                                <p className="text-gray-500 text-sm">Automated smart contracts allow us to scale infinite transactions with near-zero marginal cost compared to manual agency models.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 8: Team */}
                <section className="slide" id="team">
                    <div className="slide-content relative">
                        <span className="text-orange font-mono mb-2 block">07. THE TEAM</span>
                        <h2 className="text-4xl mb-12">Builders & Visionaries</h2>

                        <div className="flex justify-center gap-12 flex-wrap">
                            {/* Benjamin Abena - Founder */}
                            <div className="text-center group relative">
                                <div className="w-48 h-48 rounded-full bg-zinc-800 border-2 border-zinc-700 mx-auto mb-6 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500 shadow-2xl">
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-6xl text-zinc-600 font-bold">BA</div>
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

                            {/* Growth Team */}
                            <div className="text-center group relative opacity-50">
                                <div className="w-40 h-40 rounded-full bg-zinc-900 border-2 border-zinc-800 border-dashed mx-auto mb-6 flex items-center justify-center relative">
                                    <span className="text-4xl text-zinc-700">+</span>
                                </div>
                                <h3 className="text-xl text-gray-500 font-bold">Hiring</h3>
                                <p className="text-gray-600 font-mono text-sm">Core Engineering</p>
                            </div>
                        </div>

                        {/* Modal remains the same */}
                        {selectedTeamMember && (
                            <div className="absolute top-0 left-0 w-full h-full bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-8" onClick={() => setSelectedTeamMember(null)}>
                                <div className="max-w-2xl bg-zinc-900 p-12 rounded-2xl border border-orange shadow-[0_0_50px_rgba(237,80,0,0.2)] relative" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => setSelectedTeamMember(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl">✕</button>
                                    <div className="flex gap-10 items-start">
                                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-orange flex-shrink-0 flex items-center justify-center text-4xl text-zinc-500 font-bold shadow-lg">
                                            {selectedTeamMember.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="text-4xl text-white font-bold mb-2">{selectedTeamMember.name}</h3>
                                            <p className="text-orange font-mono text-lg mb-6">{selectedTeamMember.role}</p>
                                            <p className="text-gray-300 mb-6 leading-relaxed text-lg">{selectedTeamMember.bio}</p>
                                            <div className="bg-white/5 p-6 rounded-xl border-l-4 border-orange mb-8">
                                                <p className="text-gray-400 italic font-light font-body">"{selectedTeamMember.vision}"</p>
                                            </div>
                                            <div className="flex gap-6">
                                                <div className="text-dim hover:text-white transition-colors cursor-pointer text-sm font-mono mt-1">LINKEDIN</div>
                                                <div className="text-dim hover:text-white transition-colors cursor-pointer text-sm font-mono mt-1">X.COM</div>
                                                <div className="text-dim hover:text-white transition-colors cursor-pointer text-sm font-mono mt-1">GITHUB</div>
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
                        <h2 className="text-4xl mb-12">Live & Functional Ecosystem</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
                            <div className="group">
                                <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6 relative hover:border-orange transition-all duration-500">
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold text-lg">TALENT EXPLORER</div>
                                    <div className="absolute inset-0 bg-orange/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <p className="text-white font-bold text-lg">Verified Explorer</p>
                                <p className="text-sm text-gray-500">Instant access to skill-vetted pros</p>
                            </div>

                            <div className="group pb-8">
                                <div className="aspect-video bg-zinc-900 border-2 border-orange/40 rounded-xl overflow-hidden mb-6 relative shadow-[0_0_40px_rgba(237,80,0,0.15)] transform scale-110 z-10">
                                    <div className="absolute inset-0 flex items-center justify-center text-orange font-bold text-lg uppercase tracking-tighter">SMART ESCROW</div>
                                </div>
                                <p className="text-orange font-bold text-xl">Escrow Engine</p>
                                <p className="text-sm text-gray-300">Automated trustless payments</p>
                            </div>

                            <div className="group">
                                <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6 relative hover:border-orange transition-all duration-500">
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold text-lg">PROJECT HUB</div>
                                    <div className="absolute inset-0 bg-orange/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <p className="text-white font-bold text-lg">Job Marketplace</p>
                                <p className="text-sm text-gray-500">Decentralized project matching</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 10: Business Model */}
                <section className="slide" id="business">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">09. BUSINESS MODEL</span>
                        <h2 className="text-4xl mb-12">Monetization Strategy</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card bg-orange/5 border-orange/20 border-t-4 border-t-orange">
                                <h3 className="text-2xl text-white mb-2 font-bold">Protocol Fee</h3>
                                <div className="text-5xl font-bold text-orange mb-4">1-2%</div>
                                <p className="text-gray-300 mb-6 text-sm leading-relaxed">Charged on successful payments. Lower than Upwork (10%) and agencies (20%+).</p>
                                <div className="text-xs font-mono text-dim tracking-widest">VOLUME DRIVEN</div>
                            </div>

                            <div className="card border-t-4 border-t-zinc-800">
                                <h3 className="text-2xl text-white mb-2 font-bold">Premium Boost</h3>
                                <div className="text-5xl font-bold text-white mb-4">$49<span className="text-xl text-zinc-600">/mo</span></div>
                                <p className="text-gray-400 mb-6 text-sm leading-relaxed">Priority visibility for verified project listings and urgent hiring needs.</p>
                                <div className="text-xs font-mono text-dim tracking-widest">RECURRING SAAS</div>
                            </div>

                            <div className="card border-t-4 border-t-zinc-800">
                                <h3 className="text-2xl text-white mb-2 font-bold">Enterprise</h3>
                                <div className="text-5xl font-bold text-white mb-4">Custom</div>
                                <p className="text-gray-400 mb-6 text-sm leading-relaxed">White-label solutions for DAOs and protocols to manage bounties internally.</p>
                                <div className="text-xs font-mono text-dim tracking-widest">B2B SOLUTIONS</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 11: Go-to-Market */}
                <section className="slide" id="gtm">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">10. GO-TO-MARKET</span>
                        <h2 className="text-4xl mb-12">Growth & Execution</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <div className="flex gap-6 items-center">
                                    <div className="text-5xl font-bold text-zinc-800">01</div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-1">Ecosystem Partnerships</h4>
                                        <p className="text-gray-500 text-sm">Direct onboarding of VC portfolios and accelerators.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <div className="text-5xl font-bold text-orange/80">02</div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-1">Developer Communities</h4>
                                        <p className="text-gray-500 text-sm">Onboarding top talent via hackathons and bounties.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <div className="text-5xl font-bold text-zinc-800">03</div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-1">Content & SEO</h4>
                                        <p className="text-gray-500 text-sm">Targeting "Web3 Hiring" and "Verified Talent" keywords.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-zinc-900 border-zinc-800 p-8 shadow-2xl relative">
                                <h3 className="text-white font-bold mb-8 uppercase text-xs tracking-widest">Current Roadmap</h3>
                                <div className="space-y-10 border-l border-zinc-800 ml-4 pl-10 relative">
                                    {/* Current Active Milestone */}
                                    <div className="relative">
                                        <div className="absolute -left-[45px] top-1 w-2.5 h-2.5 rounded-full bg-orange shadow-[0_0_15px_rgba(237,80,0,0.8)] z-10 animate-ping"></div>
                                        <div className="absolute -left-[45px] top-1 w-2.5 h-2.5 rounded-full bg-orange border-2 border-black z-20"></div>
                                        <span className="text-orange text-xs font-mono mb-1 block font-bold">Q4 2025 - NOW</span>
                                        <h4 className="text-white font-bold text-lg">Product Launch</h4>
                                        <p className="text-gray-400 text-sm font-light">Ecosystem core + First 100 verified creators.</p>
                                    </div>
                                    <div className="relative opacity-60">
                                        <div className="absolute -left-[45px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 z-10"></div>
                                        <span className="text-zinc-500 text-xs font-mono mb-1 block">Q2 2026</span>
                                        <h4 className="text-zinc-300 font-bold">Scaling Phase</h4>
                                        <p className="text-zinc-500 text-sm font-light">Cross-chain integration & Enterprise portal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 12: Traction */}
                <section className="slide" id="traction">
                    <div className="slide-content text-center">
                        <span className="text-orange font-mono mb-2 block">11. TRACTION</span>
                        <h2 className="text-4xl mb-12">Early Momentum</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            <div className="card bg-white/5 flex flex-col items-center justify-center py-12">
                                <div className="text-6xl font-bold text-white mb-2">30+</div>
                                <p className="text-dim uppercase text-xs tracking-widest">Weekly Growth</p>
                            </div>
                            <div className="card border-orange/40 scale-105 bg-orange/5 flex flex-col items-center justify-center py-12 relative">
                                <div className="text-7xl font-bold text-orange mb-2">100+</div>
                                <p className="text-gray-300 uppercase text-xs tracking-widest font-bold">Direct Requests</p>
                                <div className="absolute -top-3 bg-orange text-black px-3 py-1 text-[10px] font-bold rounded">HOT</div>
                            </div>
                            <div className="card bg-white/5 flex flex-col items-center justify-center py-12">
                                <div className="text-6xl font-bold text-white mb-2">5+</div>
                                <p className="text-dim uppercase text-xs tracking-widest">DAOs Boarded</p>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto border-t border-zinc-800 pt-8">
                            <p className="text-xl text-gray-400 font-light italic leading-relaxed">
                                "Growth achieved with zero marketing spend, proving strong organic demand for on-chain trust."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Slide 13: Financials */}
                <section className="slide" id="financials">
                    <div className="slide-content">
                        <span className="text-orange font-mono mb-2 block">12. FINANCIALS</span>
                        <h2 className="text-4xl mb-12">Unit Economics & Growth</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <p className="text-xl text-gray-400 leading-relaxed font-light">
                                    We project capital efficiency through automated fee collection and high-margin SaaS boosts.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-zinc-900 border-l-2 border-orange">
                                        <div className="text-xs text-dim mb-1 font-mono">Gross Margin</div>
                                        <div className="text-3xl font-bold text-white">85%+</div>
                                    </div>
                                    <div className="p-4 bg-zinc-900 border-l-2 border-orange">
                                        <div className="text-xs text-dim mb-1 font-mono">LTV/CAC</div>
                                        <div className="text-3xl font-bold text-white">4.5x</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-800 relative shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                {/* Simplified Graph */}
                                <div className="flex items-end gap-10 h-64 border-b border-zinc-800 pb-4 relative z-10">
                                    <div className="w-1/3 bg-zinc-800 h-[20%] rounded-t relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs">$0.5M</span>
                                    </div>
                                    <div className="w-1/3 bg-zinc-800 h-[45%] rounded-t relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs">$2.2M</span>
                                    </div>
                                    <div className="w-1/3 bg-orange h-full rounded-t relative group shadow-[0_0_30px_rgba(237,80,0,0.3)] anim-grow">
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-orange font-bold font-mono">$5.1M</span>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-between text-xs font-mono text-dim tracking-widest">
                                    <span>YEAR 1</span>
                                    <span>YEAR 2</span>
                                    <span className="text-orange">YEAR 3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 14: Exit Strategy */}
                <section className="slide" id="exit">
                    <div className="slide-content text-center">
                        <span className="text-orange font-mono mb-2 block">13. EXIT STRATEGY</span>
                        <h2 className="text-4xl mb-12">Liquidity Options</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card text-left bg-white/5 border-zinc-800">
                                <div className="text-4xl mb-6">🤝</div>
                                <h3 className="text-2xl text-white mb-4 font-bold">Strategic M&A</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Acquisition by HR Tech leaders (LinkedIn) or Crypto Ecosystems (Coinbase) to secure on-chain talent infrastructure.</p>
                            </div>

                            <div className="card text-left border-zinc-800">
                                <div className="text-4xl mb-6">📈</div>
                                <h3 className="text-2xl text-white mb-4 font-bold">Public Listing</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Becoming the premier decentralized network for professional identity and work history.</p>
                            </div>

                            <div className="card text-left border-zinc-800">
                                <div className="text-4xl mb-6">🔄</div>
                                <h3 className="text-2xl text-white mb-4 font-bold">Community Buyout</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Transitioning to a fully autonomous DAO where the network is owned by its proven participants.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 15: The Ask */}
                <section className="slide" id="ask">
                    <div className="slide-content">
                        <div className="flex flex-col items-center text-center mb-16">
                            <span className="text-orange font-mono mb-2 block">14. THE ASK</span>
                            <h2 className="text-5xl font-bold">Fueling the Revolution</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* 1. What This Unlocks (Cognitive Order Fix) */}
                            <div className="card bg-orange/5 border-orange/40 lg:col-span-1 shadow-[0_10px_40px_-10px_rgba(237,80,0,0.15)]">
                                <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-orange rounded-full"></span>
                                    Strategic Milestones
                                </h4>
                                <ul className="space-y-4 text-gray-300">
                                    <li className="flex gap-3 items-start">
                                        <span className="text-orange font-bold text-sm">✓</span>
                                        <span className="text-sm">Mainnet scaling & L2 deployment</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <span className="text-orange font-bold text-sm">✓</span>
                                        <span className="text-sm">Onboarding 250+ paidhires</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <span className="text-orange font-bold text-sm">✓</span>
                                        <span className="text-sm">15 premium DAO partnerships</span>
                                    </li>
                                </ul>
                            </div>

                            {/* 2. Raising $1M (Middle Focal Point) */}
                            <div className="card border-white/20 scale-105 bg-white/5 relative flex flex-col items-center justify-center text-center">
                                <h3 className="text-zinc-500 uppercase tracking-widest text-xs mb-3">Seed Round</h3>
                                <div className="text-7xl font-bold text-white mb-2 leading-none">$1M</div>
                                <div className="text-orange font-mono text-sm mb-8 tracking-tighter">SAFE + TOKEN WARRANT</div>
                                <div className="flex gap-4">
                                    <div className="px-3 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400">18M RUNWAY</div>
                                    <div className="px-3 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400">20% COMMITTED</div>
                                </div>
                            </div>

                            {/* 3. Spend Distribution */}
                            <div className="card border-zinc-800">
                                <h4 className="text-zinc-400 font-bold mb-6 text-sm">Allocation</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Core Engineering</span>
                                        <span className="text-white font-bold">45%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Go-To-Market</span>
                                        <span className="text-white font-bold">30%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Operations/Legal</span>
                                        <span className="text-white font-bold">15%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Pool/Reserve</span>
                                        <span className="text-white font-bold">10%</span>
                                    </div>
                                    <div className="mt-8">
                                        <a href="mailto:benjamin@hiringplug.xyz" className="block w-full py-3 bg-orange text-black font-bold text-sm rounded-lg hover:bg-white transition-all text-center">
                                            REQUEST DATA ROOM
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



            </div>

            {/* Persistent Top Left Logo (Watermark) */}
            <div className="fixed top-8 left-8 z-50 flex items-center gap-2 opacity-50 pointer-events-none">
                <div className="w-6 h-6 rounded-full border border-orange flex items-center justify-center text-orange text-xs font-bold">HP</div>
            </div>

            {/* Navigation Indicators */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-zinc-800">
                <button onClick={() => containerRef.current.scrollBy({ left: -window.innerWidth, behavior: 'smooth' })} className="text-gray-400 hover:text-white">&larr;</button>
                <span className="text-xs text-gray-500 self-center font-mono">SCROLL TO NAVIGATE</span>
                <button onClick={() => containerRef.current.scrollBy({ left: window.innerWidth, behavior: 'smooth' })} className="text-gray-400 hover:text-white">&rarr;</button>
            </div>
        </div>
    );
};

export default PitchDeck;
