import { getFoldersByType } from '@/lib/db'
import FolderBrowser from '@/components/folder-browser'

export const dynamic = 'force-dynamic'

export default async function VideosPage() {
  const folders = await getFoldersByType('video')

  return (
    <FolderBrowser
      folders={folders}
      heroTitle="videos.pageTitle"
      heroSubtitle="videos.pageSubtitle"
      heroGradient="from-primary via-accent to-red-500"
      folderIcon="folder"
    />
  )
}
