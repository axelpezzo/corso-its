import CharatersPage from "@/components/pages/characters";
import { data } from "@/app/character/consts";
import { getCharacters, getAttributes, getSkills } from "./actions";

const Page = async () => {
  const characters = await getCharacters();
  const attributes = await getAttributes();
  const skills = await getSkills();

  return <CharatersPage characters={characters} attributes={attributes} skills={skills}/>;
};

export default Page;
