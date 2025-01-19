import { component$ } from "@builder.io/qwik";
import type { InputTextProps } from "~/types";

export default component$((props: InputTextProps) => {

  return (
    <div class="field">
      { props.label && props.name && <label for={ props.name }>{ props.label }</label> }
      <input
        class={ `${ props.class ?? '' }` }
        name={ props.name }
        type={ props.type ?? 'text' }
        placeholder={ props.placeholder }
        required={ props.required }
        min={ props.min }
        max={ props.max }
        value={ props.value }
        step={ props.step }
        onInput$={ props.onInput }
      />
    </div>
  );
});
