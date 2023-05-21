import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const getUnrelatedWords = async (url: string): Promise<string[]> => {
  try {
    const { data }: { data: string } = await axios.get(url);
    const $ = cheerio.load(data);
    const paragraphs = $("p")
      .map((_, elem) => {
        const txt = $(elem);
        return txt.text().replaceAll(/\n/g, "");
      })
      .toArray();

    const resultArray = paragraphs
      .toString()
      .toLowerCase()
      .replaceAll(/[^a-zA-Z\s]/g, "")
      .split(" ")
      .filter((word) => word !== "");

    return resultArray;
  } catch (error) {
    return [];
  }
};

const addUnrelatedWordsToKeywords = (
  keywords: { [key: string]: number },
  unrelatedWords: string[]
) => {
  unrelatedWords.forEach((word) => {
    keywords[word] = 0;
  });
};

const addRelatedWordsToKeywords = (
  keywords: { [key: string]: number },
  relatedWords: string[]
) => {
  relatedWords.forEach((word) => {
    keywords[word] = 2;
  });
};

const getGptKeywords = async (input: string): Promise<string[]> => {
  const openai = new OpenAIApi(configuration);

  const response: string =
    (
      await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me a 10 words related to ${input}. Format the answer as a javascript array.`,
        max_tokens: 100,
      })
    ).data.choices[0].text || "[]";

  const result: string = response.replace(/'/g, '"');
  const resultArray: string[] = JSON.parse(result);
  return resultArray;
};

export const keywordRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  findGPTKeywords: publicProcedure
    .input(z.object({ topic: z.string() }))
    .mutation(async ({ input }) => {
      const result = await getGptKeywords(input.topic);
      return result;
    }),
  getKeywords: protectedProcedure
    .input(z.object({ lectureId: z.string(), topic: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // The main keywords object that will contain all keywords
      // The value is either 0,1,2 where 2 is the most important
      const keyWords: { [key: string]: number } = {};

      const openai = new OpenAIApi(configuration);

      const response: string = (
        await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Give me a link to a wikipedia article of a topic very unrelated to ${input.topic} that is at least 500 words long`,
          max_tokens: 50,
        })
      ).data.choices[0].text;

      const unrelatedWikiLink = response;

      //Attempts to find topic in wiki article
      const topic = input.topic.replaceAll(" ", "_");
      axios
        .get(`https://en.wikipedia.org/wiki/${topic}`)
        .then(async ({ data }: { data: string }) => {
          const $ = cheerio.load(data);
          const paragraphs = $("p")
            .map((_, elem) => {
              const txt = $(elem);
              return txt.text().replaceAll(/\n/g, "");
            })
            .toArray();
          // console.log(paragraphs);

          const resultArray = paragraphs
            .toString()
            .toLowerCase()
            .replaceAll(/[^a-zA-Z\s]/g, "")
            .split(" ")
            .filter((word) => word !== "");

          resultArray.forEach((word) => {
            word = word.replaceAll(/'/g, "");
            keyWords[word] = 2;
          });

          //Gets unrelated words
          const unrelatedWords = await getUnrelatedWords(unrelatedWikiLink);
          //Get GPT keywords
          const gptKeywords = await getGptKeywords(input.topic);

          addUnrelatedWordsToKeywords(keyWords, unrelatedWords);
          addRelatedWordsToKeywords(keyWords, gptKeywords);

          console.log(keyWords);

          return await ctx.prisma.lecture.update({
            data: {
              keywords: JSON.stringify(keyWords),
            },
            where: {
              id: input.lectureId,
            },
          });
        })
        .catch(async () => {
          //Gets unrelated words
          const unrelatedWords = await getUnrelatedWords(unrelatedWikiLink);
          //Get GPT keywords
          const gptKeywords = await getGptKeywords(input.topic);

          addUnrelatedWordsToKeywords(keyWords, unrelatedWords);
          addRelatedWordsToKeywords(keyWords, gptKeywords);

          return await ctx.prisma.lecture.update({
            data: {
              keywords: JSON.stringify(keyWords).toLowerCase(),
            },
            where: {
              id: input.lectureId,
            },
          });
        });
    }),
});
