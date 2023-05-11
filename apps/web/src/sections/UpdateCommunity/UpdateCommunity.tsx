import {useEffect, useState} from "react";
import {clearUpdateCommunityId, useAppDispatch, useAppSelector} from "../../store";
import {CloseIcon, Spinner} from "../../components/Icons";
import Image from "next/image";
import {trpc} from "../../utils/trpc";
import {Loader} from "../../components/Loader";
import {isRight} from "../../utils/fp";
import {get, has, isNil} from "lodash";
import {getDevnodeSocialPlatform} from "../../utils";
import {toast} from "react-toastify";

interface Props {
  communityId: string;
}

export const UpdateCommunity = (props: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [name, setName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [submitting, setIsSubmitting] = useState<boolean>(false);

  const community = trpc.community.fetchCommunityUsingStreamId.useQuery({streamId: props.communityId});
  const updateCommunity = trpc.community.updateCommunityDetails.useMutation();
  const socialPlatform = getDevnodeSocialPlatform(get(community.data, "value.node.socialPlatforms.edges"));

  useEffect(() => {
    if (isRight(community.data)) {
      setName(get(community.data, "value.node.communityName"));
      setDescription(get(community.data, "value.node.description"));
      setImageUrl(get(socialPlatform, "node.communityAvatar"));
    }
  }, [community.data]);

  if (community.isLoading) {
    return <Loader />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!has(user, "id") || isNil(get(user, "didSession"))) {
      toast.error("Please re-connect with your wallet!");
      return;
    }
    const result = await updateCommunity.mutateAsync({
      session: get(user, "didSession"),
      communityId: props.communityId,
      socialPlatformId: get(socialPlatform, "node.id"),
      communityName: name,
      communityAvatar: imageUrl,
      description: description,
    });
    if (isRight(result)) {
      await community.refetch();
      toast.success("Community updated successfully");
    } else {
      toast.error("Error updating community details");
    }
  }

  return (
    <div className="w-full h-screen scrollbar-hide overflow-y-scroll">
      <button
        className="p-4"
        onClick={() => dispatch(clearUpdateCommunityId())}
      >
        <CloseIcon/>
      </button>
      <div className="p-4">
        <form onSubmit={(e) => {
          setIsSubmitting(true);
          onSubmit(e).finally(() => setIsSubmitting(false));
        }}>
         <Image
          className={"rounded-2xl border mx-auto"}
          src={imageUrl || get(socialPlatform, "node.communityAvatar")}
          alt={`community ${name}`}
          width={126}
          height={126}
        />
          <input
            className="mt-5 h-12 w-full rounded-md border border-solid border-gray-200 py-2 px-3 text-sm leading-5 text-gray-900 focus:ring-0 focus:border-gray-400 focus:bg-white focus:outline-none"
            placeholder="community name"
            type="text"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
          />
          <textarea
            className="mt-5 h-28 w-full rounded-md border border-solid border-gray-200 py-2 px-3 text-sm leading-5 text-gray-900 focus:ring-0 focus:border-gray-400 focus:bg-white focus:outline-none"
            placeholder="community description"
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required={true}
          />
          <input
            className="mt-5 h-12 w-full rounded-md border border-solid border-gray-200 py-2 px-3 text-sm leading-5 text-gray-900 focus:ring-0 focus:border-gray-400 focus:bg-white focus:outline-none"
            placeholder="image url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required={true}
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex cursor-pointer mt-5 h-10 ml-auto leading-8 justify-center items-center rounded-md border border-transparent bg-[#08010D] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none"
          >
            {submitting && <Spinner color={"text-white"}/>}
            {submitting ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
