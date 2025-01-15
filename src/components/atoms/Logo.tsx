import { component$ } from "@builder.io/qwik";
import LogoIcon from '~/assets/images/logo.png?jsx';
import { SITE } from "../../../src/config.mjs";

export default component$(() => (
  <span class="self-center text-2xl md:text-xl font-bold text-gray-900 whitespace-nowrap dark:text-white flex items-center">
    <LogoIcon alt={ `${ SITE.name } Logo` } class="inline-block" style="width: auto; height: 48px" />
  </span>
));
