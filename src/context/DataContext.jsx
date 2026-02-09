import { createContext, useState, useEffect, useContext } from 'react';
import { FaBitcoin, FaEthereum, FaLayerGroup, FaGamepad, FaWallet, FaGlobe } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialProjects = [
    {
        id: 'mock-1',
        company: 'DeFi Protocol X',
        logoIcon: 'FaBitcoin',
        logoUrl: '',
        website: 'https://example.com',
        contactEmail: 'contact@protocolx.com',
        notificationEmail: 'jobs@protocolx.com',
        role: 'Senior Rust Engineer',
        category: 'DeFi',
        location: 'Remote',
        type: 'Full-time',
        salary: '$120k - $180k',
        posted: '2 days ago',
        tags: ['Rust', 'Solana', 'Cryptography'],
        description: "We are building the next generation of decentralized exchanges. We need a Rust expert to optimize our matching engine and innovative AMM curves."
    },
    {
        id: 'mock-2',
        company: 'NFT Marketplace Y',
        logoIcon: 'FaEthereum',
        logoUrl: '',
        website: '',
        contactEmail: '',
        notificationEmail: '',
        role: 'Frontend Lead',
        category: 'NFT',
        location: 'Remote (US/EU)',
        type: 'Contract',
        salary: '$80 - $120 / hr',
        posted: '5 hours ago',
        tags: ['React', 'Web3.js', 'UI/UX'],
        description: "Leading the frontend architecture for a high-volume NFT marketplace. Experience with optimization and wallet integration is a must."
    },
    {
        id: 'mock-3',
        company: 'DAO Governance Z',
        logoIcon: 'FaGlobe',
        logoUrl: '',
        website: '',
        contactEmail: '',
        notificationEmail: '',
        role: 'Community Manager',
        category: 'DAO',
        location: 'Remote',
        type: 'Full-time',
        salary: '$60k - $90k + Tokens',
        posted: '1 week ago',
        tags: ['Discord', 'Governance', 'Marketing'],
        description: "Manage our global community of 50k+ members. You will oversee governance proposals, moderate discussions, and organize community calls."
    },
    {
        id: 'mock-4',
        company: 'Layer 2 Solution',
        logoIcon: 'FaLayerGroup',
        logoUrl: '',
        website: '',
        contactEmail: '',
        notificationEmail: '',
        role: 'Protocol Engineer',
        category: 'Infrastructure',
        location: 'Berlin / Remote',
        type: 'Full-time',
        salary: '$150k - $220k',
        posted: '3 days ago',
        tags: ['Go', 'ZK-Rollups', 'L2'],
        description: "Work on the protocol of our ZK-Rollup solution. Deep understanding of Ethereum Virtual Machine (EVM) and zero-knowledge proofs required."
    },
    {
        id: 'mock-5',
        company: 'Play-to-Earn Game',
        logoIcon: 'FaGamepad',
        logoUrl: '',
        website: '',
        contactEmail: '',
        notificationEmail: '',
        role: 'Unity Developer',
        category: 'GameFi',
        location: 'Remote (Asia)',
        type: 'Contract',
        salary: '$4k - $6k / mo',
        posted: 'Just now',
        tags: ['C#', 'Unity', 'Web3'],
        description: "Integrate blockchain mechanics into a AAA-quality Unity game. Wallet connection, asset minting, and on-chain state management."
    },
    {
        id: 'mock-6',
        company: 'Crypto Wallet App',
        logoIcon: 'FaWallet',
        logoUrl: '',
        website: '',
        contactEmail: '',
        notificationEmail: '',
        role: 'Mobile Developer',
        category: 'DeFi',
        location: 'London / Hybrid',
        type: 'Full-time',
        salary: '£80k - £110k',
        posted: '4 days ago',
        tags: ['React Native', 'Mobile Security'],
        description: "Build a non-custodial wallet with a focus on security and user experience. Biometrics, key management, and multi-chain support."
    }
];

const initialApplicants = [
    { id: 1, name: 'Alice Dev', email: 'alice@example.com', role: 'Frontend Developer', skill: 'React', status: 'New' },
    { id: 2, name: 'Bob Block', email: 'bob@example.com', role: 'Smart Contract Engineer', skill: 'Solidity', status: 'Interviewing' },
    { id: 3, name: 'Charlie Chain', email: 'charlie@example.com', role: 'Community Manager', skill: 'Marketing', status: 'In Review' },
];

