const fs = require('node:fs');

const openings = fs.readFileSync(__dirname+'/openings.txt', "utf8").split("\n").map((o, i) => {
    return {name: o, id: i}
})
const moves = fs.readFileSync(__dirname+'/moves.txt', "utf8").split("\n")


// let ontoJSONStr = ""
// let currLvl = 0
// let prevLvl = 0
// const data = fs.readFileSync(__dirname+'/ontology.txt', "utf8")
// data.split("\n").forEach(line => {
//     if (line === "") return
//     const name = line.trim()
//     currLvl = line.split("\t").length - 1
//     if (currLvl === 0) {
//         ontoJSONStr += `{"name": "${name}", "openings": [], "children": [`
//     } else if (currLvl === prevLvl) {
//         ontoJSONStr += `]}, {"name": "${name}", "openings": [], "children": [`
//     } else if (currLvl > prevLvl) {
//         ontoJSONStr += `{"name": "${name}", "openings": [], "children": [`
//     } else if (currLvl < prevLvl) {
//         ontoJSONStr += "]}".repeat(prevLvl-currLvl+1)+`, {"name": "${name}", "openings": [], "children": [`
//     }
//     prevLvl = currLvl
// })
// ontoJSONStr += "]}".repeat(currLvl+1)
// ontology = JSON.parse(ontoJSONStr)
//
// // Type
// for (let o of ontology.children[0].children) {
//     o.openings = openings.filter((opening) => opening.name.toLowerCase().includes(o.name.toLowerCase()))
// }
//
// // ECO
// for (let o of ontology.children[7].children) {
//     o.openings = openings.filter((opening) => opening.name[0] === o.name)
// }
//
// // Ligne
// for (let o of openings) {
//     ontology.children[8].children[
//         o.name.split(",").length > 2 ? 2 : o.name.split(",").length-1
//         ].openings.push(o)
// }
//
// // Playability
// const playToOnto = new Map([
//     ["D", "diversifié"],
//     ["M", "offmeta"],
//     ["O", "OTP"],
//     ["B", "blague"]
// ])
// fs.readFileSync(__dirname+'/playability.txt', "utf8").split("\n").forEach((line, i) => {
//     const [opening, playability] = line.split(" $ ")
//     ontology.children[1].children.find((o) => o.name === playToOnto.get(playability.trim())).openings.push(openings[i])
// });
//
// const styleToOnto = new Map([
//     ["T", "tactique"],
//     ["P", "positionnel"],
// ])
// const espaceToOnto = new Map([
//     ["O", "ouvert"],
//     ["F", "fermé"],
// ])
// fs.readFileSync(__dirname+'/secondBatch.txt', "utf8").split("\n").forEach((line, i) => {
//     const [_, infos] = line.split(" $ ")
//     const [style, espace, siecle] = infos.split(", ")
//
//     ontology.children[2].children.find((o) => o.name === styleToOnto.get(style.trim())).openings.push(openings[i])
//     ontology.children[3].children.find((o) => o.name === espaceToOnto.get(espace.trim())).openings.push(openings[i])
//     ontology.children[4].children.find((o) => o.name === siecle.trim()).openings.push(openings[i])
// });
//
// // Name based on
// const vocabulary = fs.readFileSync(__dirname+'/vocabulary.txt', "utf8").split("\n\n").map((line) => {
//     return line.split("\n")
// });
//
// for (let i = 0; i < ontology.children[6].children.length; i++) {
//     const o = ontology.children[6].children[i]
//     o.openings = openings.filter((opening) => {
//         const name = opening.name.toLowerCase()
//         return vocabulary[i].some((word) => name.includes(word.trim().toLowerCase()))
//     })
// }
//
// // popularity
// fs.readFileSync(__dirname+'/popularity.txt', "utf8").split("\n").forEach((line, i) => {
//     let [opening, popularity] = line.split(" $ ")
//     popularity = popularity.split(", ").map((p) => parseInt(p.trim()))
//     for (let j = 0; j < popularity.length; j++) {
//         ontology.children[5].children[j].children[2-popularity[j]].openings.push(openings[i])
//     }
// });
//
// // save ontology to file
// fs.writeFileSync(__dirname+'/ontology.json', JSON.stringify(ontology))

const ontology = JSON.parse(fs.readFileSync(__dirname+'/ontology.json', "utf8"))

exports.openingOntology = ontology
exports.openings = openings
exports.moves = moves
exports.urls = fs.readFileSync(__dirname+'/urlsBatch.txt', "utf8").split("\n").map((line) => {
    return {
        id: line.split(" ")[0],
        text: line.slice(line.indexOf(" ")+1)
    }
})
