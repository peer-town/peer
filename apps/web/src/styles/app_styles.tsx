export const md_component = "max-680:ml-[0px]";

export const md_index_grid = "860-1001:grid-cols-3 580-861:grid-cols-2  min-1001:grid-cols-2";
export const md_index_container = "max-680";
export const index_title = "min-680:hidden ";
export const mobile_font = "mobile:text-2xl"

export const threadListToggle = (communityId,threadId) => {
  return `max-680:${(communityId && !threadId) ? 'block' :'hidden '} max-680:w-full`
}
export const selectedThreadToggle = (communityId,threadId) => {
  return `max-680:${(communityId && threadId) ? 'block ' :'hidden'} max-680:w-full`
}

export const threadListFeedToggle = (threadId) => {
  return `max-680:${(!threadId) ? 'block' :'hidden '} max-680:w-full`
}
export const selectedThreadFeedToggle = (threadId) => {
  return `max-680:${(threadId) ? 'block ' :'hidden'} max-680:w-full`
}