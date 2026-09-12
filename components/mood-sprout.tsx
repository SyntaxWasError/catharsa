type MoodSproutProps = {
  level: number;
  className?: string;
  label?: string;
};

/**
 * Catharsa's five mood marks. The soft seedling silhouette and calm line work
 * mirror the supplied reference while keeping every state crisp at any size.
 */
export function MoodSprout({ level, className = '', label }: MoodSproutProps) {
  const mood = Math.min(5, Math.max(1, Math.round(level)));
  const accessibility = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true as const };

  return (
    <svg
      {...accessibility}
      viewBox="0 0 96 88"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 26V16"
        stroke="#526B63"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M47.5 17C39.5 17 34 12.5 33 6c7.8-.5 13.5 2.8 14.5 11Z"
        fill="#A3B18A"
        stroke="#526B63"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M49 16.5C50.5 8.8 56.2 4.8 64 5c-.4 7.3-6.3 12-15 11.5Z"
        fill="#B9C69F"
        stroke="#526B63"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M16 59.5C16 38.5 29.6 25 48 25s32 13.5 32 34.5C80 72 68.7 79 48 79s-32-7-32-19.5Z"
        fill="#F5F3E9"
        stroke="#526B63"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="61" r="5" fill="#D7DFC4" opacity=".9" />
      <circle cx="67" cy="61" r="5" fill="#D7DFC4" opacity=".9" />

      {mood === 1 && (
        <>
          <path
            d="M29 50l5-3.5M62 46.5l5 3.5"
            stroke="#526B63"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M31 55c2-2 4-2 6 0M59 55c2-2 4-2 6 0"
            stroke="#526B63"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M41 66c3-5 11-5 14 0"
            stroke="#526B63"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M31 58c-4 5-4 9-.2 10.5 3.8-1.5 4-5.5.2-10.5ZM65 58c-4 5-4 9-.2 10.5 3.8-1.5 4-5.5.2-10.5Z"
            fill="#79A7A1"
          />
        </>
      )}
      {mood === 2 && (
        <>
          <path
            d="M31 53c2.3-2 4.7-2 7 0M58 53c2.3-2 4.7-2 7 0"
            stroke="#526B63"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M41 66c3.2-4 10.8-4 14 0"
            stroke="#526B63"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </>
      )}
      {mood === 3 && (
        <>
          <circle cx="34" cy="54" r="3.2" fill="#526B63" />
          <circle cx="62" cy="54" r="3.2" fill="#526B63" />
          <path
            d="M43 64h10"
            stroke="#526B63"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </>
      )}
      {mood === 4 && (
        <>
          <path
            d="M30 55c1-4 7-4 8 0M58 55c1-4 7-4 8 0"
            stroke="#526B63"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M40 62c4 6 12 6 16 0"
            stroke="#526B63"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M71 35l4-5M77 42l6-2"
            stroke="#526B63"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      )}
      {mood === 5 && (
        <>
          <path
            d="M29 54c1.4-4 7.6-4 9 0M58 54c1.4-4 7.6-4 9 0"
            stroke="#526B63"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M39 61c4.7 9 13.3 9 18 0Z"
            fill="#526B63"
            stroke="#526B63"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M25 39l-4-5M71 39l4-5M78 47l6-1"
            stroke="#526B63"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
