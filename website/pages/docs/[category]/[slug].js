import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { getAllDocs, getDocBySlug } from '../../../lib/mdx';
import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import Link from 'next/link';

// MDX components configuration
const components = {
  // Add any custom components here
  h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-bold mb-3" {...props} />,
  h3: (props) => <h3 className="text-xl font-bold mb-2" {...props} />,
  p: (props) => <p className="mb-4" {...props} />,
  ul: (props) => <ul className="list-disc ml-6 mb-4" {...props} />,
  ol: (props) => <ol className="list-decimal ml-6 mb-4" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
  code: ({ children, className }) => {
    // If it's an inline code block (no className), render it differently
    if (!className) {
      // Clean up the content by removing backticks and extra whitespace
      const content = String(children)
        .replace(/^`|`$/g, '') // Remove leading/trailing backticks
        .replace(/^\s+|\s+$/g, ''); // Trim whitespace
      
      return (
        <code className="inline-code">
          {content}
        </code>
      );
    }
    
    // For code blocks with language specification
    const language = className.replace('language-', '');
    return (
      <code className={`block-code language-${language}`}>
        {String(children).replace(/\n$/, '')}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="relative">
      {children}
    </pre>
  ),
  blockquote: (props) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 relative bg-gray-50 rounded-r py-2 pr-4" {...props} />
  ),
};

// Navigation component
function DocNavigation({ navigation }) {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t">
      {navigation.prev ? (
        <Link 
          href={`/docs/${navigation.prev.category}/${navigation.prev.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {navigation.prev.title}
        </Link>
      ) : (
        <div></div>
      )}
      
      {navigation.next ? (
        <Link 
          href={`/docs/${navigation.next.category}/${navigation.next.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          {navigation.next.title}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default function DocPage({ doc }) {
  const router = useRouter();
  const [mdxSource, setMdxSource] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doc) {
      setError('Document not found');
      return;
    }

    const processMdx = async () => {
      try {
        const mdxSource = await serialize(doc.content, {
          mdxOptions: {
            development: process.env.NODE_ENV === 'development',
          },
        });
        setMdxSource(mdxSource);
      } catch (err) {
        console.error('Error processing MDX:', err);
        setError('Error processing document content');
      }
    };

    processMdx();
  }, [doc]);

  useEffect(() => {
    if (mdxSource) {
      Prism.highlightAll();
    }
  }, [mdxSource]);

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!mdxSource) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-lg max-w-none">
          <MDXRemote {...mdxSource} components={components} />
        </div>
        <DocNavigation navigation={doc.navigation} />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const docs = getAllDocs();
  
  return {
    paths: docs.map((doc) => ({
      params: {
        category: doc.category,
        slug: doc.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { category, slug } = params;
  const doc = getDocBySlug(slug, category);

  if (!doc) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      doc,
    },
  };
} 