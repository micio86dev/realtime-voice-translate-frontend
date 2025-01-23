import { component$, Slot } from "@builder.io/qwik";
import Navbar from "~/components/widgets/Navbar";

export default component$(() => {
  return (
    <>
      <main>
        <Navbar />
        <Slot />
      </main>
    </>
  );
});
