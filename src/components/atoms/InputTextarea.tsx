import { component$ } from "@builder.io/qwik";
import type { InputTextProps } from "~/types";

export default component$((props: InputTextProps) => (
  <div class="field">
    {props.label && props.name && <label for={props.name}>{props.label}</label>}
    <textarea
      class={props.class}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      required={props.required}
      onInput$={props["on-input"]}
    >
      {props.value}
    </textarea>
  </div>
));
