"use client"

import { ReactNode } from "react"

interface HomeSectionContainer {
    children: ReactNode;
    backgroundColor?: string;
}
const HomeSectionContainer: React.FC<HomeSectionContainer> = ({ children, backgroundColor = 'white' }) => {
    return (
        <section className="w-full" style={{ backgroundColor }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </section>
    )
}
export default HomeSectionContainer