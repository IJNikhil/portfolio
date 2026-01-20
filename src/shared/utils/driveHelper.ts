
/**
 * Transforms Google Drive URLs into reliable direct image links.
 * 
 * Google Drive 'uc' (export=view) links often fail in <img> tags due to 
 * strict cross-origin policies or quotas.
 * 
 * we use the 'thumbnail' endpoint which is more robust for public images.
 */
export const resolveDriveImage = (url: string | undefined): string => {
    if (!url) return "";

    // Check if it's a Google Drive URL
    if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
        // Extract ID
        let id = "";
        const idMatch = url.match(/id=([^&]+)/);
        const fileMatch = url.match(/\/file\/d\/([^\/]+)/);

        if (idMatch) {
            id = idMatch[1];
        } else if (fileMatch) {
            id = fileMatch[1];
        }

        if (id) {
            // Return thumbnail link (sz=w1920 requests a large version)
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
        }
    }

    return url;
};
