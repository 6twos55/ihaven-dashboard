"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const BlogDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const blogId = params.blogId as string

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/blogs/view/${blogId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setBlog(data)
      } catch (error: any) {
        toast({
          title: "Error fetching blog",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [blogId, toast])

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/blogs/view/${blogId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Blog deleted",
        description: "The blog post has been successfully deleted.",
      })
      router.push(`/blogs/view/${blogId}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error deleting blog",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <p>Blog not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-500 mb-4">Created At: {format(new Date(blog.createdAt), "MMMM d, yyyy h:mm a")}</p>
      <p className="text-gray-500 mb-4">Updated At: {format(new Date(blog.updatedAt), "MMMM d, yyyy h:mm a")}</p>
      <div className="mb-4">{blog.content}</div>
      <div className="flex gap-2">
        <Link href={`/blogs/edit/${blogId}`}>
          <Button>Edit</Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the blog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default BlogDetailPage
