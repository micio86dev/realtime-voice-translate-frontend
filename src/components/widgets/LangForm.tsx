import {
  component$,
  useStore,
  $,
  getLocale,
  useOnDocument,
  noSerialize,
} from '@builder.io/qwik';
import { getFullLocale } from '~/utils/locale';
import Select from '~/components/atoms/Inputs/Select';
import Input from '~/components/atoms/Inputs/Input';
import BButton from '~/components/atoms/Buttons/BButton';

export default component$(() => {
  const store = useStore({
    listening: false,
    speaking: false,
    message: '',
    channelName: '',
    pusher: null as any,
    channel: null as any,
    sendingMessage: false,
    artyom: null as any,
    voices: [],
    userId: '',
    selectedVoice: 'Alice',
    receivedMessage: '',
    sourceLang: getLocale(), // Default from the browser
    targetLang: '',
    onlineUsers: [] as any,
    selectedUser: null as any,
    supportedLangs: [
      { name: $localize`English`, id: 'en', lang: 'en-GB' },
      { name: $localize`Spanish`, id: 'es', lang: 'es-ES' },
      { name: $localize`Italian`, id: 'it', lang: 'it-IT' },
    ],
  });

  const backendUrl = import.meta.env.VITE_API_URL;

  const changeVoice = $((event?: Event) => {
    if (event) {
      const target = event.target as HTMLSelectElement;
      store.selectedVoice = target.value;
    }
    const fullLang = store.supportedLangs.find((lang: any) => lang.id === store.sourceLang)
    if (fullLang) {
      store.artyom.ArtyomVoicesIdentifiers[fullLang.lang] = [store.selectedVoice];
      console.log(store.artyom.ArtyomVoicesIdentifiers[fullLang.lang], 'B')
    }
  });

  // Set first of available voices
  const setVoices = $(() => {
    console.log(store.artyom.getVoices(), 'C')
    const voices = store.artyom.getVoices()
      .filter((voice: any) => voice.lang.includes(store.targetLang) && voice.localService)
      .map((voice: any) => { return { name: voice.name, id: voice.name } });
    store.voices = [...voices as []];

    // Set default order of voices
    const fullLang = store.supportedLangs.find((lang: any) => lang.id === store.targetLang)
    if (fullLang) {
      store.artyom.ArtyomVoicesIdentifiers[fullLang.lang] = voices.map((voice: any) => voice.id);
      console.log(store.artyom.ArtyomVoicesIdentifiers[fullLang.lang], 'A')
    } else {
      console.error('Selected lang is not supported bny Artyom');
    }

    if (voices.length > 0) {
      store.selectedVoice = voices[0].id;
      changeVoice()
    }
  });

  const changeLang = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.sourceLang = target.value;
  });

  const changeTargetLang = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.targetLang = target.value;
    setVoices();
  });

  // Set local message to send
  const setMessage = $((event: Event) => {
    const target = event.target as HTMLInputElement;
    store.message = target.value;
  });

  // Send setted local message to backend
  const sendMessage = $(() => {
    store.sendingMessage = true;

    const body = JSON.stringify({
      channel: store.channelName,
      source_lang: store.sourceLang.toUpperCase(),
      target_lang: store.targetLang.toUpperCase(),
      message: store.message,
    });

    fetch(`${ backendUrl }/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).finally(() => {
      store.sendingMessage = false;
      store.message = '';
    });
  });

  const artyomInit = $(async () => {
    const ArtyomModule = await import('artyom.js');
    const Artyom = ArtyomModule.default;
    const artyomInstance = new Artyom();

    // Inizializza Artyom lato client
    store.artyom = noSerialize(artyomInstance);
    store.artyom.initialize({
      lang: getFullLocale(),
      continuous: true,
      soundex: true,
      listen: true,
      debug: false,
      mode: 'remote',
      volume: 1,
      speed: 1,
    }).then(() => {
      setVoices();

      store.artyom.remoteProcessorService((phrase: any) => {
        if (!store.selectedUser) {
          alert($localize`Please, choose a user`);
        } else {
          store.speaking = true;

          if (phrase.isFinal) {
            store.message = phrase.text;
            if (phrase.text !== '' && store.channelName !== '') {
              // Send message to translate service
              sendMessage();
            }
            store.speaking = false;
          }
        }
      });

      store.listening = true;
    }).catch((err: any) => {
      console.error(err);
      alert($localize`Error initializing your microphone`);
    });
  });

  const addMember = $((member: any) => {
    store.onlineUsers.push(member);
  });

  const removeMember = $((member: any) => {
    store.onlineUsers = store.onlineUsers.filter((m: any) => m.id !== member.id);
  });

  const selectUser = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.selectedUser = target.value;
  });

  const initPresenceChannel = $(() => {
    const presenceChannel = store.pusher.subscribe('presence-chat');

    // When a user subscribes
    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const membersIds = Object.keys(members.members);

      membersIds.forEach((id: string) => {
        if (id !== store.userId) {
          const member = members.members[id];
          console.log(`User subscribed: ${ id } - ${ member.name }`);
          addMember({
            id,
            name: member.name,
          });
        }
      });
    });

    // When a user joins
    presenceChannel.bind('pusher:member_added', (member: any) => {
      console.log(`${ member } joined`);
      addMember(member);
    });

    // When a user leaves
    presenceChannel.bind('pusher:member_removed', (member: any) => {
      console.log(`${ member } leaved`);
      removeMember(member);
    });
  });

  const initPusher = $(() => {
    store.userId = crypto.randomUUID();
    store.channelName = `user-${ store.userId }`;

    // Init pusher
    import('pusher-js').then(PusherModule => {
      store.pusher = noSerialize(new PusherModule.default('27991ede2e5f0b8d86d9', {
        cluster: 'eu',
        authEndpoint: `${ backendUrl }/pusher/auth`,
        auth: {
          params: {
            user_id: store.userId,
          },
        },
      }));
      initPresenceChannel();

      // Subscribe me to my channel (listener)
      store.channel = noSerialize(store.pusher.subscribe(store.channelName));
      store.channel.bind('new-message', (data: any) => {
        store.receivedMessage = data.message;
        store.artyom.say(data.message);
      });
    });
  });

  useOnDocument("qinit", $(() => {
    setTimeout(async () => {
      await artyomInit();
    }, 3000);

    initPusher();
  }));

  return (
    <div class="flex flex-col p-4 gap-4 h-full">
      <div
        style={ {
          backgroundColor: store.listening ? 'green' : 'gray',
        } }
        class={ `${ store.speaking ? 'animate-pulse' : '' } circle` }
      >
      </div>
      <h3 class="py-4 text-center">{ store.receivedMessage }</h3>

      <div class="container flex flex-col gap-4">
        { store.onlineUsers.length > 0 && <Select options={ store.onlineUsers } onInput={ selectUser } label={ $localize`Choose a user` } placeholder={ $localize`Choose a user` } selected={ store.selectedUser } name="user" /> }

        { store.selectedUser && <form preventdefault:submit onSubmit$={ sendMessage } class="flex flex-row w-full">
          <Input name="message" placeholder={ $localize`Write a message` } label={ $localize`Write a message or speak` } value={ store.message } onInput={ setMessage } />
          <BButton type="submit" class="primary" iconRight="send" loading={ store.sendingMessage } disabled={ !store.message }>{ $localize`Send` }</BButton>
        </form> }

        { store.supportedLangs.length > 0 && <Select options={ store.supportedLangs } label={ $localize`Your language` } placeholder={ $localize`Select your language` } onInput={ changeLang } selected={ store.sourceLang } name="lang" /> }

        { store.supportedLangs.length > 0 && <Select options={ store.supportedLangs } label={ $localize`Target language` } placeholder={ $localize`Select target language` } onInput={ changeTargetLang } selected={ store.targetLang } name="target_lang" /> }
        { store.voices.length > 0 && <Select options={ store.voices } onInput={ changeVoice } label={ $localize`Choose a voice` } name="voice" /> }
      </div>
    </div>
  );
});
