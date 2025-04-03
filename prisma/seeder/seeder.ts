import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Creazione di utenti
  const users = await prisma.user.createMany({
    data: [
      { id: uuidv4(), email: "admin@example.com", password: "adminpass", role: "ADMIN" },
      { id: uuidv4(), email: "user0@example.com", password: "userpass", role: "GUEST" },
      { id: uuidv4(), email: "user1@example.com", password: "userpass", role: "GUEST" },
    ],
  });

  // Creazione di razze
  const races = await prisma.race.createMany({
    data: [
      { id: uuidv4(), key: "human", name: "Human", modHealth: 10, modStamina: 10, modMana: 10 },
      { id: uuidv4(), key: "elf", name: "Elf", modHealth: 5, modStamina: 15, modMana: 20 },
      { id: uuidv4(), key: "dwarf", name: "Dwarf", modHealth: 20, modStamina: 10, modMana: 5 },
      { id: uuidv4(), key: "orc", name: "Orc", modHealth: 25, modStamina: 5, modMana: 5 },
      { id: uuidv4(), key: "gnome", name: "Gnome", modHealth: 5, modStamina: 5, modMana: 25 },
    ],
  });

  // Creazione di classi
  const classes = await prisma.class.createMany({
    data: [
      { id: uuidv4(), key: "warrior", name: "Warrior", description: "A strong melee fighter." },
      { id: uuidv4(), key: "mage", name: "Mage", description: "A master of arcane magic." },
      { id: uuidv4(), key: "rogue", name: "Rogue", description: "A stealthy assassin." },
      { id: uuidv4(), key: "priest", name: "Priest", description: "A healer and support class." },
      { id: uuidv4(), key: "ranger", name: "Ranger", description: "A master of ranged weapons." },
    ],
  });

  // Creazione di attributi
  const attributes = await prisma.attribute.createMany({
    data: [
      { id: uuidv4(), key: "strength", name: "Strength", value: 20 },
      { id: uuidv4(), key: "dexterity", name: "Dexterity", value: 20 },
      { id: uuidv4(), key: "intelligence", name: "Intelligence", value: 20 },
      { id: uuidv4(), key: "wisdom", name: "Wisdom", value: 20 },
      { id: uuidv4(), key: "charisma", name: "Charisma", value: 20 },
    ],
  });

  // Recupero degli utenti, delle razze e degli attributi creati
  const userData = await prisma.user.findMany();
  const raceData = await prisma.race.findMany();
  const attributeData = await prisma.attribute.findMany();

  // Creazione di abilità
  const skills = await prisma.skill.createMany({
    data: [
      { id: uuidv4(), key: "swordsmanship", name: "Swordsmanship", idAttribute: attributeData[0].id },
      { id: uuidv4(), key: "archery", name: "Archery", idAttribute: attributeData[1].id },
      { id: uuidv4(), key: "spellcasting", name: "Spellcasting", idAttribute: attributeData[2].id },
      { id: uuidv4(), key: "stealth", name: "Stealth", idAttribute: attributeData[3].id },
      { id: uuidv4(), key: "persuasion", name: "Persuasion", idAttribute: attributeData[4].id },
    ],
  });
  console.log("Skills created!"+ skills);

  // Creazione di modificatori di razza-attributo
  await prisma.raceAttrMod.createMany({
    data: [
      { idRace: raceData[0].id, idAttribute: attributeData[0].id, value: 2 },
      { idRace: raceData[1].id, idAttribute: attributeData[1].id, value: 3 },
      { idRace: raceData[2].id, idAttribute: attributeData[2].id, value: 4 },
    ],
  });

  // Recupero delle classi e delle abilità create
  const classData = await prisma.class.findMany();
  const skillData = await prisma.skill.findMany();

  // Creazione di modificatori di classe-abilità
  await prisma.classSkillMod.createMany({
    data: [
      { idClass: classData[0].id, idSkill: skillData[0].id, value: 5 },
      { idClass: classData[1].id, idSkill: skillData[1].id, value: 5 },
      { idClass: classData[2].id, idSkill: skillData[2].id, value: 5 },
    ],
  });

  // Creazione di personaggi
  const characters = await prisma.character.createMany({
    data: [
      { id: uuidv4(), name: "Matheos", history: "A fallen prince.", age: 30, idRace: raceData[0].id, idClass: classData[0].id, userId: userData[0].id },
      { id: uuidv4(), name: "Nis", history: "A legendary archer.", age: 120, idRace: raceData[1].id, idClass: classData[1].id, userId: userData[0].id },
      { id: uuidv4(), name: "Phot", history: "A sturdy dwarf.", age: 90, idRace: raceData[2].id, idClass: classData[2].id, userId: userData[0].id },
      { id: uuidv4(), name: "Jacohm", history: "A wise wizard.", age: 500, idRace: raceData[3].id, idClass: classData[3].id, userId: userData[0].id },
      { id: uuidv4(), name: "Renzhus", history: "A powerful shaman.", age: 40, idRace: raceData[4].id, idClass: classData[4].id, userId: userData[0].id },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
