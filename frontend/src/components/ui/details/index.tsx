import { Paper, Title, Text, Stack, Progress, Box } from "@mantine/core";

interface IOwnProps {
  data: Record<string, string | number>;
}

const Details = ({ data }: IOwnProps) => {
  console.log(data);

  return (
    <Paper className="w-full mt-4" bg={"violet.6"} p="xl" radius="md">
      <Stack align="stretch" justify="center" gap="md">
        <Title>{data.name}</Title>
        <Title order={3}>Age: {data.age}</Title>
        <Text>{data.history}</Text>
        <Paper bg={"violet.4"} p="md" radius="md">
          <Stack align="stretch" justify="center" gap="md">
            <Progress.Root size={20}>
              <Progress.Section
                color="red"
                value={parseInt(data.health.toString())}
              >
                <Progress.Label>Health: {data.health}</Progress.Label>
              </Progress.Section>
            </Progress.Root>
            <Progress.Root size={20}>
              <Progress.Section
                color="blue"
                value={parseInt(data.mana.toString())}
              >
                <Progress.Label>Magika: {data.mana}</Progress.Label>
              </Progress.Section>
            </Progress.Root>
            <Progress.Root size={20}>
              <Progress.Section
                color="green"
                value={parseInt(data.stamina.toString())}
              >
                <Progress.Label>Stamina: {data.stamina}</Progress.Label>
              </Progress.Section>
            </Progress.Root>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  );
};

export default Details;
