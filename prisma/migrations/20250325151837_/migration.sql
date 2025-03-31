-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "history" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "health" INTEGER NOT NULL,
    "stamina" INTEGER NOT NULL,
    "mana" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- InsertTable

INSERT INTO "Character" (id, name, history, age, health, stamina, mana) 
VALUES 
('1', 'Arthas', 'Un valoroso cavaliere caduto in disgrazia.', 30, 100, 80, 50),
('2', 'Gandalf', 'Un potente mago errante.', 1000, 120, 60, 200),
('3', 'Ezio', 'Un abile assassino rinascimentale.', 35, 90, 100, 40);
