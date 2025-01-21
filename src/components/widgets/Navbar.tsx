import {
  component$,
} from '@builder.io/qwik';
import ImgLogo from '~/assets/images/logo.webp?w=64&h=64&jsx';

export default component$(() => {

  return (
    <div class="navbar">
      <div class="logo">
        <ImgLogo class="logo-img" />
      </div>
      <h1>{ $localize`Realtime Voice Translate` }</h1>
    </div>
  );
});
