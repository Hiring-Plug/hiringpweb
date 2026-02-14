import React, { useEffect } from 'react';
import CoverSlide from '../components/PitchDeck/CoverSlide';

const PitchDeck = () => {
    useEffect(() => {
        // Disable main body scroll when component mounts to enforce horizontal navigation feel
        document.body.style.overflow = 'hidden';

        return () => {
            // Re-enable main body scroll when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="pitch-deck-wrapper bg-black min-h-screen">
            <style>{`
                .pitch-deck-container {
                    width: 100vw;
                    height: 100vh;
                    overflow-x: auto;
                    overflow-y: hidden;
                    white-space: nowrap;
                    scroll-snap-type: x mandatory;
                    display: flex;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .pitch-deck-container::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="pitch-deck-container font-['Work_Sans',sans-serif]">
                <CoverSlide />
            </div>
        </div>
    );
};

export default PitchDeck;
