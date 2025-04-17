"use client";
import UiCarousel from "@/components/ui/carousel";
import Details from "@/components/ui/details";
import useCharacterStore from "@/store/useCharacterStore";
import { Box } from "@mantine/core";
import { use, useEffect, useState } from "react";

interface IOwnProps {
  characters: Record<string, string | number>[];
  attributes?: Record<string, string | number>[];
  skilss?: Record<string, string | number>[];
}

const CharatersPage = ({ characters, attributes, skilss }: IOwnProps) => {
  const { id } = useCharacterStore();
  const [render, setRender] = useState(false);
  const character = characters.find((item) => item.id === id);

  useEffect(() => {
    if (character) setRender(true);
    else setRender(false);
  }, [character]);

  return (
    <div className="relative w-full h-screen overflow-hidden mt-4">
      <UiCarousel data={characters} />
      {render && character && <Details data={character} />}
    </div>
  );
};

export default CharatersPage;
