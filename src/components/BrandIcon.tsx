interface BrandIconProps {
  className?: string;
  size?: number;
}

export default function BrandIcon({ className, size = 36 }: BrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <rect width="512" height="512" rx="112" fill="#059669" />
      <rect x="120" y="80" width="272" height="352" rx="32" fill="#047857" />
      <rect x="120" y="80" width="56" height="352" rx="32" fill="#065f46" />
      <rect x="196" y="128" width="168" height="24" rx="8" fill="#10b981" fillOpacity="0.45" />
      <path
        fill="#ffffff"
        d="M256 196c-52 0-88 44-88 96 0 68 72 116 88 132 16-16 88-64 88-132 0-52-36-96-88-96zm0 36c28.8 0 52 23.2 52 52 0 32.8-36.4 62.4-52 76.8-15.6-14.4-52-44-52-76.8 0-28.8 23.2-52 52-52z"
      />
      <path
        fill="#ffffff"
        fillOpacity="0.92"
        d="M256 232c-18.4 15.2-32 34.4-32 56 0 24 16 44.8 32 58.4 16-13.6 32-34.4 32-58.4 0-21.6-13.6-40.8-32-56z"
      />
    </svg>
  );
}
