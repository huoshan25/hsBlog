import {type Ref, ref} from 'vue';

// 预览数据接口
export interface UrlPreview {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  url: string;
  canonicalUrl: string;
  publishedTime: string | null;
  author: string | null;
  keywords: string[] | null;
  favicon: string | null;
}

// 选择器类型
type MetaSelector = string;

// 钩子返回类型
interface UseUrlPreviewReturn {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  getUrlPreview: (url: string) => Promise<UrlPreview>;
  parseUrl: (url: string) => ParsedUrl;
  extractMainDomain: (url: string) => string;
}

// 缓存接口
interface UrlPreviewCache {
  data: UrlPreview;
  timestamp: number;
  // 缓存过期时间，默认30分钟
  expiresIn: number;
}

// URL解析结果接口
export interface ParsedUrl {
  domain: string;
  isIp: boolean;
  protocol: string | null;
  port: string | null;
  path: string | null;
}

export function useUrlPreview(cacheExpirationTime: number = 30 * 60 * 1000): UseUrlPreviewReturn {
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const cache = new Map<string, UrlPreviewCache>();

  /*是否缓存*/
  const isCacheValid = (cacheItem: UrlPreviewCache): boolean => {
    return Date.now() - cacheItem.timestamp < cacheItem.expiresIn;
  };

  /*获取元内容*/
  const getMetaContent = (doc: Document, selectors: MetaSelector[]): string | null => {
    for (const selector of selectors) {
      const element = doc.querySelector(selector) as HTMLMetaElement;
      if (element?.content) return element.content;
    }
    return null;
  };

  /*获取网址*/
  const getFaviconUrl = (doc: Document, baseUrl: string): string | null => {
    const faviconEl = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]') as HTMLLinkElement;
    if (!faviconEl) return null;

    const faviconHref = faviconEl.getAttribute('href');
    if (!faviconHref) return null;

    try {
      return faviconHref.startsWith('http')
        ? faviconHref
        : new URL(faviconHref, baseUrl).href;
    } catch {
      return null;
    }
  };

  /*获取url预览*/
  const getUrlPreview = async (url: string): Promise<UrlPreview> => {
    loading.value = true;
    error.value = null;

    try {
      // 检查缓存
      const cachedData = cache.get(url);
      if (cachedData && isCacheValid(cachedData)) {
        loading.value = false;
        return cachedData.data;
      }

      const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`)

      // console.log(response,'response')

      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }

      const html = await response.text();
      console.log(html,'html')
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const preview: UrlPreview = {
        title: getMetaContent(doc, [
          'meta[property="og:title"]',
          'meta[name="twitter:title"]'
        ]) || doc.title || doc.querySelector('h1')?.textContent?.trim() || null,

        description: getMetaContent(doc, [
          'meta[property="og:description"]',
          'meta[name="twitter:description"]',
          'meta[name="description"]'
        ]),

        image: getMetaContent(doc, [
          'meta[property="og:image"]',
          'meta[name="twitter:image"]'
        ]),

        siteName: getMetaContent(doc, [
          'meta[property="og:site_name"]',
          'meta[name="application-name"]'
        ]),

        url: url,
        canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || url,

        publishedTime: getMetaContent(doc, [
          'meta[property="article:published_time"]',
          'meta[name="published_time"]'
        ]),

        author: getMetaContent(doc, [
          'meta[property="article:author"]',
          'meta[name="author"]'
        ]),

        keywords: getMetaContent(doc, ['meta[name="keywords"]'])
          ?.split(',')
          .map(k => k.trim()) || null,

        favicon: getFaviconUrl(doc, url)
      };

      /*更新缓存*/
      cache.set(url, {
        data: preview,
        timestamp: Date.now(),
        expiresIn: cacheExpirationTime
      });

      loading.value = false;
      return preview;

    } catch (err) {
      loading.value = false;
      error.value = err instanceof Error ? err : new Error('发生错误');
      throw error.value;
    }
  };

  /**
   * 判断字符串是否为有效的 IPv4 地址
   */
  const isValidIPv4 = (ip: string): boolean => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  /**
   * 判断字符串是否为有效的 IPv6 地址
   */
  const isValidIPv6 = (ip: string): boolean => {
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}::([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}::([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){2}:([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){3}:([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){4}:([0-9a-fA-F]{1,4}:)?[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){5}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){6}:[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  };

  /**
   * 解析URL，提取域名或IP地址
   */
  const parseUrl = (urlString: string): ParsedUrl => {
    try {
      // 确保URL包含协议
      if (!urlString.match(/^[a-zA-Z]+:\/\//)) {
        urlString = 'http://' + urlString;
      }

      const url = new URL(urlString);
      const hostname = url.hostname;

      // 检查是否为IP地址
      const isIp = isValidIPv4(hostname) || isValidIPv6(hostname);

      return {
        domain: hostname,
        isIp,
        protocol: url.protocol.replace(':', ''),
        port: url.port || null,
        path: url.pathname === '/' ? null : url.pathname
      };
    } catch (error) {
      throw new Error(`Invalid URL: ${urlString}`);
    }
  };

  /**
   * 获取URL的纯域名（去除子域名）
   */
  const extractMainDomain = (urlString: string): string => {
    try {
      const { domain, isIp } = parseUrl(urlString);

      // 如果是IP地址，直接返回
      if (isIp) return domain;

      // 提取主域名
      const parts = domain.split('.');
      if (parts.length <= 2) return domain;

      // 处理特殊的二级域名情况（如 co.uk, com.cn 等）
      const specialTlds = ['co.uk', 'com.cn', 'com.au', 'co.jp'];
      const lastTwo = parts.slice(-2).join('.');
      if (specialTlds.includes(lastTwo)) {
        return parts.slice(-3).join('.');
      }

      return parts.slice(-2).join('.');
    } catch (error) {
      throw new Error(`Invalid URL for domain extraction: ${urlString}`);
    }
  };

  return {
    loading,
    error,
    getUrlPreview,
    parseUrl,
    extractMainDomain
  };
}