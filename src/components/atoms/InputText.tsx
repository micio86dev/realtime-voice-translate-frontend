import { component$ } from "@builder.io/qwik";
import type { InputTextProps } from "~/types";

export default component$((props: InputTextProps) => (
  <div class="field">
    { props.label && props.name && <label for={ props.id ?? props.name }>{ props.label }</label> }
    <input
      id={ props.id ?? props.name }
      class={ `peer ${ props.class ?? '' }` }
      type={ props.type ?? "text" }
      name={ props.name }
      step={ props.step ?? 1 }
      min={ props.min }
      max={ props.max }
      placeholder={ props.placeholder }
      value={ props.value }
      required={ props.required }
      autoComplete="new-password"
      onInput$={ props["on-input"] }
    />
  </div>
));
