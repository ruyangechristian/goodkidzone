import { getFoldersByType } from '@/lib/db'
import FolderBrowser from '@/components/folder-browser'

export const dynamic = 'force-dynamic'

export default async function ShortFilmsPage() {
  const folders = await getFoldersByType('short-film')

  return (
    <FolderBrowser
      folders={folders}
      heroTitle="shortFilms.pageTitle"
      heroSubtitle="shortFilms.pageSubtitle"
      heroGradient="from-blue-500 to-purple-600"
      folderIcon="folder"
    />
  )
}
