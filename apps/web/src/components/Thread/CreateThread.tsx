import {useState} from "react";
import Question from "../Modal/Question/Question";
import * as utils from "../../utils";
import {get, has, isEmpty, isNil} from "lodash";
import {toast} from "react-toastify";
import {trpc} from "../../utils/trpc";
import {constants} from "../../config";
import {isRight} from "../../utils/fp";
import {CreateThreadProps} from "./type";
import {useAppSelector} from "../../store";
import {PrimaryButton} from "../Button";
import {useRouter} from "next/router";

const CreateThread = (props: CreateThreadProps) => {
  const router = useRouter();
  const [question, setQuestion] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [creatingThread, setCreatingThread] = useState<boolean>(false);
  const [questionError, setQuestionError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);

  const user = useAppSelector((state) => state.user);
  const {communityId, communityName} = props.community;

  const createThread = trpc.thread.createThread.useMutation();

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

    if (!has(user, "id") || isNil(get(user, "didSession"))) {
      toast.error("Please re-connect with your wallet!");
      setCreatingThread(false);
      return;
    }

    if (!communityId) {
      toast.error("Please select community");
      setCreatingThread(false);
      return;
    }

    const result = await createThread
      .mutateAsync({
        session: user.didSession,
        communityId: communityId,
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
        query: {communityId, threadId},
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
            <div className="w-full whitespace-normal break-all p-2">
              Posting on <span className="font-bold">{communityName}</span>
            </div>
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

export default CreateThread;
