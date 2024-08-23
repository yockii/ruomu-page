# 新建toolbar元素指南

在本目录下直接运行
```shell
pnpm create vite [xxxx] --template vue-ts
```

删除非必要文件：
- .vscode/
- public/
- .gitignore
- index.html
- src/ 下面多于的文件（大部分仅需要index.ts和对应的组件文件）

修改`package.json`中的`name`字段为`@editorjs/toolbar-xxxx`

增加`package.json`中`main`字段为`index.ts`

增加`package.json`的依赖项：
```
  "@ruomu-ui/core": "workspace:*"
```

安装依赖
```shell
pnpm install
```

新增`index.ts`文件，内容如下：
```typescript
import XxxComponent from "./src"
import type {Toolbar} from "@ruomu-ui/core"

const Xxx: Toolbar = {
  id: "xxx",
  align: "left",
  component: XxxComponent,
}

export default Xxx
```
