import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect('/map')

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border"
            style={{ backgroundColor: '#EBF5F9', color: '#4A8FA8', borderColor: '#B3D9E8' }}
          >
            🎓 College decision season is here
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
            Decide where you<br />
            <span style={{ color: 'var(--color-accent)' }}>belong</span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto">
            Pin your acceptances on a map, compare schools side by side, and run an elimination bracket to find your perfect fit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl font-semibold text-white text-base transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Create a free account
            </Link>
            <Link
              href="/map"
              className="px-8 py-4 rounded-xl font-semibold text-gray-700 text-base border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              Continue as guest →
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Guest mode is free — your data won&apos;t be saved between sessions
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-sm text-gray-500">
                Pin all your acceptances on a live map. Color-coded by status, click to see details.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Side-by-Side Compare</h3>
              <p className="text-sm text-gray-500">
                Compare tuition, aid, programs, pros/cons, and location for up to 4 schools at once.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">Elimination Bracket</h3>
              <p className="text-sm text-gray-500">
                Run a March Madness–style bracket to narrow down your options one matchup at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
