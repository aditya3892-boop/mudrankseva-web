import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog'
import { Nav } from '@/components/Nav'
import { Header } from '@/components/Header'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://mudrankseva.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://mudrankseva.in/blog/${post.slug}`,
      locale: 'mr_IN',
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const paragraphs = post.content.split('\n').filter(line => line.trim() !== '')

  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">
        ← ब्लॉग
      </Link>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <span>{post.publishedAt}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
      <div className="prose prose-gray max-w-none">
        {paragraphs.map((line, i) => {
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.replace('## ', '')}</h2>
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="text-gray-700 ml-4 mb-1">{line.replace('- ', '')}</li>
          }
          if (line.startsWith('|')) {
            return null
          }
          if (line.match(/^\d+\./)) {
            return <li key={i} className="text-gray-700 ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>
          }
          return <p key={i} className="text-gray-700 leading-relaxed mb-4">{line}</p>
        })}
      </div>
      <div className="mt-12 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-gray-900 mb-2">मुद्रांकसेवाशी संपर्क करा</p>
          <p className="text-sm text-gray-600 mb-4">
            भाडे करार, मालमत्ता नोंदणी किंवा इतर कायदेशीर दस्तऐवजांसाठी आम्ही मदत करतो.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/rent-agreement" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              भाडे करार बनवा — ₹२९९
            </Link>
            <Link href="/doorstep-registration" className="border border-amber-400 text-amber-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-amber-50 transition">
              घरपोच नोंदणी
            </Link>
            <Link href="/calculator" className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              स्टँप ड्युटी कॅल्क्युलेटर
            </Link>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
          <div className="text-3xl">💬</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-1">WhatsApp वर विचारा</p>
            <p className="text-xs text-gray-500 mb-2">कोणताही प्रश्न असल्यास आमच्याशी थेट बोला. २ तासांत उत्तर मिळेल.</p>
            <Link href="https://wa.me/917755984622?text=नमस्कार, मला मुद्रांकसेवाबद्दल माहिती हवी आहे" className="text-green-700 font-semibold text-sm hover:underline">
              +91 77559 84622 वर WhatsApp करा →
            </Link>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
