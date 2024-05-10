import React, { useState } from 'react';
import AWS from 'aws-sdk';

function Upload() {
    const [file, setFile] = useState(null);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file.');
            return;
        }

        // AWS kimlik bilgilerinizi ve bölgenizi sağlayın
        AWS.config.update({
            accessKeyId: 'AKIA2UC3B2ID7M2O2E4K',
            secretAccessKey: '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',
            region: 'eu-north-1'
        });

        const s3 = new AWS.S3();

        const uniqueFileName = `${Date.now()}-${file.name}`; // Dosya adını otomatik olarak oluşturun

        const uploadParams = {
            Bucket: 'melikbilyayresim',
            Key: uniqueFileName, // Otomatik olarak oluşturulan dosya adını kullanın
            Body: file,
            ACL: 'public-read'
        };

        try {
            const data = await s3.upload(uploadParams).promise();
            console.log('Upload Success', data.Location);
            alert('File uploaded successfully.');
        } catch (error) {
            console.error('Upload Error', error);
            alert('An error occurred while uploading the file.');
        }
    };

    return (
        <div className="App">
            <h1>File Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default Upload;
