import Head from 'next/head';
import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Frontend Concepts Documentation</title>
        <meta name="description" content="A comprehensive guide to frontend development concepts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Frontend Docs
              </Link>
              <nav className="space-x-6">
                <Link href="/docs/basics/array.prototype.filter" className="text-gray-600 hover:text-gray-900">
                  Basics
                </Link>
                <Link href="/docs/advanced/currying-react-components" className="text-gray-600 hover:text-gray-900">
                  Advanced
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Component {...pageProps} />
        </main>

        <footer className="bg-white py-6">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>Frontend Concepts Documentation © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default MyApp; 