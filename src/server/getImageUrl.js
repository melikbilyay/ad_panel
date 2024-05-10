const { writeFile } = require('fs/promises'); // Asenkron dosya işlemleri için fs/promises modülünü ekleyin
const AWS = require('aws-sdk');

// AWS yapılandırmasını yapın
const s3 = new AWS.S3({
    accessKeyId: 'AKIA2UC3B2ID7M2O2E4K',
    secretAccessKey: "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",
});

// AWS S3'den tüm fotoğrafların URL'lerini alacak işlev
const listImageURLs = async () => {
    try {
        const params = {
            Bucket: 'melikbilyayresim',
        };

        const data = await s3.listObjectsV2(params).promise();
        if (data.Contents.length === 0) {
            console.log("Kova boş.");
        } else {
            const urls = data.Contents.map((item, index) => {
                const id = index + 1; // ID'leri 1'den başlatıyoruz
                return { id, url: `https://melikbilyayresim.s3.eu-north-1.amazonaws.com/${item.Key}` };
            });
            // URL'leri JSON dosyasına kaydet
            await writeFile('server/urls.json', JSON.stringify(urls, null, 2));
            console.log("URL'ler başarıyla kaydedildi.");
        }
    } catch (error) {
        console.error('Hata resim URL listesi alınırken:', error);
    }
};

listImageURLs();
