"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, Edit, Trash2, Eye, Calendar, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getBlogPosts, deleteBlogPost } from "@/lib/services/blog-service"
import type { BlogPost } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { useToast } from "@/components/ui/use-toast"

export default function BlogsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        const data = await getBlogPosts()
        setBlogs(data)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
        toast({
          title: "Error",
          description: "Failed to load blog posts",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [toast])

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteClick = (blog: BlogPost) => {
    setSelectedBlog(blog)
    setShowDeleteDialog(true)
  }

  const handlePreviewClick = (blog: BlogPost) => {
    setSelectedBlog(blog)
    setShowPreviewDialog(true)
  }

  const handleDelete = async () => {
    if (!selectedBlog) return

    try {
      await deleteBlogPost(selectedBlog.id)
      setBlogs(blogs.filter((blog) => blog.id !== selectedBlog.id))
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete blog:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedBlog(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <Link href="/blogs/create">
          <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search blog posts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2B2B30] rounded-lg bg-white dark:bg-[#1F1F23] text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-48 relative bg-gray-100 dark:bg-gray-800">
                <Image
                  src={blog.coverImage || "/placeholder.svg?height=400&width=600"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.onerror = null // Prevent infinite error loop
                    target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
                  }}
                />
                <div className="absolute top-2 right-2 bg-white dark:bg-[#1F1F23] rounded-full px-2 py-1 text-xs font-medium">
                  {blog.category}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{blog.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{blog.author.name}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(blog.publishedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => handlePreviewClick(blog)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Preview</span>
                    </Button>
                    <Link href={`/blogs/edit/${blog.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDeleteClick(blog)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                  <Link href={`/blogs/view/${blog.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30]">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No blog posts found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm ? "No posts match your search criteria." : "Get started by creating your first blog post."}
          </p>
          {!searchTerm && (
            <Link href="/blogs/create">
              <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Blog Preview</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="h-64 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={selectedBlog.coverImage || "/placeholder.svg?height=400&width=600"}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.onerror = null // Prevent infinite error loop
                    target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBlog.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>{selectedBlog.author.name}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(selectedBlog.publishedAt)}
                  </span>
                </div>
              </div>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            {selectedBlog && (
              <Link href={`/blogs/view/${selectedBlog.id}`}>
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  View Full Post
                </Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              {selectedBlog && <span className="font-medium"> "{selectedBlog.title}"</span>} and remove it from our
              servers.
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
