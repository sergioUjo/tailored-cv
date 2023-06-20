import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

// Create styles
const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Comic Sans"],
    },
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});
function Pdf() {
  return (
    <Document>
      <Page size="A4" style={tw("p-12 font-sans")}>
        <View style={tw("p-20 bg-gray-100")}>
          <Text style={tw("text-custom text-3xl")}>Section #1</Text>
        </View>
        <View style={tw("mt-12 px-8 rotate-2")}>
          <Text style={tw("text-amber-600 text-2xl")}>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}

export default Pdf;
