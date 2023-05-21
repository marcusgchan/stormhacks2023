import Note from "~/components/lectures/note";
import { Grid, Card, Text } from "@nextui-org/react";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { env } from "~/env.mjs";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNoteContext } from "../NoteContextProvider";

const appId = env.NEXT_PUBLIC_SPEECHLY_APP_ID;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

export default function TranscriptVrClient() {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const { updateWords, words, setIsListening } =
    useNoteContext();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true }).then(() =>
      setIsListening(true)
    );
  const stopListening = () =>
    SpeechRecognition.stopListening().then(() => setIsListening(false));

  useEffect(() => {
    updateWords(
      transcript.split(" ").map((word) => {
        return { id: uuidv4(), word, importance: 0 };
      })
    );
  }, [transcript, updateWords]);

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

  const handleSave = () => {
    // Save note word map and transcript to database
  };

  return (
    <Grid.Container>
      <Grid xs={6}>
        <Note isEditable={true} />
      </Grid>
      <Grid xs={6}>
        <div className="flex w-full flex-col gap-2">
          <h2>Transcript - {displayRecordingState()}</h2>
          <div className="flex h-full flex-col gap-2">
            <div className="border-sm flex min-h-[20rem] flex-1 flex-wrap items-start gap-1 border-2">
              {words.length > 0
                ? words.map(({ word, id, importance }, index) => {
                    return <span key={id}>{word}</span>;
                  })
                : "No transcript yet."}
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
