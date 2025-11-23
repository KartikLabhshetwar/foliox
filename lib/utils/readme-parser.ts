export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  x?: string;
}

export function parseSocialLinksFromReadme(readmeContent: string): SocialLinks {
  const links: SocialLinks = {};

  const linkedinPatterns = [
    /linkedin\.com\/in\/([a-zA-Z0-9-]+)/gi,
    /\[LinkedIn\]\((https?:\/\/[^\s\)]+linkedin\.com[^\s\)]+)\)/gi,
    /linkedin:\s*(https?:\/\/[^\s]+)/gi,
  ];

  const twitterPatterns = [
    /twitter\.com\/([a-zA-Z0-9_]+)/gi,
    /x\.com\/([a-zA-Z0-9_]+)/gi,
    /\[Twitter\]\((https?:\/\/[^\s\)]+(?:twitter|x)\.com[^\s\)]+)\)/gi,
    /\[X\]\((https?:\/\/[^\s\)]+(?:twitter|x)\.com[^\s\)]+)\)/gi,
    /twitter:\s*(https?:\/\/[^\s]+)/gi,
    /x:\s*(https?:\/\/[^\s]+)/gi,
  ];

  for (const pattern of linkedinPatterns) {
    const matches = readmeContent.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].startsWith('http')) {
        links.linkedin = match[1];
      } else if (match[1]) {
        links.linkedin = `https://www.linkedin.com/in/${match[1]}`;
      }
      if (links.linkedin) break;
    }
    if (links.linkedin) break;
  }

  for (const pattern of twitterPatterns) {
    const matches = readmeContent.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].startsWith('http')) {
        links.twitter = match[1];
        links.x = match[1];
      } else if (match[1]) {
        const username = match[1];
        links.twitter = `https://twitter.com/${username}`;
        links.x = `https://x.com/${username}`;
      }
      if (links.twitter) break;
    }
    if (links.twitter) break;
  }

  return links;
}

