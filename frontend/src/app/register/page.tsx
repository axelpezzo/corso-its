"use client";
import RegistrationForm from "@/components/form/register";
import { Anchor, Container, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
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
        Create an account!
      </Title>
      <Text c="gray.4" size="sm" ta="center" mt={5}>
        you already have an account?{" "}
        <Anchor size="sm" component="button" onClick={() => router.push("/login")}>
          Log in
        </Anchor>
      </Text>
      <RegistrationForm />
    </Container>
  );
};

export default Page;
