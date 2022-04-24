import AppContext from '@components/utils/AppContext'
import Link from 'next/link'
import { FC, useContext } from 'react'

const Footer: FC = () => {
  const { staffMode } = useContext(AppContext)

  return (
    <footer
      className={`mt-4 leading-7 text-sm sticky flex flex-wrap px-3 lg:px-0 gap-x-[12px] ${
        staffMode ? 'top-28' : 'top-20'
      }`}
    >
      <span className="font-bold text-gray-500 dark:text-gray-300">
        © Marbel
      </span>

      <span>
        {' '}
        <a
          target="_blank"
          className="text-blue-600"
          rel="noreferrer noopener"
          href="https://twitter.com/joalavedra"
        >
          @jamalavedra
        </a>
      </span>
      <span>
        <a
          target="_blank"
          className="text-blue-600"
          rel="noreferrer noopener"
          href="https://twitter.com/jamalavedra"
        >
          @joalavedra
        </a>
      </span>
    </footer>
  )
}

export default Footer
