"use client";
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { RegisterFormValues } from "./types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorsHandlers } from "@/app/lib/errorsHandlers";
import { initialValuesRegister } from "./const"


const RegistraterForm = () => {
    const [error, setError] = useState<number | null>(null);
    const theme = useMantineTheme();
    const router = useRouter();

    const form = useForm({
        initialValues: initialValuesRegister,
        validate: {
          password: (value) => {
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must contain at least one special character';
            return null;
          },
          confirmPassword: (value, values) => 
            value !== values.password ? 'Passwords do not match' : null,
        }
      });

    const handleRegister = async (values: RegisterFormValues) => {

        const data = await fetch("/api/auth/register ", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            email: values.email,
            password: values.password,
            }),
        });

        if (data.status === 200) {
            const { redirect } = await data.json();
            router.push(redirect);
        } else {
            setError(data.status);
        };
    };

    return (
        <Paper shadow="md" p={30} mt={30} radius="md" bg={"violet.8"}>
          <form onSubmit={form.onSubmit((values) => handleRegister(values))}>
            <TextInput
              label="Email"
              placeholder="you@mantine.dev"
              required
              {...form.getInputProps("email")}
              styles={{
                label: {
                  color: theme.colors.gray[4],
                },
              }}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")}
              styles={{
                label: {
                  color: theme.colors.gray[4],
                },
              }}
              error={form.errors.password}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat your password"
              required
              mt="md"
              {...form.getInputProps("confirmPassword")}
              styles={{
                label: {
                  color: theme.colors.gray[4],
                },
              }}
              error={form.errors.confirmPassword}
            />        
            <Button fullWidth mt="xl" type="submit">
              Register
            </Button>
            {error && (
              <Alert mt={20} variant="light" color="red">
                {errorsHandlers(error)}
              </Alert>
            )}
          </form>
        </Paper>
    );
};

export default RegistraterForm;