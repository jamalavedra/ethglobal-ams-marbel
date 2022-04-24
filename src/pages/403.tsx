import { Button } from '@components/UI/Button'
import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="flex-col page-center">
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">Login required!</h1>
        <div className="mb-4">Please, login and reload this page</div>
        <Link href="/">
          <a href="/">
            <Button
              className="flex mx-auto item-center"
              size="lg"
              icon={<HomeIcon className="w-4 h-4" />}
            >
              <div>Go to home</div>
            </Button>
          </a>
        </Link>
      </div>
    </div>
  )
}
