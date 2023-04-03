import { useState } from "react";
import { CommunityOnBoardProps } from "../types";
import { BaseModal } from "../BaseModal/BaseModal";

export const CommunityOnBoardModal = (props: CommunityOnBoardProps) => {
  const [name, setName] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [tags, setTags] = useState<string>();
  const [description, setDescription] = useState<string>();

  const onSave = (event) => {
    event.preventDefault();
    props.onSubmit({ name, description, imageUrl, tags });
  };

  return (
    <BaseModal
      open={props.open}
      title={"community details"}
      onClose={()=>{}}
    >
      <form onSubmit={onSave}>
        <input
          className="mt-5 h-12 w-full rounded-md border-2 border-solid border-gray-200 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          placeholder="community name"
          type="text"
          maxLength={100}
          onChange={(e) => setName(e.target.value)}
          required={true}
        />
        <textarea
          className="mt-5 h-28 w-full rounded-md border-2 border-solid border-gray-200 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          placeholder="community description"
          maxLength={1000}
          onChange={(e) => setDescription(e.target.value)}
          required={true}
        />
        <input
          className="mt-5 h-12 w-full rounded-md border-2 border-solid border-gray-200 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          placeholder="image url"
          type="url"
          onChange={(e) => setImageUrl(e.target.value)}
          required={true}
        />
        <input
          className="mt-5 h-12 w-full rounded-md border-2 border-solid border-gray-200 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          placeholder="tags"
          type="text"
          onChange={(e) => setTags(e.target.value)}
          required={true}
        />
        <button
          type="submit"
          className="mt-24 inline-flex h-12 w-full justify-center rounded-md border border-transparent bg-[#3478F6] px-4 py-2 text-sm font-medium leading-8 text-white hover:bg-blue-400 focus:outline-none"
        >
          Save
        </button>
      </form>
    </BaseModal>
  );
};
