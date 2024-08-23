import {  Store } from 'pinia'

const updateStorage = (storeKey: string, storage: Storage, store: Store) => {
  storage.setItem(storeKey, JSON.stringify(store.$state))
}

interface PiniaShareOptions {
  persistShare?: boolean;
  [key:string]: any;
}

export default ({options, store}: {options: PiniaShareOptions, store: Store}) => {
  const enabled = !!options.persistShare
  if (!enabled) return
  
  const storeKey = `@pinia-persist-share#${store.$id}`
  const storage = window.localStorage
  const storageResult = storage.getItem(storeKey)
  
  store.$patch(JSON.parse(storageResult || '{}'))
  
  let externalUpdate = false
  const channelId = `@pinia-persist-share-channel#${store.$id}`
  let channel: BroadcastChannel | null = new BroadcastChannel(channelId)
  
  channel.onmessage = ({ data }) => {
      externalUpdate = true
      store.$patch(data)
  }
  
  // 清理
  const onBeforeUnload = () => {
    channel && (channel.onmessage = null, channel, channel.close())
    channel = null
    window.removeEventListener('beforeunload', onBeforeUnload)
  }
  
  window.addEventListener('beforeunload', onBeforeUnload)
  
  store.$subscribe(() => {
    updateStorage(storeKey, storage, store)
    
    if (!externalUpdate) {
      const cloneState = JSON.parse(JSON.stringify(store.$state))
      channel?.postMessage(cloneState)
    }
    
    externalUpdate = false
  })
}
