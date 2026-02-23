'use client'

import { useRouter, useSearchParams } from "next/navigation"

export default function FromBackButton() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from")

  const handleBack = () => {
    if (from) {
      router.push(from)
      // router.push(decodeURIComponent(from))
      // router.refresh()
    } else {
      router.push("/")
    }
  }

  return (
    <button onClick={() => handleBack()}>戻る</button>
  )
}
