import React, { useState } from "react";
import { api } from "../utils/api";

function WaitListForm() {
  const waitlist = api.waitlist.useMutation();
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    waitlist.mutate({ email, comment: comment });
  }
  if (waitlist.isSuccess) {
    return (
      <div
        className={
          " mx-auto flex max-w-2xl origin-top-right transform flex-col gap-4 transition duration-200 ease-in"
        }
      >
        <h1
          className={
            "animate-bounce text-center text-3xl font-bold text-primary-600"
          }
        >
          Thank you!
        </h1>
        <p className={"text-center"}>
          We will let you know when we are ready to launch.
        </p>
      </div>
    );
  }
  return (
    <form
      className={" mx-auto flex max-w-2xl flex-col gap-4"}
      onSubmit={onSubmit}
    >
      <label>
        Email *
        <input
          type={"email"}
          required
          onChange={(event) => setEmail(event.target.value)}
          placeholder={"Enter your email"}
          className={
            "w-full rounded-lg border border-solid border-gray-300 p-4 focus:border-primary-600 focus:outline-none"
          }
        />
      </label>
      <label>
        Comments (optional)
        <textarea
          placeholder={"Enter your message"}
          onChange={(event) => setComment(event.target.value)}
          className={
            "w-full rounded-lg border border-solid border-gray-300 p-4 focus:border-primary-600 focus:outline-none"
          }
        />
      </label>
      <div className={"flex justify-center"}>
        <button
          type={"submit"}
          disabled={waitlist.isLoading}
          className={
            "w-1/2 rounded-full bg-primary-600 p-3 text-base font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-400"
          }
        >
          Join the Waitlist
        </button>
      </div>
    </form>
  );
}

export default WaitListForm;
