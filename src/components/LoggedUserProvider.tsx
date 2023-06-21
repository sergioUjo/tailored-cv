import React, { useEffect } from "react";
import { SignIn, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import AppSkeleton from "./AppSkeleton";

// @ts-ignore
export const LoggedUserContext = React.createContext<UserResource>({});

function LoggedUserProvider({ children }: any) {
  const user = useUser();
  if (!user.isLoaded) {
    return <AppSkeleton />;
  }
  return (
    <LoggedUserContext.Provider value={user.user}>
      {children}
    </LoggedUserContext.Provider>
  );
}

export default LoggedUserProvider;
