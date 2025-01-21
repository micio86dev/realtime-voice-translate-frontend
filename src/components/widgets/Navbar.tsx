import {
  component$,
  $,
} from '@builder.io/qwik';
import {
  Image,
  type ImageTransformerProps,
  useImageProvider,
} from 'qwik-image';

export default component$(() => {
  const imageTransformer$ = $(
    ({ src, width, height }: ImageTransformerProps): string => {
      // Here you can set your favorite image loaders service
      return `https://cdn.builder.io/api/v1/${ src }?height=${ height }&width=${ width }&format=webp&fit=fill`;
    }
  );

  // Global Provider (required)
  useImageProvider({
    // You can set this prop to overwrite default values [3840, 1920, 1280, 960, 640]
    resolutions: [640],
    imageTransformer$,
  });

  return (
    <div class="navbar">
      <div class="logo">

        <Image
          layout="constrained"
          objectFit="fill"
          width={ 64 }
          height={ 64 }
          alt="Logo"
          placeholder="#e6e6e6"
          src={
            'assets/images/logo.webp'
          }
        />
      </div>
      <h1>{ $localize`Realtime Voice Translate` }</h1>
    </div>
  );
});
