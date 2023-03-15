import {NavBar} from "../NavBar";
import {CommunityAvatar} from "../CommunityAvatar";
import {trpc} from "../../utils/trpc";
import * as utils from "../../utils";
import {has, get, isNil, isEmpty} from "lodash";
import {selectCommunity, useAppDispatch, useAppSelector} from "../../store";

const Layout = (props) => {
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(state => state.community.selectedCommunity);
  const communities = trpc.public.fetchAllCommunities.useQuery();

  const handleOnCommunityClick = (id: string) => {
    dispatch(selectCommunity(id));
  }

  const getCommunityList = () => {
    if (isNil(communities.data) || isEmpty(communities.data)) {
      return <></>;
    }

    if (isEmpty(communityId) && has(communities, "data[0].node.id")) {
        handleOnCommunityClick(get(communities, "data[0].node.id"));
    }

    return communities.data.map((community, index) => {
      if(!community.node) return <></>;

      const name = community.node.communityName;
      const image = get(community, "node.socialPlatforms.edges[0].node.communityAvatar") || "https://placekitten.com/200/200";
      const selected = community.node.id == communityId;
      return (
        <CommunityAvatar
          classes={""}
          key={index}
          name={name}
          image={image}
          selected={selected}
          onClick={() => handleOnCommunityClick(community.node.id)}
        />
      );
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        handleDiscordUser={props.handleDiscordUser}
        handleDidSession={props.handleDidSession}
      />
      <div className="flex flex-row">
        <div className="flex flex-col gap-7 py-10 border-r h-screen sm:hidden md:flex " >
        <CommunityAvatar
          classes={utils.classNames(
            "bg-slate-300	w-full rounded-full hover:rounded-xl hover:bg-slate-500" 
          )}
          width={25}
          name={"create community"}
          image={"/plus.png"}
          selected={false}
          onClick={() => {}}
        />
          {getCommunityList()}
        </div>
        <div className="relative mx-auto w-full grow px-6">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
