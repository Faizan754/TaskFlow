import { useState } from "react";
import AuthForm from "../../components/AuthForm";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    return supabase.auth
      .signUp({ email, password, options: { data: { username } } })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          navigate("/login");
        }
      })
      .catch((err) =>
        setError(`Something went wrong. Please try again! ${err}`),
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthForm
      onSubmit={handleSubmit}
      title="Create a new account"
      error={error}
      isLoading={isLoading}
      buttonText="Sign up"
      linkTo="/login"
      linkLabel="Login"
      linkText="Already have an account?"
      showUsername={true}
    />
  );
};

export default Signup;
