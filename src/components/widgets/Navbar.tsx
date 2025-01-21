import {
  component$,
} from '@builder.io/qwik';
import { Image } from '@unpic/qwik';

export default component$(() => {

  return (
    <div class="navbar">
      <div class="logo">
        <Image
          src="~/assets/images/logo.webp"
          layout="constrained"
          width={ 64 }
          height={ 64 }
          alt="Logo"
        />
      </div>
      <h1>{ $localize`Realtime Voice Translate` }</h1>
    </div>
  );
});
