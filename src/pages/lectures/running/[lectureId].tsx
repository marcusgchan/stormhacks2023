import dynamic from "next/dynamic";

const DynamicTranscriptVrClient = dynamic(
  () => import("~/components/lectures/running/TranscriptNoteEditor"),
  {
    ssr: false,
  }
);

export default function Index() {
  return <DynamicTranscriptVrClient />;
}
