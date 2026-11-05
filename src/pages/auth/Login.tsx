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
      title="Welcome back"
      error={error}
      isLoading={isLoading}
      buttonText="Log in"
      linkText="New to TaskFlow?"
      linkLabel="Create an account"
      linkTo="/signup"
      showUsername={false}
      forgotPasswordTo="/forgot-password"
    />
  );
};

export default Login;
