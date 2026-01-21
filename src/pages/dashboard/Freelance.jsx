
import { useState } from 'react';
import Button from '../../components/Button';
import { FaBolt, FaClock, FaMoneyBillWave, FaTag } from 'react-icons/fa';

const Freelance = () => {
    // Mock Gigs (In real app, fetch from 'gigs' table)
    const gigs = [
        {
            id: 101,
            title: "Smart Contract Audit - Reentrancy Check",
            budget: "$500 - $1,000",
            duration: "2 Days",
            skills: ["Solidity", "Security"],
            posted: "2h ago",
            desc: "Need a quick audit of a staking contract for reentrancy vulnerabilities."
        },
        {
            id: 102,
            title: "React Frontend for NFT Mint",
            budget: "$1,200",
            duration: "1 Week",
            skills: ["React", "Web3.js"],
            posted: "5h ago",
            desc: "Build a responsive minting page connected to our ERC-721 contract."
        },
        {
            id: 103,
            title: "Write Technical Docs for DAO",
            budget: "$300",
            duration: "3 Days",
            skills: ["Technical Writing", "Governance"],
            posted: "1d ago",
            desc: "Document the proposal submission process for our community."
        }
    ];

    const handleApply = (id) => {
        alert(`Applied to Gig #${id}! (Application stored in DB)`);
    };

    return (
        <div className="freelance-page">
            <div className="page-header">
                <div>
                    <h1><FaBolt style={{ color: '#f1c40f' }} /> Fast Gigs</h1>
                    <p>Short-term bounties and tasks. Get paid in crypto.</p>
                </div>
                <Button variant="primary">Post a Gig</Button>
            </div>

            <div className="gigs-grid">
                {gigs.map((gig) => (
                    <div key={gig.id} className="gig-card">
                        <div className="gig-header">
                            <h3>{gig.title}</h3>
                            <span className="posted-time">{gig.posted}</span>
                        </div>

                        <div className="gig-meta">
                            <span className="meta-item"><FaMoneyBillWave /> {gig.budget}</span>
                            <span className="meta-item"><FaClock /> {gig.duration}</span>
                        </div>

                        <div className="gig-tags">
                            {gig.skills.map(skill => (
                                <span key={skill} className="tag"><FaTag /> {skill}</span>
                            ))}
                        </div>

                        <p className="gig-desc">{gig.desc}</p>

                        <div className="gig-actions">
                            <Button variant="primary" style={{ width: '100%' }} onClick={() => handleApply(gig.id)}>
                                Fast Apply
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .freelance-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .page-header h1 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.8rem;
                }
                .page-header p { color: #888; }

                .gigs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 1.5rem;
                }

                .gig-card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: transform 0.2s;
                    display: flex;
                    flex-direction: column;
                }
                .gig-card:hover {
                    transform: translateY(-5px);
                    border-color: #333;
                }

                .gig-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .gig-header h3 { font-size: 1.2rem; margin: 0; }
                .posted-time { font-size: 0.8rem; color: #666; }

                .gig-meta {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    color: var(--primary-orange);
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .meta-item { display: flex; align-items: center; gap: 5px; }

                .gig-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
                .tag {
                    background: rgba(255,255,255,0.05);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    color: #aaa;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .gig-desc {
                    color: #ccc;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }
            `}</style>
        </div>
    );
};

export default Freelance;
