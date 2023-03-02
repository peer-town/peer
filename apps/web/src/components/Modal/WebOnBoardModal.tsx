import {Dialog, Transition} from '@headlessui/react'
import {Fragment, useState} from 'react'
import {WebOnBoardProps} from "./types";

export const WebOnBoardModal = (props: WebOnBoardProps) => {
  const [name, setName] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();

  const onSave = (event) => {
    event.preventDefault()
    props.onSubmit({name, imageUrl});
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
                  className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white px-4 py-7 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold w-full text-center font-medium leading-6 text-black"
                  >
                    your details
                  </Dialog.Title>
                  <form onSubmit={onSave}>
                    <input
                      className="w-full mt-5 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      placeholder="name"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      required={true}
                    />
                    <input
                      className="w-full mt-5 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                      placeholder="image url"
                      type="url"
                      onChange={(e) => setImageUrl(e.target.value)}
                      required={true}
                    />
                    <button
                      type="submit"
                      className="inline-flex mt-24 h-12 w-full leading-8 justify-center rounded-md border border-transparent bg-[#3478F6] px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none"
                    >
                      Save
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
