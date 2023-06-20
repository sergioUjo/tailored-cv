import React, { useContext } from "react";
import AppLayout from "../../../components/AppLayout";
import Link from "next/link";
import { api } from "../../../utils/api";
import { LoggedUserContext } from "../../../components/LoggedUserProvider";
function useCreateResume() {
  const user = useContext(LoggedUserContext);
  const profile = api.profile.get.useQuery();
  const createResume = api.profile.resumes.update.useMutation({
    onSuccess: (id) => {
      window.location.href = `/app/applications/${id}`;
    },
  });

  return {
    ...createResume,
    create: () =>
      createResume.mutate({
        description: "",
        title: "Placeholder",
        jobDescription: "",
        userId: user.id,
        experiences:
          profile.data?.experiences.map((experience) => ({
            ...experience,
            description: "",
          })) ?? [],
        educations:
          profile.data?.educations.map((education) => ({
            ...education,
            description: "",
          })) ?? [],
      }),
  };
}
function Index() {
  const resumesRequest = api.profile.resumes.get.useQuery();
  const resumes = resumesRequest.data ?? [];
  const createResume = useCreateResume();
  return (
    <AppLayout>
      <h1 className={"mb-4 text-4xl font-bold text-primary-600"}>
        Aplications
      </h1>
      <div className={"flex flex-wrap gap-4"}>
        <button
          onClick={createResume.create}
          disabled={createResume.isLoading || createResume.isSuccess}
          className=" flex h-44 w-44 items-center justify-center rounded-lg border border-gray-100 bg-white text-center text-7xl font-bold text-primary-600 shadow hover:text-primary-700 hover:shadow-lg"
        >
          +
        </button>
        {resumes.map((resume) => (
          <Link
            href={`/app/applications/${resume.id}`}
            key={resume.id}
            className=" flex h-44 w-44 items-center justify-center rounded-lg border border-gray-100 bg-white text-center shadow hover:text-primary-600 hover:shadow-lg"
          >
            {resume.title}
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}

export default Index;
