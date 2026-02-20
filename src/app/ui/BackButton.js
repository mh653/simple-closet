'useClient'

import { useRouter } from "next/navigation"

export default function BackButton() {

  const router = useRouter();

  return (
    <button onClick={() => router.back()}>戻る</button>
  )
}
