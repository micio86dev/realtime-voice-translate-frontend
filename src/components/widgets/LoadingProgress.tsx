import { component$ } from "@builder.io/qwik";
import ProgressBar from "~/components/widgets/ProgressBar";

interface LoadingProgressProps {
  percentage: Number;
}

export default component$((props: LoadingProgressProps) => {

  return (
    <div class="fixed left-0 top-0 right-0 bottom-0 z-50 bg-slate-900 flex px-5 items-center justify-center">
      <ProgressBar percentage={ props.percentage } />
    </div>
  );
});
