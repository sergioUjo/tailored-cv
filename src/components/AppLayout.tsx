import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { api } from "../utils/api";
import { FaCoins } from "@react-icons/all-files/fa/FaCoins";
import LoggedUserProvider from "./LoggedUserProvider";
import Header from "./Header";

function UserTokens() {
  const profile = api.profile.get.useQuery();
  if (!profile.data?.tokens) {
    return <div className={"h-5 rounded-md bg-gray-100"} />;
  }
  const tokens =
    profile.data.tokens >= 1000
      ? (profile.data.tokens / 1000).toFixed(0) + "k"
      : profile.data.tokens;
  return (
    <div className={"flex items-center justify-between text-sm font-medium"}>
      <p className={"font-bold"}>AI Writter</p>
      <div className={"flex items-center gap-2"}>
        <p className={" rounded-md bg-gray-200 p-1"}>{tokens}</p>
        <p>Words</p>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();

  function isActive(path: string) {
    return pathname !== path
      ? "flex flex-row items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-500 focus:outline-red-500 hover:font-bold hover:text-black hover:bg-gray-100 rounded-md"
      : "flex flex-row items-center gap-2 px-4 py-1.5 text-sm focus:outline-red-500 rounded-md font-bold bg-primary-50 text-primary-600 cursor-default";
  }

  return (
    <div className={"bg-white"}>
      <Header />
      <div
        className={
          "fixed inset-y-0 top-12  hidden flex-col justify-between border-r border-gray-200 bg-transparent p-2 lg:flex"
        }
      >
        <div className={"flex w-52 flex-col gap-2"}>
          <Link className={isActive("/app")} href={"/app"}>
            <RiDashboardLine size={16} />
            Overview
          </Link>
          <Link className={isActive("/app/profile")} href={"/app/profile"}>
            <BsFillPersonFill size={16} />
            My profile
          </Link>
          <Link
            href={"/app/applications"}
            className={isActive("/app/applications")}
          >
            <IoDocumentTextOutline size={16} />
            My Applications
          </Link>
          <Link href={"/app/purchase"} className={isActive("/app/purchase")}>
            <FaCoins size={16} />
            Purchase words
          </Link>
        </div>
        <div className={"flex flex-col gap-2 rounded-md bg-gray-100 p-2"}>
          <p className={"text-xl font-bold"}>Wallet</p>
          <UserTokens />
        </div>
      </div>
      <div
        className={
          "m-auto h-full max-h-full max-w-7xl flex-1 p-4 lg:pl-60 2xl:pl-28"
        }
      >
        <LoggedUserProvider>{children}</LoggedUserProvider>
      </div>
    </div>
  );
}

export default AppLayout;
