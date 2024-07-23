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
  const personSchema = z
    .object({
      english: z.string().describe('识别出来的英文单词或者短语或者句子'),
      explain: z.string().describe('翻译成中文')
    })
    .describe('对提供的中文寻找发音相似的英文')

  const parser = StructuredOutputParser.fromZodSchema(personSchema)

  const prompt = PromptTemplate.fromTemplate(
    `识别并翻译输入的英文{content},Wrap the output in json tags\n{format_instructions}`
  )

  const partialedPrompt = await prompt.partial({
    format_instructions: parser.getFormatInstructions()
  })

  const chain = partialedPrompt.pipe(llm).pipe(parser)

  const res = await chain.invoke({ content: userInput })
  return new Promise((resolve, reject) => {
    resolve(res.content)
  })
}
