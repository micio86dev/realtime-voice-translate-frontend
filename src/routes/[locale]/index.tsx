import {
  component$,
  useVisibleTask$,
  getLocale,
} from "@builder.io/qwik";
import {
  type DocumentHead,
  useNavigate
} from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import LangForm from "~/components/widgets/LangForm";

export default component$(() => {
  const nav = useNavigate();
  const lang = getLocale();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    nav(`/${ lang }`)
  });

  return (
    <section>
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
