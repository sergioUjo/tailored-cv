import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";
import { useUser } from "@clerk/nextjs";

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
  const auth = useUser();
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
          userId: auth.user?.id ?? "",
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
  type: string;
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
  index,
  jobDescription,
}: ExperienceProps) {
  const [currentDescription, setCurrentDescription] = useState("");
  const endString = endDate
    ? new Date(endDate).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "present";
  const startString = new Date(startDate).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
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
            {startString} - {endString}
          </p>
        </div>
      </div>
      <div className={"my-1 flex justify-end gap-1"}>
        <button
          onClick={() => setCurrentDescription(description)}
          className={"btn-primary py-1"}
        >
          Use Mine
        </button>
        <GenerateButton
          onSuccess={setCurrentDescription}
          type={type}
          jobDescription={jobDescription}
          index={index}
        />
      </div>
      <textarea
        value={currentDescription}
        onChange={(e) => setCurrentDescription(e.target.value)}
        className={
          "min-h-[200px] w-full rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
        }
      />
    </div>
  );
}

function CreateResume() {
  const [resumeDescription, setResumeDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const auth = useUser();

  const profile = api.profile.get.useQuery(auth.user?.id ?? "", {
    enabled: !!auth.user?.id,
  });
  // @ts-ignore
  return (
    <AppLayout>
      <h1 className={"text-xl font-bold"}>Profile</h1>
      <div
        className={
          "flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md"
        }
      >
        <label>Job description</label>
        <textarea
          onChange={(e) => setJobDescription(e.target.value)}
          className={
            "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
          }
        />
      </div>
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
              onSuccess={setResumeDescription}
              type={"description"}
              jobDescription={jobDescription}
              index={2}
            />
          </div>
          <textarea
            value={resumeDescription}
            onChange={(e) => setResumeDescription(e.target.value)}
            className={
              "w-full rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
            }
          />
          <h2 className={"mb-2 border-b border-black text-xl"}>Education</h2>
          {profile.data?.educations.map((experience, i) => (
            <Experience
              {...experience}
              key={i}
              index={i}
              type={"education"}
              jobDescription={jobDescription}
            />
          ))}
          <h2 className={"mb-2 border-b border-black text-xl"}>
            Professional Experience
          </h2>
          {profile.data?.experiences.map((experience, i) => (
            <Experience
              {...experience}
              key={i}
              index={i}
              type={"experience"}
              jobDescription={jobDescription}
            />
          ))}
          <h2 className={"mb-2 border-b border-black text-xl"}>
            Professional Experience
          </h2>
        </div>
      </div>
    </AppLayout>
  );
}

export default CreateResume;
