import { component$ } from "@builder.io/qwik";
import { IconTwitter } from "~/components/icons/IconTwitter";
import { IconInstagram } from "~/components/icons/IconInstagram";
import { IconFacebook } from "~/components/icons/IconFacebook";
import { IconGithub } from "~/components/icons/IconGithub";
import AuhorIcon from '~/assets/images/icon.webp?jsx';

export default component$(() => {
  const social = [
    {
      label: "Twitter",
      icon: IconTwitter,
      href: "https://twitter.com/micio862",
    },
    {
      label: "Instagram",
      icon: IconInstagram,
      href: "https://www.instagram.com/alessandro.micelli/",
    },
    {
      label: "Facebook",
      icon: IconFacebook,
      href: "https://www.facebook.com/micio86dev",
    },
    {
      label: "Github",
      icon: IconGithub,
      href: "https://github.com/micio86dev",
    },
  ];

  return (
    <footer class="border-t border-gray-200 dark:border-slate-800 py-2.5 dark:md:bg-slate-900/90 bg-white dark:bg-slate-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-4">
        <div class="flex md:items-center justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7">
              <AuhorIcon alt="micio86dev" />
            </span>
            <span class="dark:text-gray-200 text-sm">Made by{ " " }</span>
            <a
              class="text-secondary-700 hover:underline dark:text-gray-200 text-sm"
              target="_blank"
              href="https://micio86dev.it"
            >
              <strong>micio86dev</strong>
            </a>
          </div>
          <ul class="flex">
            { social.map(({ label, href, icon: Icon }) => (
              <li key={ label }>
                <a
                  class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2 inline-flex items-center"
                  aria-label={ label }
                  title={ label }
                  href={ href }
                  target="_blank"
                >
                  <Icon />
                </a>
              </li>
            )) }
          </ul>
        </div>
      </div>
    </footer>
  );
});
