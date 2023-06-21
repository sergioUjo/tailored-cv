import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { AiOutlineMenu } from "@react-icons/all-files/ai/AiOutlineMenu";
import Link from "next/link";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { BsFillPersonFill } from "@react-icons/all-files/bs/BsFillPersonFill";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { FaCoins } from "@react-icons/all-files/fa/FaCoins";
import { useRouter } from "next/router";
import { UserTokens } from "./UserTokens";

function MobileMenu() {
  const { pathname } = useRouter();

  function isActive(path: string) {
    return pathname !== path
      ? "flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 focus:outline-red-500 hover:font-bold hover:text-black hover:bg-gray-100 rounded-md"
      : "flex flex-row items-center gap-2 px-4 py-2 text-sm focus:outline-red-500 rounded-md font-bold bg-primary-50 text-primary-600 cursor-default";
  }

  return (
    <Menu as="div" className="relative inline-block text-left lg:hidden">
      <div>
        <Menu.Button className="flex h-8 w-8 items-center justify-center rounded-full border border-solid border-gray-100 hover:bg-primary-100 hover:text-primary-600">
          <AiOutlineMenu aria-hidden="true" size={18} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 flex w-56 origin-top-right flex-col gap-2 rounded-lg bg-white p-2 shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                className={
                  isActive("/app") + (active ? " bg-gray-100 text-black" : "")
                }
                href={"/app"}
              >
                <RiDashboardLine size={16} />
                Overview
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                className={
                  isActive("/app/profile") +
                  (active ? " bg-gray-100 text-black" : "")
                }
                href={"/app/profile"}
              >
                <BsFillPersonFill size={16} />
                My profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                className={
                  isActive("/app/applications") +
                  (active ? " bg-gray-100 text-black" : "")
                }
                href={"/app/applications"}
              >
                <IoDocumentTextOutline size={16} />
                My Applications
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                className={
                  isActive("/app/purchase") +
                  (active ? " bg-gray-100 text-black" : "")
                }
                href={"/app/purchase"}
              >
                <FaCoins size={16} />
                Purchase words
              </Link>
            )}
          </Menu.Item>
          <div className={"mt-2 border-t border-solid border-gray-200 pt-4"}>
            <UserTokens />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default MobileMenu;
