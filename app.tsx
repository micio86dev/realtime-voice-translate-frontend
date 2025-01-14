import { component$, useState } from '@builder.io/qwik';

// Funzione per usare l'API di sintesi vocale
const speakText = (text: string, lang: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  } else {
    console.log('Sintesi vocale non supportata nel browser');
  }
};

// Funzione per ottenere l'input dal microfono e inviarlo al server per la traduzione
export default component$(() => {
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Gestione delle lingue
  const [inputLang, setInputLang] = useState(navigator.language.slice(0, 2)); // Lingua del browser per input
  const [outputLang, setOutputLang] = useState('en'); // Inglese di default per l'output

  const handleMicInput = async () => {
    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.lang = inputLang;
    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      console.log('Testo riconosciuto:', text);

      // Invio al backend per tradurre
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${ backendUrl }/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: outputLang }) // La lingua di output
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);

        // Sintesi vocale della traduzione
        speakText(data.translatedText, outputLang);
      } else {
        console.error('Errore nella traduzione');
      }
    };

    recognition.start();
  };

  return (
    <div>
      <h1>Traduzione in tempo reale</h1>

      <div>
        <label htmlFor="inputLang">Lingua di input:</label>
        <select id="inputLang" value={ inputLang } onChange$={ (e) => setInputLang(e.target.value) }>
          <option value="en">Inglese</option>
          <option value="it">Italiano</option>
          <option value="es">Spagnolo</option>
          <option value="fr">Francese</option>
          <option value="de">Tedesco</option>
        </select>
      </div>

      <div>
        <label htmlFor="outputLang">Lingua di output:</label>
        <select id="outputLang" value={ outputLang } onChange$={ (e) => setOutputLang(e.target.value) }>
          <option value="en">Inglese</option>
          <option value="it">Italiano</option>
          <option value="es">Spagnolo</option>
          <option value="fr">Francese</option>
          <option value="de">Tedesco</option>
        </select>
      </div>

      <button onClick$={ handleMicInput }>
        { isListening ? 'Ascoltando...' : 'Clicca per parlare' }
      </button>

      <p>Tradotto: { translatedText }</p>
    </div>
  );
});
