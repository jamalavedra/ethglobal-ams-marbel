import Slug from '@components/Shared/Slug'
import { UserSuggestion } from '@generated/lenstertypes'
import clsx from 'clsx'
import { Dispatch, FC } from 'react'
import { TextArea } from './TextArea'

interface UserProps {
  suggestion: UserSuggestion
  focused: boolean
}

const User: FC<UserProps> = ({ suggestion, focused }) => (
  <div
    className={clsx(
      { 'bg-gray-100 dark:bg-gray-800': focused },
      'flex items-center space-x-2 m-1.5 px-3 py-1.5 rounded-xl'
    )}
  >
    <div className="flex flex-col truncate">
      <div className="flex gap-1 items-center">
        <div className="text-sm truncate">{suggestion.name}</div>
      </div>
      <Slug className="text-xs" slug={suggestion.id} prefix="@" />
    </div>
  </div>
)

interface Props {
  value: string
  setValue: Dispatch<string>
  error: string
  setError: Dispatch<string>
  placeholder?: string
}

export const MentionTextArea: FC<Props> = ({
  value,
  setValue,
  error,
  setError,
  placeholder = ''
}) => {
  return (
    <div className="mb-2">
      <TextArea
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value)
          setError('')
        }}
      />

      {error && (
        <div className="mt-1 text-sm font-bold text-red-500">{error}</div>
      )}
    </div>
  )
}
