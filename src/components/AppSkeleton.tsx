import React from "react";
import Logo from "../svg/Logo";

function AppSkeleton() {
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
          <div className={"h-8 w-8 animate-pulse rounded-full bg-gray-100"} />
        </div>
      </div>
    </div>
  );
}

export default AppSkeleton;
