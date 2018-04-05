const css =
[
  { name: 'comment', reg: /\/\*[\s\S]*?\*\//g, },
  { name: 'atrule', reg: /@[\w-]+?.*?(?:;|(?=\s*\{))/gi, },
  { name: 'url', reg: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/gi, },
  { name: 'selector', reg: /[^{}\s][^{};]*?(?=\s*\{)/g, },
  { name: 'string', reg: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/g, },
  { name: 'property', reg: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/gi, },
  { name: 'important', reg: /\B!important\b/gi, },
  { name: 'function', reg: /[-a-z0-9]+(?=\()/gi, },
  { name: 'punctuation', reg: /[(){};:]/g, },
];

export default css;
