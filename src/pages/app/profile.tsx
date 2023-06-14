import React from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";
import { useAuth } from "@clerk/nextjs";
import {
  type FieldError,
  type FieldErrors,
  useFieldArray,
  useForm,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { HiTrash } from "@react-icons/all-files/hi/HiTrash";
import { Tab } from "@headlessui/react";
import { type Experience } from "../../utils/types";

interface Inputs {
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  email: string;
  phone: string;
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
    company?: string;
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
  const [selectedTab, setSelectedTab] = React.useState<number>(0);
  const profile = api.profile.get.useQuery(auth.userId ?? "", {
    enabled: !!auth.userId,
  });
  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => profile.refetch(),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    values: {
      firstName: profile.data?.firstName ?? "",
      lastName: profile.data?.lastName ?? "",
      title: profile.data?.title ?? "",
      description: profile.data?.description ?? "",
      email: profile.data?.email ?? "",
      phone: profile.data?.phone ?? "",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      experiences:
        (profile.data?.experiences.map((experience) => ({
          ...experience,
          startDate: experience.startDate?.split("T")[0],
          endDate: experience.endDate?.split("T")[0],
        })) as any) ?? [],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      educations:
        (profile.data?.educations.map((experience) => ({
          ...experience,
          startDate: experience.startDate?.split("T")[0],
          endDate: experience.endDate?.split("T")[0],
        })) as any) ?? [],
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
  function tabChangeHandler(index: number) {
    reset();
    setSelectedTab(index);
  }
  return (
    <AppLayout>
      <h1 className={"mb-4 text-4xl font-bold text-primary-600"}>Profile</h1>
      <Tab.Group selectedIndex={selectedTab} onChange={tabChangeHandler}>
        <Tab.List className="mb-4 flex space-x-1 rounded-lg bg-secondary-900/20 p-1">
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
              email: data.email,
              phone: data.phone,
              description: data.description,
              experiences: data.experiences as Experience[],
              educations: data.educations as Experience[],
            });
          })}
          className={"flex flex-col gap-4 pb-4"}
        >
          <Tab.Panels>
            <Tab.Panel>
              <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-wrap gap-4"}>
                  <Input
                    register={register("firstName", { required: true })}
                    placeholder={"John"}
                    label={"Name *"}
                    type={"text"}
                    errors={errors}
                  />
                  <Input
                    errors={errors}
                    placeholder={"Doe"}
                    type={"text"}
                    label={"Last Name *"}
                    register={register("lastName", { required: true })}
                  />
                  <Input
                    errors={errors}
                    label={"Title *"}
                    type={"text"}
                    placeholder={"Software Engineer"}
                    register={register("title", { required: true })}
                  />
                  <Input
                    register={register("email", { required: true })}
                    placeholder={"great-cv@tailoredcv.app"}
                    label={"Email *"}
                    type={"email"}
                    errors={errors}
                  />
                  <Input
                    register={register("phone", { required: true })}
                    placeholder={"123456789"}
                    label={"Phone *"}
                    type={"phone"}
                    errors={errors}
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
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className={"flex flex-col gap-4"}>
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
                        placeholder={"Google"}
                        label={"Company *"}
                        type={"text"}
                      />
                      <Input
                        register={register(`experiences.${index}.title`, {
                          required: true,
                        })}
                        placeholder={"Engineer"}
                        errors={errors}
                        label={"Title *"}
                        type={"text"}
                      />
                      <Input
                        register={register(`experiences.${index}.location`, {
                          required: true,
                        })}
                        errors={errors}
                        placeholder={"London, UK"}
                        label={"Location *"}
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
                      placeholder={"I worked on..."}
                      label={"Description"}
                      type={"text"}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className={"btn-primary m-auto"}
                  onClick={() => experiences.append({})}
                >
                  Add Experience
                </button>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className={"flex flex-col gap-4"}>
                {educations.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={
                      "relative flex flex-col gap-4 rounded-lg bg-gray-50 p-2"
                    }
                  >
                    <button
                      type="button"
                      aria-label={"Remove education"}
                      className={"absolute right-0 top-0 p-2 text-red-600"}
                      onClick={() => educations.remove(index)}
                    >
                      <HiTrash className={"h-6 w-6"} />
                    </button>

                    <div className={"flex flex-wrap gap-4"}>
                      <Input
                        register={register(`educations.${index}.company`, {
                          required: true,
                        })}
                        errors={errors}
                        label={"School *"}
                        placeholder={"University of Oxford"}
                        type={"text"}
                      />
                      <Input
                        register={register(`educations.${index}.title`, {
                          required: true,
                        })}
                        errors={errors}
                        label={"Title *"}
                        placeholder={"Computer Science"}
                        type={"text"}
                      />
                      <Input
                        register={register(`educations.${index}.location`, {
                          required: true,
                        })}
                        errors={errors}
                        placeholder={"London, UK"}
                        label={"Location *"}
                        type={"text"}
                      />
                    </div>
                    <div className={"flex gap-2"}>
                      <Input
                        register={register(`educations.${index}.startDate`, {
                          required: true,
                        })}
                        errors={errors}
                        label={"Start date * "}
                        type={"date"}
                      />
                      <Input
                        register={register(`educations.${index}.endDate`)}
                        errors={errors}
                        label={"End date"}
                        type={"date"}
                      />
                    </div>
                    <TextArea
                      register={register(`educations.${index}.description`, {
                        required:
                          "Please enter at least a 50 character long description.",
                        minLength: {
                          message:
                            "Please enter at least a 50 character long description.",
                          value: 50,
                        },
                      })}
                      errors={errors}
                      placeholder={"I studied..."}
                      label={"Description"}
                      type={"text"}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className={"btn-primary m-auto"}
                  onClick={() => educations.append({})}
                >
                  Add Education
                </button>
              </div>
            </Tab.Panel>
          </Tab.Panels>
          <div className={"flex justify-end"}>
            <button
              type={"submit"}
              className={"btn-primary"}
              disabled={updateProfile.isLoading}
            >
              Save
            </button>
          </div>
        </form>
      </Tab.Group>
    </AppLayout>
  );
}

export default Profile;
