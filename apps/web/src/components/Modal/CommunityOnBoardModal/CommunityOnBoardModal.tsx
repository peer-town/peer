import { useState} from "react";
import { CommunityOnBoardProps } from "../types";
import { BaseModal } from "../BaseModal/BaseModal";
import {Spinner} from "../../Icons";
import {TagMultiSelect} from "../../Tag";
import {toast} from "react-toastify";
import {constants} from "../../../config";

export const CommunityOnBoardModal = (props: CommunityOnBoardProps) => {
  const [name, setName] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [submitting, setIsSubmitting] = useState<boolean>(false );
  const [tags, setTags] = useState<{id:string,tag:string}[]>([]);
  const minLimit = constants.TAG_MIN_LIMIT;
  const onSave = (event) => {
    event.preventDefault();
    if(tags.length<minLimit){
      toast.error(`Select at least ${minLimit} tags`);
      return;
    }
    setIsSubmitting(true);
    props.onSubmit({ name, description, imageUrl, tags})
      .finally(() => setIsSubmitting(false));
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
        <div
          className="mt-5  h-auto w-full rounded-md border-2 border-solid border-gray-200 text-sm leading-5 text-gray-900 focus:ring-0"
        >
          <TagMultiSelect selectedData={tags} setData={setTags} placeholder={"Select tag"}/>
        </div>
        <button
          type="submit"
          className="flex mt-24 h-12 w-full leading-8 justify-center items-center rounded-md border border-transparent bg-[#08010D] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
        >
          {submitting && <Spinner color={"text-white"} />}
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </BaseModal>
  );
};
