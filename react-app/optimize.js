import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDirs = [
    'public/images',
    'public/assets'
];

async function optimizeImages() {
    for (const dir of imagesDirs) {
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const ext = path.extname(file).toLowerCase();

            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                try {
                    const buffer = fs.readFileSync(filePath);
                    let processedBuffer;

                    console.log(`Optimizing ${file}...`);

                    if (ext === '.jpg' || ext === '.jpeg') {
                        processedBuffer = await sharp(buffer)
                            .jpeg({ quality: 80, mozjpeg: true }) // Compress JPEG
                            .toBuffer();
                    } else if (ext === '.png') {
                        processedBuffer = await sharp(buffer)
                            .png({ quality: 80, compressionLevel: 8 }) // Compress PNG
                            .toBuffer();
                    } else if (ext === '.webp') {
                        processedBuffer = await sharp(buffer)
                            .webp({ quality: 80 }) // Compress WebP
                            .toBuffer();
                    }

                    if (processedBuffer && processedBuffer.length < buffer.length) {
                        fs.writeFileSync(filePath, processedBuffer);
                        console.log(`Saved ${(buffer.length - processedBuffer.length) / 1024} KB for ${file}`);
                    } else {
                        console.log(`Skipped ${file} (no size reduction)`);
                    }

                } catch (err) {
                    console.error(`Error processing ${file}:`, err);
                }
            }
        }
    }
}

optimizeImages();
