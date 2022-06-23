import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import imagekitURL from '@lib/imagekitURL'
import { CommunityFields } from '@gql/CommunityFields'
import { gql } from '@apollo/client'
import React, { FC, useEffect } from 'react'
import { CommentFields } from '@gql/CommentFields'
import { MirrorFields } from '@gql/MirrorFields'
import { PostFields } from '@gql/PostFields'
import MenuItems from './MenuItems'
// import MoreNavItems from './MoreNavItems'

const COMMUNITY_QUERY = gql`
  query Community($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...CommunityFields
      }
    }
  }
  ${CommunityFields}
`

export const POST_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        ...PostFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Comment {
        ...CommentFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
      ... on Mirror {
        ...MirrorFields
        onChainContentURI
        referenceModule {
          __typename
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`

const Navbar: FC = () => {
  const [pageInfo, setPageInfo] = React.useState<any>()
  const {
    pathname,
    query: { id }
  } = useRouter()

  useEffect(() => {
    setPageInfo({})
  }, [pathname])
  useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    onCompleted(data) {
      setPageInfo({
        id: data.publication?.id,
        url: data.publication?.metadata?.cover?.original?.url
          ? data.publication?.metadata?.cover?.original?.url
          : `https://avatar.tobi.sh/${data.publication?.id}.png`,
        title: data.publication?.metadata?.name
      })
    },
    skip: !id || pathname.includes('posts')
  })

  useQuery(POST_QUERY, {
    variables: { request: { publicationId: id } },

    onCompleted(data) {
      if(data.publication.commentOn){
      setPageInfo({
        id: data.publication.commentOn ? data.publication.commentOn.pubId:null,
        url: data.publication?.metadata?.cover?.original?.url
          ? data.publication?.metadata?.cover?.original?.url
          : `https://avatar.tobi.sh/${data.publication?.id}.png`,
        title: data.publication.commentOn.metadata?.name
      })}
    },
    skip: !id || pathname.includes('communities')
  })

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

                {pathname === '/' ? (
                  <Link href="/">
                    <a className="text-3xl flex font-black">
                      <img className="w-12 h-12" src="/logo.svg" alt="Marbel" />
                      <p className="pt-2 text-2xl font-medium">{'Marbel'}</p>
                    </a>
                  </Link>
                ) : pageInfo?.id ? (
                  <Link href={'/communities/' + pageInfo.id}>
                    <a className="flex cursor-pointer">
                      <img
                        src={imagekitURL(pageInfo.url, 'avatar')}
                        className="w-10 h-10 rounded-full ring-2 ring-gray-200"
                        height={10}
                        width={10}
                        alt={pageInfo.id}
                      />
                      <div className="pl-3 text-lg font-medium justify-center items-center flex">
                        <div className="truncate">{pageInfo.title}</div>
                      </div>
                      <div />
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
