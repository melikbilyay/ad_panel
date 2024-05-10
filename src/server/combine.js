const fs = require('fs/promises');
const path = require('path/posix');

// urls.json dosyasını oku
fs.readFile(path.join(__dirname, 'urls.json'), 'utf8')
    .then(urlsData => {
        const urls = JSON.parse(urlsData);

        // app.js dosyasını oku
        return fs.readFile(path.join(__dirname, 'app.js'), 'utf8')
            .then(appData => {
                // app.js dosyasından people dizisini al
                const peopleMatches = appData.match(/const people = \[(.*?)\];/s);
                const peopleString = peopleMatches[1].trim();
                const people = eval('[' + peopleString + ']');

                // urls ve people verilerini birleştir
                const combinedData = people.map(person => {
                    const matchingUrl = urls.find(url => url.id === person.id);
                    return { ...person, url: matchingUrl ? matchingUrl.url : null };
                });

                // Birleştirilmiş verileri yeni bir JS dosyasına yaz
                const fileContent = `const combinedData = ${JSON.stringify(combinedData, null, 2)};\n\nexport default combinedData;`;
                return fs.writeFile(path.join(__dirname, 'combined.js'), fileContent);
            });
    })
    .catch(err => {
        console.error(err);
    });
