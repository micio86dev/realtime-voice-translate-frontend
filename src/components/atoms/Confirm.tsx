import { Slot, component$ } from "@builder.io/qwik";

interface ConfirmProps {
  confirm: any;
  cancel: any;
}

export default component$((props: ConfirmProps) => (
  <div class="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
    <p class="pb-2 text-sm">
      <Slot />
    </p>
    <div class="actions">
      <button type="button" class="is-secondary" onClick$={ props.cancel }>
        { $localize`No` }
      </button>
      <button type="button" class="is-primary" onClick$={ props.confirm }>
        { $localize`Yes` }
      </button>
    </div>
  </div>
));
