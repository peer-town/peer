import {useAppSelector} from "../../store";
import {UserProfile} from "../../components/UserProfile";

export const UserProfileWrapper = () => {
  const profileId = useAppSelector((state) => state.profile.userProfileId);
  return (
    <>
      {profileId ? (
        <div className={"fixed top-0 right-0 w-full md:w-96 bg-white md:block border-l"}>
          <UserProfile userStreamId={profileId}/>
        </div>
      ) : null}
    </>
  );
};
