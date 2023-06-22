import React from "react";
import AppLayout from "../components/AppLayout";
import Link from "next/link";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { FaCoins } from "@react-icons/all-files/fa/FaCoins";

function Index() {
  const style =
    "flex h-44 items-center flex-col justify-center rounded-lg border border-gray-100 bg-white text-center text-base text-black shadow hover:text-primary-600 hover:shadow-lg";
  return (
    <AppLayout>
      <h1 className={"mb-4 text-4xl font-bold text-primary-600"}>Overview</h1>
      <div className={"grid grid-cols-2 gap-4 sm:grid-cols-4  lg:grid-cols-6"}>
        <Link className={style} href={"/"}>
          <RiDashboardLine size={40} />
          Overview
        </Link>
        <Link className={style} href={"/profile"}>
          <BsFillPersonFill size={40} />
          My profile
        </Link>
        <Link href={"/applications"} className={style}>
          <IoDocumentTextOutline size={40} />
          My Applications
        </Link>
        <Link href={"/purchase"} className={style}>
          <FaCoins size={40} />
          Purchase words
        </Link>
      </div>
    </AppLayout>
  );
}

export default Index;
