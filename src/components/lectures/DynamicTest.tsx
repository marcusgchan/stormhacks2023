// import dynamic from "next/dynamic";
// import { NoteProvider } from "~/components/lectures/NoteContextProvider";
import { Button, Grid, Loading, Text, Card } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftSquare, Play, CloseSquare, TimeCircle } from "react-iconly";
import {
  NoteProvider,
  useNoteContext,
} from "~/components/lectures/NoteContextProvider";
import Note from "~/components/lectures/note";
import TranscriptVrClient from "~/components/lectures/running/TranscriptNoteEditor";
import { api } from "~/utils/api";
import { RouterOutputs } from "~/utils/api";

export default function DynamicTest() {
  const router = useRouter();
  const noteCtx = useNoteContext();
  const speechlyThingRef = useRef<any>(null);

  const navToHome = () => {
    router.push("/lectures");
  };

  const lectureId = router.query.lectureId;
  console.log("lectureId", lectureId);

  const { data: lecture, isLoading: isLoadingLecture } =
    api.example.getLecture.useQuery(
      {
        lectureId: String(lectureId),
      },
      { refetchOnWindowFocus: false }
    );

  console.log("keywords", lecture?.keywords);

  const { data: note, isLoading: isLoadingNote } = api.example.getNote.useQuery(
    {
      lectureId: (lectureId as string) ?? "",
    }
  );

  const { data: transcript, isLoading: isLoadingTranscript } =
    api.example.getTranscript.useQuery({
      lectureId: (lectureId as string) ?? "",
    });

  const updateNote = api.example.updateNote.useMutation();

  const updateNoteCallback = () => {
    const content = noteCtx.getSerializedJson() || "";
    console.log("updatenotecallback called");
    console.log(content);
    updateNote.mutate({
      content: (content as string) ?? "",
      lectureId: (lectureId as string) ?? "",
    });
  };

  const saveLecture = api.example.saveLecture.useMutation({
    onSuccess() {
      router.push("/lectures");
    },
  });

  if (isLoadingLecture || !lecture) {
    return <Loading />;
  }

  // if (isLoadingNote || !note) {
  //   return <Loading />;
  // }

  // if (isLoadingTranscript || !transcript) {
  //   return <Loading />;
  // }

  // console.log("transcript");
  // console.log(transcript);

  const handleSave = () => {
    // notes
    // nptesWordMapping
    // transcript
    const content = noteCtx.getSerializedJson() || "";
    const transcript = JSON.stringify(noteCtx.words);
    const nodeToWordIndex = JSON.stringify(
      Object.fromEntries(noteCtx.nodeToWordIndex)
    );
    saveLecture.mutate({
      lectureId,
      note: content,
      words: transcript,
      noteWordMapping: nodeToWordIndex,
    });
  };

  const importanceStyler = (importance: number) => {
    if (importance == 0) {
      return "text-white text-opacity-50";
    } else if (importance == 1) {
      return "text-white text-opacity-50";
    } else {
      return "text-white text-opacity-90 font-bold";
    }
  };

  function displayButtons() {
    if (noteCtx.listening) {
      return (
        <Button
          color="warning"
          onClick={() => speechlyThingRef.current.stopListening()}
        >
          <TimeCircle set="bold" primaryColor="white" />
        </Button>
      );
    } else if (!noteCtx.listening && noteCtx.words.length > 0) {
      return (
        <>
          <Button
            color="success"
            onClick={() => speechlyThingRef.current.startListening()}
          >
            <Play set="bold" primaryColor="white" />
          </Button>
          <Button color="error" onClick={handleSave}>
            <CloseSquare set="bold" primaryColor="white" />
          </Button>
        </>
      );
    }
    return (
      <Button
        onClick={() => speechlyThingRef.current.startListening()}
        color="success"
      >
        <Play set="bold" primaryColor="white" />
      </Button>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#3b017d] to-[#151515]">
      <div className="container flex flex-col items-center justify-center gap-2.5 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          {lecture.title}
        </h1>
        <h2 className="text-5xl font-bold tracking-tight text-white sm:text-[2rem]">
          {lecture.topic}
        </h2>
        <div className="flex flex-row gap-2.5 pt-6">{displayButtons()}</div>
      </div>
      <div className="flex w-full w-screen max-w-full">
        <Grid.Container gap={2} justify="center">
          <Grid xs={5}>
            <div className="flex max-h-[550px] w-full flex-col gap-5">
              <Text h3>Note</Text>
              <Card
                variant="shadow"
                borderWeight="none"
                css={{ height: "550px", padding: "20px" }}
              >
                <div className="overflow-y-auto">
                  <Note isEditable={true} data={note} />
                </div>
              </Card>
            </div>
          </Grid>
          <Grid xs={5}>
            <div className="flex max-h-[550px] w-full flex-col gap-5">
              <Text h3>Transcription</Text>
              <Card
                variant="shadow"
                borderWeight="none"
                css={{ height: "550px", padding: "20px" }}
              >
                <TranscriptVrClient
                  ref={speechlyThingRef}
                  keywords={
                    typeof lecture.keywords === "string"
                      ? JSON.parse(lecture.keywords)
                      : JSON.parse(JSON.stringify(lecture.keywords))
                  }
                ></TranscriptVrClient>
              </Card>
            </div>
          </Grid>
        </Grid.Container>
      </div>
    </main>
  );
}
