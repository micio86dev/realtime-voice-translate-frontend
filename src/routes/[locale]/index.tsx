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
    <section class="section">
      <div class="row md:grid-cols-1">
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
