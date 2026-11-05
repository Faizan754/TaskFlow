import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  CircleAlert,
  Info,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import {
  alertDanger,
  alertInfo,
  authCard,
  authHeading,
  authPage,
  btnBase,
  btnBrand,
  btnGhost,
  btnLg,
  btnMd,
  btnSecondary,
  iconTile,
  iconTileSuccess,
  inputIcon,
  inputWithIcon,
  label,
} from "../../lib/ui";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmed,
        { redirectTo: `${window.location.origin}/reset-password` },
      );
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      console.error(err);
      setError(
        "Couldn't send the reset email. Please try again in a few minutes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={authPage}>
        <div className={authCard}>
          <div className={iconTileSuccess}>
            <Mail aria-hidden="true" className="size-6" />
          </div>
          <h1 className={authHeading}>
            Check your email
          </h1>
          <p className="text-sm text-muted">
            We sent a password reset link to{" "}
            <b className="font-semibold text-fg">{email.trim()}</b> if an
            account exists for it. Open it on this device to choose a new
            password.
          </p>
          <div className={alertInfo}>
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>Can't find it? Check your spam folder.</span>
          </div>
          <Link
            to="/login"
            className={`${btnBase} ${btnLg} ${btnSecondary} w-full`}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={authPage}>
      <div className={authCard}>
        <div className={iconTile}>
          <Lock aria-hidden="true" className="size-6" />
        </div>
        <div>
          <h1 className={authHeading}>
            Forgot your password?
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Enter the email you signed up with and we'll send you a link to
            reset it.
          </p>
        </div>
        {error && (
          <div role="alert" className={alertDanger}>
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={label}>
              Email
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className={inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputWithIcon}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${btnBase} ${btnLg} ${btnBrand} w-full`}
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
        <Link
          to="/login"
          className={`${btnBase} ${btnMd} ${btnGhost} self-center`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to log in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
