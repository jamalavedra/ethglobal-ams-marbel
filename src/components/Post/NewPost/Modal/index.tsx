import { Modal } from '@components/UI/Modal'
import { PencilAltIcon } from '@heroicons/react/outline'
import { FC, useState } from 'react'
import { Button } from '@components/UI/Button'

import NewPost from '..'

const NewPostModal: FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(!showModal)
        }}
        icon={<PencilAltIcon className="w-4 h-4" />}
      >
        {'New entry'}
      </Button>

      <Modal
        title="New Entry"
        icon={<PencilAltIcon className="w-5 h-5 text-brand" />}
        size="sm"
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <NewPost setShowModal={setShowModal} hideCard />
      </Modal>
    </>
  )
}

export default NewPostModal
