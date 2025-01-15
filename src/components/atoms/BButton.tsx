import { component$, Slot } from "@builder.io/qwik";
import { IconSpinner } from "../icons/IconSpinner";

interface BButtonProps {
  class?: string;
  type: "button" | "reset" | "submit" | undefined;
  loading?: boolean;
  disabled?: boolean;
  'on-click'?: any;
}

export default component$((props: BButtonProps) => (
  <button
    type={ props.type ?? 'button' }
    class={ `${ props.class ? `is-${ props.class }` : '' }` }
    disabled={ props.disabled || props.loading }
    onClick$={ props.type == 'button' ? props['on-click'] : undefined }>
    { props.loading && <><IconSpinner />&nbsp;</> }
    <Slot />
  </button>
));