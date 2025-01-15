import {
  component$,
  useStore,
  $,
  useOnDocument,
} from "@builder.io/qwik";

import { IconSun } from "~/components/icons/IconSun";
import { IconMoon } from "../icons/IconMoon";

interface ItemProps {
  iconClass?: string;
}

export default component$((props: ItemProps) => {
  const { iconClass } = props;
  const store = useStore({
    theme:
      (typeof window !== "undefined" && window.localStorage.theme) ||
      undefined,
  });

  useOnDocument("qinit", $(() => {
    if (!(typeof window !== "undefined")) {
      return;
    }

    store.theme =
      window.localStorage.theme === "light" ||
        (!("theme" in window.localStorage) &&
          window.matchMedia("(prefers-color-scheme: light)").matches)
        ? "light"
        : "dark";

    if (store.theme === 'dark') {
      document.documentElement.classList.add("dark");
    }
  }));

  return (
    <button
      type="button"
      class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center"
      aria-label="Toggle between Dark and Light mode"
      onClick$={ () => {
        switch (store.theme) {
          case "light":
            document.documentElement.classList.add("dark");
            store.theme = window.localStorage.theme = "dark";
            break;
          default:
            document.documentElement.classList.remove("dark");
            store.theme = window.localStorage.theme = "light";
            break;
        }
      } }
    >
      { store.theme === "dark" ? (
        <IconMoon class={ iconClass } />
      ) : (
        <IconSun class={ iconClass } />
      ) }
    </button>
  );
});
