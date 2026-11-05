import { Link } from "react-router";
import { Compass } from "lucide-react";
import { btnBase, btnLg, btnPrimary } from "../lib/ui";

const miniColumn = "flex h-24 w-[72px] flex-col gap-2 rounded-2xl bg-surface-sunken p-2";
const miniCard = "h-[22px] rounded-md border border-border bg-surface-raised shadow-sm";

const NotFound = () => (
  <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center gap-[18px] px-10 pt-16 pb-20 text-center max-md:px-4">
    <div aria-hidden="true" className="flex items-start gap-3">
      <div className={miniColumn}>
        <div className={miniCard} />
        <div className={miniCard} />
      </div>
      <div className={miniColumn}>
        <div className="grid flex-1 place-content-center rounded-md border-2 border-dashed border-border-strong bg-transparent">
          <Compass className="size-6 text-primary-text" />
        </div>
      </div>
      <div className={miniColumn}>
        <div className={miniCard} />
      </div>
    </div>
    <p className="text-xs font-semibold tracking-[0.08em] text-primary-text uppercase">
      Error 404
    </p>
    <h1 className="font-display text-[36px] leading-[44px] font-bold tracking-tight text-fg max-md:text-[28px] max-md:leading-9">
      This card isn't on any board
    </h1>
    <p className="max-w-[420px] text-[15px] leading-6 text-muted">
      The page you're looking for doesn't exist or has moved. Check the link,
      or head back home.
    </p>
    <Link to="/" className={`${btnBase} ${btnLg} ${btnPrimary}`}>
      Back to home
    </Link>
  </div>
);

export default NotFound;
