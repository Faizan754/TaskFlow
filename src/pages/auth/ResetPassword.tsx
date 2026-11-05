import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import { CircleAlert, LoaderCircle, Lock, TriangleAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import Loading from "../../components/Loading";
import {
  alertDanger,
  authCard,
  authHeading,
  authPage,
  btnBase,
  btnLg,
  btnPrimary,
  hint,
  iconTileDanger,
  inputIcon,
  inputWithIcon,
  label,
} from "../../lib/ui";

const MIN_LENGTH = 6;

const ResetPassword = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className={authPage}>
        <div className={authCard}>
          <div className={iconTileDanger}>
            <TriangleAlert aria-hidden="true" className="size-6" />
          </div>
          <div>
            <h1 className={authHeading}>
              This link is invalid or has expired
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Reset links work once and only for a limited time. Request a
              fresh one and we'll email it right away.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className={`${btnBase} ${btnLg} ${btnPrimary} w-full`}
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    if (password.length < MIN_LENGTH) {
      setError(`Password must be at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) throw updateError;
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update your password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={authPage}>
      <div className={authCard}>
        <div>
          <h1 className={authHeading}>
            Set a new password
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Choose a password you haven't used here before.
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
            <label htmlFor="password" className={label}>
              New password
            </label>
            <div className="relative">
              <Lock aria-hidden="true" className={inputIcon} />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-describedby="password-hint"
                className={inputWithIcon}
              />
            </div>
            <p id="password-hint" className={hint}>
              At least {MIN_LENGTH} characters.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className={label}>
              Confirm password
            </label>
            <div className="relative">
              <Lock aria-hidden="true" className={inputIcon} />
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className={inputWithIcon}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${btnBase} ${btnLg} ${btnPrimary} w-full`}
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
