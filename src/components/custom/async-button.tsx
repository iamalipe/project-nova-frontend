import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import { useState } from "react";

function isPromise(value: any) {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

/**
 * Shared state/behavior for buttons that show a spinner and disable
 * themselves while an async `onClick` handler is in flight.
 *
 * Centralizes the "loading" logic so `AsyncButton`, `AsyncIconButton`,
 * and `AsyncRefreshButton` only need to differ in visual presentation.
 */
function useAsyncButtonState({
  onClick,
  loading,
}: {
  onClick: ButtonProps["onClick"];
  loading?: boolean;
}) {
  const [isHandlingClick, setHandlingClick] = useState(false);

  const isLoading = loading === undefined ? isHandlingClick : loading;

  const handleClick: ButtonProps["onClick"] = async (...args) => {
    if (typeof onClick === "function" && !isHandlingClick) {
      const returnValue = onClick(...args);
      if (isPromise(returnValue)) {
        try {
          setHandlingClick(true);
          await returnValue;
          setHandlingClick(false);
        } catch (e) {
          setHandlingClick(false);
          throw e;
        }
      }
    }
  };

  return { isLoading, handleClick };
}

type AsyncButtonProps = ButtonProps & {
  loading?: boolean;
  loadingText?: string;
};
export function AsyncButton({
  onClick,
  loading,
  disabled,
  children,
  loadingText = "Loading...",
  ...restProps
}: AsyncButtonProps) {
  const { isLoading, handleClick } = useAsyncButtonState({ onClick, loading });

  return (
    <Button {...restProps} disabled={disabled || isLoading} onClick={handleClick}>
      {isLoading ? (
        <>
          <LoaderCircle className="animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}

type AsyncIconButtonProps = ButtonProps & {
  loading?: boolean;
  loadingIcon?: React.ReactNode;
};
export function AsyncIconButton({
  onClick,
  loading,
  disabled,
  children,
  loadingIcon = <LoaderCircle className="animate-spin" />,
  ...restProps
}: AsyncIconButtonProps) {
  const { isLoading, handleClick } = useAsyncButtonState({ onClick, loading });

  return (
    <Button
      size="icon"
      {...restProps}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading ? <>{loadingIcon}</> : children}
    </Button>
  );
}

type AsyncRefreshButtonProps = ButtonProps & {
  loading?: boolean;
};
export function AsyncRefreshButton({
  onClick,
  loading,
  disabled,
  ...restProps
}: AsyncRefreshButtonProps) {
  const { isLoading, handleClick } = useAsyncButtonState({ onClick, loading });

  return (
    <Button
      size="icon"
      {...restProps}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      <RefreshCcw className={cn([isLoading ? "animate-spin" : ""])} />
    </Button>
  );
}
