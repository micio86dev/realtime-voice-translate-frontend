import { component$ } from "@builder.io/qwik";
import type { InputTextProps } from "~/types";

export default component$((props: InputTextProps) => (
  <div class="field">
    {props.label && props.name && (
      <div class="flex justify-between mb-1">
        <label for={props.name}>{props.label}</label>
        <span class="text-sm font-medium appearance-none outline-none dark:text-white">
          {props.value ?? 0}%
        </span>
      </div>
    )}
    <input
      class={props.class}
      style={{ "background-size": `${props.value ?? 0}% 100%` }}
      type="range"
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      required={props.required}
      onInput$={props["on-input"]}
    />
  </div>
));
