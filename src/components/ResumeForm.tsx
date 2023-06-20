import React from "react";

import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { api } from "../utils/api";
import AppLayout from "./AppLayout";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useRouter } from "next/router";
import { type Resume } from "../utils/types";
import { Tab } from "@headlessui/react";
import { Input } from "./Input";
import { TextArea } from "./TextArea";
import dynamic from "next/dynamic";
import { printTimePeriod } from "../utils/time";
const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});
interface GenerateButtonProps {
  type: string;
  jobDescription: string;
  onSuccess: (description: string) => void;
  index: number;
}

function GenerateButton({
  onSuccess,
  index,
  type,
  jobDescription,
}: GenerateButtonProps) {
  const context = api.useContext();
  const aiWrite = api.profile.aiWrite.useMutation({
    onSuccess: async (data) => {
      onSuccess(data ?? "");
      await context.profile.get.invalidate();
    },
  });

  return (
    <button
      type={"button"}
      disabled={aiWrite.isLoading}
      onClick={() =>
        aiWrite.mutate({
          jobDescription: jobDescription,
          type: type,
          index: index,
        })
      }
      className={
        "relative w-fit rounded-lg bg-secondary-600 py-1 pl-8 pr-4 text-base  font-bold text-white hover:bg-secondary-700 focus:outline-secondary-700  focus:ring-offset-2 disabled:bg-gray-50 disabled:text-gray-400"
      }
    >
      <ImMagicWand
        className={"inset-y absolute left-0 flex h-6 w-6 items-center pl-2"}
      />
      AI Write
    </button>
  );
}

interface ExperienceProps {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description: string;
  index: number;
  type: "experiences" | "educations";
  jobDescription: string;
}

function Experience({
  endDate,
  startDate,
  title,
  type,
  company,
  location,
  description,
  form,
  index,
  jobDescription,
}: ExperienceProps & { form: UseFormReturn<Resume> }) {
  return (
    <div className={"mb-1"}>
      <div className={"flex justify-between"}>
        <div>
          <p className={"text-base font-bold"}>{company}</p>
          <p className={"text-base text-gray-700 underline"}>{title}</p>
        </div>
        <div>
          <p className={"text-right text-base font-bold"}>{location}</p>
          <p className={"text-base text-gray-700 underline"}>
            {printTimePeriod(startDate, endDate)}
          </p>
        </div>
      </div>
      <div className={"my-1 flex justify-end gap-1"}>
        <button
          onClick={() =>
            form.setValue(`${type}.${index}.description`, description)
          }
          className={"btn-primary py-1"}
        >
          Use Mine
        </button>
        <GenerateButton
          onSuccess={(description) =>
            form.setValue(`${type}.${index}.description`, description)
          }
          type={type}
          jobDescription={jobDescription}
          index={index}
        />
      </div>
      <textarea
        {...form.register(`${type}.${index}.description`)}
        className={
          "min-h-[200px] w-full rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
        }
      />
    </div>
  );
}

function useResume() {
  const router = useRouter();
  const { id } = router.query;
  return api.profile.resumes.getById.useQuery(parseInt(id as string), {
    suspense: true,
  });
}

function ResumeForm() {
  const profile = api.profile.get.useQuery(undefined, { suspense: true });
  const resume = useResume();
  const [modalOpen, setModalOpen] = React.useState(false);
  const form = useForm<Resume>({
    values: resume.data,
  });
  const update = api.profile.resumes.update.useMutation();

  const jobDescription = form.getValues("jobDescription");

  function submit(resume: Resume) {
    update.mutate(resume);
  }

  return (
    <AppLayout>
      <Tab.Group>
        <h1 className={"mb-4 text-4xl font-bold text-primary-600"}>
          Application
        </h1>
        <Tab.List className="mb-4 grid grid-cols-3 gap-4">
          {["Position", "Résumé", "Cover Letter"].map((category, i) => (
            <Tab
              key={category}
              className={({ selected }) =>
                "rounded-lg border border-solid border-gray-200 py-2 text-lg leading-5 shadow disabled:bg-gray-100 disabled:text-gray-500 " +
                (selected
                  ? "bg-secondary-600 font-bold text-white "
                  : "bg-white font-medium text-secondary-600 hover:bg-secondary-50")
              }
              disabled={!form.formState.isValid && i !== 0}
            >
              <h2>{category}</h2>
            </Tab>
          ))}
        </Tab.List>

        <form
          onSubmit={form.handleSubmit(submit)}
          className={"relative flex flex-col gap-4"}
        >
          <Tab.Panels>
            <Tab.Panel>
              <div className={"flex flex-col gap-4"}>
                <Input
                  type={"text"}
                  placeholder={"Google"}
                  register={form.register("title", { required: true })}
                  errors={form.formState.errors}
                  label={"Company Name"}
                />
                <TextArea
                  register={form.register("jobDescription")}
                  errors={form.formState.errors}
                  label={"Position Description"}
                  placeholder={
                    "What they are looking for in a candidate, requirements, good to have, etc."
                  }
                />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div
                className={
                  "mt-4 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md"
                }
              >
                <div>
                  <p className={"text-center text-2xl text-gray-500"}>
                    {profile.data?.firstName + " " + profile.data?.lastName}
                  </p>
                  <div>
                    <p className={"text-center text-base text-gray-500"}>
                      {profile.data?.title} | {profile.data?.email} |{" "}
                      {profile.data?.phone}
                    </p>
                  </div>
                  <div className={"mb-1 flex justify-end"}>
                    <GenerateButton
                      onSuccess={(description) =>
                        form.setValue("description", description)
                      }
                      type={"description"}
                      jobDescription={jobDescription}
                      index={2}
                    />
                  </div>
                  <textarea
                    {...form.register("description")}
                    className={
                      "w-full rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
                    }
                  />
                  <h2 className={"mb-2 border-b border-black text-xl"}>
                    Education
                  </h2>
                  {resume.data?.educations.map((experience, i) => (
                    <Experience
                      {...experience}
                      key={i}
                      index={i}
                      form={form}
                      type={"educations"}
                      jobDescription={jobDescription}
                    />
                  ))}
                  <h2 className={"mb-2 border-b border-black text-xl"}>
                    Professional Experience
                  </h2>
                  {resume.data?.experiences.map((experience, i) => (
                    <Experience
                      {...experience}
                      key={i}
                      index={i}
                      form={form}
                      type={"experiences"}
                      jobDescription={jobDescription}
                    />
                  ))}
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel></Tab.Panel>
          </Tab.Panels>
          <div
            className={
              "sticky bottom-2 right-0 z-10 w-fit self-end rounded-lg border border-gray-200 bg-white p-2 shadow"
            }
          >
            <Modal
              isOpen={modalOpen}
              close={() => setModalOpen(false)}
              resume={resume.data!}
            />
            <button
              className={"btn-primary"}
              onClick={() => setModalOpen(true)}
            >
              Preview
            </button>
            <button type={"submit"} className={"btn-primary"}>
              Save
            </button>
          </div>
        </form>
      </Tab.Group>
    </AppLayout>
  );
}

export default ResumeForm;
