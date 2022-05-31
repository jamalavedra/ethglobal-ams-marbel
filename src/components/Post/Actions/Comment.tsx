import { LensterPost } from '@generated/lenstertypes'
import { ReplyIcon } from '@heroicons/react/solid'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  post: LensterPost
}

const Comment: FC<Props> = ({ post }) => {
  return (
    <motion.button whileTap={{ scale: 0.9 }} aria-label="Comment">
      <Link href={`/posts/${post?.id}`}>
        <a
          href={`/posts/${post?.id}`}
          className="flex items-center border border-brand-500 text-brand hover:bg-brand-100 focus:ring-brand-400 px-2 py-0.5 text-white space-x-1 rounded"
        >
          <ReplyIcon className="w-[18px]" />
          <p>{'Reply'}</p>
        </a>
      </Link>
    </motion.button>
  )
}

export default Comment
