import { ArrowUpIcon, ChatBubbleLeftIcon, BookmarkIcon } from '@heroicons/react/24/outline'

type ThoughtCardProps = {
    content: string
    createdAt: string
    author?: {
      username?: string
    }
    votes?: number
    comments?: number
    color?: string
    font?: string
  }
  
  const ThoughtCard = ({
    content,
    createdAt,
    author,
    votes = 0,
    comments = 0,
    // color,
    // font
  }: ThoughtCardProps) => {
    return (
      <div
        className="rounded-xl border border-gray-300 p-4 relative bg-repeat  bg-[#fefae0]"
        style={{
            backgroundImage: `repeating-linear-gradient(
                to bottom,
                #fefae0 0px,
                #fefae0 23px,
                #e0d9c7 24px
              )`,
          backgroundSize: 'auto 24px',
          fontFamily: 'Nanum Brush Script',
          maxWidth: '350px',
          backgroundColor:  '#fefae0'
        }}
      >
      {/* Author and Date */}
      <div className="mb-4">
        <p className="font-bold text-2xl">{author?.username || 'Anonymous'}</p>
        <p className="text-xl text-gray-600">{new Date(createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}</p>
      </div>

      {/* Content */}
      <p className="text-3xl mb-6 break-words">{content}</p>

      {/* Bottom Actions */}
<div className="flex items-center font-serif justify-between text-gray-600 text-sm">
  <div className="flex items-center gap-1 cursor-pointer group transition-colors duration-200 hover:text-[#C9A889] px-2 py-1 rounded-md hover:bg-[#F5F3EF]">
    <ArrowUpIcon className="h-4 w-4 transition-colors duration-200 group-hover:stroke-[#C9A889]" />
    <span className="transition-colors duration-200 group-hover:text-[#C9A889]">{votes}</span>
  </div>
  <div className="flex items-center gap-1 cursor-pointer group transition-colors duration-200 hover:text-[#C9A889] px-2 py-1 rounded-md hover:bg-[#F5F3EF]">
    <ChatBubbleLeftIcon className="h-4 w-4 transition-colors duration-200 group-hover:stroke-[#C9A889]" />
    <span className="transition-colors duration-200 group-hover:text-[#C9A889]">{comments}</span>
  </div>
  <div className="cursor-pointer group transition-colors duration-200 px-2 py-1 rounded-md hover:bg-[#F5F3EF]">
    <BookmarkIcon className="h-4 w-4 transition-colors duration-200 group-hover:stroke-[#C9A889] group-hover:fill-[#F8F6F1]" />
  </div>
</div>
    </div>
  )
}

export default ThoughtCard