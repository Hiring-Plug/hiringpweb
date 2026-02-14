import Slide from './Slide';

const CoverSlide = () => {
    return (
        <Slide>
            {/* Subtle background accent */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
                    style={{ background: '#ED5000' }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-24">
                <img
                    src="/src/assets/banner-dark-transparent.png"
                    alt="Hiring Plug"
                    className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-semibold tracking-tight">
                    Hiring Plug
                </span>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-end h-[65%]">
                {/* Left */}
                <div>
                    <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
                        The Talent Layer<br />for Web3
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-md">
                        A decentralized hiring infrastructure connecting verified talent
                        with high-growth teams.
                    </p>
                </div>

                {/* Right navigation tiles */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        'Problem',
                        'Solution',
                        'Product',
                        'Market',
                        'Team',
                        'Roadmap',
                        'Get Started',
                    ].map((title, i) => (
                        <div
                            key={i}
                            className={`p-5 rounded border transition ${title === 'Get Started'
                                ? 'bg-[#ED5000] border-[#ED5000]'
                                : 'bg-white/[0.04] border-white/[0.08]'
                                }`}
                        >
                            <span className="text-sm text-neutral-200">{title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Slide>
    );
};

export default CoverSlide;
