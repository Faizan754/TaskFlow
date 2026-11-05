import { Link } from "react-router";
import {
  ArrowRight,
  ExternalLink,
  Move,
  Sparkles,
  SquareKanban,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  btnBase,
  btnLg,
  btnBrand,
  btnSecondary,
  iconTileMd,
  textLink,
} from "../lib/ui";

const features = [
  {
    title: "Boards & columns",
    text: "A board for every project. Start with To Do, In Progress and Done, then add, rename or remove columns to fit how you work.",
    icon: SquareKanban,
  },
  {
    title: "Drag, drop, done",
    text: "Move cards between and within columns. Priority badges and colored labels keep what matters visible.",
    icon: Move,
  },
  {
    title: "AI-suggested subtasks",
    text: "Stuck on a big card? Ask Gemini or Groq for subtasks, edit the list, and add only the ones you want.",
    icon: Sparkles,
  },
];

const miniCardBase =
  "flex flex-col gap-2 rounded-xl border bg-surface-raised p-2.5";
const miniCard = `${miniCardBase} border-border shadow-sm`;
const miniCardDragging = `${miniCardBase} border-primary shadow-drag`;
const miniTitle = "truncate text-xs leading-4 font-semibold text-fg";
const miniMeta = "flex min-w-0 items-center gap-1.5";
const miniBadge =
  "inline-flex h-[18px] shrink-0 items-center rounded-full px-1.5 text-[10px] font-semibold";
const miniColHead = "flex min-h-[26px] items-center gap-1.5 px-1 py-0.5";
const miniCount =
  "ml-auto grid h-[18px] min-w-[18px] place-content-center rounded-full bg-surface px-1 text-[11px] font-semibold text-muted";
const footLink = "inline-flex min-h-11 items-center gap-1 px-2 text-sm";

