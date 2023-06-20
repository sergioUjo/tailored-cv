import React from "react";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";

// @ts-ignore
export const LoggedUserContext = React.createContext<UserResource>({});

function LoggedUserProvider({ children }: any) {
  const user = useUser();
  if (!user.isLoaded) {
    return <div>Loading...</div>;
  }
  if (!user.isSignedIn) {
    window.location.href = "/sign-in";
    return <div></div>;
  }
  return (
    <LoggedUserContext.Provider value={user.user}>
      {children}
    </LoggedUserContext.Provider>
  );
}

export default LoggedUserProvider;
