import { component$ } from "@builder.io/qwik";
import type { InputSelectProps } from "~/types";

export default component$((props: InputSelectProps) => {
  return (
    <div class="field">
      {props.label && props.name && (
        <label for={props.name}>{props.label}</label>
      )}
      <select
        class={`${props.class ?? ""}`}
        name={props.name}
        required={props.required}
        autocomplete="new-password"
        onInput$={props.onInput}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {props.options?.map((option: any) => (
          <option
            key={option.id}
            value={option.id}
            selected={props.selected === option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
});
