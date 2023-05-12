import { BaseModal } from "../BaseModal/BaseModal";
import {AddRepoModalProps} from "../types";
import * as utils from "../../../utils";
import {PrimaryButton} from "../../Button";
import {get, has, isEmpty, isNil} from "lodash";
import {toast} from "react-toastify";
import {useState} from "react";
import {useAppSelector} from "../../../store";
import {trpc} from "../../../utils/trpc";
import {isRight} from "../../../utils/fp";

const AddRepoModal = (props:AddRepoModalProps) => {
  const [url, setUrl] = useState<string | null>("");
  const [branch, setBranch] = useState<string | null>("");
  const [description, setDescription] = useState<string | null>("");
  const [addingRepo, setAddingRepo] = useState<boolean>(false);
  const [userNameError , setUserNameError] = useState<boolean>(false);
  const [urlError , setUrlError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [branchError , setBranchError] = useState<boolean>(false);

  const user = useAppSelector((state) => state.user);
  const userName = user?.userPlatforms[0].platformUsername;
  const adRepo = trpc.radicle.addRepo.useMutation();

  const handleUrlInput = (e) => {
    urlError && !isEmpty(e.target.value.trim())
      ? setUrlError(false)
      : null;
    setUrl(e.target.value);
  };

  const handleDescriptionInput = (e) => {
    descriptionError && !isEmpty(e.target.value.trim())
      ? setDescriptionError(false)
      : null;
    setDescription(e.target.value);
  };

  const handleBranchInput = (e) => {
    branchError && !isEmpty(e.target.value.trim())
      ? setBranchError(false)
      : null;
    setBranch(e.target.value);
  };

  const validateUrl = (url) => {
    const regex = /((git|ssh|http(s)?)|(git@[\w\.-]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\/)?/;
    const match = url.match(regex);
    if (!match) {
      toast.error("Invalid Url");
      setAddingRepo(false);
      setUrlError(true);
    }
    return match;
  }

  const handleSubmit = async () => {
    setAddingRepo(true);

    if (isEmpty(userName.trim())) {
      toast.error("Question cannot be empty");
      setAddingRepo(false);
      setUserNameError(true);
      return;
    }
    if (isEmpty(url.trim())) {
      toast.error("Description cannot be empty");
      setAddingRepo(false);
      setUrlError(true);
      return;
    }
    if(!validateUrl(url)){
      return;
    }

    if (isEmpty(branch.trim())) {
      toast.error("Branch Name cannot be empty");
      setAddingRepo(false);
      setBranchError(true);
      return;
    }

    if (isEmpty(description.trim())) {
      toast.error("Branch Name cannot be empty");
      setAddingRepo(false);
      setDescriptionError(true);
      return;
    }

    if (!has(user, "id") || isNil(get(user, "didSession"))) {
      toast.error("Please re-connect with your wallet!");
      setAddingRepo(false);
      return;
    }

    const result = await adRepo
      .mutateAsync({
        session: user?.didSession,
        userId: user?.id,
        username: userName,
        repoUrl: utils.keepOrAppendGit(url),
        description: description,
        branch: branch,
      });

    if(isRight(result)){
      toast.success("repo added");
      setUrl("");
      setBranch("");
      setDescription("");
      props?.onDone();
    }
    else{
      toast.error("error occurred");
    }
    setAddingRepo(false);
  };

  return (
    <BaseModal
      open={props.open}
      title={props.title}
      onClose={props.onClose}
    >
      <div className="form-group mb-6 mt-2">
        <input
          tabIndex={1}
          id="userName"
          className={utils.classNames(
            "form-control mb-3 block w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
            userNameError ? "border-red-600 focus:border-red-600" : ""
          )}
          maxLength={500}
          placeholder="Enter user name"
          type="text"
          value={userName}
          readOnly
          required
        />
        <input
          tabIndex={1}
          id="Url"
          className={utils.classNames(
            "form-control mb-3 block w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
            urlError ? "border-red-600 focus:border-red-600" : ""
          )}
          maxLength={500}
          placeholder="Enter Repository url"
          type="text"
          value={url}
          onChange={handleUrlInput}
          required
        />
        <input
          tabIndex={1}
          id="branch"
          className={utils.classNames(
            "form-control mb-3 block w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-2 px-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
            branchError ? "border-red-600 focus:border-red-600" : ""
          )}
          maxLength={500}
          placeholder="Branch name ex.(main, master)"
          type="text"
          value={branch}
          onChange={handleBranchInput}
          required
        />
        <textarea
          tabIndex={2}
          id="description"
          className={utils.classNames(
            "form-control mb-3 block h-[200px] min-h-[120px] w-full rounded-[10px] border-2 border-solid border-[#F1F1F1] bg-white bg-clip-padding p-5 text-base font-normal text-gray-700 focus:border-gray-400 focus:bg-white focus:text-gray-700 focus:outline-none",
            descriptionError ? "border-red-600 focus:border-red-600" : ""
          )}
          placeholder="Description"
          value={description}
          maxLength={2000}
          onChange={handleDescriptionInput}
          required
        />

        <PrimaryButton
          classes={"w-full mt-4"}
          loading={addingRepo}
          title={addingRepo ? "Adding..." : "Add Repo"}
          onClick={handleSubmit}
        />
      </div>
    </BaseModal>
  )
};

export default AddRepoModal;
