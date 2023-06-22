import React from "react";
import Logo from "../svg/Logo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  return (
    <div className={"sticky top-0 z-50 border-b border-gray-200 bg-white p-2"}>
      <div className={"m-auto flex max-w-7xl justify-between px-4"}>
        <Link
          href={"https://www.tailoredcv.app"}
          className={"flex items-center gap-2 fill-primary-600"}
        >
          <Logo className="h-8 w-8" />
          <p className={"text-lg font-bold"}>TailoredCV</p>
        </Link>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
