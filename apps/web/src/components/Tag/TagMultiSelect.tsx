import {useState} from "react";
import {has, isEmpty} from "lodash";
import {MultiSelectDropdown} from "../MultiSelectDropdown";
import {trpc} from "../../utils/trpc";
import {tagSelectProp} from "./types";
import {Chip} from "../Chip";
import {CreateTag} from "./index";

const TagMultiSelect = (props: tagSelectProp) => {

  const {selectedData, setData, placeholder} = props;
  const tagData = trpc.tag.getAllTags.useQuery();
  const [open, setOpen] = useState<boolean>(false);

  const tagFilteredData = has(tagData, "data.value") ? tagData.data?.value.map((tag) => tag.node) : [];

  const handleRefetch = async () => {
    await tagData.refetch()
  }
  const handleOpen = () => {
    setOpen((prevstate: boolean) => !prevstate)
  }
  const handleCloseTag = (removedTag) => {
    setData((prevState) => prevState.filter((tag) => tag !== removedTag));
  }
  return (
    <div className={"relative w-full h-full"}>
      <div className={"flex row w-full h-full items-center "}>
        <div className={"flex row gap-[10px] w-full p-3 flex-wrap"}>
          {isEmpty(selectedData) && <div className={"text-sm text-[#A2A8B4]"}> {placeholder} </div>}
          {selectedData && selectedData.length > 0 ? (selectedData.map((tag, index) => {
            return (<Chip key={index} text={tag.tag} onClose={() => {
              handleCloseTag(tag)
            }}/>)
          })) : null}
        </div>
        <div className={"w-[30px] h-[30px] text-center"} onClick={handleOpen}>
          <svg className="w-full h-full cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 14l-5-5h10l-5 5z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
      {open && (
        <div className={"absolute bottom-[-60px] w-full h-12"}>
          <MultiSelectDropdown
            dataArray={tagFilteredData}
            selectedData={selectedData}
            setData={setData}
            maxLimit={3}
            attribute={"tag"}
            NoDataComponent={(query: string) => (
              <>
                <div className={"w-full h-full flex row items-center"}>
                  <div className={"grow inline-block w-[30%]"}>
                    {"No tag found"}
                  </div>
                  <div className={"w-[70%"}>
                    <CreateTag tag={query} title={"create tag"} refetch={handleRefetch}/>
                  </div>
                </div>
              </>
            )}
          />
        </div>)}
    </div>
  )
}
export default TagMultiSelect;
