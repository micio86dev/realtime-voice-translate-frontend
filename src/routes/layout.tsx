import {
  component$,
  useVisibleTask$,
  Slot,
} from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";
import { extractLang, useI18n } from "~/routes/[locale]/i18n-utils";
import Header from "~/components/widgets/Header";
import Footer from "~/components/widgets/Footer";
import { startConnectionStatus } from '~/utils/connection-status';

export const onRequest: RequestHandler = ({ locale, params }) => {
  locale(extractLang(params.locale));
};

export default component$(() => {
  useI18n();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    startConnectionStatus();
  });

  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});
