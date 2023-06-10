import { OpenAI } from "langchain/llms/openai";
import { CommaSeparatedListOutputParser } from "langchain/output_parsers";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";

const outputParser = new CommaSeparatedListOutputParser();

const cv = new PDFLoader("/home/sergio/tailored-cv/src/utils/cv.pdf");

// eslint-disable-next-line
const llm = new OpenAI({
  openAIApiKey: "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",
});

export async function tellAJoke(jobDescription: string): Promise<string> {
  const document = await cv.load();
  const chainA = loadQAStuffChain(llm);
  const docs = [
    ...document,
    new Document({
      pageContent: jobDescription,
      metadata: { title: "Job Description" },
    }),
  ];
  const resA = await chainA.call({
    input_documents: docs,
    question:
      "Write a introduction resume description for this job description based on my CV. Do it in first person.",
  });

  console.log(resA);
  return resA.text as string;
}
