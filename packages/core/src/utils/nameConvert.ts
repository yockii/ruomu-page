// 转换驼峰命名为中划线命名（css）
export const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

// 转换中划线命名为驼峰命名（css）
export const toCamelCase = (str: string) => str.replace(/-([a-z])/g, (_, group1) => group1.toUpperCase());

