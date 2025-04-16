import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
} 