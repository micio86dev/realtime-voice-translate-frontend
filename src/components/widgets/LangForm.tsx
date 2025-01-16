import {
  component$,
  useStore,
  $,
  getLocale,
  useOnDocument,
  noSerialize,
} from '@builder.io/qwik';

export default component$(() => {
  const state = useStore({
    listening: false,
    speaking: false,
    message: '',
    artyom: null as any,
  });

  const speak = $(() => {
    state.artyom.say('Ciao come va?');
  });

  const artyomInit = $(() => {
    const lang = getLocale();

    state.artyom.initialize({
      lang: 'it-IT',
      name: 'Alice',
      continuous: true,
      soundex: true,
      listen: true,
      debug: true,
      mode: 'remote',
      volume: 1,
      speed: 1,
    }).then(() => {
      const voices = state.artyom.getVoices().filter((voice: any) => voice.lang.includes(lang) && voice.localService).map((voice: any) => voice.name);
      console.log(voices, 'VOICES');

      state.artyom.remoteProcessorService((phrase: any) => {
        state.speaking = true;
        state.message = phrase.text;
        if (phrase.isFinal) {
          if (phrase.text !== '') {
            // Send message to translate service
            console.log({ text: state.message, lang: state.artyom.getLanguage() }, 'MESSAGE');
          }
          state.speaking = false;
        }
      });

      state.listening = true;

      speak();
    }).catch((err: any) => {
      state.artyom.say("Artyom couldn't be initialized, please check the console for errors");
      console.log(err);
    });
  });

  useOnDocument("qinit", $(async () => {
    if (typeof window !== 'undefined') {
      const ArtyomModule = await import('artyom.js');
      const Artyom = ArtyomModule.default;
      const artyomInstance = new Artyom();

      // Inizializza Artyom lato client
      state.artyom = noSerialize(artyomInstance);

      artyomInit();
    }
  }));

  return (
    <div>
      <div
        style={ {
          backgroundColor: state.listening ? 'green' : 'gray',
        } }
        class={ `${ state.speaking ? 'animate-pulse' : '' } circle` }
      >
        { state.speaking ? 'Registrando...' : state.listening ? 'Ascoltando...' : 'Non in ascolto' }
      </div>
      <h3 class="py-4 text-center">{ state.message }</h3>
    </div>
  );
});
