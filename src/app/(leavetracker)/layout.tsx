import React from 'react'
import Header from '@/components/Header'

export default function RSLayout({
    children,
}:{children:React.ReactNode}) {
  return (
    <div className=''>

      <Header>
        {children}
      </Header>

      
    </div>
  )
}
