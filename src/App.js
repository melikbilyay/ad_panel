import React, { useState, useEffect } from 'react';
import combinedData from './server/combined.js';

function App() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getHours();
            const activePerson = combinedData.find(person => {
                const { start, end } = person.workingHours;
                if (start <= end) {
                    return currentTime >= start && currentTime < end;
                } else {
                    return currentTime >= start || currentTime < end;
                }
            });

            if (activePerson) {
                const activeIndex = combinedData.indexOf(activePerson);
                setIndex(activeIndex);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="section">
            <div className="section-center">
                {combinedData.map((person, personIndex) => {
                    const { id, url, workingHours } = person;

                    let position = 'nextSlide';
                    if (personIndex === index) {
                        position = 'activeSlide';
                    }
                    if (
                        personIndex === index - 1 ||
                        (index === 0 && personIndex === combinedData.length - 1)
                    ) {
                        position = 'lastSlide';
                    }

                    return (
                        <article className={position} key={id}>
                            <img src={url} alt={`Person ${id}`} className="person-img" />
                            <p>Çalışma Saatleri: {workingHours.start} - {workingHours.end}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}


export default App;
