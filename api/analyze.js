export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageBase64, mimeType } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: '请在 Vercel 中配置 OPENROUTER_API_KEY 环境变量' });
    }
    if (!imageBase64) {
      return res.status(400).json({ error: '未收到图片数据' });
    }

    const systemPrompt = `你是一位亚马逊高级运营专家，专精于产品图片分析与优化策略。

用户上传了一张竞品展示图，请你从专业电商运营角度分析这张图，并生成3个AI图片生成提示词。

请严格返回以下JSON格式（不包含任何Markdown代码块标记，直接输出纯JSON）：

{
  "analysis": {
    "scene": "场景类型（如：白底商业图/生活场景图/创意概念图等）",
    "composition": "构图特点（如：居中对称/三角构图/留白处理等）",
    "color": "色彩搭配（主色调、辅助色、整体氛围）",
    "lighting": "光线运用（如：柔和自然光/专业棚拍光/逆光效果等）",
    "style": "整体风格（如：简约高端/温馨家居/科技感/户外探险等）",
    "highlights": ["该图最大亮点1", "亮点2", "亮点3（从转化率/视觉吸引力角度）"]
  },
  "prompts": [
    {
      "id": 1,
      "title": "简约白底版",
      "description": "适合主图/详情页首图",
      "prompt": "根据图片定制的英文prompt"
    },
    {
      "id": 2,
      "title": "生活场景版",
      "description": "适合增加代入感与转化",
      "prompt": "根据图片定制的英文prompt"
    },
    {
      "id": 3,
      "title": "创意概念版",
      "description": "适合品牌广告/社媒推广",
      "prompt": "根据图片定制的英文prompt"
    }
  ]
}

注意：三个prompt必须根据你看到的实际竞品图片特点来定制。每个英文prompt要详细（50词以上），包含具体的场景、光线、构图、色调描述，能直接用于Stable Diffusion/Midjourney/Nano Banana等AI图片生成工具。`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-tool-jane-v1.vercel.app',
        'X-Title': 'Amazon Product Image Analyzer'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`
                }
              },
              {
                type: 'text',
                text: systemPrompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `OpenRouter API 错误 (${response.status})`);
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content || '';

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error('AI 返回格式解析失败，请重试');
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    return res.status(500).json({ error: error.message || '分析失败，请重试' });
  }
}
