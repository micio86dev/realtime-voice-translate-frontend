import { component$, useStore, $, useSignal, useContext } from "@builder.io/qwik";
import ajax from "~/utils/ajax";
import { AuthContext } from "~/root";
import InputText from "~/components/atoms/InputText";
import BButton from "~/components/atoms/BButton";

interface AuthStore {
  id?: string;
  email: string;
  name: string;
  surname: string;
  roleId: string;
  authToken?: string;
  password?: string;
  repeatPassword?: string;
}

interface Credentials {
  form: AuthStore;
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
  const currentUser = useContext(AuthContext);

  const store = useStore<Credentials>({
    form: currentUser,
    errors: {},
  });
  const loading = useSignal(false);

  const save = $(() => {
    store.errors = {} // reset errors

    if (store.form.password !== store.form.repeatPassword) {
      store.msg = { class: 'danger', text: $localize`Passwords don't match` };
      return;
    }

    if (!store.form.id) {
      return;
    }

    loading.value = true;

    ajax.put('users', store.form.id, store.form).then(() => {
      store.msg = { class: 'success', text: $localize`Profile updated correctly` };
      loading.value = false;
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
      onSubmit$={ save }
    >
      <div class="flex flex-col gap-4">
        <InputText
          name="name"
          type="text"
          label={ $localize`First name` }
          placeholder={ $localize`Insert your first name` }
          value={ store.form.name }
          required={ true }
          on-input={ $((ev: any) => (store.form.name = ev.target.value)) }
        />
        <InputText
          name="surname"
          type="text"
          label={ $localize`Last name` }
          placeholder={ $localize`Insert your last name` }
          value={ store.form.surname }
          required={ true }
          on-input={ $((ev: any) => (store.form.surname = ev.target.value)) }
        />
        <InputText
          name="email"
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
          placeholder={ $localize`Insert a secure password` }
          value={ store.form.password }
          required={ false }
          on-input={ $((ev: any) => (store.form.password = ev.target.value)) }
        />
        <InputText
          name="repeatPassword"
          type="password"
          label={ $localize`Repeat Password` }
          placeholder={ $localize`Repeat your secure password` }
          value={ store.form.repeatPassword }
          required={ false }
          on-input={ $((ev: any) => (store.form.repeatPassword = ev.target.value)) }
        />
      </div>
      <div class="actions">
        <BButton type="submit" class="primary w-full" loading={ loading.value }>{ $localize`Update profile` }</BButton>
      </div>
      { store.msg && <p class={ `notification is-${ store.msg.class }` }>{ store.msg.text }</p> }
    </form>
  );
});
