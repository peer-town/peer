import {CreateTagProps} from "./types";
import {trpc} from "../../utils/trpc";
import {useAppSelector} from "../../store";
import {isNil} from "lodash";
import {useState} from "react";
import {toast} from "react-toastify";
import {isRight} from "../../utils/fp";
import {PrimaryButton} from "../Button";

const CreateTag = (props: CreateTagProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {title, tag, refetch} = props;
  const user = useAppSelector(state => state.user);
  const createTag = trpc.tag.createTag.useMutation();

  const handleCreateTag = async () => {
    if (isNil(user.id) || isNil(user.didSession)) {
      toast.error("Please re-connect with your wallet")
    }
    setLoading(true);
    const response = await createTag.mutateAsync({
      session:user.didSession,
      tag:tag
    });
    if(isRight(response)){
      toast.success("tag created");
      refetch();
    }
    else {
      toast.error("Failed to create tag. Try again in a while!");
    }
    setLoading(false);
  }

  return (
      <div>
        <PrimaryButton
            title={loading ? "creating.." : title}
            onClick={handleCreateTag}
            loading={loading}
        />
      </div>
  )
}
export default CreateTag;