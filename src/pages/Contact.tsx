import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { sendContactMessage } from "../services/contactService";

const MAX_NAME = 100;
const MAX_MESSAGE = 2000;

const inputClasses =
  "block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6";

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

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Message sent
        </h1>
        <p className="mt-4 text-sm text-gray-300">
          Thanks for getting in touch. I'll read your message soon.
        </p>
        <div className="mt-8 flex justify-center gap-6 text-sm font-semibold">
          <button
            type="button"
            onClick={reset}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Send another message
          </button>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center text-2xl font-bold tracking-tight text-white">
        Contact
      </h1>
      <p className="mt-2 text-center text-sm text-gray-400">
        Questions or feedback about TaskFlow? Send a message.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME}
              required
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Message
          </label>
          <div className="mt-2">
            <textarea
              id="message"
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_MESSAGE}
              required
              className={inputClasses}
            />
          </div>
          <p className="mt-1 text-right text-xs text-gray-500">
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

        {error && (
          <div className="text-center text-sm text-red-500">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
