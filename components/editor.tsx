import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export function Editor({ value = "", onChange }: { value?: string; onChange: (value: string) => void }) {
  // Ensure value is never undefined
  const initialValue = value || ""

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
