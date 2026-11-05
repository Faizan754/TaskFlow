import { Link } from "react-router";
import { CircleAlert } from "lucide-react";
import { alertDanger } from "../lib/ui";

interface Props {
  link: string;
  linkText: string;
  content: string;
}

const ErrorMessage = ({ link, linkText, content }: Props) => {
  return (
    <div className={alertDanger} role="alert">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        <span>{content}</span>{" "}
        <strong className="font-semibold">
          <Link
            to={`/${link}`}
            className="rounded-sm underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {linkText}
          </Link>
        </strong>
      </span>
    </div>
  );
};

export default ErrorMessage;
