import llm from './config.mjs'
// import { HumanMessage } from '@langchain/core/messages'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'
import { z } from 'zod'

let messageHistories
let withMessageHistory
export const chat_chat = async (userInput, returnId) => {
  const config = {
    configurable: {
      sessionId: 'a1'
    }
  }
  if (returnId) {
  } else {
    messageHistories = {}
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `你是一个优秀的英文聊天助手，你的名字叫小识，现在你将根据输入的信息，进行连续的英文对话,注意：你必须用英文进行对话，请确保你的回答中没有中文`
      ],
      ['placeholder', '{chat_history}'],
      ['human', '{input}']
    ])
    const chain = prompt.pipe(llm)
    withMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: async (sessionId) => {
        if (messageHistories[sessionId] === undefined) {
          messageHistories[sessionId] = new InMemoryChatMessageHistory()
        }
        return messageHistories[sessionId]
      },
      inputMessagesKey: 'input',
      historyMessagesKey: 'chat_history'
    })
  }

  const res = await withMessageHistory.invoke(
    {
      input: userInput
    },
    config
  )
  return new Promise((resolve, reject) => {
    resolve(res.content)
  })
}

export const chat_translate = async (userInput, returnId) => {
  const examlpeSchema = z.object({
    example_sentence: z
      .string()
      .describe('英文例句,输入为单词和短语的时候出现'),
    example_translation: z.string().describe('英文例句的翻译')
  })
  const personSchema = z
    .object({
      english: z.string().describe('识别出来的英文'),
      explain: z
        .string()
        .describe('完整的包含词性和中文解释,内容要全面,只保留中文部分'),
      phonetic: z
        .string()
        .describe('单词的音标,输入为单词的时候出现,检查格式正确性')
        .optional(),
      examlpe: z.array(examlpeSchema).optional()
    })
    .describe('对提供的中文寻找发音相似的英文')

  const parser = StructuredOutputParser.fromZodSchema(personSchema)

  const prompt = PromptTemplate.fromTemplate(
    `识别并翻译输入的{content}, 首先判断输入的是单词还是短语还是完整的句子。
    如果是单词,回答中要有翻译，音标和例句;
    如果是短语，回答中要有翻译，例句,不要带上音标;
    如果是句子，就只返回英文和翻译，不需要带上例句;
    如果输入的是中文，那么就将其完整的翻译成英文,规则同上
    仔细检查你输入的英文和你返回的英文格式，大小写是否正确，如果不对，改正
    Wrap the output in json tags\n{format_instructions}`
  )

  const partialedPrompt = await prompt.partial({
    format_instructions: parser.getFormatInstructions()
  })

  const chain = partialedPrompt.pipe(llm).pipe(parser)

  const res = await chain.invoke({ content: userInput })

  return new Promise((resolve, reject) => {
    resolve(res)
  })
}
