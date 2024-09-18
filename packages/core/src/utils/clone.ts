export function deepClone(value: any, cache = new WeakMap()) {
  // 派出原始类型，函数也满足此条件
  if (typeof value !== "object" || value === null) {
    return value;
  }
  
  // 如果缓存中存在，则直接返回缓存中的值，解决环形引用问题
  const cached = cache.get(value);
  if (cached) {
    return cached;
  }
  
  // 克隆结果：1.数组 2.对象
  
  
  
  
  
  
  
  
  const result = Array.isArray(value) ? [] : {};
  // 设置结果原型链为value的原型链
  Object.setPrototypeOf(result, Object.getPrototypeOf(value));
  // 环形引用问题，将当前value缓存
  cache.set(value, result);
  // 递归克隆
  for(let key in value) {
    if (value.hasOwnProperty(key)) {
      (result as { [key: string]: any })[key] = deepClone(value[key], cache);
    }
  }
  
  return result;
}
