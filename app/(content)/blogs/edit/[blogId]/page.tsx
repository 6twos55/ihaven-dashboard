"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Editor } from "@/components/editor"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  coverImage: z.string().url({ message: "Invalid URL" }),
})

const BlogEditPage = () => {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    coverImage: "",
  })
  const [content, setContent] = useState("")
  const id = params.blogId as string

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/blogs/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch blog")
        }
        const data = await response.json()
        setFormData({
          title: data.title || "",
          excerpt: data.excerpt || "",
          category: data.category || "",
          coverImage: data.coverImage || "",
        })
        setContent(data.content || "")
      } catch (error: any) {
        toast({
          title: "Error!",
          description: error.message,
          variant: "destructive",
        })
        // Set default empty content on error
        setContent("")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [id, toast])

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
    form.reset(formData)
  }, [formData, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, content }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Blog updated successfully.",
        })
        router.push(`/blogs/view/${id}`)
      } else {
        throw new Error("Failed to update blog")
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <Link href={`/blogs/view/${id}`} className="mr-4">
          Back to Blog
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                  <Textarea placeholder="Enter blog excerpt" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog category" {...field} />
                </FormControl>
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
                  <Input placeholder="Enter cover image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="min-h-[400px] border rounded-md">
                    {!isLoading && (
                      <Editor
                        value={content || ""}
                        onChange={(value) => {
                          setContent(value)
                          field.onChange(value)
                        }}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Blog"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default BlogEditPage
