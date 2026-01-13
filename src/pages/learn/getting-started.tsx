import React from 'react';
import Layout from '@theme/Layout';

export default function RedirectGettingStarted(): JSX.Element {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side redirect to the new Getting Started section
      window.location.replace('/getting-started');
    }
  }, []);

  return (
    <Layout title="Redirecting...">
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Redirecting to the documentation...</h2>
        <p>If you are not redirected, <a href="/getting-started">click here</a>.</p>
      </main>
    </Layout>
  );
}
