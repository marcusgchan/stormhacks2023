import Note from "~/components/lectures/note";
import { Grid, Card, Text } from "@nextui-org/react";

import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { env } from "~/env.mjs";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNoteContext } from "../NoteContextProvider";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const appId = env.NEXT_PUBLIC_SPEECHLY_APP_ID;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const TranscriptVrClient = forwardRef((props, ref) => {
  console.log(props.keywords);
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const { updateWords, words, setIsListening } = useNoteContext();

  const getLecture = api.example.getLecture.useQuery();

  // const startListening = () =>
  //   SpeechRecognition.startListening({ continuous: true }).then(() =>
  //     setIsListening(true)
  //   );
  // const stopListening = () =>
  //   SpeechRecognition.stopListening().then(() => setIsListening(false));

  useImperativeHandle(ref, () => {
    return {
      startListening() {
        SpeechRecognition.startListening({ continuous: true }).then(() =>
          setIsListening(true)
        );
      },
      stopListening() {
        SpeechRecognition.stopListening().then(() => {
          console.log("stopped");
          setIsListening(false);
        });
      },
    };
  });

  useEffect(() => {
    if (!transcript.length) return;
    updateWords(
      transcript.split(" ").map((word) => {
        console.log(
          word + props.keywords.hasOwnProperty(word) + props.keywords[word]
        );
        return {
          id: uuidv4(),
          word,
          importance: props.keywords.hasOwnProperty(word)
            ? props.keywords[word]
            : 1,
        };
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

  const importanceStyler = (importance: number) => {
    if (importance == 0) {
      return "text-white text-opacity-50";
    } else if (importance == 1) {
      return "text-white text-opacity-50";
    } else {
      return "text-white text-opacity-90 font-bold";
    }
  };

  const handleSave = () => {
    // Save note word map and transcript to database
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <h2>Transcript - {displayRecordingState()}</h2>
      <div className="flex h-full flex-col gap-2">
        <div className="flex flex-1 flex-wrap items-start gap-1">
          {words.length > 0
            ? words.map(({ word, id, importance }, index) => {
                return (
                  <span key={id} className={importanceStyler(importance)}>
                    {word}
                  </span>
                );
              })
            : "No transcript yet."}
        </div>
      </div>
    </div>
  );
});

export default TranscriptVrClient;
