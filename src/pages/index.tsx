import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useState } from 'react';

export default function Home(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search or relevant documentation
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <Layout
      title="Prometheux Documentation"
      description="Build your first ontology and explore the power of knowledge graphs with Prometheux"
    >
      <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#f2f2f2' }}>
        {/* Hero Images - Left and Right */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Hero Image */}
          <img
            src="/img/platform-hero-img-left.svg"
            alt=""
            aria-hidden="true"
            className="absolute left-0 bottom-0 h-full max-h-[80vh] opacity-50"
            style={{
              width: 'auto',
              zIndex: 1,
            }}
          />
          {/* Right Hero Image */}
          <img
            src="/img/platform-hero-img-right.svg"
            alt=""
            aria-hidden="true"
            className="absolute right-0 bottom-0 h-full max-h-[80vh] opacity-50"
            style={{
              width: 'auto',
              zIndex: 1,
            }}
          />
        </div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
          {/* Logo */}
          <div className="mb-4">
            <img
              src="/img/prometheux-logo.png"
              alt="Prometheux"
              className="h-12"
            />
          </div>

          {/* Welcome Message under Logo */}
          <p className="text-lg text-gray-600 mb-12">
            Welcome to Prometheux Documentation
          </p>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-normal text-[#212020] mb-8 text-center">
            Build your first ontology
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl">
            Describe what you want to understand and Prometheux will build it for you.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What would you like to explore in the documentation?"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#00e382] focus:ring-1 focus:ring-[#00e382] transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#00e382] text-[#212020] px-6 py-2 rounded-md hover:bg-[#00d072] transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Platform CTA Button */}
          <div className="mb-6">
            <Link
              to="https://platform.prometheux.ai"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#00e382] text-[#212020] font-semibold rounded-lg hover:bg-[#00d072] transition-all duration-200 text-lg shadow-sm hover:shadow-md"
            >
              Get Started on the Platform
            </Link>
          </div>

          {/* Login Link */}
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="https://platform.prometheux.ai/login"
              className="text-[#00e382] hover:underline"
            >
              Log in
            </Link>
          </p>

          {/* Quick Links Section */}
          <div className="mt-20 w-full max-w-4xl">
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/docs/getting-started"
                className="group bg-white border-2 border-[#212020] rounded-lg p-6 shadow-[3px_3px_0_0_#212020] hover:shadow-[1px_1px_0_0_#212020] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                style={{ backgroundColor: 'white' }}
              >
                <div className="w-12 h-12 bg-[#00e382] border-2 border-[#212020] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#212020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#212020] mb-2">Get Started</h3>
                <p className="text-gray-600">
                  Get up and running with Prometheux in minutes
                </p>
              </Link>

              <Link
                to="/docs/api"
                className="group bg-white border-2 border-[#212020] rounded-lg p-6 shadow-[3px_3px_0_0_#212020] hover:shadow-[1px_1px_0_0_#212020] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                style={{ backgroundColor: 'white' }}
              >
                <div className="w-12 h-12 bg-[#00e382] border-2 border-[#212020] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#212020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#212020] mb-2">PX APIs</h3>
                <p className="text-gray-600">
                  Explore our comprehensive API reference
                </p>
              </Link>

              <Link
                to="/docs/examples"
                className="group bg-white border-2 border-[#212020] rounded-lg p-6 shadow-[3px_3px_0_0_#212020] hover:shadow-[1px_1px_0_0_#212020] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                style={{ backgroundColor: 'white' }}
              >
                <div className="w-12 h-12 bg-[#00e382] border-2 border-[#212020] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#212020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#212020] mb-2">Examples</h3>
                <p className="text-gray-600">
                  Learn from real-world use cases
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
