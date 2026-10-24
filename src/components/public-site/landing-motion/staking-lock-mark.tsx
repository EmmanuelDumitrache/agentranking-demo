type Props = {
  readonly className?: string;
  readonly gradientId?: string;
};

/** Brushed lock for the staking feature — replaces the banking Visa on this product. */
export function StakingLockMark({ className, gradientId = "lm-lock-shackle" }: Props) {
  return (
    <div className={className} aria-hidden="true">
      <svg className="orbit__shackle" viewBox="0 0 132 118">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f2f3f6" />
            <stop offset="0.45" stopColor="#c3c4cb" />
            <stop offset="1" stopColor="#7f8088" />
          </linearGradient>
        </defs>
        <path
          d="M28 116 V52 a38 38 0 0 1 76 0 V116"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M25 112 V52 a41 41 0 0 1 25 -38"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="orbit__body">
        <span className="orbit__keyhole" />
      </div>
    </div>
  );
}
