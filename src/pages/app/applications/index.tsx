import React, { useContext } from "react";
import AppLayout from "../../../components/AppLayout";
import Link from "next/link";
import { api } from "../../../utils/api";
import { LoggedUserContext } from "../../../components/LoggedUserProvider";
import { useRouter } from "next/router";
function useCreateResume() {
  const user = useContext(LoggedUserContext);
  const profile = api.profile.get.useQuery();
  const router = useRouter();
  const createResume = api.profile.resumes.update.useMutation({
    onSuccess: async (id) => {
      await router.push(`/app/applications/${id}`);
    },
  });

  return {
    ...createResume,
    create: () =>
      createResume.mutate({
        description: "",
        title: "",
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
  const profileRequest = api.profile.get.useQuery(undefined, {
    suspense: true,
  });
  const resumes = resumesRequest.data ?? [];
  const createResume = useCreateResume();
  const isIncomplete =
    !profileRequest.data || profileRequest.data.firstName.length === 0;
  const disableCreate =
    createResume.isLoading || createResume.isSuccess || isIncomplete;
  return (
    <AppLayout>
      <h1 className={"mb-4 text-4xl font-bold text-primary-600"}>
        Aplications
      </h1>
      {isIncomplete && (
        <p className={"mb-4 rounded-lg bg-gray-100 p-4 text-lg text-gray-500"}>
          Complete your{" "}
          <Link href={"/app/profile"} className={"text-primary-600 underline"}>
            profile
          </Link>{" "}
          to start creating applications
        </p>
      )}
      <div className={"grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 "}>
        <button
          onClick={createResume.create}
          disabled={disableCreate}
          className="flex h-32 items-center justify-center rounded-lg border border-gray-100 bg-white text-center text-7xl font-bold text-primary-600 shadow hover:text-primary-700 hover:shadow-lg disabled:bg-gray-100 disabled:text-gray-500"
        >
          +
        </button>
        {resumes.map((resume) => (
          <Link
            href={`/app/applications/${resume.id}`}
            key={resume.id}
            className=" flex  h-32 flex-grow basis-20 items-center justify-center rounded-lg border border-gray-100 bg-white text-center shadow hover:text-primary-600 hover:shadow-lg"
          >
            {resume.title}
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}

export default Index;
