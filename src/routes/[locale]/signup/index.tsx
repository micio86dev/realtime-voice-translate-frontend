import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import Title from "~/components/atoms/Title";
import LangForm from "~/components/widgets/LangForm";

export default component$(() => {
  return (
    <section class="page-container">
      <header>
        <Title>{ $localize`Speak now, and listen in your language!` }</Title>
      </header>
      <LangForm />
    </section>
  );
});

export const head: DocumentHead = {
  title: `${ $localize`Speak now` } — ${ SITE.name }`,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