const HomePage = () => {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto grid w-full max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-14 px-10 py-[72px] max-md:grid-cols-1 max-md:gap-10 max-md:px-4 max-md:py-12">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex h-[30px] items-center gap-2 rounded-full border border-border bg-surface pr-3 pl-1.5 text-[13px] font-semibold text-muted">
            <span className="grid size-5 place-content-center rounded-full bg-primary-soft text-primary-text">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
            Kanban for your own work, with AI subtasks
          </span>
          <h1 className="font-display text-[56px] leading-[64px] font-bold tracking-[-0.035em] text-fg max-md:text-[36px] max-md:leading-[44px]">
            Plan it. Move it.
            <br />
            <span className="text-primary-text">Get it done.</span>
          </h1>
          <p className="max-w-[500px] text-lg leading-7 text-muted max-md:text-base max-md:leading-[26px]">
            TaskFlow is a focused task board for one. Create boards, organize
            work into columns of cards, drag them forward as you go — and let
            AI break big tasks into small steps.
          </p>

          <div className="flex gap-3 max-md:w-full max-md:flex-col">
            {loading ? null : user ? (
              <Link
                to="/dashboard"
                className={`${btnBase} ${btnLg} ${btnBrand} max-md:w-full`}
              >
                Go to your boards
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className={`${btnBase} ${btnLg} ${btnBrand} max-md:w-full`}
                >
                  Get started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/login"
                  className={`${btnBase} ${btnLg} ${btnSecondary} max-md:w-full`}
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative min-w-0 rounded-3xl border border-border bg-surface p-3.5 shadow-lg"
        >
          <div className="flex items-center gap-1.5 px-1 pb-3">
            <span className="size-2.5 rounded-full bg-[var(--sw-red)]" />
            <span className="size-2.5 rounded-full bg-[var(--sw-yellow)]" />
            <span className="size-2.5 rounded-full bg-[var(--sw-green)]" />
            <span className="ml-3 truncate font-display text-sm font-semibold text-fg">
              Website redesign
            </span>
            <span className="ml-auto inline-flex h-[22px] shrink-0 items-center rounded-full bg-[var(--l-gray-bg)] px-2 text-[11px] font-semibold text-[var(--l-gray-fg)]">
              3 columns
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-transparent bg-surface-sunken p-2">
              <div className={miniColHead}>
                <span className="size-2 shrink-0 rounded-full bg-[var(--sw-gray)]" />
                <span className="truncate text-xs font-semibold text-fg">
                  To Do
                </span>
                <span className={miniCount}>2</span>
              </div>
              <div className={miniCard}>
                <span className={miniTitle}>Write landing page copy</span>
                <span className={miniMeta}>
                  <span
                    className={`${miniBadge} bg-[var(--p-med-bg)] text-[var(--p-med-fg)]`}
                  >
                    Medium
                  </span>
                  <span
                    className={`${miniBadge} bg-[var(--l-purple-bg)] text-[var(--l-purple-fg)]`}
                  >
                    Design
                  </span>
                </span>
              </div>
              <div className={miniCard}>
                <span className={miniTitle}>Review analytics</span>
                <span className={miniMeta}>
                  <span
                    className={`${miniBadge} bg-[var(--p-low-bg)] text-[var(--p-low-fg)]`}
                  >
                    Low
                  </span>
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-primary bg-col-over p-2">
              <div className={miniColHead}>
                <span className="size-2 shrink-0 rounded-full bg-[var(--sw-blue)]" />
                <span className="truncate text-xs font-semibold text-fg">
                  In Progress
                </span>
                <span className={miniCount}>1</span>
              </div>
              <div className={miniCard}>
                <span className={miniTitle}>Fix login redirect bug</span>
                <span className={miniMeta}>
                  <span
                    className={`${miniBadge} bg-[var(--p-high-bg)] text-[var(--p-high-fg)]`}
                  >
                    High
                  </span>
                  <span
                    className={`${miniBadge} bg-[var(--l-red-bg)] text-[var(--l-red-fg)]`}
                  >
                    Bug
                  </span>
                </span>
              </div>
              <div className="h-[54px] rounded-xl border-2 border-dashed border-primary bg-primary/10" />
            </div>
            <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-transparent bg-surface-sunken p-2">
              <div className={miniColHead}>
                <span className="size-2 shrink-0 rounded-full bg-[var(--sw-green)]" />
                <span className="truncate text-xs font-semibold text-fg">
                  Done
                </span>
                <span className={miniCount}>1</span>
              </div>
              <div className={miniCard}>
                <span className={miniTitle}>Pick color palette</span>
                <span className={miniMeta}>
                  <span
                    className={`${miniBadge} bg-[var(--l-green-bg)] text-[var(--l-green-fg)]`}
                  >
                    Feature
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div
            className={`${miniCardDragging} absolute top-[58%] left-[30%] w-[36%] rotate-3 motion-reduce:rotate-0`}
          >
            <span className={miniTitle}>Draft hero text</span>
            <span className={miniMeta}>
              <span
                className={`${miniBadge} bg-[var(--p-med-bg)] text-[var(--p-med-fg)]`}
              >
                Medium
              </span>
              <span
                className={`${miniBadge} bg-[var(--l-orange-bg)] text-[var(--l-orange-fg)]`}
              >
                Urgent
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-10 pb-24 max-md:px-4 max-md:pb-16">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.08em] text-primary-text uppercase">
            What you get
          </span>
          <h2 className="max-w-[620px] font-display text-[36px] leading-[44px] font-bold tracking-tight text-fg max-md:text-[28px] max-md:leading-9">
            Everything a personal board needs. Nothing it doesn't.
          </h2>
        </div>
        <ul className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:gap-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-7 shadow-sm"
            >
              <span className={iconTileMd}>
                <feature.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg leading-[26px] font-semibold tracking-tight text-fg">
                {feature.title}
              </h3>
              <p className="text-sm text-muted">{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1240px] flex-wrap items-center gap-4 px-10 max-md:px-4">
          <span className="font-display font-bold text-fg">TaskFlow</span>
          <span className="text-sm text-muted">
            © {new Date().getFullYear()} TaskFlow
          </span>
          <div className="ml-auto flex gap-1">
            <Link to="/contact" className={`${footLink} ${textLink}`}>
              Contact
            </Link>
            <a
              href="https://github.com/Faizan754/TaskFlow"
              target="_blank"
              rel="noopener noreferrer"
              className={`${footLink} ${textLink}`}
            >
              GitHub
              <ExternalLink className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
