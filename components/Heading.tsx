import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Roboto_Mono } from 'next/font/google';
import React from 'react'

interface HeadingProps {
    title: string;
    description: string
    icon: LucideIcon
    iconColor?: string
    bgColor?: string
    className?: string
}

const robotMono = Roboto_Mono({
    weight: "500",
    subsets: ["latin"],
  });

const Heading: React.FC<HeadingProps> = ({title, description, icon: Icon, iconColor, bgColor, className}) => {
  return (
    <>
    <div className="flex items-center gap-x-3 mt-5 mb-7">
      <div className={cn("p-2 w-fit rounded-md", bgColor)}>
        <Icon className={cn("w-8 h-8 md:w-10 md:h-10", iconColor)} />
      </div>
      <div>
        <h2 className={cn("text-xl md:text-2xl lg:text-3xl font-extrabold",robotMono.className)}>{title}</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  </>
  )
}

export default Heading