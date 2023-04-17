import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Markdown = (props: {markdown: string}) => {
  return (
    <ReactMarkdown 
      className="prose prose-zinc" 
      remarkPlugins={[remarkGfm]}
    >
      {props.markdown}
    </ReactMarkdown>
  );
}
