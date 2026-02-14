const Slide = ({ children }) => {
    return (
        <section className="w-screen h-screen flex-shrink-0 snap-start bg-[#0A0A0A] flex items-center justify-center">
            <div className="relative w-full max-w-7xl h-full px-12 py-16">
                {children}
            </div>
        </section>
    );
};

export default Slide;
