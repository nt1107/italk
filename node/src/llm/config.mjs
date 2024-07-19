import { ChatZhipuAI } from '@langchain/community/chat_models/zhipuai'
const secretKey = process.env.ZHIPU_API_KEY

export default new ChatZhipuAI({
  model: 'GLM-4-Flash',
  apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  apiKey: secretKey
})
