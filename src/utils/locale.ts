import { getLocale } from "@builder.io/qwik";

export const getFullLocale = () => {
  const lang = getLocale(); // Example: 'it'
  const locale = new Intl.Locale(lang, { region: lang.toUpperCase() }); // Adds 'IT'

  return locale.toString(); // Returns 'it-IT'
};
