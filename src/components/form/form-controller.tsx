import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId } from "react";
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type UseFormReturn,
  type UseFormStateReturn,
} from "react-hook-form";

interface FormControllerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: React.ReactNode;
  className?: string;
  classNameLabel?: string;
  maxLength?: number;
  render: ({
    field,
    fieldState,
    formState,
    isError,
    ariaDescribedby,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
    isError: boolean;
    ariaDescribedby: string | undefined;
  }) => React.ReactElement;
}

const FormController = <T extends FieldValues>({
  form,
  name,
  label,
  render,
  className,
  classNameLabel,
  maxLength,
}: FormControllerProps<T>) => {
  const id = useId();
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const error = fieldState.error;
        const isError = !!error;

        const errorId = isError ? `${id}-error` : undefined;
        const descriptionId = errorId;

        const isStringValue = typeof field.value === "string";
        const valueLength = isStringValue ? field.value.length : undefined;
        const shouldShowCounter = !!maxLength && isStringValue;
        const shouldShowBottomSection = isError || shouldShowCounter;

        return (
          <div className={cn(["flex flex-col flex-1", className])}>
            {label && (
              <Label
                htmlFor={id}
                className={cn(["text-left mb-2", classNameLabel])}
              >
                {label}
              </Label>
            )}

            {/* Render the actual input component */}
            {render({
              field,
              fieldState,
              formState,
              isError,
              ariaDescribedby: descriptionId,
            })}
            {shouldShowBottomSection && (
              <div className="flex justify-between mt-1 min-h-[16px]">
                {isError && (
                  <p id={errorId} className="text-xs text-destructive">
                    {String(error.message)}
                  </p>
                )}
                {shouldShowCounter && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {valueLength}/{maxLength}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormController;
