import {NavBar} from "../NavBar";
import {CommunityAvatar} from "../CommunityAvatar";
import {trpc} from "../../utils/trpc";
import {get} from "lodash";
import Link from "next/link";

const Layout = (props) => {
  const communities = trpc.public.fetchAllCommunities.useQuery();

  const getCommunityList = () => {
    if (!communities.data || communities.data.length == 0) {
      return <></>;
    }

    return communities.data.map((community, index) => {
      const name = community.node.communityName;
      const image = get(community, "node.socialPlatforms.edges[0].node.communityAvatar") || "https://placekitten.com/200/200";
      const redirect = {
        pathname: `/[id]/community`,
        query: {id: community.node.id},
      };
      return (
        <Link key={index} href={redirect}>
          <CommunityAvatar name={name} image={image}/>
        </Link>
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
        <div className="flex flex-col gap-7 px-6 py-10 border-r h-screen sm:hidden md:flex">
          {getCommunityList()}
        </div>
        <div className="relative mx-auto w-full grow px-5 lg:px-0">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
