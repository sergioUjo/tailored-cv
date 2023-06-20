import React from "react";
import {
  type FieldError,
  type FieldErrors,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { type Profile } from "../utils/types";

export function TextArea(
  props: React.InputHTMLAttributes<HTMLTextAreaElement> & {
    register: UseFormRegisterReturn;
    errors: FieldErrors<Profile>;
    label: string;
  }
) {
  const { errors, label, register, ...rest } = props;
  const errorKeys = register.name.split(".");
  const error = errorKeys.reduce<FieldErrors<Profile> | undefined>(
    (previousValue, currentValue) =>
      previousValue && previousValue[currentValue as keyof Profile],
    errors
  ) as FieldError | undefined;
  return (
    <div className={"flex flex-col"}>
      <label
        className={error ? "text-red-500" : "text-back"}
        htmlFor={register.name}
      >
        {label}
      </label>
      <textarea
        className={
          "min-h-[200px] rounded-lg border p-2 px-4 py-2 text-base focus:outline-secondary-600 " +
          (error ? "border-red-500" : "border-gray-200")
        }
        {...props}
        {...rest}
        {...register}
        id={register.name}
      />
      {error && <p className={"text-sm text-red-500"}>{error.message}</p>}
    </div>
  );
}
