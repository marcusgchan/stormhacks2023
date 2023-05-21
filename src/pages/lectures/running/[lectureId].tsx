// import dynamic from "next/dynamic";
// import { NoteProvider } from "~/components/lectures/NoteContextProvider";
import { Button, Grid, Loading, Text, Card } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { ArrowLeftSquare, Play, CloseSquare, TimeCircle } from "react-iconly";
import {
  NoteProvider,
  useNoteContext,
} from "~/components/lectures/NoteContextProvider";
import Note from "~/components/lectures/note";
import TranscriptVrClient from "~/components/lectures/running/TranscriptNoteEditor";
import { api } from "~/utils/api";

const DynamicTranscriptClient = dynamic(
  () => import("~/components/lectures/running/TranscriptNoteEditor"),
  {
    ssr: false,
  }
);

export default function Index() {
  return (
    <NoteProvider>
      <RunningLecture></RunningLecture>
    </NoteProvider>
  );
}

function RunningLecture() {
  const router = useRouter();
  const noteCtx = useNoteContext();
  const speechlyThingRef = useRef<any>(null);
  const lectureId = router.query.lectureId;

  const navToHome = () => {
    router.push("/lectures");
  };

  const { data: lecture, isLoading: isLoadingLecture } =
    api.example.getLecture.useQuery({
      lectureId: (lectureId as string) ?? "",
    });

  const { data: note, isLoading: isLoadingNote } = api.example.getNote.useQuery(
    {
      lectureId: (lectureId as string) ?? "",
    }
  );

  // useEffect(() => {
  //   console.log("working..?");
  //   if (note || !isLoadingNote) {
  //     console.log("useEffect note");
  //     console.log(note);
  //     const noteContent = note?.content?.toString() || "";
  //     useNote.getEditorSerializedJson(noteContent);
  //   }
  // }, [note]);

  const { data: transcript, isLoading: isLoadingTranscript } =
    api.example.getTranscript.useQuery({
      lectureId: (lectureId as string) ?? "",
    });

  // const content = useNote.getSerializedJson() || "";

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

  if (isLoadingLecture || !lecture) {
    return <Loading />;
  }

  // if (isLoadingNote || !note) {
  //   return <Loading />;
  // }

  // if (isLoadingTranscript || !transcript) {
  //   return <Loading />;
  // }

  // console.log("lecture");
  // console.log(lecture);

  // console.log("note");
  // console.log(note);

  // console.log("transcript");
  // console.log(transcript);

  const handleSave = () => {
    // notes
    // nptesWordMapping
    // transcript
  };

  function displayButtons() {
    console.log(!noteCtx.listening, noteCtx.words);
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
          <Button color="error">
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
                  keywords={JSON.parse(lecture.keywords)}
                ></TranscriptVrClient>
              </Card>
            </div>
          </Grid>
        </Grid.Container>
      </div>
    </main>
  );
}
