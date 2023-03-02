import {Dialog, Transition} from '@headlessui/react'
import {Fragment} from 'react'
import {ModalProps} from "./types";
import {getDiscordAuthUrl} from "../../config";

export const InterfacesModal = (props: ModalProps) => {
  const connectDiscord = () => {
    props.onClose();
    window.location.replace(getDiscordAuthUrl());
  }

  return (
    <>
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
            <div className="fixed inset-0 bg-black bg-opacity-60"/>
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
                  className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white px-4 py-7 pb-26  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold w-full text-center font-medium leading-6 text-black"
                  >
                    add interfaces
                  </Dialog.Title>
                    <button
                      className="w-full mt-5 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      onClick={connectDiscord}
                    >
                      Connect discord
                    </button>
                  <button
                    className="w-full mt-4 mb-40 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    onClick={connectDiscord}
                  >
                    Connect discourse
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
