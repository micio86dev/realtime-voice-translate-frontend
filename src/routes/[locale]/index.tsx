import {
  component$,
} from "@builder.io/qwik";
import {
  type DocumentHead,
} from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import VideoPeer from "~/components/widgets/VideoPeer";

export default component$(() => {
  const userId = crypto.randomUUID();

  return (
    <section class="h-[calc(90vh)] p-4">
      <div class="row md:grid-cols-1 h-full">
        <VideoPeer userId={ userId } />
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
