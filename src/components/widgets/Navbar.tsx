import {
  component$,
} from '@builder.io/qwik';
import ImgLogo from '~/assets/images/logo.webp?jsx';

export default component$(() => {

  return (
    <div class="navbar">
      <div class="logo">
        <ImgLogo class="logo-img" />
      </div>
    </div>
  );
});
