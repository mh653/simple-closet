// import { MetadataRoute } from 'next'

export default function manifest() {
  return {
    name: 'Simple Closet', //アプリケーション名
    short_name: 'Simple Closet', //アプリケーション名(短縮版)
    description: 'シンプルで操作性の良いクローゼットアプリ', // アプリケーションの説明文
    start_url: '/',  // アプリ起動時に開くパス
    display: 'standalone', // アプリケーションの表示モードを指定する
    background_color: '#ffffff',　// コンテンツ表示されるまでの背景色
    theme_color: 'rgba(255,255,255,0.5)',       // ブラウザのアドレスバーやステータスバーの色
    icons: [　                    // ホーム画面に表示させるicon画像
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
