/**
 * Vercel Serverless Function - 会议助手 API
 * 支持生成会议纪要和待办事项
 */
export default async function handler(req, res) {
  // ✅ 设置跨域头（允许前端调用）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🔍 处理预检请求（CORS）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ❌ 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowed: 'POST'
    });
  }

  try {
    // 📥 解析请求体
    const body = req.body;
    const content = body?.content?.trim();
    const type = body?.type;

    // ❌ 验证输入
    if (!content) {
      return res.status(400).json({
        error: 'Missing or empty "content" in request body'
      });
    }

    if (!type || !['summary', 'tasks'].includes(type)) {
      return res.status(400).json({
        error: 'Missing or invalid "type". Use "summary" or "tasks"'
      });
    }

    // 🧠 模拟 AI 处理（返回结构化结果）
    let result;
    if (type === 'summary') {
      result = `【会议纪要】\n\n主题：${content.substring(0, 30)}...\n\n本次会议围绕项目进度展开讨论，明确了下一阶段目标与分工安排。\n\n关键结论：\n1. 项目周期为6周，9月底交付\n2. 前端由张三负责，后端由李四牵头\n3. 每周五下午3点举行进度同步会`;
    } else {
      result = `✅ 待办事项清单\n\n1. 完成需求文档终稿撰写\n2. 开发用户登录与权限模块\n3. 联调前后端 API 接口\n4. 编写核心功能测试用例\n5. 准备下周客户演示材料`;
    }

    // ✅ 返回成功响应
    return res.status(200).json({
      text: result,
      timestamp: new Date().toISOString(),
      type: type
    });

  } catch (error) {
    // 🛑 捕获所有异常，防止 CONNECTION_CLOSED
    console.error('API Handler Error:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
