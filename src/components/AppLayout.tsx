import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { FaCoins } from "@react-icons/all-files/fa/FaCoins";
import Logo from "../svg/Logo";
import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { UserTokens } from "./UserTokens";

const MobileMenu = dynamic(() => import("./MobileMenu"), {
  ssr: false,
  loading: () => (
    <div className={"h-8 w-8 animate-pulse rounded-full bg-gray-100"} />
  ),
});

function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();

  function isActive(path: string) {
    return pathname !== path
      ? "flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 focus:outline-red-500 hover:font-bold hover:text-black hover:bg-gray-100 rounded-md"
      : "flex flex-row items-center gap-2 px-4 py-2 text-sm focus:outline-red-500 rounded-md font-bold bg-primary-50 text-primary-600 cursor-default";
  }

  return (
    <div className={"bg-white"}>
      <div
        className={"sticky top-0 z-50 border-b border-gray-200 bg-white p-2"}
      >
        <div className={"m-auto flex max-w-7xl justify-between px-4"}>
          <Link
            href={"https://www.tailoredcv.app"}
            className={"flex items-center gap-2 fill-primary-600"}
          >
            <Logo className="h-8 w-8" />
            <p className={"text-lg font-bold"}>TailoredCV</p>
          </Link>
          <div className={"flex gap-2"}>
            <MobileMenu />
            <UserButton />
          </div>
        </div>
      </div>
      <div
        className={
          "fixed inset-y-0 top-12  hidden flex-col justify-between border-r border-gray-200 bg-transparent p-2 lg:flex"
        }
      >
        <div className={"flex w-52 flex-col gap-2"}>
          <Link className={isActive("/")} href={"/"}>
            <RiDashboardLine size={16} />
            Overview
          </Link>
          <Link className={isActive("/profile")} href={"/profile"}>
            <BsFillPersonFill size={16} />
            My profile
          </Link>
          <Link href={"/applications"} className={isActive("/applications")}>
            <IoDocumentTextOutline size={16} />
            My Applications
          </Link>
          <Link href={"/purchase"} className={isActive("/purchase")}>
            <FaCoins size={16} />
            Purchase words
          </Link>
        </div>
        <UserTokens />
      </div>
      <div
        className={
          "m-auto h-full max-h-full max-w-7xl flex-1 p-4 lg:pl-60 2xl:pl-28"
        }
      >
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
