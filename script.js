// ── Elemente ──
const launcher     = document.getElementById('chatLauncher');
const windowBox    = document.getElementById('chatWindow');
const closeBtn     = document.getElementById('closeChat');
const sendBtn      = document.getElementById('sendBtn');
const userInput    = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');

// ── Chat öffnen / schließen ──
launcher.onclick = () => { windowBox.style.display = 'flex'; };
closeBtn.onclick = () => { windowBox.style.display = 'none'; };

// ── Nachricht anzeigen ──
function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ── KI-Anfrage (Google Gemini) ──
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    const loading = document.createElement('div');
    loading.className = 'message bot';
    loading.innerText = '...';
    chatMessages.appendChild(loading);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 🔑 Deinen Gemini API-Key hier eintragen (kostenlos auf aistudio.google.com)
    const URL = `https://aabp.kajurieh.workers.dev`/;

    const systemInstruction = `Du bist der offizielle Guide der Aalen Block Party 2026 – ein Festival in Aalen, Deutschland.
Dein Ton ist cool, authentisch und nutzt lockeren Festival- und Rap-Slang auf Deutsch (z.B. "safe", "Vibe", "Bro", "krass", "fett").
Sei hilfsbereit aber kurz angebunden. Antworte immer auf Deutsch.
Du weißt über folgendes Bescheid:
- Das Festival findet im Sommer 2026 in Aalen statt
- Tickets: Early Bird 29€ (ausverkauft), Standard 45€, VIP 99€
- Es gibt eine Main Stage und eine Second Stage
- Anfahrt: Shuttlebus ab Aalen Hbf, Linie 42
- Merch: Shirts ab 19,99€, Hoodies, Caps`;

    const requestBody = {
        contents: [{
            parts: [{ text: `${systemInstruction}\n\nNutzer fragt: ${text}` }]
        }]
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        loading.remove();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            appendMessage('bot', data.candidates[0].content.parts[0].text);
        } else {
            throw new Error("Keine Antwort von Gemini");
        }

    } catch (err) {
        loading.remove();
        appendMessage('bot', 'Bro, meine Verbindung zur Stage ist gerade abgebrochen! 😅');
        console.error('Gemini API Fehler:', err);
    }
}

// ── Events ──
sendBtn.onclick = sendMessage;
userInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
