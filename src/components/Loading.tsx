import { FC } from 'react'
import { Spinner } from './UI/Spinner'

const Loading: FC = () => {
  return (
    <div className="flex flex-grow justify-center items-center h-screen animate-pulse">
      <span className="flex justify-center p-5">
        <Spinner size="sm" />
      </span>
    </div>
  )
}

export default Loading
