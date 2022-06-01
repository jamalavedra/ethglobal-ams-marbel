import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import PubIndexStatus from '@components/Shared/PubIndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import Markup from '@components/Shared/Markup'
import trimify from '@lib/trimify'
import {
  CreateCommentBroadcastItemResult,
  EnabledModule
} from '@generated/types'
import { PencilAltIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import {
  defaultFeeData,
  defaultModuleData,
  FEE_DATA_TYPE,
  getModule
} from '@lib/getModule'
import { LensterAttachment, LensterPost } from '@generated/lenstertypes'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import uploadToIPFS from '@lib/uploadToIPFS'
import { FC, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  RELAY_ON,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { Input } from '@components/UI/Input'
import { Form, useZodForm } from '@components/UI/Form'
import { object, string } from 'zod'
import trackEvent from '@lib/trackEvent'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { MentionTextArea } from '@components/UI/MentionTextArea'
import dynamic from 'next/dynamic'
import { Dispatch } from 'react'

const editProfileSchema = object({
  title: string()
    .min(2, { message: 'Title should have at least 2 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' })
})

const Preview = dynamic(() => import('../../Shared/Preview'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
})

const CREATE_COMMENT_TYPED_DATA_MUTATION = gql`
  mutation CreateCommentTypedData($request: CreatePublicCommentRequest!) {
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

interface Props {
  setShowModal?: Dispatch<boolean>
  hideCard?: boolean
  post: LensterPost
}

const NewComment: FC<Props> = ({ setShowModal, hideCard = false, post }) => {
  const [preview, setPreview] = useState<boolean>(false)
  const [postContent, setPostContent] = useState<string>('')
  const [postContentError, setPostContentError] = useState<string>('')
  const [selectedModule, setSelectedModule] =
    useState<EnabledModule>(defaultModuleData)
  const [onlyFollowers, setOnlyFollowers] = useState<boolean>(false)
  const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<LensterAttachment[]>([])
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onCompleted = () => {
    setPreview(false)
    setPostContent('')
    setAttachments([])
    setSelectedModule(defaultModuleData)
    setFeeData(defaultFeeData)
    trackEvent('new post', 'create')
  }

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      title: '' as string
    }
  })

  const {
    data,
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'commentWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error) {
        console.log('useContractWrite', error)
        toast.error(error?.message)
      }
    }
  )

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted({ broadcast }) {
        if (broadcast?.reason !== 'NOT_ALLOWED') {
          onCompleted()
        }
      },
      onError(error) {
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    })

  const [createCommentTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COMMENT_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createCommentTypedData
      }: {
        createCommentTypedData: CreateCommentBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createCommentTypedData')
        const { id, typedData } = createCommentTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData
        } = typedData?.value

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ data: { broadcast }, errors }) => {
                if (errors || broadcast?.reason === 'NOT_ALLOWED') {
                  write({ args: inputStruct })
                }
              }
            )
          } else {
            write({ args: inputStruct })
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  const createComment = async (title: string, description: string | null) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else if (postContent.length === 0 && attachments.length === 0) {
      setPostContentError('Post should not be empty!')
    } else {
      setIsUploading(true)
      setPostContentError('')
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: description,
        content: trimify(title),
        external_url: null,
        image: null,
        imageMimeType: null,
        name: `Comment by @${currentUser?.handle}`,
        attributes: [
          {
            traitType: 'string',
            key: 'type',
            value: 'community post'
          }
        ],
        media: attachments,
        appId: 'Marbel'
      }).finally(() => setIsUploading(false))

      createCommentTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            publicationId: post?.id,
            contentURI: `https://ipfs.infura.io/ipfs/${path}`,
            collectModule: feeData.recipient
              ? {
                  [getModule(selectedModule.moduleName).config]: feeData
                }
              : getModule(selectedModule.moduleName).config,
            referenceModule: {
              followerOnlyReferenceModule: onlyFollowers ? true : false
            }
          }
        }
      })
    }
  }

  return (
    <Card>
      <div className="px-5 pt-5 pb-3">
        <div className="space-y-1">
          {error && (
            <ErrorMessage
              className="mb-3"
              title="Transaction failed!"
              error={error}
            />
          )}
          <Form
            form={form}
            className="space-y-4"
            onSubmit={({ title }) => {
              createComment(title, postContent)
            }}
          >
            <Input
              label="Title"
              type="text"
              placeholder="Write here the title"
              {...form.register('title')}
            />

            {preview ? (
              <div className="pb-3 mb-2 border-b linkify dark:border-b-gray-700/80">
                <Markup>{postContent}</Markup>
              </div>
            ) : (
              <MentionTextArea
                value={postContent}
                setValue={setPostContent}
                error={postContentError}
                setError={setPostContentError}
                placeholder="Write here. You can use Markdown"
              />
            )}

            <div className="block items-center sm:flex">
              <div className="flex items-center space-x-4">
                {postContent && (
                  <Preview preview={preview} setPreview={setPreview} />
                )}
              </div>
              <div className="flex items-center mt-5 ml-auto space-x-2 sm:pt-0">
                {data?.hash ?? broadcastData?.broadcast?.txHash ? (
                  <div className="py-2">
                    <PubIndexStatus
                      setShowModal={setShowModal}
                      type="community post"
                      txHash={
                        data?.hash
                          ? data?.hash
                          : broadcastData?.broadcast?.txHash
                      }
                    />
                  </div>
                ) : null}{' '}
                {activeChain?.id !== CHAIN_ID ? (
                  <SwitchNetwork className="ml-auto" />
                ) : (
                  <Button
                    className="ml-auto"
                    disabled={
                      isUploading ||
                      typedDataLoading ||
                      signLoading ||
                      broadcastLoading ||
                      writeLoading
                    }
                    icon={
                      isUploading ||
                      typedDataLoading ||
                      signLoading ||
                      broadcastLoading ||
                      writeLoading ? (
                        <Spinner size="xs" />
                      ) : (
                        <PencilAltIcon className="w-4 h-4" />
                      )
                    }
                  >
                    {isUploading
                      ? 'Uploading to IPFS'
                      : typedDataLoading
                      ? `Generating Entry`
                      : signLoading
                      ? 'Sign'
                      : writeLoading || broadcastLoading
                      ? 'Send'
                      : 'Submit'}
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  )
}

export default NewComment
