import { component$, Slot } from "@builder.io/qwik";
import { IconSpinner } from "~/components/icons/IconSpinner";

interface BButtonProps {
  class?: string;
  iconLeft?: string;
  iconRight?: string;
  type: "button" | "reset" | "submit" | undefined;
  loading?: boolean;
  disabled?: boolean;
  onClick?: any;
}

export default component$((props: BButtonProps) => (
  <button
    type={props.type ?? "button"}
    class={`${props.class ? `is-${props.class}` : ""}`}
    disabled={props.disabled || props.loading}
    onClick$={props.type == "button" ? props.onClick : undefined}
  >
    {props.loading && (
      <>
        <IconSpinner />
        &nbsp;
      </>
    )}
    {props.iconLeft && (
      <>
        &nbsp;
        <i class={`icon ${props.iconLeft}`} />
      </>
    )}
    <Slot />
    {props.iconRight && (
      <>
        &nbsp;
        <i class={`icon ${props.iconRight}`} />
      </>
    )}
  </button>
));
