import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { Experience } from "../../utils/types";
import { LLMResult } from "langchain/schema";

// eslint-disable-next-line

interface RequestResult {
  text: string;
  cost: number;
}

async function request(
  docs: Document[],
  question: string,
  onResult: (tokenUsage: number) => void
) {
  const llm = new OpenAI({
    openAIApiKey: "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",
    modelName: "gpt-3.5-turbo",
    callbacks: [
      {
        handleLLMEnd(output: LLMResult): Promise<void> | void {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          onResult((output.llmOutput?.tokenUsage?.totalTokens as number) ?? 0);
        },
      },
    ],
  });
  const chain = loadQAStuffChain(llm);
  const res = await chain.call({
    input_documents: docs,
    question: question,
  });
  return res.text as string;
}

export async function generateDescription(
  jobDescription: string,
  cvDescription: string,
  experiences: Experience[],
  educations: Experience[],
  onResult: (tokenUsage: number) => void
) {
  const jobDescriptionDocument = new Document({
    pageContent: jobDescription,
    metadata: { title: "Job Description" },
  });
  const profileDescription = new Document({
    pageContent: cvDescription,
    metadata: { title: "Profile Description" },
  });
  const profileExperiences = experiences.map((experience) => {
    const { description, ...rest } = experience;
    return new Document({
      pageContent: description,
      metadata: { ...rest, description: "Professional Experience" },
    });
  });
  const profileEducations = educations.map((education) => {
    const { description, ...rest } = education;
    return new Document({
      pageContent: description,
      metadata: { ...rest, description: "Education" },
    });
  });
  return request(
    [
      jobDescriptionDocument,
      profileDescription,
      ...profileExperiences,
      ...profileEducations,
    ],
    "Write a introduction resume description for this job description based on my profile. Do it in first person with a maximum of 100 words.",
    onResult
  );
}

export async function rewriteExperienceDescription(
  jobDescription: string,
  experience: Experience,
  onResult: (tokenUsage: number) => void
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
    onResult
  );
}

export async function rewriteEducationDescription(
  jobDescription: string,
  experience: Experience,
  onResult: (tokenUsage: number) => void
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
    onResult
  );
}
