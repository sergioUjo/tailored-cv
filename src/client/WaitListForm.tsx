import React from "react";

function WaitListForm() {
  return (
    <form className={" mx-auto flex max-w-2xl flex-col gap-4"}>
      <label>
        Email *
        <input
          type={"email"}
          required
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
          className={
            "w-full rounded-lg border border-solid border-gray-300 p-4 focus:border-primary-600 focus:outline-none"
          }
        />
      </label>
      <div className={"flex justify-center"}>
        <button
          type={"submit"}
          className={
            "w-1/2 rounded-full bg-primary-600 p-3 text-base font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          }
        >
          Join the Waitlist
        </button>
      </div>
    </form>
  );
}

export default WaitListForm;
