const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directories = [
    'assets/images',
    'assets/images/slider',
    'assets/images/gallery/concerts',
    'assets/images/gallery/entreprise',
    'assets/images/gallery/mariage',
    'assets/images/gallery/portraits'
];

const sizes = {
    slider: { width: 1920, height: 888 },
    gallery: { width: 800, height: 600 },
    portrait: { width: 400, height: 400 }
};

async function optimizeImage(inputPath, outputPath, options = {}) {
    try {
        await sharp(inputPath)
            .resize(options.width, options.height, {
                fit: 'cover',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));

        console.log(`Optimized: ${outputPath}`);
    } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error);
    }
}

async function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const inputPath = path.join(directory, file);
            const outputPath = path.join(directory, 'optimized', file);

            if (!fs.existsSync(path.dirname(outputPath))) {
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            }

            let options = {};
            if (directory.includes('slider')) {
                options = sizes.slider;
            } else if (directory.includes('gallery')) {
                options = sizes.gallery;
            } else {
                options = sizes.portrait;
            }

            await optimizeImage(inputPath, outputPath, options);
        }
    }
}

async function main() {
    for (const directory of directories) {
        await processDirectory(directory);
    }
}

main().catch(console.error); 