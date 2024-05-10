import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

function Upload() {
    const [files, setFiles] = useState([]);
    const [workingHoursList, setWorkingHoursList] = useState([]);

    const handleChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        const initialHours = Array(selectedFiles.length).fill('');
        setWorkingHoursList(initialHours);
    };

    const handleWorkingHoursChange = (event, index) => {
        const newWorkingHoursList = [...workingHoursList];
        newWorkingHoursList[index] = event.target.value;
        setWorkingHoursList(newWorkingHoursList);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (files.length === 0) {
            alert('Please select a file.');
            return;
        }

        AWS.config.update({
            accessKeyId: 'AKIA2UC3B2ID7M2O2E4K',
            secretAccessKey: "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",
            region: 'eu-north-1'
        });

        const s3 = new AWS.S3();

        try {
            const uploadPromises = files.map(async (file, index) => {
                const uniqueFileName = `${Date.now()}-${file.name}`;

                const uploadParams = {
                    Bucket: 'melikbilyayresim',
                    Key: uniqueFileName,
                    Body: file,
                    ACL: 'public-read',
                    Metadata: {
                        workinghours: workingHoursList[index]
                    }
                };

                const data = await s3.upload(uploadParams).promise();
                console.log('Upload Success', data.Location);
            });

            await Promise.all(uploadPromises);
            alert('All files uploaded successfully.');
        } catch (error) {
            console.error('Upload Error', error);
            alert('An error occurred while uploading the files.');
        }
    };

    // Fonksiyonu tarayıcı içinden çağırarak önizleme oluşturma
    const renderPreviews = () => {
        return files.map((file, index) => (
            <div key={index}>
                <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} style={{ width: '100px', height: 'auto' }} />
                <input
                    type="text"
                    placeholder="Working Hours"
                    value={workingHoursList[index]}
                    onChange={(event) => handleWorkingHoursChange(event, index)}
                />
            </div>
        ));
    };

    return (
        <div className="App">
            <h1>File Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleChange} multiple />
                {renderPreviews()}
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default Upload;
