const { MongoClient } = require('mongodb')

async function fixImages() {
  const c = new MongoClient(
    'mongodb+srv://Fabrice:Fabrice12@cluster0.bnhnfjq.mongodb.net/goodkidzone?retryWrites=true&w=majority',
    { connectTimeoutMS: 45000, serverSelectionTimeoutMS: 45000 }
  )

  await c.connect()
  const db = c.db('goodkidzone')

  const fixes = [
    { slug: 'ubuzima-imirire', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop' },
    { slug: 'amateka-umuco', image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=400&h=300&fit=crop' },
    { slug: 'uburezi', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop' },
    { slug: 'abana-1-5', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop' },
    { slug: 'inyigisho-quran', image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=300&fit=crop' },
  ]

  for (const fix of fixes) {
    const r = await db.collection('folders').updateOne(
      { slug: fix.slug },
      { $set: { image: fix.image } }
    )
    console.log(fix.slug, r.modifiedCount ? 'FIXED' : 'NOT FOUND')
  }

  await c.close()
  console.log('Done!')
}

fixImages()
