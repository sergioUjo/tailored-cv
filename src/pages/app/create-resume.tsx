import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";
import { ImMagicWand } from "@react-icons/all-files/im/ImMagicWand";

function GenerateButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
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
function CreateResume() {
  const [resumeDescription, setResumeDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const tellAJOKE = api.gpt.useMutation({ onSuccess: setResumeDescription });
  return (
    <AppLayout>
      <h1 className={"text-xl font-bold"}>Profile</h1>
      <div
        className={
          "flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md"
        }
      >
        <h2 className={"text-lg font-medium"}>Base Information</h2>
        {/*<label htmlFor={"name"}>Name *</label>*/}
        {/*<input*/}
        {/*  id={"name"}*/}
        {/*  type={"text"}*/}
        {/*  className={*/}
        {/*    "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"*/}
        {/*  }*/}
        {/*/>*/}
        {/*<label htmlFor={"lastName"}>Last Name</label>*/}
        {/*<input*/}
        {/*  id={"lastName"}*/}
        {/*  type={"text"}*/}
        {/*  className={*/}
        {/*    "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"*/}
        {/*  }*/}
        {/*/>*/}
        {/*<label>Title</label>*/}
        {/*<input*/}
        {/*  type={"text"}*/}
        {/*  className={*/}
        {/*    "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"*/}
        {/*  }*/}
        {/*/>*/}
        <label>Job description</label>
        <textarea
          onChange={(e) => setJobDescription(e.target.value)}
          className={
            "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
          }
        />
        <div>
          <div className={"mb-2 flex justify-between"}>
            <label>Resume Description</label>
            <GenerateButton
              disabled={tellAJOKE.isLoading}
              onClick={() => tellAJOKE.mutate({ description: jobDescription })}
            ></GenerateButton>
          </div>
          <textarea
            value={resumeDescription}
            onChange={(e) => setResumeDescription(e.target.value)}
            className={
              "w-full rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default CreateResume;
