

import { LoaderCircle } from "lucide-react"

export default function loading() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80">
        <div className="w-full h-dvh grid place-content-center">
            <LoaderCircle className="h-48 w-48 animate-spin text-foreground/20"></LoaderCircle>

        </div>
    </div>
  )
}
