
/**
 * Optimizes Supabase Storage image URLs by appending transformation parameters.
 * 
 * @param {string} url - The original image URL.
 * @param {object} options - Transformation options.
 * @param {number} [options.width] - Target width.
 * @param {number} [options.height] - Target height.
 * @param {number} [options.quality=80] - Compression quality (0-100).
 * @param {string} [options.resize='cover'] - Resize mode: 'cover', 'contain', 'fill'.
 * @param {string} [options.format='webp'] - Output format.
 * @returns {string} - The transformed URL.
 */
export const optimizeImage = (url, { width, height, quality = 80, resize = 'cover', format = 'webp' } = {}) => {
    if (!url) return '';
    if (!url.includes('supabase.co/storage/v1/object/public')) {
        // Not a Supabase Storage URL, return as is or handle other CDNs if needed
        return url;
    }

    // Supabase attributes like ?width=x&height=y are supported if the 'transform' feature is enabled on the project.
    // If using the old Supabase storage without image transformation add-on, this might just return the original image 
    // but with query params ignored by the server. 
    // Ideally, we'd use the `/render/` endpoint or similar if it was a different setup, 
    // but standard Supabase transformations use query params on the public URL.

    // NOTE: Supabase Image Transformation is a paid feature on some plans or requires specific setup.
    // However, appending these params is safe (ignored if not checked) and is the standard way to request it.

    const params = new URLSearchParams();
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    params.append('quality', quality);
    params.append('resize', resize);
    params.append('format', format);

    return `${url}?${params.toString()}`;
};
