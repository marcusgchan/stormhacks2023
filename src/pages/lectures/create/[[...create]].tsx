import {
  Grid,
  Container,
  Row,
  Col,
  Text,
  Card,
  Input,
  Button,
  FormElement,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ArrowLeftSquare, Play } from "react-iconly";
import { api } from "~/utils/api";

export default function Index() {
  const [sessionName, setSessionName] = useState("");
  const [topicName, setTopicName] = useState("");

  const createLecture = api.example.createLecture.useMutation({
    async onSuccess(data) {
      await startSession(data.id);
    },
  });

  const handleTitle = (e: React.ChangeEvent<FormElement>) => {
    setSessionName(e.target.value);
  };

  const handleTopic = (e: React.ChangeEvent<FormElement>) => {
    setTopicName(e.target.value);
  };

  const createSessionButton = () => {
    console.log(sessionName);
    console.log(topicName);

    createLecture.mutate({ topicName: topicName, titleName: sessionName });
  };

  const router = useRouter();

  const startSession = async (sessionId: string) => {
    console.log("routing!");
    await router.push("/lectures/running/" + sessionId);
  };

  const goBack = () => {
    router.push("/lectures");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#3b017d] to-[#151515]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Session Creation
        </h1>
      </div>
      <div className="container flex h-5/6 w-2/5 flex-col items-center justify-center">
        <Card variant="shadow" borderWeight="none">
          <Card.Header className="flex flex-col items-center justify-center">
            <Text b>Session Input</Text>
          </Card.Header>
          <Card.Divider></Card.Divider>
          <Card.Body
            className="flex flex-col items-center justify-center gap-12"
            css={{ py: "$15", px: "$20" }}
          >
            <Input
              onChange={handleTitle}
              value={sessionName}
              bordered
              labelPlaceholder="Session Name"
            ></Input>
            <Input
              onChange={handleTopic}
              value={topicName}
              bordered
              labelPlaceholder="Topic Name"
            ></Input>
          </Card.Body>
          <Card.Divider></Card.Divider>
          <Card.Footer className="flex flex-row items-center justify-center gap-10">
            <Button css={{ backgroundColor: "grey" }} onClick={goBack}>
              <div className="flex flex-row items-center gap-2">
                <ArrowLeftSquare set="bold" primaryColor="white" />
                <Text>Back</Text>
              </div>
            </Button>
            <Button color="success" onClick={createSessionButton}>
              <div className="flex flex-row items-center gap-2">
                <Play set="bold" primaryColor="white" />
                <Text>Start Session</Text>
              </div>
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
}
