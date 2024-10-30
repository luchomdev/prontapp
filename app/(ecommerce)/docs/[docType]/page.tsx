"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from 'react'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export default function DocsTypePage() {
    const params = useParams<{docType: string}>()
    const [content, setContent] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config/public?vars=${params.docType}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch content')
                }
                const data = await response.json()
                setContent(data[params.docType] || '')
            } catch (error) {
                console.error('Error fetching content:', error)
                setContent('Error loading content')
            } finally {
                setIsLoading(false)
            }
        }

        fetchContent()
    }, [params.docType])

    if (isLoading) {
        return <div>Cargando contenido ...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <MarkdownRenderer content={content} />
        </div>
    )
}