import {
  component$,
  useContext,
  useVisibleTask$,
  getLocale,
  useTask$,
} from "@builder.io/qwik";
import {
  type DocumentHead,
  useNavigate
} from "@builder.io/qwik-city";
import { SITE } from "~/config.mjs";
import { GlobalContext, CardsContext } from "~/root";
import CardRow from "~/components/cards/Row";

export default component$(() => {
  const globalStore = useContext(GlobalContext);
  const cardStore = useContext(CardsContext);
  const nav = useNavigate();
  const lang = getLocale();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const percentage = track(() => globalStore.percentage);
    if (percentage === 100 && !cardStore.items.length) {
      nav(`/${ lang }/cards`)
    }
  });

  useTask$(({ track }) => {
    const count = track(() => cardStore.items.length);
    if (count > 0) {
      cardStore.currentCard = cardStore.items.find(item => item.selected);
    }
  });

  return (
    <section>
      <div class="row md:grid-cols-1">
        {
          cardStore.currentCard ?
            <CardRow item={ cardStore.currentCard } noSelect={ true } /> :
            <div class="notification is-danger">{ cardStore.items.length ? $localize`No card selected` : $localize`No cards` }</div>
        }
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
