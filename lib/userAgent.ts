export interface ParsedUA {
  browser: string;
  os: string;
}

export function parseUserAgent(uaString: string | null): ParsedUA {
  if (!uaString) {
    return { browser: "Unknown", os: "Unknown" };
  }

  let browser = "Unknown";
  let os = "Unknown";

  // Determinar Sistema Operativo
  if (uaString.includes("Windows")) os = "Windows";
  else if (uaString.includes("Macintosh") || uaString.includes("Mac OS X")) os = "macOS";
  else if (uaString.includes("Linux")) os = "Linux";
  else if (uaString.includes("Android")) os = "Android";
  else if (uaString.includes("iPhone") || uaString.includes("iPad") || uaString.includes("iPod")) os = "iOS";

  // Determinar Navegador
  if (uaString.includes("Firefox/")) {
    browser = "Firefox";
  } else if (uaString.includes("Edg/")) {
    browser = "Microsoft Edge";
  } else if (uaString.includes("Chrome/")) {
    browser = "Chrome";
  } else if (uaString.includes("Safari/") && !uaString.includes("Chrome/")) {
    browser = "Safari";
  } else if (uaString.includes("Opera") || uaString.includes("OPR/")) {
    browser = "Opera";
  }

  return { browser, os };
}
