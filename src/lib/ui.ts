// Shared presentational class strings (complete literals, no interpolation).
// Button composition: btnBase has NO sizing/radius/gap/text-size utilities.
// Combine btnBase + exactly one size (btnMd | btnSm | btnLg | btnIcon |
// btnIconSm) + one variant, so no final className contains conflicting
// utilities, e.g. `${btnBase} ${btnMd} ${btnPrimary}`.

export const btnBase =
  "inline-flex items-center justify-center font-semibold whitespace-nowrap cursor-pointer transition-[background-color,border-color,box-shadow,transform] duration-150 active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const btnMd = "h-10 gap-2 rounded-[10px] px-4 text-sm max-md:h-11";
export const btnSm = "h-8 gap-1.5 rounded-lg px-3 text-[13px] max-md:h-11";
export const btnLg = "h-12 gap-2 rounded-xl px-[22px] text-[15px] max-md:h-12";
export const btnIcon = "size-10 rounded-[10px] text-sm max-md:size-11";
export const btnIconSm = "size-8 rounded-lg text-sm max-md:size-11";

export const btnPrimary =
  "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active";
export const btnSecondary =
  "border border-border-strong bg-surface text-fg shadow-sm hover:bg-surface-sunken active:bg-border";
export const btnGhost =
  "text-muted hover:bg-surface-sunken hover:text-fg active:bg-border";
export const btnDanger = "bg-danger text-on-danger hover:bg-danger-hover";
export const btnGhostDanger = "text-danger-text hover:bg-danger-soft";
export const btnBrand =
  "bg-linear-135 from-[#1a6bff] to-[#4b2ae8] text-white shadow-[0_8px_20px_-8px_rgba(26,107,255,.7)] hover:from-[#0f56e0] hover:to-[#3a1fd0]";

export const label = "block text-[13px] leading-[18px] font-semibold text-fg";
export const hint = "text-xs text-muted";

export const input =
  "block h-10 w-full rounded-[10px] border border-border-strong bg-surface px-3 text-sm text-fg placeholder:text-placeholder transition-colors hover:border-muted focus:border-focus focus:outline-2 focus:outline-offset-1 focus:outline-focus disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted max-md:h-11 max-md:text-base motion-reduce:transition-none";
export const textarea =
  "block min-h-24 w-full resize-y rounded-[10px] border border-border-strong bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-placeholder transition-colors hover:border-muted focus:border-focus focus:outline-2 focus:outline-offset-1 focus:outline-focus disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted max-md:text-base motion-reduce:transition-none";

export const fieldError =
  "flex items-center gap-1.5 text-[13px] leading-[18px] font-medium text-danger-text";
export const alertDanger =
  "flex items-start gap-2.5 rounded-xl bg-danger-soft px-3.5 py-3 text-sm text-danger-text";

export const menuItem =
  "flex h-[38px] w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm font-medium text-fg cursor-pointer data-focus:bg-surface-sunken data-focus:outline-none max-md:h-11";

export const inputWithIcon =
  "block h-10 w-full rounded-[10px] border border-border-strong bg-surface pl-[38px] pr-3 text-sm text-fg placeholder:text-placeholder transition-colors hover:border-muted focus:border-focus focus:outline-2 focus:outline-offset-1 focus:outline-focus disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted max-md:h-11 max-md:text-base motion-reduce:transition-none";
export const inputIcon =
  "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted";

export const authCard =
  "flex w-full max-w-[440px] flex-col gap-6 rounded-[20px] border border-border bg-surface px-8 py-9 shadow-md max-md:px-5 max-md:py-7";
export const iconTile =
  "grid size-14 place-content-center rounded-2xl bg-primary-soft text-primary-text";
export const iconTileSuccess =
  "grid size-14 place-content-center rounded-2xl bg-success-soft text-success";
export const iconTileDanger =
  "grid size-14 place-content-center rounded-2xl bg-danger-soft text-danger-text";
export const alertInfo =
  "flex items-start gap-2.5 rounded-xl bg-surface-sunken px-3.5 py-3 text-sm text-muted";
export const textLink =
  "rounded-sm font-semibold text-primary-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
export const authHeading =
  "font-display text-2xl leading-8 font-semibold tracking-tight text-fg max-md:text-[21px] max-md:leading-7";
// Fills the space below the navbar and centers the auth card in it.
export const authPage =
  "flex flex-1 items-center justify-center px-4 py-10 max-md:py-6";
