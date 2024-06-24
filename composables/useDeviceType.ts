export interface DeviceTypeResult {
  type: string;
  env?: 'wechat' | 'weibo' | 'qq';
  masklayer?: boolean;
  /*操作系统版本*/
  osVersion?: string;
  /*浏览器信息*/
  browserInfo?: {
    name?: string,
    version?: string
  };
}

/*判断是否为微信环境*/
function isWechat(UA: string): boolean {
  return /MicroMessenger/i.test(UA);
}

/*判断是否为移动端*/
function isMobile(UA: string): boolean {
  return /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(UA);
}

/*判断是否为iOS设备*/
function isIOS(UA: string): boolean {
  return /iPhone|iPad|iPod/i.test(UA);
}

/*判断是否为Android设备*/
function isAndroid(UA: string): boolean {
  return /Android/i.test(UA);
}

/*解析操作系统版本*/
const getOSVersion = (UA: string): string => {
  if (isIOS(UA)) {
    const match = UA.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      return `${match[1]}.${match[2]}`;
    }
  } else if (isAndroid(UA)) {
    const match = UA.match(/Android (\d+(\.\d+)?)/);
    if (match) {
      return match[1];
    }
  }
  return '';
}

/*解析浏览器信息*/
const getBrowserInfo = (UA: string): DeviceTypeResult['browserInfo'] => {
  const browserInfo: DeviceTypeResult['browserInfo'] = {};
  const browserMatches = UA.match(/(Chrome|Firefox|Safari|Edge|MSIE|Trident)/i);
  if (browserMatches) {
    browserInfo.name = browserMatches[0].toLowerCase();
    const versionMatch = UA.match(new RegExp(`${browserInfo.name}/([\\d.]+)`, 'i'));
    if (versionMatch && versionMatch.length > 1) {
      browserInfo.version = versionMatch[1];
    }
  }
  return browserInfo;
}

/**
 * 根据userAgent判断设备类型
 * @returns {DeviceTypeResult} 设备类型
 */
export const useDeviceType = (): DeviceTypeResult => {
  const headers = useRequestHeaders();
  const userAgent = headers['user-agent'] || '';
  if (userAgent === '') {
    return {
      type: '没有user-agent'
    }
  }

  /*操作系统版本*/
  const osVersion = getOSVersion(userAgent);
  /*浏览器信息*/
  const browserInfo = getBrowserInfo(userAgent);

  if (isMobile(userAgent)) {
    if (isIOS(userAgent)) {
      return {
        type: 'ios',
        env: isWechat(userAgent) ? 'wechat' : undefined,
        masklayer: isWechat(userAgent) ? true : undefined,
        osVersion,
        browserInfo
      };
    }
    if (isAndroid(userAgent)) {
      return {
        type: 'android',
        env: isWechat(userAgent) ? 'wechat' : undefined,
        masklayer: isWechat(userAgent) ? true : undefined,
        osVersion,
        browserInfo
      };
    }
    return {
      type: 'mobile',
      osVersion,
      browserInfo
    };
  } else {
    return {
      type: 'pc',
      osVersion,
      browserInfo
    };
  }
}