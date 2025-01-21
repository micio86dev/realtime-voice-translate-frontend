import {
  component$,
} from '@builder.io/qwik';

export default component$(() => {

  return (
    <div class="navbar">
      <div class="logo">
        <img class="logo-img" src="/images/logo.webp" alt="Logo" />
      </div>
      <h1>{ $localize`Realtime Voice Translate` }</h1>
    </div>
  );
});
