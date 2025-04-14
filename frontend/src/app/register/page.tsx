import RegistationForm from "@/components/form/register";
import { Container, Title, Group, Anchor, Text } from "@mantine/core";

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
        Register your account!
      </Title>
      <Group justify="center" mt="lg">
        <Text size="sm">
          If you already have an account <Anchor size="sm" href="/login">click here</Anchor>
        </Text>
      </Group>
      <RegistationForm/>
    </Container>
  );
};

export default Page;