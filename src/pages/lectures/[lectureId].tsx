import { Button, Grid, Loading, Text, Card } from "@nextui-org/react";
import { useRouter } from "next/router";
import { ArrowLeftSquare } from "react-iconly";
import { api } from "~/utils/api";

export default function Index() {
  const router = useRouter();

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

  const { data: transcript, isLoading: isLoadingTranscript } = api.example.getTranscript.useQuery(
    {
      lectureId: (lectureId as string) ?? "",
    }
  )

  if (isLoadingLecture || !lecture) {
    return <Loading />;
  }

  if (isLoadingNote || !note) {
    return <Loading />;
  }

  if(isLoadingTranscript || !transcript) {
    return <Loading />;
  }

  console.log("lecture");
  console.log(lecture);

  console.log("note");
  console.log(note);

  console.log("transcript");
  console.log(transcript);

  return (
    <main className="flex min-h-screen flex-col items-start justify-start bg-gradient-to-b from-[#3b017d] to-[#151515]">
      <div className="container flex flex-col items-center justify-center gap-2.5 px-4 py-16">
        <div className="flex w-full w-screen max-w-full flex-row justify-start">
          <Button size="md" color="secondary" onClick={navToHome}>
            <div className="flex flex-row items-center gap-2">
              <ArrowLeftSquare
                set="bold"
                primaryColor="white"
              ></ArrowLeftSquare>
              <Text>Back</Text>
            </div>
          </Button>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          {lecture.title}
        </h1>
        <h2 className="text-5xl font-bold tracking-tight text-white sm:text-[2rem]">
          {lecture.topic}
        </h2>
      </div>
      <div className="flex w-full w-screen max-w-full">
        <Grid.Container gap={2} justify="center">
          <Grid xs={5}>
            <div className="flex w-full flex-col gap-5">
              <Text h3>Note</Text>
              <Card
                variant="shadow"
                borderWeight="none"
                css={{ padding: "20px" }}
              >
                <Text>1 of 2</Text>
              </Card>
              <div className="w-2/4">
                <Button color="success">Save</Button>
              </div>
            </div>
          </Grid>
          <Grid xs={5}>
            <div className="flex w-full flex-col gap-5">
              <Text h3>Transcription</Text>
              <Card
                variant="shadow"
                borderWeight="none"
                css={{ padding: "20px" }}
              >
                <Text>2 of 2</Text>
              </Card>
            </div>
          </Grid>
        </Grid.Container>
      </div>
    </main>
  );
}
