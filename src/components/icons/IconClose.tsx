interface ItemProps {
  class?: string;
}

export const IconClose = (props: ItemProps) => {
  const { class: className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class={`icon icon-tabler icon-tabler-arrow-down-right ${
        className || "h-5 w-5"
      }`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="2" y1="2" x2="22" y2="22"></line>
      <line x1="2" y1="22" x2="22" y2="2"></line>
    </svg>
  );
};
