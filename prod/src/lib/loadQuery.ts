import { type QueryParams } from 'sanity'
import { sanityClient } from 'sanity:client'

const token = import.meta.env.SANITY_API_READ_TOKEN

export async function loadQuery<T>({
  query,
  params,
  preview = false,
}: {
  query: string
  params?: QueryParams
  preview?: boolean
}): Promise<T> {
  if (preview && !token) {
    throw new Error(
      'The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.',
    )
  }

  const perspective = preview ? 'drafts' : 'published'

  const { result } = await sanityClient.fetch<T>(query, params ?? {}, {
    filterResponse: false,
    perspective,
    resultSourceMap: preview ? 'withKeyArraySelector' : false,
    stega: preview,
    ...(preview ? { token } : {}),
    useCdn: !preview,
  })

  return result
}
