import { Button } from '@components/UI/Button'
import { Input } from '@components/UI/Input'
import { MentionTextArea } from '@components/UI/MentionTextArea'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ArrowRightIcon } from '@heroicons/react/solid'
import React from 'react'

export default function Welcome() {
  // current step
  const [step, setStep] = React.useState(0)

  return (
    <div className="flex justify-between h-full overflow-hidden">
      <div className="xl:w-2/4 flex justify-top items-center flex-col w-full">
        <div className="flex flex-col mt-5 content-start items-start w-3/4">
          <div className="flex">
            <img className="w-12 h-12" src="/logo.svg" alt="Marbel" />
            <p className="pt-2 text-2xl font-bold italic">{'Marbel'}</p>
          </div>
          <div className="flex my-10">
            <button
              onClick={() => (step > 0 ? setStep(0) : null)}
              className={`pointer w-20 h-2 ${
                step == 0 ? 'bg-green-400' : 'bg-gray-300'
              } mr-2 rounded-sm`}
            />
            <button
              onClick={() => (step > 1 ? setStep(1) : null)}
              className={`pointer w-20 h-2 ${
                step == 1 ? 'bg-green-400' : 'bg-gray-300'
              } mr-2 rounded-sm`}
            />
            <button
              onClick={() => (step > 2 ? setStep(2) : null)}
              className={`pointer w-20 h-2 ${
                step == 2 ? 'bg-green-400' : 'bg-gray-300'
              } mr-2 rounded-sm`}
            />
            <button
              onClick={() => (step > 3 ? setStep(3) : null)}
              className={`pointer w-20 h-2 ${
                step == 3 ? 'bg-green-400' : 'bg-gray-300'
              } mr-2 rounded-sm`}
            />
          </div>
          {step === 0 && (
            <div>
              <h1 className="text-5xl font-extrabold mb-3 text-left leading-tight">
                What do you plan to use Marbel for?
              </h1>
              <div className="mt-2">
                <p className="text font-medium mb-10 text-left">
                  We will provide helpful resources to help you get started
                </p>
                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={() =>
                      step < 4 ? setStep((step) => step + 1) : null
                    }
                    icon={<ArrowRightIcon className="w-4 h-5 text-white" />}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h1 className="text-5xl font-extrabold mb-3 text-left leading-tight">
                What is the name of your Workspace
              </h1>
              <div className="mt-2">
                <p className="text font-medium mb-10 text-left">
                  A Workspace is where bookmarks can be accessed
                </p>
                <Input label="Name" placeholder="Workspace Name" />
                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={() =>
                      step < 4 ? setStep((step) => step + 1) : null
                    }
                    icon={<ArrowRightIcon className="w-4 h-5 text-white" />}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h1 className="text-5xl font-extrabold mb-3 text-left leading-tight">
                Who do you collaborate with?
              </h1>
              <div className="mt-2">
                <p className="text font-medium mb-10 text-left">
                  Invite teammates so they can easily access secure bookmarks
                  and collaborate in the Team library
                </p>
                <div className="flex items-center mb-1 space-x-1.5">
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {'Email addressess'}
                  </div>
                </div>
                <MentionTextArea
                  value=""
                  setValue={() => {}}
                  error=""
                  setError={() => {}}
                  placeholder="Separate emails with space, comma, tab or enter"
                />
                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={() =>
                      step < 4 ? setStep((step) => step + 1) : null
                    }
                    icon={<ArrowRightIcon className="w-4 h-5 text-white" />}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h1 className="text-5xl font-extrabold mb-3 text-left leading-tight">
                Add your first website
              </h1>
              <div className="mt-2">
                <div className="bg-gray-200 rounded my-10 p-5">
                  <p className="text font-bold mb-5 text-left">
                    Install Chrome extension
                  </p>
                  <p className="mb-10 text-gray-600 text-sm">
                    Basic storing needs and fast set up
                  </p>
                  <Button
                    size="lg"
                    icon={<ExternalLinkIcon className="w-4 h-5 text-white" />}
                  >
                    Install extension
                  </Button>
                </div>
                <div className="mt-8">
                  <Button
                    size="lg"
                    variant="none"
                    onClick={() =>
                      step < 4 ? setStep((step) => step + 1) : null
                    }
                    icon={<ArrowRightIcon className="w-4 h-5 text-black" />}
                  >
                    Continue to workspace
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          height: '100vh',
          padding: '100px 0 50px 0'
        }}
        className="bg-indigo-500 w-2/4 bg-cover bg-no-repeat xl:grid grid-flow-row content-center items-center flex-col overflow-hidden hidden"
      >
        <img className="h-3/4 w-auto m-auto" src={'/commentDemo.svg'} />
      </div>
    </div>
  )
}
