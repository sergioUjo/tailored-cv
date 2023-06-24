import { api } from "../utils/api";
import React from "react";

export function UserTokens() {
  const profile = api.profile.get.useQuery();
  if (profile.data?.tokens === undefined) {
    return <div className={"h-5 rounded-md bg-gray-100"} />;
  }
  const tokens =
    profile.data.tokens >= 1000
      ? (profile.data.tokens / 1000).toFixed(0) + "k"
      : profile.data.tokens;
  return (
    <div className={"flex flex-col gap-2 rounded-md bg-gray-100 p-2"}>
      <p className={"text-lg font-bold md:text-xl"}>Wallet</p>
      <div className={"flex items-center justify-between text-sm font-medium"}>
        <p className={"font-bold"}>AI Writter</p>
        <div className={"flex items-center gap-2"}>
          <p className={" rounded-md bg-gray-200 p-1"}>{tokens}</p>
          <p>Words</p>
        </div>
      </div>
    </div>
  );
}
