interface Props {
  size: number;
}

export function ArrowUpIcon({ size = 24 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      height={size}
      width={size}
    >
      <path
        fill="currentColor"
        d="M452-244v-400L282-477l-42-43 241-241 241 241-42 42-168-168v402h-60Z"
      />
    </svg>
  );
}
