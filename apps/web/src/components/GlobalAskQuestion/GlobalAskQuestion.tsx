import {GlobalCreateThread} from "../Thread";
import {useState} from "react";

const GlobalAskQuestion = () => {
  const [questionModal, setQuestionModal] = useState<boolean>(false);

  const AskQuestion = () => {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="52" fill="#5865F2"/>
          <path d="M18 34V29H28V24H33V19H18V24H8V14H13V9H38V14H43V24H38V29H33V34H18ZM18 44V39H33V44H18Z" fill="white"/>
        </svg>

    )
  }

  return (
      <div>
        <button
            title="ask a question"
            className="h-[50px] min-w-[50px] outline-none border-none"
            onClick={() => setQuestionModal(true)}
        >
          <AskQuestion/>
        </button>
        <GlobalCreateThread
            title={"Ask Question"}
            open={questionModal}
            onClose={() => setQuestionModal(false)}
        />
      </div>
  )
}
export default GlobalAskQuestion;