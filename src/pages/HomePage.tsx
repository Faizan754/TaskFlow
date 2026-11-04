import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Boards and columns",
    text: "Organize work into boards with columns you can add, rename and delete.",
  },
  {
    title: "Drag and drop",
    text: "Move cards between columns and the order is saved automatically.",
  },
  {
    title: "AI subtasks",
    text: "Break any card into a checklist of subtasks with one click.",
  },
];

const HomePage = () => {
  const { user, loading } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Plan your work on a simple Kanban board
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
        TaskFlow keeps your tasks in columns you control, with drag and drop,
        subtasks and AI suggestions.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        {loading ? null : user ? (
          <Link
            to="/dashboard"
            className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Go to your boards
          </Link>
        ) : (
          <>
            <Link
              to="/signup"
              className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Log in
            </Link>
          </>
        )}
      </div>

      <ul className="mt-16 grid gap-6 text-left sm:grid-cols-3">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="rounded-lg border border-white/10 bg-white/5 p-5"
          >
            <h2 className="font-semibold text-white">{feature.title}</h2>
            <p className="mt-2 text-sm text-gray-300">{feature.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
