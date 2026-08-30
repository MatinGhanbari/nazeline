export default function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 60 18" width="60" height="18">
            <path
              d="M2 14 Q9 2 16 14 T30 14 T44 14 T58 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="brand__name">NazeLine</span>
      </div>
      <nav className="topnav" aria-label="منو">
        <a href="#stage">مجموعه</a>
        <a href="#details">جزئیات</a>
        <a href="#contact">تماس</a>
      </nav>
      <div className="topmeta">
        <span>F/W · ۲۰۲۶</span>
      </div>
    </header>
  );
}
