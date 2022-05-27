import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { FC } from 'react'
import { useRouter } from 'next/router'

import MenuItems from './MenuItems'
// import MoreNavItems from './MoreNavItems'

const Navbar: FC = () => {
  const router = useRouter()

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {({ open }) => (
        <>
          <div className="container px-5 mx-auto max-w-screen-xl">
            <div className="flex relative justify-between items-center h-14 sm:h-16">
              <div className="flex justify-start items-center">
                <Disclosure.Button className="inline-flex justify-center items-center mr-4 text-gray-500 rounded-md sm:hidden focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>

                {router.pathname === '/' ? (
                  <Link href="/">
                    <a className="text-3xl flex font-black">
                      <img className="w-12 h-12" src="/logo.svg" alt="Marbel" />
                      <p className="pt-2 text-2xl font-medium">{'Marbel'}</p>
                    </a>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
              <div className="flex gap-8 items-center">
                <MenuItems />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex flex-col p-3 space-y-2">
              <div className="mb-2"></div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
