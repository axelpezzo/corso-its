"use client";
import UiCarousel from "@/components/ui/carousel";
import Details from "@/components/ui/details";
import useCharacterStore from "@/store/useCharacterStore";
import { Box } from "@mantine/core";
import { useEffect } from "react";

interface IOwnProps {
  characters: Record<string, string | number>[];
  attributes?: Record<string, string | number>[];
  skills?: Record<string, string | number>[];
}

const CharatersPage = ({ characters, attributes, skills }: IOwnProps) => {
  const { id } = useCharacterStore();

  useEffect(() => {
    if (id) {
      const character = characters.find((item) => item.id === id);
      const idClass = character?.idClass;
      const idRace = character?.idRace;
    }
  }, [id]);

  console.log("characters ", characters);
  console.log("attributes ", attributes);
  console.log("skills ", skills);

  return (
    <div className="relative w-full h-screen overflow-hidden mt-4">
      <UiCarousel data={characters} />
      <Box>
        <Details />
      </Box>
    </div>
  );
};

export default CharatersPage;
