const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className ?? "size-[34px]"}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tf-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19d3f5" />
          <stop offset=".55" stopColor="#1a6bff" />
          <stop offset="1" stopColor="#4b2ae8" />
        </linearGradient>
      </defs>
      <rect
        x="3.5"
        y="3.5"
        width="41"
        height="41"
        rx="13"
        fill="none"
        stroke="url(#tf-logo-grad)"
        strokeWidth="5"
      />
      <rect
        x="12"
        y="11"
        width="20"
        height="25"
        rx="4"
        style={{ fill: "var(--logo-doc)" }}
      />
      <circle cx="17" cy="17" r="2.3" fill="#1a6bff" />
      <circle cx="17" cy="23.5" r="2.3" fill="#1a6bff" />
      <circle cx="17" cy="30" r="2.3" fill="#ff3347" />
      <rect
        x="21.5"
        y="15.8"
        width="7"
        height="2.4"
        rx="1.2"
        style={{ fill: "var(--logo-line)" }}
      />
      <rect
        x="21.5"
        y="22.3"
        width="7"
        height="2.4"
        rx="1.2"
        style={{ fill: "var(--logo-line)" }}
      />
      <path
        d="M25 32l5 5 12-14"
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: "var(--surface)" }}
      />
      <path
        d="M25 32l5 5 12-14"
        fill="none"
        stroke="url(#tf-logo-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
