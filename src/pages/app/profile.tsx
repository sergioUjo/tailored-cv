import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";
import { useAuth } from "@clerk/nextjs";
import {
  FieldError,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormRegisterReturn,
} from "react-hook-form";
import { HiTrash } from "@react-icons/all-files/hi/HiTrash";
import { Tab } from "@headlessui/react";

interface Inputs {
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  experiences: {
    title?: string;
    company?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  }[];
  educations: {
    title?: string;
    school?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  }[];
}
function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    register: UseFormRegisterReturn;
    errors: FieldErrors<Inputs>;
    label: string;
  }
) {
  const { errors, label, register, ...rest } = props;
  const errorKeys = register.name.split(".");
  const error = errorKeys.reduce<FieldErrors<Inputs> | undefined>(
    (previousValue, currentValue) =>
      previousValue && previousValue[currentValue as keyof Inputs],
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
      <input
        className={
          "rounded-lg border  p-2 px-4 py-2 text-base focus:outline-secondary-600 " +
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
function TextArea(
  props: React.InputHTMLAttributes<HTMLTextAreaElement> & {
    register: UseFormRegisterReturn;
    errors: FieldErrors<Inputs>;
    label: string;
  }
) {
  const { errors, label, register, ...rest } = props;
  const errorKeys = register.name.split(".");
  const error = errorKeys.reduce<FieldErrors<Inputs> | undefined>(
    (previousValue, currentValue) =>
      previousValue && previousValue[currentValue as keyof Inputs],
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
function Profile() {
  const auth = useAuth();

  const profile = api.profile.get.useQuery(auth.userId ?? "", {
    enabled: !!auth.userId,
  });
  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => profile.refetch(),
  });
  console.log(profile.data?.experiences);
  const {
    register,
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<Inputs>({
    values: {
      firstName: profile.data?.firstName ?? "",
      lastName: profile.data?.lastName ?? "",
      title: profile.data?.title ?? "",
      description: profile.data?.description ?? "",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      experiences:
        (profile.data?.experiences.map((experience) => ({
          ...experience,
          startDate: experience.startDate?.split("T")[0],
          endDate: experience.endDate?.split("T")[0],
        })) as any) ?? [],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      educations: (profile.data?.educations as any) ?? [],
    },
  });
  const experiences = useFieldArray({
    control,
    name: "experiences", // unique name for your Field Array
  });
  const educations = useFieldArray({
    control,
    name: "educations", // unique name for your Field Array
  });
  if (!auth.isLoaded || profile.isLoading) {
    return;
  }
  console.log(errors);
  return (
    <AppLayout>
      <h1 className={" mb-4 text-4xl font-bold text-primary-600"}>Profile</h1>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-lg bg-secondary-900/20 p-1">
          {["Base Information", "Experiences", "Education"].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                "w-full rounded-lg py-2 text-lg leading-5 " +
                (selected
                  ? "bg-white font-bold text-primary-600 shadow"
                  : "font-medium text-white hover:bg-white/[0.12] hover:text-white")
              }
            >
              <h2>{category}</h2>
            </Tab>
          ))}
        </Tab.List>
        <form
          onSubmit={handleSubmit((data) => {
            updateProfile.mutate({
              id: auth.userId ?? "",
              firstName: data.firstName,
              lastName: data.lastName,
              title: data.title,
              description: data.description,
              experiences: data.experiences,
              educations: data.educations,
            });
          })}
          className={
            "mt-4 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md"
          }
        >
          <Tab.Panels>
            <Tab.Panel>
              <div className={"flex flex-wrap gap-4"}>
                <Input
                  register={register("firstName", { required: true })}
                  placeholder={"John"}
                  label={"Name *"}
                  errors={errors}
                />
                <Input
                  errors={errors}
                  placeholder={"Doe"}
                  label={"Last Name *"}
                  register={register("lastName", { required: true })}
                />
                <Input
                  errors={errors}
                  label={"Title *"}
                  placeholder={"Software Engineer"}
                  register={register("title", { required: true })}
                />
              </div>
              <TextArea
                label={"Description *"}
                placeholder={"I am a software engineer..."}
                register={register("description", {
                  required:
                    "Please enter at least a 50 character long description.",
                  minLength: {
                    message:
                      "Please enter at least a 50 character long description.",
                    value: 50,
                  },
                })}
                errors={errors}
              />
            </Tab.Panel>
            <Tab.Panel>
              <>
                {experiences.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={
                      "relative flex flex-col gap-4 rounded-lg bg-gray-50 p-2"
                    }
                  >
                    <button
                      type="button"
                      aria-label={"Remove experience"}
                      className={"absolute right-0 top-0 p-2 text-red-600"}
                      onClick={() => experiences.remove(index)}
                    >
                      <HiTrash className={"h-6 w-6"} />
                    </button>

                    <div className={"flex flex-wrap gap-4"}>
                      <Input
                        register={register(`experiences.${index}.company`, {
                          required: true,
                        })}
                        errors={errors}
                        label={"Company *"}
                        type={"text"}
                      />
                      <Input
                        register={register(`experiences.${index}.title`, {
                          required: true,
                        })}
                        errors={errors}
                        label={"Title *"}
                        type={"text"}
                      />
                      <Input
                        register={register(`experiences.${index}.location`)}
                        errors={errors}
                        label={"Location"}
                        type={"text"}
                      />
                    </div>
                    <div className={"flex gap-2"}>
                      <Input
                        register={register(`experiences.${index}.startDate`, {
                          required: true,
                        })}
                        errors={errors}
                        label={"Start date * "}
                        type={"date"}
                      />
                      <Input
                        register={register(`experiences.${index}.endDate`)}
                        errors={errors}
                        label={"End date"}
                        type={"date"}
                      />
                    </div>
                    <TextArea
                      register={register(`experiences.${index}.description`, {
                        required:
                          "Please enter at least a 50 character long description.",
                        minLength: {
                          message:
                            "Please enter at least a 50 character long description.",
                          value: 50,
                        },
                      })}
                      errors={errors}
                      label={"Description"}
                      type={"text"}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className={
                    "rounded-md bg-primary-600 p-2 text-white shadow-md"
                  }
                  onClick={() => experiences.append({})}
                >
                  Add Experience
                </button>
              </>
            </Tab.Panel>
            <Tab.Panel>
              {educations.fields.map((field, index) => (
                <>
                  <button
                    type="button"
                    onClick={() => educations.remove(index)}
                  >
                    Delete
                  </button>
                  <input
                    key={field.id}
                    {...register(`experiences.${index}.title`)}
                  />
                </>
              ))}
              <button
                type="button"
                className={"rounded-md bg-primary-600 p-2 text-white shadow-md"}
                onClick={() =>
                  educations.append({
                    title: "append",
                    description: "",
                    location: "",
                  })
                }
              >
                append
              </button>
            </Tab.Panel>
          </Tab.Panels>

          <button type={"submit"} className={"btn btn-primary"}>
            Save
          </button>
        </form>
      </Tab.Group>
    </AppLayout>
  );
}

export default Profile;
