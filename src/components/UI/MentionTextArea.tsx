import { UserSuggestion } from '@generated/lenstertypes'
import { Dispatch, FC } from 'react'
import { TextArea } from './TextArea'

interface UserProps {
  suggestion: UserSuggestion
  focused: boolean
}
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
