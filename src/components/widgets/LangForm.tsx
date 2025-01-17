import {
  component$,
  useStore,
  $,
  getLocale,
  useOnDocument,
  noSerialize,
} from '@builder.io/qwik';
import { getFullLocale } from '~/utils/locale';
import SelectComponent from '~/components/atoms/SelectComponent';

export default component$(() => {
  const store = useStore({
    listening: false,
    speaking: false,
    message: '',
    channelName: '',
    artyom: null as any,
    voices: [],
    selectedVoice: 'Alice',
  });

  const backendUrl = import.meta.env.VITE_API_URL;

  const changeVoice = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.selectedVoice = target.value;
    store.artyom.ArtyomVoicesIdentifiers[getFullLocale()] = [store.selectedVoice];
  });

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

    store.artyom.initialize({
      lang: getFullLocale(),
      continuous: true,
      soundex: true,
      listen: true,
      debug: true,
      mode: 'remote',
      volume: 1,
      speed: 1,
    }).then(() => {
      const voices = store.artyom.getVoices()
        .filter((voice: any) => voice.lang.includes(lang) && voice.localService)
        .map((voice: any) => { return { name: voice.name, id: voice.name } });
      store.voices = voices;
      store.artyom.ArtyomVoicesIdentifiers[getFullLocale()] = voices.map((voice: any) => voice.id); // Set default order of voices

      store.artyom.remoteProcessorService((phrase: any) => {
        store.speaking = true;
        store.message = phrase.text;

        if (phrase.isFinal) {
          if (phrase.text !== '' && store.channelName !== '') {
            // Send message to translate service
            sendMessage({
              channel: store.channelName,
              source_lang: lang.toUpperCase(),
              target_lang: "es".toUpperCase(),
              message: phrase.text,
            });
          }
          store.speaking = false;
        }
      });

      store.listening = true;
    }).catch((err: any) => {
      console.error(err);
    });
  });

  useOnDocument("qinit", $(async () => {
    const ArtyomModule = await import('artyom.js');
    const Artyom = ArtyomModule.default;
    const artyomInstance = new Artyom();

    // Inizializza Artyom lato client
    store.artyom = noSerialize(artyomInstance);
    artyomInit();

    const userId = crypto.randomUUID();
    store.channelName = `user-${ userId }`;

    import('pusher-js').then(PusherModule => {
      const pusher = new PusherModule.default('27991ede2e5f0b8d86d9', {
        cluster: 'eu',
      });
      const channel = pusher.subscribe(store.channelName);
      channel.bind('new-message', (data: any) => {
        store.message = data.message;
        store.artyom.say(data.message, {
          voice: 'Eddy (italiano (Italia))',
        });
      });
    });
  }));

  return (
    <div class="flex flex-col p-4 gap-4 items-center justify-center h-full w-full">
      <div
        style={ {
          backgroundColor: store.listening ? 'green' : 'gray',
        } }
        class={ `${ store.speaking ? 'animate-pulse' : '' } circle` }
      >
        { store.speaking ? 'Registrando...' : store.listening ? 'Ascoltando...' : 'Non in ascolto' }
      </div>

      <SelectComponent options={ store.voices } on-input={ changeVoice } name="voice" class="mt-4 m-auto" />
      <h3 class="py-4 text-center">{ store.message }</h3>
    </div>
  );
});
