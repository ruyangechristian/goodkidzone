import { getFoldersByType } from '@/lib/db'
import FolderBrowser from '@/components/folder-browser'

export const dynamic = 'force-dynamic'

export default async function ReligionPage() {
  const folders = await getFoldersByType('religion')

  return (
    <FolderBrowser
      folders={folders}
      heroTitle="religion.pageTitle"
      heroSubtitle="religion.pageSubtitle"
      heroGradient="from-amber-500 to-orange-600"
      folderIcon="heart"
    />
  )
}
