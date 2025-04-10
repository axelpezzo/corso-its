import RegisterFrom from "@/components/form/register";
import { Anchor, Container, Text, Title } from "@mantine/core";

const Page = () => {
  return (
    <Container
      h={"100vh"}
      size={420}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Title ta="center" c="gray.0">
        Welcome back!
      </Title>
      <Text c="gray.4" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Login account
        </Anchor>
      </Text>
      <RegisterFrom/>
    </Container>
  );
};

export default Page;
