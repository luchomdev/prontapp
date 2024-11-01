 "use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from 'react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import DocumentSkeleton from '@/components/skeletons/DocumentSkeleton'
import { fetchDocContent } from '@/app/actions/config'

export default function DocsTypePage() {
    const params = useParams<{docType: string}>()
    const [content, setContent] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true)
            try {
                const docContent = await fetchDocContent(params.docType)
                setContent(docContent)
            } catch (error) {
                console.error('Error loading content:', error)
                setContent('Error loading content')
            } finally {
                setIsLoading(false)
            }
        }

        loadContent()
    }, [params.docType])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <DocumentSkeleton />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <MarkdownRenderer content={content} />
        </div>
    )
}