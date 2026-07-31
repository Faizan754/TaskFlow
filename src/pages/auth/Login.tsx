import { useState } from "react";
import AuthForm from "../../components/AuthForm";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (_username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    return supabase.auth
      .signInWithPassword({ email, password })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          navigate("/dashboard");
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
      title="Login to your account"
      error={error}
      isLoading={isLoading}
      buttonText="Login"
      linkText="Dont have an account yet?"
      linkLabel="Sign up"
      linkTo="/signup"
      showUsername={false}
    />
  );
};

export default Login;
