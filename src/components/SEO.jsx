
const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
    const siteTitle = 'Hiring Plug';
    const defaultDescription = 'Hiring Plug: The Web3-powered hiring ecosystem connecting talent with decentralized opportunities.';
    const defaultImage = 'https://hiringplug.xyz/og-image2.png';
    const siteUrl = 'https://hiringplug.xyz';

    const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || defaultDescription;
    const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
    const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <>
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@hiring_plug" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
        </>
    );
};

export default SEO;
