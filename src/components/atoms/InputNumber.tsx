import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { InputTextProps } from "~/types";
import { IconPlusCircle } from "../icons/IconPlusCircle";
import { IconMinusCircle } from "../icons/IconMinusCircle";

export default component$((props: InputTextProps) => {
  const value = useSignal(props.value ?? 0 as number);

  const setValue = $(() => {
    const fn = props['on-input'];
    if (fn) {
      fn({ target: { value: value.value } });
    }
  });

  const prev = $(() => {
    if (typeof props.min === 'undefined' || value.value > props.min) {
      value.value = Number(value.value) - (props.step ?? 1);
      setValue();
    }
  });

  const next = $(() => {
    if (typeof props.max === 'undefined' || value.value < props.max) {
      value.value = Number(value.value) + (props.step ?? 1);
      setValue();
    }
  });

  useTask$(({ track }) => {
    track(() => props.value);
    value.value = props.value ?? 0;
  });

  return (
    <div class="field">
      { props.label && props.name && <label for={ props.id ?? props.name }>{ props.label }</label> }
      <div class="flex gap-1 pt-3">
        <button type="button" class={ `is-primary ${ props.bClass ?? '' }` } onClick$={ prev } disabled={ props.disabled }>
          <IconMinusCircle />
        </button>
        <input
          id={ props.id ?? props.name }
          class={ `text-center ${ props.class ?? '' }` }
          type="number"
          name={ props.name }
          step={ props.step ?? 1 }
          min={ props.min }
          max={ props.max }
          placeholder={ props.placeholder }
          value={ value.value }
          required={ props.required }
          disabled={ props.disabled }
          autoComplete="new-password"
          onInput$={ props["on-input"] }
        />
        <button type="button" class={ `is-primary ${ props.bClass ?? '' }` } onClick$={ next } disabled={ props.disabled }>
          <IconPlusCircle />
        </button>
      </div>
    </div>)
});
