import { useEffect, useState } from "react";
import { useAppSelector } from "../../store";
import { trpc } from "../../utils/trpc";
import { SecondaryButton } from "../Button/SecondaryButton";
import { has, isNil } from "lodash";
import { isRight } from "../../utils/fp";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const JoinCommunity = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const [loading, setLoading] = useState<boolean>(false);
  const data = useAppSelector((state) => ({
    session:state.user.didSession,
    userId: state.user.id,
    userAuthor: state.user.author?.id,
  }));

  const hasUser = trpc.user.checkCommunityUser.useQuery({
    userAuthor: data.userAuthor,
    communityStreamId: communityId,
  });

  const createUserCommunityRelation =
    trpc.community.createUserCommunityRealtion.useMutation();

  const joinCommunityHandler = async () => {
    if(isNil(data.session)){
      toast.error("Please re-connect with your wallet!");
      return;
    }
    setLoading(true);
    const response = await createUserCommunityRelation.mutateAsync({
      session: data.session,
      userId: data.userId,
      communityId: communityId,
    });
    if (
      isRight(response) &&
      has(response.value, "createUserCommunity.document.id")
    ) {
      toast.success("Joined Community");
    } else {
      toast.error("Could not join community. Please try again later.");
    }
    setLoading(false);
    await hasUser.refetch();

  };
  return (
    <div>
      {(hasUser.data === false) && (
        <SecondaryButton
          classes={"w-full border-0 !rounded-none !bg-[#5865F2] justify-center !text-white"}
          loading={loading}
          title={loading ? "Joining..." : "Join Community"}
          onClick={joinCommunityHandler}
        />
      )}
    </div>
  );
};

export default JoinCommunity;
