import {
  component$,
  useStore,
  $,
  useContext,
  getLocale,
  useSignal,
} from "@builder.io/qwik";
import Cookies from "js-cookie";
import { AuthContext } from "~/root";
import ajax from "~/utils/ajax";
import { SITE } from "~/config.mjs";
import InputText from "~/components/atoms/InputText";
import BButton from "~/components/atoms/BButton";
import { isOnline } from '~/utils/connection-status';

interface Credentials {
  form: {
    email: string;
    password: string;
  }
  errors: {
    email?: string;
    password?: string;
  }
  msg?: {
    class: string;
    text: string;
  };
}

export default component$(() => {
  const store = useStore<Credentials>({
    form: {
      email: "",
      password: "",
    },
    errors: {},
  });
  const loading = useSignal(false)
  const currentUser = useContext(AuthContext);
  const lang = getLocale();

  const login = $(() => {
    if (!isOnline()) {
      store.msg = {
        class: 'danger',
        text: $localize`You are offline`,
      }
      return;
    }

    loading.value = true;
    store.errors = {} // reset errors

    ajax.post('auth/login', store.form).then((result: any) => {
      Object.assign(currentUser, result);
      Cookies.set('token', result.authToken);
      store.msg = { class: 'success', text: `${ $localize`Welcome to` } ${ SITE.name }` };
      loading.value = false;
      window.location.href = `/${ lang }/login`;
    }).catch((err: any) => {
      store.msg = { class: 'danger', text: err.msg };
      store.errors = err.errors;
      loading.value = false;
    });
  });

  return (
    <form
      class="login"
      method="post"
      preventdefault:submit
      onSubmit$={ login }
    >
      <div class="flex flex-col gap-4">
        <InputText
          name="email"
          type="email"
          label={ $localize`E-Mail` }
          placeholder={ $localize`Insert your E-Mail address` }
          value={ store.form.email }
          required={ true }
          on-input={ $((ev: any) => (store.form.email = ev.target.value)) }
        />
        <InputText
          name="password"
          type="password"
          label={ $localize`Password` }
          placeholder={ $localize`Insert your password` }
          value={ store.form.password }
          required={ true }
          on-input={ $((ev: any) => (store.form.password = ev.target.value)) }
        />
      </div>
      <div class="actions">
        <BButton type="submit" class="primary w-full" loading={ loading.value }>{ $localize`Login` }</BButton>
      </div>

      { store.msg?.text && <p class={ `notification is-${ store.msg.class }` }>{ store.msg.text }</p> }
    </form>
  );
});
