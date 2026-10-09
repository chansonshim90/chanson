# CHANSON SHIM 个人作品集

完整网站源码，使用 React、Vite、Three.js。包含流体背景、文字交互、发光边框、入场动画、人物图片和四支作品视频。按作者要求，公开仓库不包含简历 PDF，页面中的简历下载链接也已移除。

## 本地运行

安装 Node.js 和 pnpm 后，在项目目录执行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开终端显示的本地地址。

## 构建与预览

```sh
pnpm build
pnpm preview
```

构建产物位于 `dist/`。部署时将该目录上传到静态网站托管服务，按网站根路径部署。

## 目录

- `src/main.jsx`：页面、项目内容和交互逻辑
- `src/styles.css`：页面样式及响应式布局
- `src/components/`：背景、文字、边框等视觉组件
- `public/media/`：图片及网页播放视频

视频是保留完整时长的网页播放压缩版。保留原网站人物形象。本仓库不包含单文件离线 HTML、依赖目录、构建产物或托管账号配置。

上传代码不等于自动发布网站，网站需单独配置托管服务。
