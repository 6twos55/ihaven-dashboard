"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { createBlogPost } from "@/lib/services/blog-service"
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

export default function CreateBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState("")

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
      const newBlog: Partial<BlogPost> = {
        title: values.title,
        excerpt: values.excerpt || "",
        content,
        category: values.category || "Other",
        coverImage: values.coverImage || "https://placehold.co/800x400/e2e8f0/1e293b?text=Blog+Cover",
        author: {
          id: "current-user",
          name: "Current User",
          avatar: "https://placehold.co/100x100/e2e8f0/1e293b?text=User",
        },
        publishedAt: new Date().toISOString(),
      }

      const createdBlog = await createBlogPost(newBlog)

      toast({
        title: "Success",
        description: "Blog post created successfully",
      })

      router.push(`/blogs/view/${createdBlog.id}`)
    } catch (error) {
      console.error("Failed to create blog post:", error)
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Blog Post</h1>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Publishing..." : "Publish"}
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
              <FormLabel>Content</FormLabel>
              <div className="border border-gray-200 dark:border-[#2B2B30] rounded-md overflow-hidden">
                <TipTapEditor onChange={handleEditorChange} initialContent="" />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
