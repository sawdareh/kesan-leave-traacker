import type { LucideIcon } from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,

}from "@/components/ui/dropdown-menu"

type Props={
    icon:LucideIcon,
    label:string,
    choice:{
        title:string,
        href:string
    }[]
}


export default function NavButtonMenu({
    icon:Icon,
    label,
    choice
}:Props) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
            
            >
                <Icon className="h-[1.2rem] w-[1.2rem]">

                </Icon>
                <span className="sr-only">
                    {label}
                </span>

            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {
                choice.map(choice=>(
                    <DropdownMenuItem key={choice.title} asChild>
                        <Link href={choice.href}>
                            {choice.title}
                        </Link>

                    </DropdownMenuItem>
                ))
            }
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
