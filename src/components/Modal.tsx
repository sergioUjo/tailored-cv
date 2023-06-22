import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, type PropsWithChildren } from "react";
import { type Experience, type Resume } from "../utils/types";
import { Document, Page, PDFViewer, Text, View } from "@react-pdf/renderer";
import { api } from "../utils/api";
import { printTimePeriod } from "../utils/time";

interface Props {
  isOpen: boolean;
  close: () => void;
  resume: Resume;
}

// Create styles
function Experience({ experience }: { experience: Experience }) {
  const descriptionItems = experience.description.split("\n");
  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: 4,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>{experience.company}</Text>
          <Text style={{ textDecoration: "underline", fontSize: 10 }}>
            {experience.title}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexDirection: "column",
            marginBottom: 8,
          }}
        >
          <Text>{experience.location}</Text>
          <Text
            style={{
              textDecoration: "underline",
              fontSize: 10,
            }}
          >
            {printTimePeriod(experience.startDate, experience.endDate)}
          </Text>
        </View>
      </View>
      {descriptionItems.map((detail, i) => (
        <View key={i}>
          <Text>{detail}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Modal({ isOpen, close, resume }: Props) {
  const profile = api.profile.get.useQuery().data!;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex max-w-7xl flex-1 transform flex-col overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Payment successful
                </Dialog.Title>
                <PDFViewer className={"flex-1"}>
                  <Document>
                    <Page
                      size="A4"
                      style={{
                        padding: 4,
                        backgroundColor: "white",
                        fontSize: 12,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 24,
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {profile.firstName + " " + profile.lastName}
                        </Text>
                        <Text style={{ textAlign: "center" }}>
                          {profile.title} | {profile.email} | {profile.phone}
                        </Text>
                      </View>
                      <Text style={{ marginTop: 16 }}>
                        {resume.description}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          marginTop: 16,
                          fontWeight: "bold",
                          borderBottomWidth: 2,
                          borderBottomColor: "#112131",
                          borderBottomStyle: "solid",
                        }}
                      >
                        EDUCATION
                      </Text>
                      {resume.educations.map((education, i) => (
                        <Experience experience={education} key={i} />
                      ))}
                      <Text
                        style={{
                          fontSize: 16,
                          marginTop: 16,
                          fontWeight: "bold",
                          borderBottomWidth: 2,
                          borderBottomColor: "#112131",
                          borderBottomStyle: "solid",
                        }}
                      >
                        EXPERIENCE
                      </Text>
                      {resume.experiences.map((education, i) => (
                        <Experience experience={education} key={i} />
                      ))}
                    </Page>
                  </Document>
                </PDFViewer>

                <div className="mt-4">
                  <button
                    type="button"
                    className="btn-primary self-end"
                    onClick={close}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
