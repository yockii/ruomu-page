import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; //引入持久化插件
import { piniaShare } from "@ruomu-ui/core"

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
pinia.use(piniaShare);

export default pinia;
