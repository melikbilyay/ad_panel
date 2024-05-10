const { writeFile } = require('fs/promises');
const AWS = require('aws-sdk');

// AWS yapılandırmasını yapın
const s3 = new AWS.S3({
    accessKeyId: 'AKIA2UC3B2ID7M2O2E4K',
    secretAccessKey: "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",
});

// AWS S3'den tüm nesnelerin metadata ve URL'lerini alacak işlev
const listMetadataAndURLs = async (bucketName) => {
    try {
        const params = {
            Bucket: bucketName,
        };

        const data = await s3.listObjectsV2(params).promise();
        if (data.Contents.length === 0) {
            console.log("Kova boş.");
        } else {
            const metadataAndURLs = data.Contents.map(async (item, index) => {
                const objectKey = item.Key;
                const { Metadata } = await s3.headObject({ Bucket: bucketName, Key: objectKey }).promise();
                const url = `https://${bucketName}.s3.eu-north-1.amazonaws.com/${objectKey}`;

                let workingHours = null;
                if (Metadata && Metadata.workinghours) {
                    const hoursArray = Metadata.workinghours.split(' ').map(Number); // Boşluk karakterine göre ayır, sayıya dönüştür
                    if (hoursArray.length === 2) {
                        const start = hoursArray[0];
                        const end = hoursArray[1];
                        workingHours = { start, end };
                    }
                }

                return { objectKey,  url, workingHours };
            });

            const metadataAndURLsArray = await Promise.all(metadataAndURLs);

            // Metadata ve URL'leri JavaScript dosyasına kaydet
            const jsFileContent = `const data = ${JSON.stringify(metadataAndURLsArray, null, 2)};\n\nexport default data;`;
            await writeFile('metadataAndURLs.js', jsFileContent);
            console.log("Metadata ve URL'ler başarıyla kaydedildi.");
        }
    } catch (error) {
        console.error('Hata metadata ve URL listesi alınırken:', error);
    }
};

// Kullanım
const bucketName = 'melikbilyayresim';
listMetadataAndURLs(bucketName);
