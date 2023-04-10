import {useState} from "react";
import Question from "../Modal/Question/Question";
import * as utils from "../../utils";
import {get, has, isEmpty, isNil} from "lodash";
import {toast} from "react-toastify";
import {trpc} from "../../utils/trpc";
import {constants} from "../../config";
import {isRight} from "../../utils/fp";
import {GlobalCreateThreadProps, SelectedCommunity} from "./type";
import {useAppSelector} from "../../store";
import {PrimaryButton} from "../Button";
import {useRouter} from "next/router";
import Dropdown from "../Dropdown/Dropdown";

const GlobalCreateThread = (props: GlobalCreateThreadProps) => {
  const router = useRouter();
  const [question, setQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [creatingThread, setCreatingThread] = useState<boolean>(false);
  const [questionError, setQuestionError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [community, setCommunity] = useState<SelectedCommunity>({communityName: "", communityId: ""});

  const user = useAppSelector((state) => state.user);

  const createThread = trpc.thread.createThread.useMutation();
  const communities = trpc.user.getUserCommunities.useQuery({
    streamId: user.id,
    first: 10,
  });

  const getCommunityList = () => {
    if (isNil(communities.data) || isEmpty(communities.data)) {
      return <></>;
    }

    return communities.data.edges.map((communityNode, index) => {
      if (!communityNode.node) return null;

      const communityDetails = {
        communityId: communityNode.node?.community?.id,
        communityName: communityNode.node?.community?.communityName,
      };
      const communityAvatar = get(
          communityNode,
          "node.community.socialPlatforms.edges[0].node.communityAvatar"
      );
      return (
          <div key={index} className={"p-4 !text-gray-700 font-normal cursor-pointer border-b hover:bg-slate-200 "}
               onClick={() => {
                 setCommunity({...communityDetails})
               }}>
            <div className={"flex gap-[30px] items-center"}>
              <div className={"w-[20px] h-[20px] inline-block rounded-xl overflow-hidden"}>
                <img src={communityAvatar} alt="avatar" width="100%" height="100%"/>
              </div>
              {communityDetails.communityName}
            </div>
          </div>
      );
    });
  };

  const handleQuestionInput = (e) => {
    questionError && !isEmpty(e.target.value.trim())
        ? setQuestionError(false)
        : null;
    setQuestion(e.target.value);
  };

  const handleDescriptionInput = (e) => {
    descriptionError && !isEmpty(e.target.value.trim())
        ? setDescriptionError(false)
        : null;
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    setCreatingThread(true);

    if (isEmpty(question.trim())) {
      toast.error("Question cannot be empty");
      setCreatingThread(false);
      setQuestionError(true);
      return;
    }
    if (isEmpty(description.trim())) {
      toast.error("Description cannot be empty");
      setCreatingThread(false);
      setDescriptionError(true);
      return;
    }

    if (!has(user, "id") || !has(user, "didSession")) {
      toast.error("Please re-connect with your wallet!");
      return;
    }

    if (!community.communityId) {
      toast.error("Please select community");
      return;
    }

    setCreatingThread(true);
    const result = await createThread
        .mutateAsync({
          session: user.didSession,
          communityId: community.communityId,
          userId: user.id,
          title: question,
          body: description,
          createdFrom: constants.CREATED_FROM_DEVNODE,
          createdAt: new Date().toISOString(),
        });
    if (isRight(result)) {
      setQuestion("");
      setDescription("");
      toast.success("Thread created successfully!");

      const threadId = get(result, "value.createThread.createThread.document.id");
      await router.push({
        pathname: "/community",
        query: {communityId: community.communityId, threadId},
      });
      props.onClose();
    } else {
      toast.error("Failed to create thread. Try again in a while!");
    }
    setCreatingThread(false)
  };

  return (
      <Question title={"Ask question"} open={props.open} onClose={props.onClose}>
        <div className="form-group mb-6">
          <input
              id="question-title"
              className={utils.classNames(
                  "form-control mb-3 block w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
                  questionError ? "border-red-600 focus:border-red-600" : ""
              )}
              maxLength={500}
              placeholder="What is your question?"
              type="text"
              value={question}
              onChange={handleQuestionInput}
              required
          />
          <textarea
              id="question-desc"
              className={utils.classNames(
                  "form-control mb-3 block h-[264px] min-h-[120px] w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
                  descriptionError ? "border-red-600 focus:border-red-600" : ""
              )}
              placeholder="Describe your question"
              value={description}
              maxLength={2000}
              onChange={handleDescriptionInput}
              required
          />
          <div
              className=" mb-3 block flex w-full flex-col rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none">
            <Dropdown selected={community.communityName} placeholder={"Select Community"}>
              {getCommunityList()}
            </Dropdown>
          </div>
          <PrimaryButton
              classes={"w-full mt-4"}
              loading={creatingThread}
              title={creatingThread ? "Posting..." : "Post Thread"}
              onClick={handleSubmit}
          />
        </div>
      </Question>
  );
};

export default GlobalCreateThread;