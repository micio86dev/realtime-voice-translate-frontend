import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="navbar">
      <div class="logo"></div>
      <h1>{$localize`Realtime Voice Translate`}</h1>
    </div>
  );
});
