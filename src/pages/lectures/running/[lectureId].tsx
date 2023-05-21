import dynamic from "next/dynamic";
import { NoteProvider } from "~/components/lectures/NoteContextProvider";

const DynamicTranscriptClient = dynamic(
  () => import("~/components/lectures/running/TranscriptNoteEditor"),
  {
    ssr: false,
  }
);

export default function Index() {
  return (
    <NoteProvider>
      <DynamicTranscriptClient />
    </NoteProvider>
  );
}
