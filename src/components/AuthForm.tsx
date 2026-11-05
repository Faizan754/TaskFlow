import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { CircleAlert, LoaderCircle, Lock, Mail, User } from "lucide-react";
import {
  alertDanger,
  authCard,
  authHeading,
  authPage,
  btnBase,
  btnBrand,
  btnLg,
  btnPrimary,
  inputIcon,
  inputWithIcon,
  label,
  textLink,
} from "../lib/ui";

interface AuthFormProps {
  title: string;
  error: string | null;
  isLoading: boolean;
  buttonText: string;
  linkTo: string;
  linkLabel: string;
  linkText: string;
  showUsername: boolean;
  forgotPasswordTo?: string;
  onSubmit: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
}

const AuthForm = ({
  title,
  error,
  isLoading,
  buttonText,
  linkTo,
  linkLabel,
  linkText,
  showUsername,
  forgotPasswordTo,
  onSubmit,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(username, email, password);
  };

  return (
    <div className={authPage}>
      <div className={authCard}>
        <h1 className={authHeading}>
          {title}
        </h1>
        {error && (
          <div role="alert" className={alertDanger}>
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {showUsername && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className={label}>
                Username
              </label>
              <div className="relative">
                <User aria-hidden="true" className={inputIcon} />
                <input
                  type="text"
                  autoComplete="username"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={inputWithIcon}
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={label}>
              Email
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className={inputIcon} />
              <input
                type="email"
                autoComplete="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputWithIcon}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className={label}>
                Password
              </label>
              {forgotPasswordTo && (
                <Link
                  to={forgotPasswordTo}
                  className={`${textLink} text-[13px]`}
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock aria-hidden="true" className={inputIcon} />
              <input
                id="password"
                type="password"
                autoComplete={
                  showUsername ? "new-password" : "current-password"
                }
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputWithIcon}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={
              showUsername
                ? `${btnBase} ${btnLg} ${btnBrand} w-full`
                : `${btnBase} ${btnLg} ${btnPrimary} w-full`
            }
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
                {showUsername ? "Creating account…" : "Logging in…"}
              </>
            ) : (
              buttonText
            )}
          </button>
        </form>
        <p className="text-center text-sm text-muted">
          {linkText}{" "}
          <Link to={linkTo} className={textLink}>
            {linkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
