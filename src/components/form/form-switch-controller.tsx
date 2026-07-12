import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useId } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";

interface FormSwitchControllerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: React.ReactNode;
  className?: string;
  classNameLabel?: string;
  classNameDiv?: string;
}

const FormSwitchController = <T extends FieldValues>({
  form,
  name,
  label,
  className,
  classNameLabel,
  classNameDiv,
}: FormSwitchControllerProps<T>) => {
  const id = useId();
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        const isError = !!error;

        const errorId = isError ? `${id}-error` : undefined;

        return (
          <div className={cn(["flex flex-col flex-1", className])}>
            <div
              className={cn([
                "flex items-center gap-2 md:gap-4",
                isError ? "mb-2" : "",
                classNameDiv,
              ])}
            >
              {label && (
                <Label htmlFor={id} className={cn([classNameLabel])}>
                  {label}
                </Label>
              )}
              <Switch
                id={id}
                name={field.name}
                checked={field.value}
                onCheckedChange={(check) => field.onChange(check)}
              />
            </div>
            {isError && (
              <p id={errorId} className="text-xs text-destructive mt-1">
                {String(error.message)}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormSwitchController;
