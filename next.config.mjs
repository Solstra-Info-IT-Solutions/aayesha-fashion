import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// react-reconciler (used deep inside @react-three/fiber for the hero's
// decorative 3D scene) does a bare `require('react')`. Under this Next.js
// version's client bundling, that sometimes resolves through react's
// "react-server" export condition instead of the default one, landing on
// react.shared-subset.js — a minimal build that strips the legacy internals
// (__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) react-reconciler
// needs, crashing with "Cannot read properties of undefined (reading
// 'ReactCurrentOwner')". Aliasing to the concrete file bypasses the
// exports-conditions lookup entirely so this one dependency always gets the
// full client build, regardless of which module graph is resolving it.
const reactIndexPath = path.resolve(__dirname, 'node_modules/react/index.js');

/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backendUrl}/api/:path*` }];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: reactIndexPath,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      react: reactIndexPath,
    },
  },
};

export default nextConfig;
