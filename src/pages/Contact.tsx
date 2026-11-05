import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Mail,
  MessageSquare,
} from "lucide-react";
import { sendContactMessage } from "../services/contactService";
import {
  alertDanger,
  btnBase,
  btnBrand,
  btnGhost,
  btnLg,
  btnMd,
  btnPrimary,
  iconTile,
  iconTileSuccess,
  input,
  label as labelClass,
  textareaTall,
} from "../lib/ui";

const MAX_NAME = 100;
const MAX_MESSAGE = 2000;

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot("");
    setError(null);
    setSent(false);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    // Simple bot trap: people never see this field, bots tend to fill it.
    if (honeypot) {
      setSent(true);
      return;
    }

    const trimmed = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await sendContactMessage(trimmed);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError("Couldn't send your message. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const intro = (
    <div className="flex flex-col items-start gap-4">
      <div className={iconTile}>
        <MessageSquare className="size-6" aria-hidden="true" />
      </div>
      <h1 className="font-display text-[36px] leading-[44px] font-bold tracking-tight text-fg max-md:text-[28px] max-md:leading-9">
        Get in touch
      </h1>
      <p className="max-w-[440px] text-lg leading-7 text-muted max-md:text-base">
        Found a bug, have an idea, or need a hand with your boards? Send a
        message and you'll get a reply by email.
      </p>
      <p className="flex items-center gap-2 text-sm text-muted">
        <Mail className="size-4" aria-hidden="true" />
        Replies go to the email you enter.
      </p>
    </div>
  );

  const pageGrid =
    "mx-auto grid w-full max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start gap-14 px-10 py-[72px] max-md:grid-cols-1 max-md:gap-8 max-md:px-4 max-md:py-10";
  const card =
    "rounded-[20px] border border-border bg-surface p-8 shadow-md max-md:p-5";

  if (sent) {
    return (
      <div className={pageGrid}>
        {intro}
        <div role="status" className={`${card} flex flex-col items-start gap-4`}>
          <div className={iconTileSuccess}>
            <CircleCheck className="size-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl leading-8 font-semibold tracking-tight text-fg">
            Thanks — your message is on its way
          </h2>
          <p className="text-[15px] leading-6 text-muted">
            {email.trim() ? (
              <>
                A reply will go to{" "}
                <b className="font-semibold text-fg">{email.trim()}</b>.
              </>
            ) : (
              "We'll reply by email."
            )}
          </p>
          <div className="flex gap-3 max-md:w-full max-md:flex-col">
            <Link to="/" className={`${btnBase} ${btnMd} ${btnPrimary}`}>
              Back to home
            </Link>
            <button
              type="button"
              onClick={reset}
              className={`${btnBase} ${btnMd} ${btnGhost}`}
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageGrid}>
      {intro}
      <div className={card}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          {error && (
            <div role="alert" className={alertDanger}>
              <CircleAlert
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              {error}
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_NAME}
                required
                className={input}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={input}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_MESSAGE}
              required
              className={textareaTall}
            />
            <p className="text-right text-xs text-muted">
              {message.length}/{MAX_MESSAGE}
            </p>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${btnBase} ${btnLg} ${btnBrand} self-start max-md:w-full`}
          >
            {isLoading ? (
              <LoaderCircle
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
            {isLoading ? "Sending…" : "Send message"}
            {!isLoading && (
              <ArrowRight className="size-4" aria-hidden="true" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
