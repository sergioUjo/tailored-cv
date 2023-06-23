import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { type Experience, type Profile } from "../../utils/types";
import { type LLMResult } from "langchain/schema";
import { decreaseProfileTokens } from "../profile";
import { env } from "../../env.mjs";

async function request(docs: Document[], question: string, profile: Profile) {
  const llm = new OpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    callbacks: [
      {
        async handleLLMEnd(output: LLMResult): Promise<void> {
          const generations = output.generations?.flat();
          console.log("generations", generations);
          const tokenUsage =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (output.llmOutput?.tokenUsage?.totalTokens as number) ?? 0;
          console.log("token usage", output);
          await decreaseProfileTokens(profile, tokenUsage);
        },
      },
    ],
  });
  const chain = loadQAStuffChain(llm);
  console.log(docs);
  const res = await chain.call({
    input_documents: docs,
    question: question,
  });
  return res.text as string;
}
function requestWithFullProfile(
  profile: Profile,
  jobDescription: string,
  query: string
) {
  const jobDescriptionDocument = new Document({
    pageContent: jobDescription,
    metadata: { title: "Job Description" },
  });
  const profileDescription = new Document({
    pageContent: profile.description,
    metadata: { ...profile, description: "My Profile" },
  });
  const profileExperiences = profile.experiences.map((experience) => {
    return new Document({
      pageContent: experience.description,
      metadata: { ...experience, description: "Professional Experience" },
    });
  });
  const profileEducations = profile.educations.map((education) => {
    return new Document({
      pageContent: education.description,
      metadata: { ...education, description: "Education" },
    });
  });
  return request(
    [
      jobDescriptionDocument,
      profileDescription,
      ...profileExperiences,
      ...profileEducations,
    ],
    query,
    profile
  );
}
export async function generateDescription(
  jobDescription: string,
  profile: Profile
) {
  return requestWithFullProfile(
    profile,
    jobDescription,
    "Write a introduction resume description for this job description based on my profile. Do it in first person with a maximum of 100 words."
  );
}

export async function generateCover(jobDescription: string, profile: Profile) {
  return requestWithFullProfile(
    profile,
    jobDescription,
    "Write a cover letter for this job description based on my profile. Do it in first person with a maximum of 100 words."
  );
}

export async function rewriteExperienceDescription(
  jobDescription: string,
  experience: Experience,
  profile: Profile
) {
  const jobDescriptionDocument = new Document({
    pageContent: jobDescription,
    metadata: { title: "Job Description" },
  });
  const { description, ...rest } = experience;
  const document = new Document({
    pageContent: description,
    metadata: { ...rest, description: "Professional Experience" },
  });
  return request(
    [jobDescriptionDocument, document],
    "Rewrite this experience description by improving it and tailoring it to the job description. Do it in first person with a maximum of 100 words and in a bullet point manner.",
    profile
  );
}

export async function rewriteEducationDescription(
  jobDescription: string,
  experience: Experience,
  profile: Profile
) {
  const jobDescriptionDocument = new Document({
    pageContent: jobDescription,
    metadata: { title: "Job Description" },
  });
  const { description, ...rest } = experience;
  const document = new Document({
    pageContent: description,
    metadata: { ...rest, description: "Education" },
  });
  return request(
    [jobDescriptionDocument, document],
    "Rewrite this education description by improving it and tailoring it to the  job description. Do it in first person with a maximum of 100 words.",
    profile
  );
}
