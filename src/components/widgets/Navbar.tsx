import {
  component$,
} from '@builder.io/qwik';
import Image from '~/assets/images/logo.webp?jsx';

export default component$(() => {

  return (
    <div class="navbar">
      <div class="logo">
        <Image class="logo-img" alt="Logo" />
      </div>
      <h1>{ $localize`Realtime Voice Translate` }</h1>
    </div>
  );
});
