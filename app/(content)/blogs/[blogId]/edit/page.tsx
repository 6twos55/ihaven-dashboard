"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getBlogPost, updateBlogPost } from "@/lib/services/blog-service"
import { TipTapEditor } from "@/components/tiptap-editor"
import type { BlogPost } from "@/lib/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const CATEGORIES = [
  "Technology",
  "Business",
  "Finance",
  "Cryptocurrency",
  "Blockchain",
  "Web3",
  "Development",
  "Design",
  "Marketing",
  "Other",
]

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState("")
  const blogId = params.blogId as string

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      category: "",
      coverImage: "",
    },
  })

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const blog = await getBlogPost(blogId)

        // Reset form with blog data
        form.reset({
          title: blog.title,
          excerpt: blog.excerpt,
          category: blog.category,
          coverImage: blog.coverImage || "",
        })

        setContent(blog.content)
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
  }, [blogId, toast, form])

  const handleEditorChange = (html: string) => {
    setContent(html)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!content) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updatedBlog: Partial<BlogPost> = {
        title: values.title,
        excerpt: values.excerpt || "",
        content,
        category: values.category,
        coverImage: values.coverImage || "",
      }

      await updateBlogPost(blogId, updatedBlog)

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })

      router.push(`/blogs/${blogId}`)
    } catch (error) {
      console.error("Failed to update blog post:", error)
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href={`/blogs/${blogId}`} className="mr-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/blogs/${blogId}`} className="mr-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h1>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of your blog post"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              {/* Using regular label instead of FormLabel */}
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Content
              </label>
              <div className="border border-gray-200 dark:border-[#2B2B30] rounded-md overflow-hidden">
                <TipTapEditor onChange={handleEditorChange} initialContent={content} />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
