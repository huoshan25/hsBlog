// components/MarkdownContent.tsx
import { defineComponent, type PropType } from 'vue'
import { useMarkdown } from '../../../composables/markdown/useMarkdown'

export default defineComponent({
  props: {
    content: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const { renderToVNode } = useMarkdown()

    return () => renderToVNode(props.content)
  }
})