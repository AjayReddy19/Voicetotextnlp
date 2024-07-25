document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const status = document.getElementById('status');
    const notes = document.getElementById('notes');

    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        alert('Your browser does not support speech recognition.');
        return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    startBtn.addEventListener('click', () => {
        if (startBtn.innerText === '🎤 Start Recording') {
            recognition.start();
            startBtn.innerText = '🛑 Stop Recording';
            status.innerText = 'Recording...';
        } else {
            recognition.stop();
            startBtn.innerText = '🎤 Start Recording';
            status.innerText = 'Click the mic to start recording...';
        }
    });

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        const fullTranscript = finalTranscript + interimTranscript;
        notes.value = fullTranscript;

        // Process the transcript with compromise.js
        const doc = nlp(fullTranscript);
        const people = doc.people().out('array');
        const organizations = doc.organizations().out('array');
        const places = doc.places().out('array');

        notes.value += `\n\nPeople: ${people.join(', ')}\nOrganizations: ${organizations.join(', ')}\nPlaces: ${places.join(', ')}`;
    };

    recognition.onerror = (event) => {
        status.innerText = 'Error occurred in recognition: ' + event.error;
        console.error('Recognition error:', event.error);
    };

    recognition.onend = () => {
        startBtn.innerText = '🎤 Start Recording';
        status.innerText = 'Click the mic to start recording...';
        console.log('Recognition ended.');
    };
});
