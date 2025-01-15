import {
  component$,
  useStore,
  useSignal,
  $,
  getLocale,
  useOnDocument,
  noSerialize,
} from '@builder.io/qwik';
import BButton from "~/components/atoms/BButton";

export default component$(() => {
  const state = useStore({ text: '', recognize: undefined as any });
  const isRecording = useSignal(false);
  const isSending = useSignal(false);

  // Funzione per avviare il riconoscimento
  const startRecognition = $(() => {
    if (state.recognize) {
      state.text = '';
      state.recognize.start();
    } else {
      console.error('SpeechRecognition non è stato inizializzato correttamente');
    }
  });

  useOnDocument("qinit", $(() => {
    if (typeof window !== 'undefined') {
      const r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

      // Imposta le configurazioni di SpeechRecognition
      r.lang = getLocale();
      r.interimResults = true;
      r.maxAlternatives = 1;

      r.onresult = (event: any) => {
        const lastResult = event.results[0][0]

        if (event.results[0].isFinal) {
          state.text = lastResult.transcript;
        }
      };

      r.onstart = () => {
        isRecording.value = true;
      };

      r.onend = () => {
        isRecording.value = false;
        isSending.value = true;
        // TODO: Send text to server
        isSending.value = false;
      };
      state.recognize = noSerialize(r);
    }
  }));

  return (
    <>
      <div class="flex flex-col gap-2">
        <BButton type="button" class="primary w-full" on-click={ startRecognition } loading={ isRecording.value }>
          { $localize`Start recognize voice` }
        </BButton>
      </div>
      <p>{ state.text }</p>
    </>
  );
});
