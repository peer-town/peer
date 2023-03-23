import { useState } from "react";
import { SecondaryButton } from "../Button/SecondaryButton";
import Question from "../Modal/Question/Question";
import * as utils from "../../utils";
import { get, has, isEmpty } from "lodash";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";
import { constants } from "../../config";
import { isRight } from "../../utils/fp";
import { config } from "../../config";
import { CreateThreadProps } from "./type";

const CreateThread = (props: CreateThreadProps) => {
  const [question, setQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [creatingThread, setCreatingThread] = useState<boolean>(false);
  const [questionError, setQuestionError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);

  const { user, community, did, didSession, refetch } = props;
  const userName = user.userPlatforms && user.userPlatforms[0].platformUsername;
  const communityName = community.communityName;
  const communityId = community.selectedCommunity;

  const createThread = trpc.thread.createThread.useMutation();
  const updateThreadWithSocilaId =
    trpc.thread.updateThreadWithSocialId.useMutation();

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

    if (!has(user, "id") || !didSession) {
      toast.error("Please re-connect with your wallet!");
      return;
    }

    if (!communityId) {
      toast.error("Please select community");
      return;
    }

    setCreatingThread(true);

    const result = await createThread
      .mutateAsync({
        session: didSession,
        communityId: communityId,
        userId: user.id,
        threadId: "null", //social id
        title: question,
        body: description,
        createdFrom: constants.CREATED_FROM_DEVNODE,
        createdAt: new Date().toISOString(),
      })
      

    if (isRight(result)) {
      const threadId = get(result, "value.createThread.document.id");
      await handleWebToAggregator(threadId)
        .then(async (response) => {
          const data = await response.json();
          const result = await updateThreadWithSocilaId.mutateAsync({
            session: didSession,
            streamId: threadId,
            threadId: get(data,"data.threadId"),
          });

          if (isRight(result)) {
            setQuestion("");
            setDescription("");
            toast.success("Thread created successfully!");
            refetch();
          } else {
            toast.error("Failed to create thread. Try again in a while!");
          }
        })
        .catch(() => {
          toast.error("Failed to create thread. Try again in a while!");
        }).finally(() => setCreatingThread(false));
    } else {
      toast.error("Failed to create thread. Try again in a while!");
    }
  };

  const handleWebToAggregator = async (threadId: string) => {
    const endpoint = `${config.aggregator.endpoint}/web-thread`;
    return await fetch(endpoint, {
      body: JSON.stringify({
        threadId: threadId,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <Question title={"Ask question"} open={props.open} onClose={props.onClose}>
      <div className="form-group mb-6">
        <input
          className={utils.classNames(
            "form-control mb-3 block w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
            questionError ? "border-red-600 focus:border-red-600" : ""
          )}
          placeholder="What is your question?"
          type="text"
          value={question}
          onChange={handleQuestionInput}
          required
        />
        <textarea
          className={utils.classNames(
            "form-control mb-3 block h-[264px] min-h-[120px] w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
            descriptionError ? "border-red-600 focus:border-red-600" : ""
          )}
          placeholder="Describe your question"
          value={description}
          onChange={handleDescriptionInput}
          required
        />
        <div className=" mb-3 block flex w-full flex-col rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none">
          <div className="flex w-full flex-row items-center justify-center ">
            <div className="w-1/4 whitespace-normal break-all p-2 font-bold">
              User name
            </div>
            <div className="w-3/4 whitespace-normal break-all p-2 text-gray-700">
              {userName}{" "}
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-center">
            <div className="w-1/4 whitespace-normal break-all p-2 font-bold">
              Community name{" "}
            </div>
            <div className="w-3/4 whitespace-normal break-all p-2 text-gray-700">
              {communityName}
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-center">
            <div className="w-1/4 whitespace-normal break-all p-2 font-bold">
              Posting as{" "}
            </div>
            <div className="w-3/4 whitespace-normal break-all p-2 text-gray-700">
              {did}
            </div>
          </div>
        </div>
        <SecondaryButton
          classes={"m-auto mt-4 w-full justify-center"}
          loading={creatingThread}
          title={creatingThread ? "Creating..." : "Create Thread"}
          onClick={handleSubmit}
        />
      </div>
    </Question>
  );
};

export default CreateThread;
