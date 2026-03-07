/**
 * Formats a social handle or link into an absolute URL for the specified platform.
 * 
 * @param {string} value - The handle or URL entered by the user.
 * @param {string} platform - The platform name (twitter, linkedin, telegram, discord).
 * @returns {string} - The formatted absolute URL.
 */
export const formatSocialLink = (value, platform) => {
    if (!value) return '';

    const val = value.trim();

    // If it's already an absolute URL, return it
    if (val.startsWith('http://') || val.startsWith('https://')) {
        return val;
    }

    switch (platform.toLowerCase()) {
        case 'twitter':
        case 'x':
            return `https://x.com/${val.replace(/^@/, '')}`;
        case 'linkedin':
            // LinkedIn handles are a bit complex, but if it's not a URL, we can only assume it's a profile path
            return `https://linkedin.com/in/${val}`;
        case 'telegram':
            return `https://t.me/${val.replace(/^@/, '')}`;
        case 'discord':
            // Discord handles/invites are varied, but prefixing with discord.gg if it looks like a code,
            // or just returning as is if it looks like a handle (though handles don't have direct profile URLs like others)
            if (val.includes('.gg/')) return `https://${val}`;
            if (!val.includes('.')) return `https://discord.gg/${val}`;
            return val;
        default:
            return val;
    }
};
