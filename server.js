

const { openingOntology, openings, moves } = require("./data/chessOpenings.js")
const express = require("express")
const app = express()

app.use("/js", express.static(__dirname + "/js"))

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html")
})

app.get("/ontology", (req, res) => {
	res.json(openingOntology)
});

app.get("/texts", (req, res) => {
	res.json([openings, moves])
});

app.listen(8080)
