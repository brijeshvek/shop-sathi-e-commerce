/**
 * Convert any image file (PNG, JPG, JPEG, etc.) into an optimized WebP Base64 data URL
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality (0 to 1)
 * @returns {Promise<string>} WebP Base64 data URL
 */
export const convertFileToWebpBase64 = (file, maxWidth = 1600, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to WebP base64
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for WebP conversion'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
