interface ItemProps {
  class?: string;
}

export const IconSpinner = (props: ItemProps) => {
  const { class: className } = props;
  return <div class={`loader ${className || ""}`}></div>;
};
