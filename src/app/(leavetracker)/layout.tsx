

import React, { Suspense } from 'react'
import Header from '@/components/Header'
import Loading from '@/app/loading'
import {getUserNameFromAuth} from "@/lib/getUserInfoFromKinde"


export  default async function  RSLayout({
    children,
}:{children:React.ReactNode}) {

const rawUserId = await getUserNameFromAuth();
//const userId = rawUserId.replace(/\s+/g, '_');
console.log("userId",rawUserId)
  return (
    <div className=''>
      <Suspense fallback={<Loading/>}>
        <Header>
          {children}
        </Header>
      </Suspense>
    </div>
  )
}
