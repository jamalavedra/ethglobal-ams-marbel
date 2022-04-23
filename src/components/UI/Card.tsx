import clsx from 'clsx'
import { FC, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  forceRounded?: boolean
}

export const Card: FC<CardProps> = ({
  children,
  className = '',
  forceRounded = false
}) => {
  return (
    <div
      className={clsx(
        forceRounded ? 'rounded-sm' : 'rounded-none sm:rounded-sm',
        ' bg-white',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader: FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return <div className={`border-b p-3 ${className}`}>{children}</div>
}

interface CardBodyProps {
  children?: ReactNode
  className?: string
}
export const CardBody: FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`px-2 pt-1 ${className}`}>{children}</div>
}
