export const watchRegex = /^[a-zA-Z$_][\w$]*(\.[a-zA-Z$_][\w$]*)*$/;
export const watchStartRegex = /[a-zA-Z$_]/;
export const validWatchChar = /[a-zA-Z0-9$\.]/;
export const push = Array.prototype.push;
export const glob = {
  registeredTagsCount: 0,
  registeredTags: Object.create(null)
};
export const testInterpolationRegex = /\{\{[^\}]+\}\}/;
export const interpilationExprRegex = /\{\{([^\}]+)\}\}/g;
export const spaceRegex = /\s+/;
export const eventPrefix = '@';
export const interceptArrayMethods = ['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'splice'];
export const filters = Object.create(null);
export const newFunCacheKey = 'NEWFUNCACHE';