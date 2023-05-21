import dynamic from "next/dynamic";
import { NoteProvider } from "~/components/lectures/NoteContextProvider";

const DynamicTranscriptVrClient = dynamic(
  () => import("~/components/lectures/running/TranscriptNoteEditor"),
  {
    ssr: false,
  }
);

export default function Index() {
  return (
    <NoteProvider>
      <DynamicTranscriptVrClient />
    </NoteProvider>
  );
}
