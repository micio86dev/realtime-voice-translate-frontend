import { component$ } from "@builder.io/qwik";

interface LoadingProgressProps {
  percentage: Number;
}

export default component$((props: LoadingProgressProps) => (
  <div class="bg-gray-500 w-full h-10">
    <div class={ `bg-primary-500 text-white p-2 w-[${ props.percentage }%]` }>{ `${ props.percentage }%` }</div>
  </div>
));
