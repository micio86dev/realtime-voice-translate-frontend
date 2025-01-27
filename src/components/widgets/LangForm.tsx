import {
  component$,
  useStore,
  $,
  useOnDocument,
  noSerialize,
} from "@builder.io/qwik";
import Select from "~/components/atoms/Inputs/Select";
import Input from "~/components/atoms/Inputs/Input";
import BButton from "~/components/atoms/Buttons/BButton";
import { inlineTranslate } from 'qwik-speak';
import type { Message, Voice, Lang, Phrase, Member, Members } from "~/types";

export default component$((props: { userId: string }) => {
  const t = inlineTranslate();
  const store = useStore({
    listening: false,
    speaking: false,
    message: "",
    channelName: "",
    pusher: null as any,
    channel: null as any,
    sendingMessage: false,
    artyom: null as any,
    userId: props.userId,
    voices: [],
    selectedVoice: "Alice",
    receivedMessage: "",
    sourceLang: 'en', // Default from the browser
    onlineUsers: [] as any,
    selectedUser: null as any,
    supportedLangs: [
      { name: t('English'), id: "en", lang: "en-GB" },
      { name: t('Spanish'), id: "es", lang: "es-ES" },
      { name: t('Italian'), id: "it", lang: "it-IT" },
    ],
  }, { deep: true });

  const backendUrl = import.meta.env.VITE_API_URL ?? 'https://api.realtime-voice-translate.it';

  const changeVoice = $((event?: Event) => {
    if (event) {
      const target = event.target as HTMLSelectElement;
      store.selectedVoice = target.value;
    }
    const fullLang = store.supportedLangs.find(
      (lang: any) => lang.id === store.sourceLang,
    );
    if (fullLang) {
      store.artyom.ArtyomVoicesIdentifiers[fullLang.lang] = [
        store.selectedVoice,
      ];
    }
  });

  // Set first of available voices
  const setVoices = $(() => {
    if (!store.artyom) return;

    const voices = store.artyom
      .getVoices()
      .filter(
        (voice: Voice) =>
          voice.lang.includes(store.sourceLang) && voice.localService,
      )
      .map((voice: Voice) => {
        return { name: voice.name, id: voice.name };
      });
    store.voices = [...(voices as [])];

    if (!store.sourceLang) {
      return;
    }

    // Set default order of voices
    const fullLang = store.supportedLangs.find(
      (lang: Lang) => lang.id === store.sourceLang,
    );
    if (fullLang) {
      store.artyom.ArtyomVoicesIdentifiers[fullLang.lang] = voices.map(
        (voice: Voice) => voice.id,
      );
    } else {
      console.error("Selected lang is not supported by Artyom");
    }

    if (voices.length > 0) {
      store.selectedVoice = voices[0].id;
      changeVoice();
    }
  });

  const removeMember = $((member: Member) => {
    store.onlineUsers = store.onlineUsers.filter(
      (m: Member) => m.id !== member.id,
    );
  });

  const addMember = $((member: Member) => {
    if (store.onlineUsers.find((m: Member) => m.id === member.id)) {
      // If exists, update it
      store.onlineUsers = store.onlineUsers.filter((mx: Member) =>
        mx.id === member.id ? mx : member,
      );
    } else {
      store.onlineUsers.push(member);
      console.log(store.onlineUsers, 'online users');
    }
  });

  const initPresenceChannel = $(() => {
    const presenceChannel = store.pusher.subscribe("presence-chat");

    // When a user subscribes
    presenceChannel.bind(
      "pusher:subscription_succeeded",
      (members: Members) => {
        const membersIds = Object.keys(members.members);

        membersIds.forEach((id: string) => {
          if (id !== store.userId) {
            const member = members.members[id];
            console.log(`User subscribed: ${ id }`);

            addMember({
              id,
              name: member.name,
              lang: member.lang,
            });
          }
        });
      },
    );

    // When a user joins
    presenceChannel.bind("pusher:member_added", (member: Member) => {
      console.log(`${ member.id } joined`);

      addMember({
        id: member.id,
        name: member.info.name,
        lang: member.info.lang,
      });
    });

    // When a user leaves
    presenceChannel.bind("pusher:member_removed", (member: Member) => {
      console.log(`${ member.id } leaved`);

      removeMember(member);
    });
  });

  // Send setted local message to backend
  const sendMessage = $(() => {
    store.sendingMessage = true;

    if (!store.selectedUser) {
      console.log('Please, choose a user');
      return;
    }

    const target_lang = store.onlineUsers.find(
      (user: Member) => user.id === store.selectedUser,
    )?.lang;

    const body = JSON.stringify({
      user_id: store.selectedUser,
      source_lang: store.sourceLang.toUpperCase(),
      target_lang,
      message: store.message,
    });

    fetch(`${ backendUrl }/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }).finally(() => {
      store.sendingMessage = false;

      setTimeout(() => {
        store.message = "";
      }, 1000);
    });
  });

  const artyomInit = $(async () => {
    if (store.artyom) return;

    const ArtyomModule = await import("artyom.js");
    const Artyom = ArtyomModule.default;
    const artyomInstance = new Artyom();

    // Inizializza Artyom lato client
    const lang =
      store.supportedLangs.find((lang: Lang) => lang.id === store.sourceLang)
        ?.lang || "en-GB";

    await artyomInstance
      .initialize({
        lang,
        continuous: true,
        soundex: true,
        listen: true,
        debug: false,
        mode: "remote",
        volume: 1,
        speed: 1,
      })
      .then(() => {
        setVoices();

        artyomInstance.remoteProcessorService((phrase: Phrase) => {
          if (!store.selectedUser) {
            console.log('Please, choose a user');
          } else {
            store.speaking = true;

            if (phrase.isFinal) {
              store.message = phrase.text;
              if (phrase.text !== "" && store.channelName !== "") {
                // Send message to translate service
                sendMessage();
              }
              store.speaking = false;
            }
          }
        });

        store.artyom = noSerialize(artyomInstance);
        console.log('init Artyom');

        store.listening = true;
      })
      .catch((err: any) => {
        console.error(err);
      });
  });

  const initPusher = $(() => {
    store.channelName = "chat";

    // Init pusher
    import("pusher-js").then((PusherModule) => {
      store.pusher = noSerialize(
        new PusherModule.default("27991ede2e5f0b8d86d9", {
          cluster: "eu",
          authEndpoint: `${ backendUrl }/pusher/auth`,
          auth: {
            params: {
              user_id: store.userId,
              lang: store.sourceLang.toUpperCase(),
            },
          },
        }),
      );

      initPresenceChannel();

      // Subscribe me to my channel (listener)
      store.channel = noSerialize(store.pusher.subscribe(store.channelName));
      store.channel.bind("new-message", (data: Message) => {
        console.log("new-message", data);
        if (data.user_id === store.userId) {
          store.receivedMessage = data.message;
          store.artyom?.say(data.message);
        }
      });
    });
  });

  const changeLang = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.sourceLang = target.value;

    setVoices();

    store.pusher.disconnect();
    initPusher();
  });

  // Set local message to send
  const setMessage = $((event: Event) => {
    const target = event.target as HTMLInputElement;
    store.message = target.value;
  });

  const selectUser = $(async (event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.selectedUser = target.value;

    await artyomInit();
  });

  useOnDocument(
    "qinit",
    $(() => {
      initPusher();
    }),
  );

  return (
    <div class="flex h-full flex-col gap-4">
      <div
        style={ {
          backgroundColor: store.listening ? "green" : "gray",
        } }
        class={ `${ store.speaking ? "animate-pulse" : "" } circle` }
      >
        { !store.selectedUser && <h3>{ t('Choose a user') }</h3> }
      </div>
      <h3 class="py-4 text-center">{ store.receivedMessage }</h3>
      { store.userId }

      <div class="container flex flex-col gap-4">
        { store.selectedUser && (
          <form
            preventdefault:submit
            onSubmit$={ sendMessage }
            class="flex w-full flex-row"
          >
            <Input
              name="message"
              placeholder={ t('Write a message') }
              label={ t('Write a message or speak') }
              value={ store.message }
              onInput={ setMessage }
            />
            <BButton
              type="submit"
              class="primary"
              iconRight="send"
              loading={ store.sendingMessage }
              disabled={ !store.message }
            >{ t('Send') }</BButton>
          </form>
        ) }

        { store.onlineUsers.length > 0 && (
          <Select
            options={ store.onlineUsers }
            onInput={ selectUser }
            label={ t('Choose a user') }
            placeholder={ t('Choose a user') }
            selected={ store.selectedUser }
            name="user"
          />
        ) }
        { store.supportedLangs.length > 0 && (
          <Select
            options={ store.supportedLangs }
            label={ t('Your language') }
            placeholder={ t('Select your language') }
            onInput={ changeLang }
            selected={ store.sourceLang }
            name="lang"
          />
        ) }
        { store.voices.length > 0 && (
          <Select
            options={ store.voices }
            onInput={ changeVoice }
            label={ t('Choose a voice') }
            name="voice"
          />
        ) }
      </div>
    </div>
  );
});
