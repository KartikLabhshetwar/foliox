'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ClassicLoading } from '@/components/portfolio/classic-loading'
import { BentoLoading } from '@/components/portfolio/bento-loading'

function LoadingContent() {
  const searchParams = useSearchParams()
  const layout = searchParams.get('layout')
  const isBento = layout === 'bento'

  return isBento ? <BentoLoading /> : <ClassicLoading />
}

export default function Loading() {
  return (
    <Suspense fallback={<ClassicLoading />}>
      <LoadingContent />
    </Suspense>
  )
}
