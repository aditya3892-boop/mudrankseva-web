import Link from 'next/link'
import { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'ब्लॉग | मुद्रांकसेवा',
  description: 'महाराष्ट्रातील मालमत्ता नोंदणी, भाडे करार, स्टँप ड्युटी याबद्दल मराठीत माहिती.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ब्लॉग</h1>
      <p className="text-gray-500 mb-10">
        मालमत्ता, भाडे करार आणि कायदेशीर दस्तऐवजांबद्दल मराठीत सोप्या भाषेत माहिती.
      </p>
      <div className="space-y-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border border-gray-200 rounded-xl p-6 hover:border-amber-400 hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <span>{post.publishedAt}</span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
    </>
  )
}
