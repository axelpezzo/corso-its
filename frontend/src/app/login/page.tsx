"use client";
import LoginForm from "@/components/form/login";
import { Anchor, Container, Text, Title } from "@mantine/core";
import Link from "next/link";
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
        Welcome back!
      </Title>
      <Text c="gray.4" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href="/register">
          Create account
        </Link>
      </Text>
      <LoginForm />
    </Container>
  );
};

export default Page;
