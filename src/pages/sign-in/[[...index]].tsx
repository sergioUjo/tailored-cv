import { SignIn } from "@clerk/nextjs";
import Header from "../../components/Header";

export default function Page() {
  return (
    <div className={"flex h-screen flex-col"}>
      <Header />
      <div className={"flex flex-1 items-center justify-center"}>
        <SignIn />
      </div>
    </div>
  );
}
