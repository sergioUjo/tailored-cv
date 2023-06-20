import React, { useContext } from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";
import { useFieldArray, useForm } from "react-hook-form";
import { HiTrash } from "@react-icons/all-files/hi/HiTrash";
import { Tab } from "@headlessui/react";
import { type Experience, type Profile } from "../../utils/types";
import { LoggedUserContext } from "../../components/LoggedUserProvider";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";

function convertDate(experience: Experience): Experience {
  return {
    ...experience,
    startDate: experience.startDate?.split("T")[0] as string,
    endDate: experience.endDate?.split("T")[0] as string,
  };
}
function ProfileForm() {
  const auth = useContext(LoggedUserContext);
  const [selectedTab, setSelectedTab] = React.useState<number>(0);
  const profile = api.profile.get.useQuery();
  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => profile.refetch(),
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Profile>({
    values: {
      firstName: profile.data?.firstName ?? "",
      lastName: profile.data?.lastName ?? "",
      title: profile.data?.title ?? "",
      description: profile.data?.description ?? "",
      email: profile.data?.email ?? "",
      phone: profile.data?.phone ?? "",
      tokens: profile.data?.tokens ?? 0,
      id: profile.data?.id ?? "",
      experiences: profile.data?.experiences.map(convertDate) ?? [],
      educations: profile.data?.educations.map(convertDate) ?? [],
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
  if (profile.isLoading) {
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
              id: auth.id,
              firstName: data.firstName,
              tokens: data.tokens,
              lastName: data.lastName,
              title: data.title,
              email: data.email,
              phone: data.phone,
              description: data.description,
              experiences: data.experiences,
              educations: data.educations,
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

export default ProfileForm;
