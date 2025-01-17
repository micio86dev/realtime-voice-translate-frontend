import {
  component$,
  useStyles$,
  createContextId,
  useContextProvider,
  useStore,
  getLocale,
} from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import globalStyles from "~/assets/styles/main.css?inline";

interface GlobalStore {
  percentage: number;
}

export const GlobalContext = createContextId<GlobalStore>("global");

export default component$(() => {
  useStyles$(globalStyles);
  const lang = getLocale();

  const globalStore: GlobalStore = useStore({
    percentage: 0,
  });

  useContextProvider(GlobalContext, globalStore);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang={ lang }>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
