import {useState} from 'react'
import {WebOnBoardProps} from "../types";
import {BaseModal} from "../BaseModal/BaseModal";

export const WebOnBoardModal = (props: WebOnBoardProps) => {
  const [name, setName] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();

  const onSave = (event) => {
    event.preventDefault();
    props.onSubmit({name, imageUrl});
  }

  return (
    <BaseModal open={props.open} title={"your details"} onClose={()=>{}}>
      <form onSubmit={onSave}>
        <input
          className="w-full mt-5 h-12 border-solid border-2 border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          placeholder="name"
          type="text"
          maxLength={100}
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
    </BaseModal>
  )
}
