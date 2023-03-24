import { BaseModal } from "../BaseModal/BaseModal";
import { BaseModalProps } from "../types";

const Question = (props: BaseModalProps) => {
  return (
    <>
      <BaseModal
        title={props.title}
        open={props.open}
        onClose={props.onClose}
        classNameContent="sm:max-w-[741px] sm:rounded-[15px] font-inter font-bold text-xl leading-6 text-black dark:text-white"
        classNameTitle="p-5 pt-0 box-border"
      >
        {props.children}
      </BaseModal>
    </>
  );
};

export default Question;
