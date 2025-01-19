import {
  component$,
} from "@builder.io/qwik";
import {
  type DocumentHead,
} from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import LangForm from "~/components/widgets/LangForm";

export default component$(() => {
  return (
    <section class="h-[calc(90vh)]">
      <div class="row md:grid-cols-1 h-full">
        <LangForm />
      </div>
    </section>
  );
});

export const head: DocumentHead = {
  title: SITE.title,
  meta: [
    {
      name: "description",
      content: SITE.description,
    },
  ],
};
