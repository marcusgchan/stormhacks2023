import {
  Navbar,
  Button,
  Text,
  Grid,
  Card,
  Loading,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { Plus, Search } from "react-iconly";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Index() {
  const { data: user, isLoading: isLoadingUser } =
    api.example.getUser.useQuery();
  const { data: lectures, isLoading: isLoadingLectures } =
    api.example.getLectures.useQuery();

  const router = useRouter();

  const navToCreate = () => {
    router.push("/lectures/create");
  };

  const navToPrevSession = (id: string) => {
    router.push("/lectures/" + id);
  };

  const navToLandingPage = () => {
    signOut({ redirect: false }).then((res) => {
      router.push("/");
    });
  };

  console.log("lectures");
  console.log(lectures);

  console.log("name of user");
  console.log(user);

  if (!lectures || isLoadingLectures) {
    return <Loading />;
  }

  if (!user || isLoadingUser) {
    return <Loading />;
  }

  return (
    <main className="flex min-h-screen flex-col items-start justify-start bg-gradient-to-b from-[#3b017d] to-[#151515] pt-10">
      <div className="absolute top-0 w-full w-screen max-w-full bg-[#000000]">
        <Navbar height="100px" isBordered variant="static">
          <Navbar.Brand>
            <Text h2 color="inherit" hideIn="xs">
              App Name
            </Text>
          </Navbar.Brand>
          <Navbar.Content css={{ backgroundColor: "transparent" }}>
            <Navbar.Link color="inherit">{user.name}</Navbar.Link>
            <Navbar.Item>
              <Button
                onClick={navToLandingPage}
                size="sm"
                css={{ backgroundColor: "#26292b" }}
              >
                Logout
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
      </div>
      <div className="container flex flex-row items-center justify-between gap-12 px-10 pb-10 pt-20">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
          Sessions
        </h1>
        <Button color="secondary" size="lg" onClick={navToCreate}>
          <div className="flex flex-row items-center gap-2">
            <Plus set="bold" primaryColor="white" />
            <Text>Create Session</Text>
          </div>
        </Button>
      </div>
      <div className="flex flex-row items-center justify-start gap-10 px-10 pb-10 pt-0">
        <Input
          labelRight={
            <Button css={{ backgroundColor: "transparent", justifyContent: "end" }} size="xs">
              <Search set="bold" primaryColor="white" />
            </Button>
          }
          size="lg"
          bordered
          labelPlaceholder="Search"
        ></Input>
      </div>
      <div className="w-full w-screen max-w-full px-10">
        <Grid.Container gap={2} justify="center">
          {lectures.map((lecture) => {
            return (
              <Grid key={lecture.id} xs={3}>
                <Card
                  isHoverable
                  isPressable
                  onPress={() => navToPrevSession(lecture.id)}
                  variant="shadow"
                  borderWeight="none"
                  css={{ height: "300px", padding: "20px" }}
                >
                  <div className="flex flex-col gap-10">
                    <Text h3>{lecture.title}</Text>
                    <Text h4>{lecture.topic}</Text>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid.Container>
      </div>
    </main>
  );
}
