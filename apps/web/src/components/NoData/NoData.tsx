interface NoDataProps {
  title: string;
  description: string;
}

export const NoData = (props: NoDataProps) => {
  return (
    <div className="grid min-h-full place-items-center px-4 lg:px-8">
      <div className="text-center">
        <p className="text-2xl m-2 font-bold text-accent">(❍ᴥ❍ʋ)</p>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-2xl">
          {props.title}
        </h1>
        <p className="mt-1 text-sm leading-7 text-gray-600">
          {props.description}
        </p>
      </div>
    </div>
  );
};
