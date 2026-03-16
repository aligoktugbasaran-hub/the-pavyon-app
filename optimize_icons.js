const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimize() {
    const input = path.join('public', 'logo.png');
    
    if (!fs.existsSync(input)) {
        console.error(`Giriş dosyası bulunamadı: ${input}`);
        return;
    }

    console.log(`Optimizasyon başlıyor... Giriş: ${input}`);
    
    // Play Store ikonu 512x512
    await sharp(input)
        .resize(512, 512, { fit: 'contain', background: { r: 10, g: 0, b: 17, alpha: 1 } })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile('play_store_icon_512.png');
    console.log('Play Store ikonu oluşturuldu: play_store_icon_512.png');
    
    // Android mipmap ikonları (optimize)
    const sizes = { xxxhdpi: 192, xxhdpi: 144, xhdpi: 96, hdpi: 72, mdpi: 48 };
    for (const [density, size] of Object.entries(sizes)) {
        const outDir = path.join('android', 'app', 'src', 'main', 'res', 'mipmap-' + density);
        
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        await sharp(input)
            .resize(size, size, { fit: 'contain', background: { r: 10, g: 0, b: 17, alpha: 1 } })
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(path.join(outDir, 'ic_launcher.png'));
        await sharp(input)
            .resize(size, size, { fit: 'contain', background: { r: 10, g: 0, b: 17, alpha: 1 } })
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(path.join(outDir, 'ic_launcher_round.png'));
        await sharp(input)
            .resize(size, size, { fit: 'contain', background: { r: 10, g: 0, b: 17, alpha: 1 } })
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(path.join(outDir, 'ic_launcher_foreground.png'));
        console.log(`${density}: ${size}x${size} OK`);
    }
    
    // Web ikonu optimize (Geçici dosyalara yazıp sonra replace edeceğiz çünkü giriş dosyasıyla aynı olabilirler)
    const tempIcon = path.join('public', 'icon_temp.png');
    const tempLogo = path.join('public', 'logo_temp.png');

    await sharp(input)
        .resize(512, 512, { fit: 'contain', background: { r: 10, g: 0, b: 17, alpha: 1 } })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(tempIcon);
    
    await sharp(input)
        .resize(280, 280, { fit: 'contain', background: { r: 10, g: 0, b: 17, alpha: 0 } })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(tempLogo);

    // Dosyaları yer değiştir
    const finalIcon = path.join('public', 'icon.png');
    const finalLogo = path.join('public', 'logo.png');

    // Windows'ta unlink/rename gerekebilir
    if (fs.existsSync(finalIcon)) fs.unlinkSync(finalIcon);
    fs.renameSync(tempIcon, finalIcon);
    
    if (fs.existsSync(finalLogo)) fs.unlinkSync(finalLogo);
    fs.renameSync(tempLogo, finalLogo);
    
    console.log('Tüm ikonlar optimize edildi!');
}

optimize().catch(error => {
    console.error('Hata oluştu:', error);
    process.exit(1);
});
