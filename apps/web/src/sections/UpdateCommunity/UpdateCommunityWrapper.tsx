import {useAppSelector} from "../../store";
import {UpdateCommunity} from "./UpdateCommunity";

export const UpdateCommunityWrapper = () => {
  const communityId = useAppSelector((state) => state.community.updateCommunityId);
  return (
    <>
      {communityId ? (
        <div className={"fixed top-0 right-0 w-full md:w-96 bg-white md:block border-l"}>
          <UpdateCommunity communityId={communityId}/>
        </div>
      ) : null}
    </>
  );
};
