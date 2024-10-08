# Ruomu UI - Lowcode UI Builder

低代码构建应用平台

## 使用说明
详见 [文档](https://github.com/yockii/ruomu-page/blob/master/packages/designer/README.md)

## 特点
- 低代码页面构建
- 支持插槽、事件、变量绑定、样式自定义、方法自定义
- 支持任意UI库（目前以vue3为主）
- 其它……自己想吧

## 成分
- 项目
- 页面/文件夹 可以包含页面
- 组件
- 物料
- 数据源 （axios）
- 依赖资源
- 国际化
- 状态管理 （区分页面和项目）



## 开发说明
1. 为了避免js和css污染，实际组件渲染画布使用iframe嵌入设计窗，同时，该画布应该可以直接预览并使用。
2. 设计窗使用独立组件包裹iframe,来完成组件的选择、拖拽、属性编辑等功能。
3. 所有绘制的组件都带上class="rm-node"，方便后续操作，并附加 data-component-id 属性，用于标识并快速查找schema中对应的组件。
4. 所有插槽节点都带上 class="rm-slot"，方便后续操作，并附加 data-component-slot 属性，用于标识并快速查找schema中对应的插槽。

[//]: # (changeset add/version/publish)