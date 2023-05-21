import { useState, useContext, createContext, useRef } from "react";

export type NoteContext = {
  words: Word[];
  updateWords: (words: Word[]) => void;
  addWordKeyToNode: (nodeId: string) => void;
  shouldHighlight: (wordId: string) => boolean;
  removeWordKeyToNode: (nodeId: string) => void;
} | null;

const NoteContext = createContext<NoteContext>(null);

export function useNoteContext() {
  return useContext(NoteContext);
}

type Word = {
  id: string;
  word: string;
  importance: number;
};

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const wordKeyToNode = useRef(new Map<string, string>());
  const [words, setWords] = useState<Word[]>([]);

  const updateWords = (words: Word[]) => {
    setWords(words);
  };

  const addWordKeyToNode = (nodeId: string) => {
    const lastWord = words.at(-1);
    if (!wordKeyToNode.current.has(nodeId) && lastWord !== undefined) {
      wordKeyToNode.current.set(lastWord.id, nodeId);
    }
  };

  const shouldHighlight = (wordId: string) => wordKeyToNode.current.has(wordId);

  const removeWordKeyToNode = (nodeId: string) => {
    const updatedWordKeyToNode = new Map<string, string>();
    for (const [key, value] of wordKeyToNode.current.entries()) {
      if (value !== nodeId) {
        updatedWordKeyToNode.set(key, value);
      }
    }
    wordKeyToNode.current = updatedWordKeyToNode;
  };

  return (
    <NoteContext.Provider
      value={{
        words,
        updateWords,
        addWordKeyToNode,
        shouldHighlight,
        removeWordKeyToNode,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
