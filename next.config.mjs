/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Next.jsの<Image>コンポーネントは、セキュリティのためデフォルトで外部画像を読み込めないので追記
  // protocol: 'https' → httpsプロトコルのみ許可
  // hostname: '**.supabase.co' → *.supabase.co のすべてのサブドメインを許可

    formats: ['image/avif', 'image/webp'],
    // AVIFを最優先にすると画像サイズが大幅に削減される
};

export default nextConfig;
