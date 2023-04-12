
interface LoadMoreProps {
  title: string;
  isFetching: boolean;
  hasNextPage: boolean;
  next(): void;
}

export const LoadMore = (props: LoadMoreProps) => {
  return (
    <>
      {props.hasNextPage ? (
        <div className="w-full cursor-pointer my-4 text-center p-4" onClick={props.next}>
          <p id="loader-button" className="border bg-white w-max mx-auto py-2 px-4 rounded-2xl text-sm text-gray-500 hover:text-gray-700">
            {props.isFetching ? "Loading..." : props.title}
          </p>
        </div>
      ) : null}
    </>
  );
}
