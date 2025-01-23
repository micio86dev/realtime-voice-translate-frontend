import { component$ } from "@builder.io/qwik";
import { inlineTranslate } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  return (
    <div class="navbar">
      <div class="logo"></div>
      <h1>{ t('Realtime Voice Translate') }</h1>
    </div>
  );
});
