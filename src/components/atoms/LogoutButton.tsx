import { component$, $, useContext, getLocale } from "@builder.io/qwik";
import Cookies from "js-cookie";
import { AuthContext } from "~/root";

export default component$(() => {
  const currentUser = useContext(AuthContext);
  const lang = getLocale();

  const logout = $(() => {
    Object.assign(currentUser, null);

    Cookies.remove("token");

    window.location.href = `/${ lang }/login`;
  });

  return (
    <>
      { currentUser.authToken && (
        <button
          type="button"
          class="is-danger md:ml-4 md:static absolute bottom-4"
          onClick$={ logout }
        >
          { $localize`Logout` }
        </button>
      ) }
    </>
  );
});
