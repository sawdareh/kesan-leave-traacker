import React from 'react'
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from './ui/button';
import { HomeIcon,File,UsersRound, SettingsIcon,LogOut,  } from 'lucide-react';
import NavButton from './NavButton';
import { ModeToggle } from './ModeToggle';
import Link from 'next/link';
import NavButtonMenu from './NavButtonMenu';
import getAllTrackers from '@/lib/queries/getAllTrackers';
import DropDownMenuYear from '@/components/DropDownMenuYear';
import DropdownViewByName from "@/components/DropDownViewByName";
import { getAllEmployee } from '@/lib/queries/getAllemployee';

export default async function Header() {

    const tracker = await getAllTrackers();
    const employee=await getAllEmployee();

    const uniqueYears = Array.from(
    new Set(
        tracker
        .map((data) => new Date(data.trackersDate).getFullYear())
        .filter((year) => !isNaN(year))
    )
    ).sort((a, b) => a - b);

  return (
    <header className='animate-slide bg-background h-12 p-2 border-b sticky h-20 flex items-center justify-center mb-8 top-0 z-20'>
        <div className="flex h-8 items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <NavButton href='/leave_tracker' label='Home' icon={HomeIcon}/>
                <Link href="/leave_tracker" className="flex justify-center items-center gap-2 ml-0" title="Home">
                    <h1 className='hidden sm:block text-lg font-bold m-0'>
                        KESAN Employee Leave Tracker
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-4">

                <DropdownViewByName employee={employee}/>
                <NavButtonMenu icon={File}
                    label='Leave Tracker Menu'
                    choice={[
                        {title:"View Leave Tracker", href:"/leave_tracker"},
                        {title:"Add New Leave Tracker", href:"/leave_tracker/form"}
                    ]}
                >
                </NavButtonMenu>

                <NavButtonMenu icon={UsersRound}
                    label='Customers Menu'
                    choice={[
                        {title:"Employee list", href:"/employee"},
                        {title:"Add New employee", href:"/employee/form"}
                    ]}
                >
                </NavButtonMenu>
                <NavButtonMenu icon={SettingsIcon}
                    label='Settting Menu'
                    choice={[
                        {title:"Tracker type", href:"/tracker_type"},
                        {title:"Add New Tracker type", href:"/tracker_type/form"},
                        {title:"Program", href:"/department"},
                        {title:"Add New Program", href:"/department/form"},
                    ]}
                >
                </NavButtonMenu>
                <DropDownMenuYear uniqueYears={uniqueYears}>

                </DropDownMenuYear> 
            
                <ModeToggle/>
                <Button variant="ghost" size="icon" aria-label="LogOut" title='LogOut' className='rounded-full' asChild>
                    <LogoutLink>
                        <LogOut></LogOut>
                    </LogoutLink>
                </Button>
            </div>
            
        </div>
    </header>
  )
}
