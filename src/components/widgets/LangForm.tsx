import {
  component$,
  useStore,
  $,
  getLocale,
  useOnDocument,
  noSerialize,
} from '@builder.io/qwik';
import Pusher from 'pusher-js';
import { getFullLocale } from '~/utils/locale';

export default component$(() => {
  const state = useStore({
    listening: false,
    speaking: false,
    message: '',
    channelName: '',
    artyom: null as any,
  });

  const backendUrl = import.meta.env._API_URL;

  const sendMessage = $((body: any) => {
    fetch(`${ backendUrl }/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  });

  const artyomInit = $(() => {
    const lang = getLocale();

    state.artyom.initialize({
      lang: getFullLocale(),
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
          if (phrase.text !== '' && state.channelName !== '') {
            // Send message to translate service
            sendMessage({
              channel: state.channelName,
              source_lang: lang.toUpperCase(),
              target_lang: "es".toUpperCase(),
              message: phrase.text,
            });
          }
          state.speaking = false;
        }
      });

      state.listening = true;
    }).catch((err: any) => {
      state.artyom.say("Artyom couldn't be initialized, please refresh the page and try again.");
      console.log(err);
    });
  });

  useOnDocument("qinit", $(async () => {
    const ArtyomModule = await import('artyom.js');
    const Artyom = ArtyomModule.default;
    const artyomInstance = new Artyom();

    // Inizializza Artyom lato client
    state.artyom = noSerialize(artyomInstance);
    artyomInit();

    const userId = crypto.randomUUID();
    state.channelName = `user-${ userId }`;
    const pusher = new Pusher('27991ede2e5f0b8d86d9', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe(state.channelName);
    channel.bind('new-message', (data: any) => {
      state.message = data.message;
      state.artyom.say(data.message);
    });
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
