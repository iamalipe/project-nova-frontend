import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const ErrorPage = (props: { error: Error }) => {
  useEffect(() => {
    console.error(props.error);
  }, [props.error]);

  return (
    <main className="flex-1 overflow-hidden flex flex-col p-2 md:p-4 gap-2 md:gap-4">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-xl mb-2">
          The page you're looking for doesn't exist or an unexpected error
          occurred.
        </p>
        {props.error?.message && (
          <p className="text-base mb-8 italic text-muted-foreground">
            {props.error.message}
          </p>
        )}
        {import.meta.env.DEV && props.error?.stack && (
          <pre className="mb-8 max-h-64 w-full max-w-2xl overflow-auto rounded-lg border bg-muted p-4 text-left text-xs text-muted-foreground">
            {props.error.stack}
          </pre>
        )}
        <Button nativeButton={false} render={<Link to="/" />}>
          Go back
        </Button>
      </div>
    </main>
  );
};

export default ErrorPage;
