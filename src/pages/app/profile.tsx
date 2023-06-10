import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";

function Profile() {
  const [resumeDescription, setResumeDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const tellAJOKE = api.gpt.useMutation({ onSuccess: setResumeDescription });
  return (
    <AppLayout>
      <h1 className={"text-xl font-bold"}>Profile</h1>
      <div
        className={"flex flex-col gap-4 rounded-lg border border-gray-200 p-4"}
      >
        <h2 className={"text-lg font-medium"}>Base Information</h2>
        <label htmlFor={"name"}>Name *</label>
        <input
          id={"name"}
          type={"text"}
          className={
            "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
          }
        />
        <label htmlFor={"lastName"}>Last Name</label>
        <input
          id={"lastName"}
          type={"text"}
          className={
            "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
          }
        />
        <label>Title</label>
        <input
          type={"text"}
          className={
            "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
          }
        />
        <textarea
          value={resumeDescription}
          onChange={(e) => setResumeDescription(e.target.value)}
          className={
            "rounded-lg border border-gray-200 p-2 px-4 py-2 text-base focus:outline-secondary-600"
          }
        />
        <button
          onClick={() => tellAJOKE.mutate({ description: jobDescription })}
        >
          Tell a joke
        </button>
      </div>
    </AppLayout>
  );
}

export default Profile;
