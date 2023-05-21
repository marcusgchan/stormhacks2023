import Note from "~/components/lectures/note";
import { Grid, Card, Text } from "@nextui-org/react";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { env } from "~/env.mjs";
import { useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const appId = env.NEXT_PUBLIC_SPEECHLY_APP_ID;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

export default function TranscriptVrClient() {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  const filteredWords = useMemo(() => {
    return transcript.split(" ").map((word) => {
      return { id: uuidv4(), word, importance: 0 };
    });
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const displayRecordingState = () => {
    if (listening) {
      return "Recording...";
    } else if (transcript.length) {
      return "Recording paused";
    }
    return "Not recording";
  };

  const handleSave = () => {};

  return (
    <Grid.Container>
      <Grid xs={6}>
        <Note isEditable={true} />
      </Grid>
      <Grid xs={6}>
        <div className="flex w-full flex-col gap-2">
          <h2>Transcript - {displayRecordingState()}</h2>
          <div className="flex h-full flex-col gap-2">
            <div className="border-sm min-h-[20rem] flex-1 border-2">
              {transcript.length ? transcript : "No transcript yet."}
            </div>
            <div className="flex gap-2">
              {!listening && transcript.length === 0 && (
                <button onClick={startListening}>Start</button>
              )}
              {listening && <button onClick={stopListening}>Pause</button>}
              {!listening && transcript.length > 0 && (
                <button onClick={startListening}>Resume</button>
              )}
              {!listening && transcript.length > 0 && (
                <button onClick={handleSave}>Finish</button>
              )}
            </div>
          </div>
        </div>
      </Grid>
    </Grid.Container>
  );
}
