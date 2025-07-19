"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Edit, Trash2, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { getBlogPost, deleteBlogPost } from "@/lib/services/blog-service"
import type { BlogPost } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BlogDetailPage() {
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
        const data = await getBlogPost(blogId)
        setBlog(data)
      } catch (error) {
        console.error("Failed to fetch blog:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (blogId) {
      fetchBlog()
    }
  }, [blogId, toast])

  const handleDelete = async () => {
    try {
      await deleteBlogPost(blogId)
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      router.push("/blogs")
    } catch (error) {
      console.error("Failed to delete blog:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/blogs" className="mr-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/blogs" className="mr-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Post Not Found</h1>
        </div>
        <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/blogs" className="mr-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Post</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/blogs/${blogId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
        <div className="h-64 relative bg-gray-100 dark:bg-gray-800">
          <Image
            src={blog.coverImage || "/placeholder.svg?height=400&width=600"}
            alt={blog.title}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.onerror = null // Prevent infinite error loop
              target.src = "https://placehold.co/800x400/e2e8f0/1e293b?text=Image+Not+Found"
            }}
          />
          <div className="absolute top-4 right-4 bg-white dark:bg-[#1F1F23] rounded-full px-3 py-1 text-sm font-medium">
            {blog.category}
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h2>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={blog.author.avatar || "/placeholder.svg?height=100&width=100"}
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <User className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{blog.author.name}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {blog.excerpt && (
            <div className="mb-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 italic border-l-4 border-gray-200 dark:border-gray-700 pl-4">
                {blog.excerpt}
              </p>
            </div>
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              <span className="font-medium"> "{blog.title}"</span> and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
