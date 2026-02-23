'use client'

import { useRouter, useSearchParams } from "next/navigation"

// 遷移元に戻るボタン

export default function FromBackButton() {
  // ルータ
  const router = useRouter();
  // どこから来たかを取得
  const searchParams = useSearchParams();
  const from = searchParams.get("from")

  const handleBack = () => {
    if (from) {
      router.push(from)
    } else {
      router.push("/")
    }
  }

  return (
    <button onClick={() => handleBack()}>戻る</button>
  )
}
