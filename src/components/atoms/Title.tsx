import { Slot, component$ } from "@builder.io/qwik";

export default component$(() => (
  <h1>
    <Slot />
  </h1>
));
