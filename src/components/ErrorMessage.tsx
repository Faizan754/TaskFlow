import { Link } from "react-router";

interface Props {
  link: string;
  linkText: string;
  content: string;
}

const ErrorMessage = ({ link, linkText, content }: Props) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <span className="block sm:inline">{content}</span>
      <strong className="font-bold">
        <Link to={`/${link}`}>{linkText}</Link>
      </strong>
    </div>
  );
};

export default ErrorMessage;
