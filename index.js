const fs = require("fs");

const data = fs.readFileSync("data.txt", "utf-8", (err, data) => { //callback
    console.log(data)
});


const fs = require("fs/promises"); // Usa il modulo fs/promises per lavorare con Promises

fs.readFile("data.txt", "utf-8")
    .then((data) => {
        console.log("File data.txt letto con successo:", data);
    })
    .then((data2) => {
        console.log("File data2.txt letto con successo:", data2);
    })
    .catch((err) => {
        console.error("Errore durante la lettura del file:", err);
    });



const readfile = async () => {
    return await fs.promises.readFile("file.txt", "utf-8") // async 
}

const data_read = readfile();
console.log(data_read);