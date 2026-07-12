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
  const [isHandlingClick, setHandlingClick] = useState(false);

  const isLoading = loading === undefined ? isHandlingClick : loading;
  return (
    <Button
      {...restProps}
      disabled={disabled || isLoading}
      onClick={async (...args) => {
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
      }}
    >
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
  const [isHandlingClick, setHandlingClick] = useState(false);

  const isLoading = loading === undefined ? isHandlingClick : loading;
  return (
    <Button
      size="icon"
      {...restProps}
      disabled={disabled || isLoading}
      onClick={async (...args) => {
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
      }}
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
  const [isHandlingClick, setHandlingClick] = useState(false);

  const isLoading = loading === undefined ? isHandlingClick : loading;
  return (
    <Button
      size="icon"
      {...restProps}
      disabled={disabled || isLoading}
      onClick={async (...args) => {
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
      }}
    >
      <RefreshCcw className={cn([isLoading ? "animate-spin" : ""])} />
    </Button>
  );
}
