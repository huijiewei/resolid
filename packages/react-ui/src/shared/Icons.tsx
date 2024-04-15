export const AngleLeft = ({ size = "1em" }: { size?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
};

export const AngleRight = ({ size = "1em" }: { size?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
};
