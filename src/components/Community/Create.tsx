import LensHubProxy from '@abis/LensHubProxy.json'
import { useMutation } from '@apollo/client'
import { GridItemFour, GridLayout } from '@components/GridLayout'
import Pending from '@components/Shared/Pending'
import SettingsHelper from '@components/Shared/SettingsHelper'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import { CreatePostBroadcastItemResult } from '@generated/types'
import { PlusIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import uploadToIPFS from '@lib/uploadToIPFS'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  RELAY_ON,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import Custom403 from 'src/pages/403'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'
import { gql } from '@apollo/client'
import { NextPage } from 'next'
import trackEvent from '@lib/trackEvent'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'

export const CREATE_POST_TYPED_DATA_MUTATION = gql`
  mutation CreatePostTypedData($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`

const newCommunitySchema = object({
  name: string()
    .min(2, { message: 'Title should be at least 2 characters' })
    .max(31, { message: 'Title should be less than 32 characters' }),
  description: string()
    .max(260, { message: 'Description should not exceed 260 characters' })
    .nullable()
})

const Create: NextPage = () => {
  const [avatar, setAvatar] = useState<string>()
  const [avatarType, setAvatarType] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const onCompleted = () => {
    trackEvent('new community', 'create')
  }
  const {
    data,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'postWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  const form = useZodForm({
    schema: newCommunitySchema
  })

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

  const [createPostTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult
      }) {
        consoleLog('Mutation', '#4ade80', 'Generated createPostTypedData')
        const { id, typedData } = createPostTypedData
        const {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
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
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
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

  const createCommunity = async (name: string, description: string | null) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        version: '1.0.0',
        metadata_id: uuidv4(),
        description: description,
        content: description,
        external_url: null,
        image: avatar ? avatar : `https://avatar.tobi.sh/${uuidv4()}.png`,
        imageMimeType: avatarType,
        name: name,
        attributes: [
          {
            traitType: 'string',
            key: 'type',
            value: 'community'
          }
        ],
        media: [],
        appId: 'Marbel'
      }).finally(() => setIsUploading(false))
      createPostTypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            contentURI: `https://ipfs.infura.io/ipfs/${path}`,
            collectModule: {
              freeCollectModule: {
                followerOnly: false
              }
            },
            referenceModule: {
              followerOnlyReferenceModule: false
            }
          }
        }
      })
    }
  }

  if (!currentUser) return <Custom403 />

  return (
    <GridLayout>
      <GridItemFour>
        <SettingsHelper
          heading="Create Community"
          description="Communities is where links are shared, commented and upvoted"
        />
        <Card>
          {data?.hash ?? broadcastData?.broadcast?.txHash ? (
            <Pending
              txHash={
                data?.hash ? data?.hash : broadcastData?.broadcast?.txHash
              }
              indexing="Community creation in progress, please wait!"
              indexed="Community created successfully"
              type="community"
              urlPrefix="communities"
            />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({ name, description }) => {
                createCommunity(name, description)
              }}
            >
              <Input
                label="Name"
                type="text"
                placeholder="Investment DAO"
                {...form.register('name')}
              />
              <TextArea
                label="Description"
                placeholder="Tell us something about the community!"
                {...form.register('description')}
              />

              <div className="ml-auto">
                {activeChain?.id !== CHAIN_ID ? (
                  <SwitchNetwork />
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      typedDataLoading ||
                      isUploading ||
                      signLoading ||
                      writeLoading ||
                      broadcastLoading
                    }
                    icon={
                      typedDataLoading ||
                      isUploading ||
                      signLoading ||
                      broadcastLoading ||
                      writeLoading ? (
                        <Spinner size="xs" />
                      ) : (
                        <PlusIcon className="w-4 h-4" />
                      )
                    }
                  >
                    Create
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Card>
      </GridItemFour>
    </GridLayout>
  )
}

export default Create
