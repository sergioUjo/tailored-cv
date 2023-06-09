import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { VscTools } from "@react-icons/all-files/vsc/VscTools";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  function isActive(path: string) {
    return pathname !== path
      ? "flex flex-row items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-500 focus:outline-red-500 hover:font-bold hover:text-black hover:bg-gray-100 rounded-md"
      : "flex flex-row items-center gap-2 px-4 py-1.5 text-sm focus:outline-red-500 rounded-md font-bold bg-primary-50 text-primary-600 cursor-default";
  }
  return (
    <div className={"m-auto flex h-screen max-w-7xl"}>
      <div className={"flexflex-col gap-y-2 border-r border-gray-200 p-2"}>
        <div className={"flex w-52 flex-col gap-y-2 p-2"}>
          <Link className={isActive("/app")} href={"/app"}>
            <RiDashboardLine size={16} />
            Overview
          </Link>
          <Link className={isActive("/app/profile")} href={"/app/profile"}>
            <BsFillPersonFill size={16} />
            My profile
          </Link>
          <Link
            className={isActive("/app/create-resume")}
            href={"/app/create-resume"}
          >
            <VscTools size={16} />
            Create résumé
          </Link>
          <Link
            href={"/app/create-cover-letter"}
            className={isActive("/app/create-cover-letter")}
          >
            <VscTools size={16} />
            Create cover letter
          </Link>
          <Link href={"/app/resumes"} className={isActive("/app/resumes")}>
            <IoDocumentTextOutline size={16} />
            My résumés
          </Link>
          <Link
            href={"/app/cover-letters"}
            className={isActive("/app/cover-letters")}
          >
            <IoDocumentTextOutline size={16} />
            My cover letters
          </Link>
        </div>
        <div>
          <Link href={"/app/settings"} className={isActive("/app/settings")}>
            Setting
          </Link>
          <button type={"button"}>Logout</button>
        </div>
      </div>
      <div className={"flex-1 p-4 lg:ml-20"}>{children}</div>
    </div>
  );
}

export default AppLayout;
