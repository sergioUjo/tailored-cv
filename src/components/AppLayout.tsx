import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { VscTools } from "@react-icons/all-files/vsc/VscTools";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { UserButton, useUser } from "@clerk/nextjs";
import Logo from "../svg/Logo";
import { api } from "../utils/api";
import { Profile } from "../utils/types";
function useUpdateProfile() {
  const user = useUser();
  const profile = api.profile.get.useQuery(user.user?.id ?? "", {
    enabled: !!user.user?.id,
  });
  const updateProfile = api.profile.update.useMutation({
    onSuccess: async (data) => {
      await profile.refetch();
    },
  });
  return {
    ...updateProfile,
    mutate: (data: Partial<Profile>) =>
      updateProfile.mutate({
        ...profile.data,
        id: user.user?.id ?? "",
        ...data,
      } as Profile),
  };
}
function UserTokens() {
  const user = useUser();
  const profile = api.profile.get.useQuery(user.user?.id ?? "", {
    enabled: !!user.user?.id,
  });
  const updateProfile = useUpdateProfile();
  if (!user.isLoaded || profile.isLoading) {
    return <div></div>;
  }
  return (
    <div>
      <p className={"text-lg font-bold"}>Tokens {profile.data?.tokens}</p>
      <button
        type={"button"}
        onClick={() => updateProfile.mutate({ tokens: 1000 })}
      >
        Buy tokens
      </button>
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
      <div
        className={"sticky top-0 z-50 border-b border-gray-200 bg-white p-2"}
      >
        <div className={"m-auto flex max-w-7xl justify-between px-4"}>
          <div className={"flex items-center gap-2 fill-primary-600"}>
            <Logo className="h-8 w-8" />
            <p className={"text-lg font-bold"}>TailoredCV</p>
          </div>
          <UserTokens></UserTokens>
          <UserButton />
        </div>
      </div>
      <div></div>
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
      <div className={"m-auto h-full max-h-full max-w-7xl flex-1 p-4 lg:pl-60"}>
        {children}
      </div>
    </div>
  );
}

export default AppLayout;
