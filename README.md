# emotional-webkit

用纯 HTML / CSS / JavaScript 制作竖屏情感短视频，再用 Puppeteer 逐帧录制导出为 MP4。

无需 After Effects，无需 Premiere，一个浏览器就够了。

## 效果预览

项目内含一个完整的示例视频页面 `video.html`，主题为**「输入法还记得你的名字」**——

> 一个关于失恋后手机输入法依然记住那个人名字的情感故事。  
> 包含 5 个场景：暗场开场、手机输入框联想、雨窗独白、笔记本手写、结尾互动。

直接用浏览器打开 `video.html` 即可观看动画效果。

## 为什么做这个

做短视频内容的人，大部分依赖 AE / PR / 剪映等工具。但这些工具对纯文字、情感类、诗意化的竖屏视频来说往往「杀鸡用牛刀」。

emotional-webkit 的思路是：**把网页当画布**。

- 网页天然擅长排版、动画、粒子效果、渐变、模糊
- CSS transition / keyframe 动画流畅且可精确控制时序
- 一个 HTML 文件就是一段视频的分镜脚本
- 修改文案、配色、节奏只需要改文字和数字

## 工作流

```
1. 编辑 video.html  →  设计场景、文案、动画时间线
2. 浏览器打开预览  →  实时查看效果，反复调整
3. npm install      →  安装依赖（puppeteer）
4. node capture.js  →  Puppeteer 逐帧截图到 frames/ 目录
5. ffmpeg 合成      →  将帧序列合成 MP4 视频
```

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/emotional-webkit.git
cd emotional-webkit

# 2. 安装依赖
npm install

# 3. 浏览器预览动画效果
#    直接双击 video.html 或用 Live Server 打开

# 4. 录制帧序列
node capture.js

# 5. 用 FFmpeg 合成视频
ffmpeg -framerate 30 -i frames/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow output.mp4
```

## 项目结构

```
emotional-webkit/
├── video.html       # 视频页面（场景、文案、动画、样式全部在此）
├── capture.js       # Puppeteer 逐帧截图脚本
├── package.json     # 项目配置与依赖
├── README.md        # 你正在看的文件
└── frames/          # 截图输出目录（运行 capture.js 后生成）
```

## 技术细节

### video.html 设计思路

页面以 `1080x1920` 竖屏为基准，通过 JavaScript 时间轴系统驱动 5 个场景的切换：

| 场景 | 内容 | 时段 | 视觉风格 |
|------|------|------|----------|
| Scene 0 | 标题浮现 | 0-1.5s | 暗场 + 辉光文字 |
| Scene 1 | 手机输入框联想 | 1.5-5s | 模拟手机界面 + 浮动粒子 |
| Scene 2 | 核心文案 | 5-11s | 深蓝背景 + 渐显文字 |
| Scene 3 | 雨窗独白 | 11-22s | 雨滴动画 + 散景光斑 |
| Scene 4 | 笔记本手写 | 22-27s | 暖色纸质纹理 + 手写体 |
| Scene 5 | 结尾互动 | 27-33s | 极简黑底 + 互动引导 |

动画全部基于 CSS transition，配合 JavaScript `setTimeout` 时间轴精确控制出场时机。

### capture.js 录制逻辑

- 使用 Puppeteer headless 模式加载 `video.html`
- 以 30fps 逐帧截图为 PNG
- 对非关键帧做了跳帧优化（隔帧复制），加快录制速度
- 输出帧序列到 `frames/` 目录，供 FFmpeg 合成

### 自定义你的视频

修改 `video.html` 中的以下部分即可：

- **文案**：直接修改 HTML 中的文字内容
- **配色**：修改 CSS 中的颜色值（`rgba()` 或十六进制）
- **时间线**：调整 `timeline` 数组中的 `time` 值（单位：毫秒）
- **字体**：更换 `@import` 引入的 Google Fonts 链接
- **场景数量**：复制/删除 `.scene` 区块，并在 timeline 中添加对应事件

## 依赖

- [Puppeteer](https://pptr.dev/) — 无头浏览器，用于逐帧截图
- [FFmpeg](https://ffmpeg.org/) — 视频编码合成（需另行安装）

## 许可

[MIT License](LICENSE) - 自由使用、修改、分发。
