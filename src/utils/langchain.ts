import { OpenAI } from "langchain/llms/openai";
import { CommaSeparatedListOutputParser } from "langchain/output_parsers";
const outputParser = new CommaSeparatedListOutputParser();
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const cv = new PDFLoader("/home/sergio/tailored-cv/src/utils/cv.pdf");

// eslint-disable-next-line
const llm = new OpenAI({
  openAIApiKey: "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",
});
export async function tellAJoke(): Promise<string> {
  const document = await cv.loadAndSplit();
  console.log(document);
  return "Hello";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return llm.call("Tell me a joke");
}
