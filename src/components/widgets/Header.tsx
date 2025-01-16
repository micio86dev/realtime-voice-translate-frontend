import {
  component$,
  useStore,
  getLocale,
  $,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import Logo from "~/components/atoms/Logo";
import ToggleTheme from "~/components/core/ToggleTheme";
import { SITE } from "../../../src/config.mjs";

interface MenuItem {
  text: string;
  href: string;
  items?: MenuItem[];
}

export default component$(() => {
  const store = useStore({
    isScrolling: false,
  });

  const lang = getLocale();
  const menu = [] as MenuItem[];

  const closeMenu = $(() => {
    document.body.classList.remove("overflow-hidden");
    document.getElementById("header")?.classList.remove("h-screen");
    document.querySelector("#header nav")?.classList.add("hidden");
  });

  return (
    <header
      class="sticky top-0 z-40 flex-none mx-auto w-full transition-all md:bg-white/90 md:backdrop-blur-sm dark:md:bg-slate-900/90 bg-white dark:bg-slate-900"
      id="header"
      window:onScroll$={ () => {
        if (!store.isScrolling && window.scrollY >= 10) {
          store.isScrolling = true;
        } else if (store.isScrolling && window.scrollY < 10) {
          store.isScrolling = false;
        }
      } }
    >
      <div class="py-3 px-3 mx-auto w-full md:flex md:justify-between max-w-6xl md:px-4">
        <div class="flex justify-between items-center">
          <Link href={ `/${ lang }` }
            onClick$={ closeMenu }>
            <Logo />
          </Link>
          <h1 class="m-0 ml-4">{ SITE.name }</h1>
          <div class="flex items-center md:hidden">
            <ToggleTheme iconClass="w-6 h-6" />
          </div>
        </div>
        <div class="md:self-center flex items-center ml-4">
          <nav
            class="items-center w-full md:w-auto hidden md:flex text-gray-500 dark:text-slate-200 h-[calc(100vh-72px)] md:h-auto overflow-y-auto md:overflow-visible pr-4"
            aria-label="Main navigation"
          >
            <ul class="menu">
              { menu.map((item) => (
                <li class={ `${ item.items?.length ? "dropdown" : "" }` } key={ item.text }>
                  <Link
                    href={ item.href }
                    onClick$={ closeMenu }
                    class="font-medium hover:text-gray-900 dark:hover:text-white px-4 py-3 flex items-center transition duration-150 ease-in-out"
                  >
                    { item.text }
                  </Link>

                  { item.items?.length ? (
                    <ul class="dropdown-menu rounded md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-white md:min-w-[200px] dark:md:bg-slate-800 drop-shadow-xl">
                      { item.items.map((item2) => (
                        <li key={ item2.text }>
                          <a
                            class="font-medium rounded-t md:hover:bg-gray-100 dark:hover:bg-gray-700 py-2 px-4 block whitespace-no-wrap"
                            href={ item2.href }
                          >
                            { item2.text }
                          </a>
                        </li>
                      )) }
                    </ul>
                  ) : null }
                </li>
              )) }
            </ul>
          </nav>

          <div class="hidden items-center md:flex">
            <ToggleTheme iconClass="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
});