export const DataProvider = ({ children }) => {
    const [localProjects, setLocalProjects] = useState(() => {
        const saved = localStorage.getItem('hp_projects');
        return saved ? JSON.parse(saved) : [];
    });

    const [dbProjects, setDbProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [applicants, setApplicants] = useState(() => {
        const saved = localStorage.getItem('hp_applicants');
        return saved ? JSON.parse(saved) : initialApplicants;
    });

    // Fetch DB Projects
    const fetchDbProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Jobs first (flat query)
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (jobsError) {
                console.error('Supabase Jobs Query Error:', jobsError);
                setError(jobsError.message);
                return;
            }

            if (!jobsData || jobsData.length === 0) {
                setDbProjects([]);
                return;
            }

            // 2. Extract unique project_ids
            const projectIds = [...new Set(jobsData.map(j => j.project_id).filter(Boolean))];

            // 3. Fetch Profiles for these IDs
            let profilesMap = {};
            if (projectIds.length > 0) {
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, username, avatar_url, website, contact_email')
                    .in('id', projectIds);

                if (profilesError) {
                    console.warn('Supabase Profiles Query Error (Non-critical):', profilesError);
                    // We can still continue, just companies will be "Unknown"
                } else if (profilesData) {
                    profilesMap = profilesData.reduce((acc, p) => {
                        acc[p.id] = p;
                        return acc;
                    }, {});
                }
            }

            // 4. Map DB format to UI format with manual join
            const mapped = jobsData.map(job => {
                const profile = profilesMap[job.project_id] || {};
                const projectName = profile.username || job.company || 'Project ' + (job.project_id?.substring(0, 5) || 'Unknown');

                return {
                    id: job.id,
                    company: projectName,
                    logoIcon: 'FaGlobe',
                    logoUrl: job.logo_url || profile.avatar_url || '',
                    website: profile.website || job.website || '',
                    contactEmail: profile.contact_email || job.contactEmail || '',
                    notificationEmail: job.notificationEmail || '',
                    role: job.title,
                    category: job.category || 'Other',
                    location: job.location,
                    type: job.type,
                    salary: job.salary_range,
                    posted: new Date(job.created_at).toLocaleDateString(),
                    tags: job.tags || [],
                    description: job.description
                };
            });

            setDbProjects(mapped);
        } catch (err) {
            console.error('Exception fetching jobs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDbProjects();
    }, []);

    // Merge all projects
    const projects = [...dbProjects, ...localProjects, ...initialProjects];

    // Persistence effects
    useEffect(() => {
        localStorage.setItem('hp_projects', JSON.stringify(localProjects));
    }, [localProjects]);

    useEffect(() => {
        localStorage.setItem('hp_applicants', JSON.stringify(applicants));
    }, [applicants]);

    // Project Actions
    const addProject = (project) => {
        const newProject = { ...project, id: Date.now() };
        setLocalProjects([newProject, ...localProjects]);
    };

    const updateProject = (id, updatedProject) => {
        setLocalProjects(localProjects.map(p => p.id === id ? { ...updatedProject, id } : p));
    };

    const deleteProject = (id) => {
        setLocalProjects(localProjects.filter(p => p.id !== id));
    };

    // Applicant Actions
    const addApplicant = (applicant) => {
        const newApplicant = { ...applicant, id: Date.now(), status: 'New' };
        setApplicants([newApplicant, ...applicants]);
    };

    const updateApplicant = (id, updatedApplicant) => {
        setApplicants(applicants.map(a => a.id === id ? { ...updatedApplicant, id } : a));
    };

    const deleteApplicant = (id) => {
        setApplicants(applicants.filter(a => a.id !== id));
    };

    // Helper to get Icon component dynamically (since we store string names in JSON)
    const getIconComponent = (iconName) => {
        const icons = { FaBitcoin, FaEthereum, FaLayerGroup, FaGamepad, FaWallet, FaGlobe };
        return icons[iconName] || <FaGlobe />;
    };

    return (
        <DataContext.Provider value={{
            projects,
            applicants,
            addProject,
            updateProject,
            deleteProject,
            addApplicant,
            updateApplicant,
            deleteApplicant,
            getIconComponent,
            refreshData: fetchDbProjects,
            loading,
            error
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
