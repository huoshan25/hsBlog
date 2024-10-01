import MarkdownIt from "markdown-it";
import {formatText} from "~/composables/tools/testFormatting";

/**
 * 定义markdown内容的摘要hook
 * @description
 * 目前规则： 是否有前言内容，是否有h1下的内容， 前面都无则结合文本内容来用TextRank生成摘要。
 * @param content md的内容
 */
const useMarkdownAbstract = (content: string) => {
  /**md文章摘要*/
  const briefContent = ref()

  const md = new MarkdownIt();

  /**
   * 获取前言
   * @param tokens
   * @private
   */
  const extractPreface = (tokens: any[]): string => {
    let content = '';
    // 是否为前言内容
    let inPreface = false;

    // 判断开头是否为文本内容
    if (tokens.length === 0 || tokens[0].type !== 'paragraph_open' || tokens[0].tag !== 'p') {
      return content;
    }

    tokens.some(token => {
      if (token.type === 'paragraph_open' && token.tag === 'p') {
        inPreface = true;
      } else if (inPreface && token.tag === 'p') {
        return true; // 遇到不是文本内容时结束
      }

      if (inPreface && token.type === 'inline' && token.tag === '') {
        content += token.content;
      }

      return false;
    });

    return content;
  };

  /**
   * 获取第一个h1的内容
   * @param tokens
   * @private
   */
  const extractContentBeforeFirstHeading = (tokens: any[]): string | boolean => {
    console.log(tokens,'tokens')
    let content = '';
    for (const token of tokens) {
      if (token.type === 'heading_open' && token.tag === 'h1') {
        content = token.content;
        break;
      } else {
        return false
      }
    }
    return content;
  }

  /**
   * 使用 TextRank 模型生成摘要
   * 假设 textrank.summarize 是 TextRank 模型库的摘要方法
   * @private
   */
  const generateSummary = (mdContent: string): any => {
    // 去除非文本内容
    let textContent = parseMarkdownAndRemoveHeaders(mdContent)
    // 格式化段落
    textContent = formatText(textContent)
    // 使用 TextRank 模型生成摘要
    const textRank = new TextRank(textContent);
    return textRank.getSummarizedOneText();
  }

  /**
   * md过滤
   * @description
   * 处理markdown非文本的内容
   * @private
   */
  const parseMarkdownAndRemoveHeaders = (mdContent: any): string => {
    // 自定义规则来移除 h1 和其他的 Markdown 标签
    md.core.ruler.push('remove_headers_and_extract_text', (state) => {
      let tokens = state.tokens;
      let textContent = '';
      let currentParagraph = '';

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // 检查是否是段落的开始
        if (token.type === 'paragraph_open') {
          currentParagraph = '';
        }

        // 检查是否是段落中的文本
        if (token.type === 'inline') {
          // @ts-ignore
          for (let j = 0; j < token.children.length; j++) {
            // @ts-ignore
            if (token.children[j].type === 'text') {
              // @ts-ignore
              currentParagraph += token.children[j].content + ' ';
            }
          }
        }

        // 检查是否是段落的结束
        if (token.type === 'paragraph_close') {
          textContent += currentParagraph.trim() + '\n\n';
        }
      }

      // 移除所有的 token
      state.tokens = [];

      // 重新添加纯文本 token
      // @ts-ignore
      state.tokens.push({
        type: 'text',
        content: textContent.trim(),
        level: 0,
      });
    });

    // 解析 Markdown 内容
    const parsedContent = md.render(mdContent);


    /**
     * 提取文本内容，并且格式化字符串内容
     */
    return formatText(parsedContent);
  };

  // 解析 Markdown 内容
  const tokens = md.parse(<string>content, {});
  const tokens2 = content

  /**规则1: 判断是否有前言模块*/
  const preface = extractPreface(tokens);
  if (preface) {
    briefContent.value = preface;
  } else {
    /**规则2: 判断第一级标题前是否有内容*/
    const beforeFirstHeading = extractContentBeforeFirstHeading(tokens);
    if (beforeFirstHeading) {
      briefContent.value = beforeFirstHeading;
    } else {
      /**规则3: 使用 TextRank 模型生成摘要*/
      briefContent.value = generateSummary(tokens2);
    }
  }

  return {
    briefContent
  }
}


export default useMarkdownAbstract;