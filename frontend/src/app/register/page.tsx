import RegisterFrom from "@/components/form/register";
import { Anchor, Container, Text, Title } from "@mantine/core";
import Link from "next/link";

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
        Create your account
      </Title>
      <Text c="gray.4" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Link href="/login">
          <Anchor size="sm" component="button">
            Login account
          </Anchor>
        </Link>
      </Text>
      <RegisterFrom/>
    </Container>
  );
};

export default Page;
