import { BaseModalProps } from "../types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import * as utils from "../../../utils";

export const BaseModal = (props: BaseModalProps) => {
  return (
    <>
      {props.open && (
        <Transition appear show={props.open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={props.onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={utils.classNames(
                      "w-full max-w-sm transform overflow-hidden rounded-2xl bg-white px-4 py-7 text-left align-middle shadow-xl transition-all ",
                      props?.classNameContent
                    )}
                  >
                    <Dialog.Title
                      as="h3"
                      className={utils.classNames(
                        "w-full text-center text-lg font-bold font-medium leading-6 text-black",
                        props?.classNameTitle
                      )}
                    >
                      {props.title}
                    </Dialog.Title>
                    {props.children}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};
