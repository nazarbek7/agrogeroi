const config = {
  // In the browser always use relative URLs so it works on any domain.
  // On the server use the configured absolute URL (needed for inter-service SSR calls).
  get apiBaseUrl() {
    if (typeof window !== 'undefined') return '';
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  },
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

