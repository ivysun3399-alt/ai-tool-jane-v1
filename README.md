# 亚马逊竞品图分析 · AI选图助手

上传竞品图 → Gemini AI分析 → 生成3个专业Prompt → 一键打开Nano Banana出图

## 使用流程
1. 上传竞品展示图
2. Gemini 自动分析图片（场景/构图/色彩/光线）并生成3个定制Prompt
3. 选择一个Prompt风格
4. 点击按钮 → Prompt自动复制 + 自动打开 Nano Banana
5. 在 Nano Banana 粘贴Prompt，上传你的商品图，生成！

---

## 部署步骤

### 第一步：获取 Gemini API Key（免费）

1. 访问 https://aistudio.google.com/app/apikey
2. 登录 Google 账号
3. 点击 **Create API Key**
4. 复制生成的 API Key（格式：`AIza...`）

### 第二步：上传代码到 GitHub

将以下4个文件上传到你的 GitHub 仓库 `ai-tool-jane-v1`：

```
ai-tool-jane-v1/
├── index.html        ← 主页面
├── api/
│   └── analyze.js    ← 后端接口（调用Gemini）
├── package.json
└── vercel.json
```

上传方法（任选一种）：
- **方法A**：在 GitHub 网页直接拖拽上传文件
- **方法B**：git clone 后 push

### 第三步：部署到 Vercel

1. 访问 https://vercel.com，用 GitHub 账号登录
2. 点击 **Add New → Project**
3. 选择 `ai-tool-jane-v1` 仓库，点击 **Import**
4. Framework Preset 选 **Other**（不用改任何设置）
5. 点击 **Deploy**

### 第四步：配置环境变量

部署完成后：

1. 在 Vercel 项目页面，点击 **Settings → Environment Variables**
2. 添加一条变量：
   - Name: `GEMINI_API_KEY`
   - Value: 你在第一步复制的 API Key
3. 点击 **Save**
4. 回到 **Deployments**，点击最新部署右侧的 **...** → **Redeploy**

### 完成！

访问 Vercel 给你的域名（如 `ai-tool-jane-v1.vercel.app`）即可使用。

---

## 常见问题

**Q: Gemini API 免费吗？**
A: 是的，Google AI Studio 提供免费额度，个人使用完全够用（每分钟60次请求）。

**Q: 部署失败怎么办？**
A: 检查 Vercel Deployments 页面的错误日志，最常见问题是环境变量未配置或拼写错误。

**Q: 分析报错"请在 Vercel 中配置 GEMINI_API_KEY"？**
A: 按第四步重新配置环境变量，必须 Redeploy 才生效。
