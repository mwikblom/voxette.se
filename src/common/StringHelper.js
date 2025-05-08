import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['p', 'span', '#text', 'h2', 'h3', 'h4', 'i', 'b', 'ul', 'li', 'ol', 'strong', 'br', 'a'];
const ADD_ATTR = ['target'];

export function sanitizeHTML(dirtyHtmlString) {
  if (!DOMPurify.isSupported) {
    return '';
  }
  return DOMPurify.sanitize(dirtyHtmlString, { ALLOWED_TAGS, ADD_ATTR });
}

export function replaceLinebreaks(text) {
  return text.replace(/(\r\n|\r|\n)/g, ' <br /> ');
}
