import useMarkdownAbstract from "~/composables/tools/useMarkdownAbstract.js";

const stopwords = new Set(["the", "is", "in", "and", "of", "to", "a", "an"]);

function tokenize(text) {
  return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word && !stopwords.has(word));
}

function buildGraph(words, windowSize = 4) {
  const graph = new Map();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!graph.has(word)) {
      graph.set(word, new Set());
    }

    for (let j = i + 1; j < Math.min(i + windowSize, words.length); j++) {
      graph.get(word).add(words[j]);
      if (!graph.has(words[j])) {
        graph.set(words[j], new Set());
      }
      graph.get(words[j]).add(word);
    }
  }

  return graph;
}

function rankNodes(graph, d = 0.85, maxIter = 100, tol = 1e-6) {
  const nodes = Array.from(graph.keys());
  const scores = new Map(nodes.map(node => [node, 1 / nodes.length]));

  for (let iter = 0; iter < maxIter; iter++) {
    const newScores = new Map();

    for (const node of nodes) {
      let score = 1 - d;
      for (const neighbor of graph.get(node)) {
        score += d * (scores.get(neighbor) / graph.get(neighbor).size);
      }
      newScores.set(node, score);
    }

    let diff = 0;
    for (const node of nodes) {
      diff += Math.abs(newScores.get(node) - scores.get(node));
    }

    scores.clear();
    for (const [node, score] of newScores) {
      scores.set(node, score);
    }

    if (diff < tol) {
      break;
    }
  }

  return scores;
}

 function extractKeywords(text, topN = 10) {
  const words = tokenize(text);
  const graph = buildGraph(words);
  const scores = rankNodes(graph);
  return Array.from(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word]) => word);
}

// Example usage:
const text = "TextRank is a graph-based ranking algorithm for natural language processing that can be used for keyword extraction and text summarization.";
// const keywords = extractKeywords(text, 5);
// console.log(keywords);

export default extractKeywords