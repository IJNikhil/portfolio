import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file before upload.
 * Settings: Max 1920x1080, Quality 0.8, WebP format.
 */
export const compressImage = async (file: File): Promise<File> => {
    // Options for compression
    const options = {
        maxSizeMB: 1,              // Try to stay under 1MB
        maxWidthOrHeight: 1920,    // 1080p standard
        useWebWorker: true,        // Performance
        fileType: "image/webp",    // Efficient format
        initialQuality: 0.8        // Good balance
    };

    try {
        console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        const compressedFile = await imageCompression(file, options);
        console.log(`Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        return compressedFile;
    } catch (error) {
        console.warn("Image compression failed, falling back to original file.", error);
        return file;
    }
};
