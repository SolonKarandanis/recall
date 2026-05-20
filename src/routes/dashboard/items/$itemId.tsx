import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { getItemById } from '#/data/items'
import type { SavedItem } from '#/generated/prisma/client'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Calendar, ChevronDown, Clock, ExternalLink, User } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '#/components/ui/collapsible'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemById({ data: { id: params.itemId } }),
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? 'Item Details'
    const description =
      loaderData?.summary ??
      'View saved article details and AI-generated summary'
    const image = loaderData?.ogImage

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        ...(image ? [{ property: 'og:image', content: image }] : []),
        {
          name: 'twitter:card',
          content: image ? 'summary_large_image' : 'summary',
        },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        ...(image ? [{ name: 'twitter:image', content: image }] : []),
        ...(loaderData?.author
          ? [{ name: 'author', content: loaderData.author }]
          : []),
      ],
    }
  },
})

function RouteComponent() {
  const data:SavedItem = Route.useLoaderData()
  const [contentOpen, setContentOpen] = useState(false)
  const router = useRouter()
  const tags = Array.isArray(data.tags) ? data.tags : []
  return (
    <div className="mx-auto max-w-3xl space-y-6 w-full">
      <div className="flex justify-start">
        <Link
          to="/dashboard/items"
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <ArrowLeft />
          Go Back
        </Link>
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <img
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          src={
            data.ogImage ??
            'https://images.unsplash.com/photo-1635776062043-223faf322554?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={data.title ?? 'Item Image'}
        />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {data.title ?? 'Untitled'}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {data.author && (
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5" />
            {data.author}
          </span>
        )}
        {data.publishedAt && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {new Date(data.publishedAt).toLocaleDateString('en-US')}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          Saved {new Date(data.createdAt).toLocaleDateString('en-US')}
        </span>
      </div>
      <a
        href={data.url}
        className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
        target="_blank"
      >
        View Original
        <ExternalLink className="size-3.5" />
      </a>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={String(tag)}>{String(tag)}</Badge>
          ))}
        </div>
      )}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                Summary
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>
      {data.content && (
        <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
          <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="font-medium">Full Content</span>
                <ChevronDown
                  className={cn(
                    contentOpen ? 'rotate-180' : '',
                    'size-4 transition-transform duration-200',
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent>
                  {data.content}
                  {/* <MessageResponse>{data.content}</MessageResponse> */}
                </CardContent>
              </Card>
            </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
