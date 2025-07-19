"use client"

import type React from "react"

import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Code,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Loader2,
  Type,
  FileCode,
} from "lucide-react"
import { useState, useRef, useCallback } from "react"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import TextAlign from "@tiptap/extension-text-align"
import { useToast } from "@/components/ui/use-toast"
import apiRequest from "@/lib/api"

interface TipTapEditorProps {
  onChange: (html: string) => void
  initialContent?: string
}

export function TipTapEditor({ onChange, initialContent = "" }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          crossorigin: "anonymous",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Write something amazing... (Type '/' for commands)",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Define these functions after all hooks
  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setIsLinkPopoverOpen(false)
    }
  }

  const addImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setIsImagePopoverOpen(false)
    }
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Move all hook calls to the top level
  const triggerFileUpload = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      // Ensure the file input exists before trying to click it
      if (fileInputRef.current) {
        fileInputRef.current.click()
      } else {
        console.error("File input reference is not available")
        toast({
          title: "Error",
          description: "Could not open file selector. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setIsUploading(true)

      try {
        // Convert file to base64
        const base64Data = await fileToBase64(file)

        // Use apiRequest instead of fetch
        const response = await apiRequest("POST", "/upload/any", {
          file: base64Data,
        })

        if (!response.success) {
          console.error("Upload failed with response:", response)
          throw new Error(response.message || "Upload failed")
        }

        // Check if the response has the expected format
        if (response.data && response.data.data) {
          if (editor) {
            // Insert the image with crossOrigin attribute
            editor.chain().focus().setImage({ src: response.data.data }).run()
          }

          toast({
            title: "Success",
            description: "Image uploaded successfully",
          })
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [editor, toast],
  )

  if (!editor) {
    return null
  }

  return (
    <div className="border-0 w-full">
      {/* File input for image uploads - moved outside of popover for better accessibility */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        aria-label="Upload image"
      />

      <div className="bg-white dark:bg-[#1F1F23] border-b border-gray-200 dark:border-[#2B2B30] p-2 sticky top-0 z-10 flex flex-wrap gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Toggle heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Toggle heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Toggle heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          aria-label="Toggle code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Toggle blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </Button>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          aria-label="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          aria-label="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          aria-label="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Toggle size="sm" pressed={editor.isActive("link")} aria-label="Add link">
              <LinkIcon className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <Button onClick={addLink}>Add Link</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Toggle size="sm" aria-label="Add image">
              <ImageIcon className="h-4 w-4" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addImage()}
              />
              <div className="flex items-center gap-2">
                <Button onClick={addImage} className="flex-1">
                  Add Image URL
                </Button>
                <Button
                  onClick={triggerFileUpload}
                  variant="outline"
                  className="flex-1"
                  disabled={isUploading}
                  type="button"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {/* Direct upload button in toolbar */}
        <Button variant="ghost" size="sm" onClick={triggerFileUpload} type="button" title="Upload image">
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 min-h-[400px] prose prose-sm dark:prose-invert max-w-none">
        <EditorContent editor={editor} />
      </div>

      {/* Floating Menu for Slash Commands */}
      <FloatingMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          placement: "bottom-start",
        }}
        shouldShow={({ state }) => {
          const { $from } = state.selection
          const currentLineText = $from.nodeBefore?.textContent
          return currentLineText === "/"
        }}
        className="bg-black text-white rounded-md shadow-lg border border-gray-800 overflow-hidden"
        onClick={(e) => {
          // Prevent the click from bubbling up to the form
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <div className="p-1 max-h-80 overflow-y-auto w-72" onClick={(e) => e.stopPropagation()}>
          <div className="text-xs text-gray-400 px-3 py-1">Basic blocks</div>
          <CommandButton
            icon={<Type className="h-4 w-4" />}
            label="Text"
            description="Just start writing with plain text"
            onClick={() => {
              // Delete the slash and continue with normal text
              editor.commands.deleteRange({
                from: editor.state.selection.from - 1,
                to: editor.state.selection.from,
              })
            }}
          />
          <CommandButton
            icon={<Heading1 className="h-4 w-4" />}
            label="Heading 1"
            description="Large section heading"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setNode("heading", { level: 1 })
                .run()
            }}
          />
          <CommandButton
            icon={<Heading2 className="h-4 w-4" />}
            label="Heading 2"
            description="Medium section heading"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setNode("heading", { level: 2 })
                .run()
            }}
          />
          <CommandButton
            icon={<Heading3 className="h-4 w-4" />}
            label="Heading 3"
            description="Small section heading"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setNode("heading", { level: 3 })
                .run()
            }}
          />
          <CommandButton
            icon={<List className="h-4 w-4" />}
            label="Bullet List"
            description="Create a simple bullet list"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .toggleBulletList()
                .run()
            }}
          />
          <CommandButton
            icon={<ListOrdered className="h-4 w-4" />}
            label="Numbered List"
            description="Create an ordered list"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .toggleOrderedList()
                .run()
            }}
          />
          <CommandButton
            icon={<FileCode className="h-4 w-4" />}
            label="Code Block"
            description="Capture code snippets"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .toggleCodeBlock()
                .run()
            }}
          />
          <CommandButton
            icon={<ImageIcon className="h-4 w-4" />}
            label="Image"
            description="Insert an image"
            onClick={() => {
              // Delete the slash
              editor.commands.deleteRange({
                from: editor.state.selection.from - 1,
                to: editor.state.selection.from,
              })
              // Open image popover
              setIsImagePopoverOpen(true)
            }}
          />
          {/* Add direct upload option in slash commands */}
          <CommandButton
            icon={<Upload className="h-4 w-4" />}
            label="Upload Image"
            description="Upload an image from your device"
            onClick={() => {
              // Delete the slash
              editor.commands.deleteRange({
                from: editor.state.selection.from - 1,
                to: editor.state.selection.from,
              })
              // Trigger file upload directly
              triggerFileUpload()
            }}
          />
          <CommandButton
            icon={<Minus className="h-4 w-4" />}
            label="Horizontal Rule"
            description="Add a horizontal divider"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setHorizontalRule()
                .run()
            }}
          />
          <CommandButton
            icon={<Quote className="h-4 w-4" />}
            label="Quote"
            description="Capture a quotation"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .toggleBlockquote()
                .run()
            }}
          />

          <div className="text-xs text-gray-400 px-3 py-1 mt-2">Inline</div>
          <CommandButton
            icon={<Code className="h-4 w-4" />}
            label="Code"
            description="Inline code snippet"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .toggleCode()
                .run()
            }}
          />
          <CommandButton
            icon={<Quote className="h-4 w-4" />}
            label="Blockquote"
            description="Block quote"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .toggleBlockquote()
                .run()
            }}
          />

          <div className="text-xs text-gray-400 px-3 py-1 mt-2">Alignment</div>
          <CommandButton
            icon={<AlignLeft className="h-4 w-4" />}
            label="Align Left"
            description="Align text to the left"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setTextAlign("left")
                .run()
            }}
          />
          <CommandButton
            icon={<AlignCenter className="h-4 w-4" />}
            label="Align Center"
            description="Center align text"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setTextAlign("center")
                .run()
            }}
          />
          <CommandButton
            icon={<AlignRight className="h-4 w-4" />}
            label="Align Right"
            description="Align text to the right"
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                })
                .setTextAlign("right")
                .run()
            }}
          />
        </div>
      </FloatingMenu>
    </div>
  )
}

// Command button component for the slash menu
function CommandButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      className="flex items-center w-full px-3 py-1.5 hover:bg-gray-800 text-left"
      onClick={(e) => {
        e.preventDefault() // Prevent default form submission
        e.stopPropagation() // Stop event propagation
        onClick()
      }}
      type="button" // Explicitly set button type to prevent form submission
    >
      <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-md mr-2">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
      <div className="text-xs text-gray-500">⌘</div>
    </button>
  )
}
