import { contextProps } from "@trpc/react-query/shared";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // get all the lectures from the lecture table
  getLectures: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.lecture.findMany({
      where: { userId: ctx.session.user.id },
      select: { id: true, topic: true, title: true },
    });
  }),

  // get a specific user from the user table
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { id: true, name: true },
    });
  }),

  // get a specific lecture from the lecture table
  getLecture: protectedProcedure
    .input(z.object({ lectureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.lecture.findFirst({
        where: { userId: ctx.session.user.id, id: input.lectureId },
      });
    }),

  getNote: protectedProcedure
    .input(z.object({ lectureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.note.findFirst({
        where: { lectureId: input.lectureId },
      });
    }),

  getTranscript: protectedProcedure
    .input(z.object({ lectureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.transcript.findFirst({
        where: { lectureId: input.lectureId },
      });
    }),

  createLecture: protectedProcedure
    .input(z.object({ topicName: z.string(), titleName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.lecture.create({
        data: {
          topic: input.topicName,
          title: input.titleName,
          userId: ctx.session.user.id,
        },
      });
    }),

  // editLectureTitle: protectedProcedure.input(z.object({ lectureId: z.string() })).mutation(async({ctx, input}) => {
  //   return await ctx.prisma.lecture.update({
  //     where: {lectureId: input.lectureId},
  //     data: {
  //       title: input.titleName,
  //     }
  //   })
  // })
});
