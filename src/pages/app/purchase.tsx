import React from "react";
import AppLayout from "../../components/AppLayout";
import { api } from "../../utils/api";

const plans = [
  {
    name: "Sniffer",
    id: "sniffer" as const,
    price: 5,
    description:
      "The best option for scanning the market, see what you are worth.",
    features: [
      <p key={"I"}>Individual configuration</p>,
      <span key={"A"}>
        AI Words <span className="font-semibold">50k</span>
        <span className="text-gray-500"> ~20 CV's</span>
      </span>,
      <span key={"V"}>Résumé writer</span>,
      <span key={"A"}>Cover Letter writer</span>,
    ],
  },
  {
    name: "Hunter",
    id: "hunter" as const,
    price: 10,
    description: "The go-to if you are on a job hunt. Get the best results.",
    features: [
      <p key={"I"}>Individual configuration</p>,
      <span key={"A"}>
        AI Words <span className="font-semibold">110k</span>
        <span className="text-gray-500"> ~44 CV's</span>
      </span>,
      <span key={"V"}>Résumé writer</span>,
      <span key={"A"}>Cover Letter writer</span>,
    ],
  },
  {
    name: "Professional",
    id: "professional" as const,
    price: 20,
    description: "Best for someone writing CV's on a daily basis.",
    features: [
      <p key={"I"}>Individual configuration</p>,
      <span key={"A"}>
        AI Words <span className="font-semibold">250k</span>
        <span className="text-gray-500"> ~120 CV's</span>
      </span>,
      <span key={"V"}>Résumé writer</span>,
      <span key={"A"}>Cover Letter writer</span>,
    ],
  },
];
function Purchase() {
  const buy = api.profile.buyTokens.useMutation({
    onSuccess: (data) => {
      data.url && window.location.assign(data.url);
    },
  });
  return (
    <AppLayout>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Designed for people like you
            </h2>
            <p className="mb-5 font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              Here at TailoredCV we focus on getting through the CV scanning so
              that you can focus on what matters. Landing that dream job!
            </p>
          </div>
          <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8"
              >
                <h3 className="mb-4 text-2xl font-semibold">{plan.name}</h3>
                <p className="font-light text-gray-500 dark:text-gray-400 sm:text-lg">
                  {plan.description}
                </p>
                <div className="my-8 flex items-baseline justify-center">
                  <span className="mr-2 text-5xl font-extrabold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">.69</span>
                </div>
                <ul role="list" className="mb-8 space-y-4 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => buy.mutate(plan.id)}
                  disabled={buy.isLoading || buy.isSuccess}
                  className="btn-primary w-full"
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

export default Purchase;
