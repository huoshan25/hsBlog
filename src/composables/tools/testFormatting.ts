export function formatText(text: string) {
  // 定义段落分隔符和换行符
  const paragraphSeparator = '\n\n';

  // 用正则表达式匹配句子
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);

  // 如果没有匹配到句子，直接返回原始文本
  if (!sentences) {
    return text;
  }

  // 初始化变量存储段落
  let paragraphs = [];
  let currentParagraph = '';

  // 遍历每个句子
  for (let i = 0; i < sentences.length; i++) {
    // 当前句子
    const sentence = sentences[i].trim();

    // 如果当前段落长度加上当前句子长度超过一定阈值，则认为是一个新段落
    if (currentParagraph.length + sentence.length > 300) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = sentence;
    } else {
      // 否则，将句子添加到当前段落
      currentParagraph += sentence + ' ';
    }
  }

  // 添加最后一个段落
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.trim());
  }

  // 将段落数组转换为字符串，并用段落分隔符连接
  const formattedText = paragraphs.join(paragraphSeparator);

  return formattedText;
}

