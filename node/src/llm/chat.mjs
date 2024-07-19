import llm from './config.mjs'
import { HumanMessage } from '@langchain/core/messages'
import {
  StringOutputParser,
  StructuredOutputParser
} from '@langchain/core/output_parsers'
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'

const parser = new StringOutputParser()

export const chat_chat = (userInput, returnId) => {
  console.log(userInput)
  return 123
}

export const chat_translate = async (userInput, returnId) => {
  const personSchema = z.object({
    english: z.string().describe('识别出来的英文单词或者短语或者句子'),
    explain: z
      .string()
      .describe('识别出来的英文单词或者短语或者句子对应的中文解释')
  })

  const parser = StructuredOutputParser.fromZodSchema(personSchema)

  const systemTemplate = `你是一个中英文都精通的大师，你的任务是纠正汉语式的英文发音，
  现在需要你来识别中文汉字或者英文和中文汉字组成的词语或者句子，
  这个词语或者句子的发音往往都对应着一个英文单词或者句子的发音，比如
  古的 实际上应该为good, "哈我 而由" 实际上对应 “How are you”。 
  返回的数据格式应该是为：{{ english: string, explain: string }}, 
  其中english字段对应英文的单词或句子，explain对应用中文对这个单词或者句子的解释或者翻译。 
  如果发送了多段，请组成一句话，并且只返回一个对象,
  比如"哈我 are you, 二门 fine, 俺就?",应该返回：{{ english: 'How are you, I'm fine, and you?', explain: '你还好吗，我很好，你呢？'}},
  当你返回数据的时候，一定记得校验数据的格式：Object<{{english: string, explain: string}}>,如果格式不对，请修改后再返回
  识别接下来的词{content}`
  const promptTemplate = PromptTemplate.fromTemplate(systemTemplate)

  const partialedPrompt = await promptTemplate.partial({
    format_instructions: parser.getFormatInstructions()
  })
  const chain = partialedPrompt.pipe(llm).pipe(parser)
  // const chain = promptTemplate.pipe(llm).pipe(parser)
  const res = chain.invoke({ content: userInput })

  return new Promise((resolve, reject) => {
    resolve(res)
  }).then((res) => parser.invoke(res))
}
