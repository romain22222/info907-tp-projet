    const { createApp, ref, reactive, computed, onMounted, watch } = Vue

createApp({
    setup() {

        let ontology = reactive({})
        let openings = reactive([])
        let moves = reactive([])
        let openingOrder = computed(() => {
            const v = openings.map(a => {
                return {id: a.id, score: calcScore(a.name, a.id)}
            }).filter(a => a.score !== 0).sort((a, b) => b.score - a.score)
            console.log(v)
            return v.map(a => a.id)
        });

        function levenshtein(text, opening) {
            const a = text.toLowerCase();
            const b = opening.toLowerCase();
            const costs = [];
            for (let i = 0; i <= a.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= b.length; j++) {
                    if (i === 0)
                        costs[j] = j;
                    else {
                        if (j > 0) {
                            let newValue = costs[j - 1];
                            if (a.charAt(i - 1) !== b.charAt(j - 1))
                                newValue = Math.min(Math.min(newValue, lastValue),
                                    costs[j]) + 1;
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0)
                    costs[b.length] = lastValue;
            }
            return costs[b.length];
        }
        function redirectTo(OO) {
            axios.get('/urls').then(
                response => {
                    const openingClosestMatch = response.data
                    const openingName = openings[OO].name.replace(/(ouverture|gambit|attaque|défense|variante)/gi, "").trim()
                    openingClosestMatch.sort((a, b) => levenshtein(a.text, openingName) - levenshtein(b.text, openingName))
                    window.location.href = "http://myweb.astate.edu/wpaulsen/chess/chess.htm?" + openingClosestMatch[0].id;
                }
            )
        }
        let typeS = ref(-1);
        let jouabiliteS = ref(-1);
        let styleS = ref(-1);
        let espaceS = ref(-1);
        let popCenturyS = ref(-1);
        let popDebIntS = ref(-1);
        let popHighLvlS = ref(-1);
        let popGrandPub = ref(-1);
        let nameBasedOnS = ref(-1);
        let ecoS = ref(-1);
        let ligneS = ref(-1);
        let moveS = ref("");

        let selectors = reactive([
            typeS,
            jouabiliteS,
            styleS,
            espaceS,
            popCenturyS,
            popDebIntS,
            popHighLvlS,
            popGrandPub,
            nameBasedOnS,
            ecoS,
            ligneS
        ])

        let selectorKeys = reactive([])

        function calcScore(a, i) {
            // Check every selected filter
            // If it's not selected, don't check it
            // If it's selected, check if the opening matches it and add 1 to the score if it does
            // for moveS, check if the opening starts with the proposed chain of moves
            // If it doesn't, set the score to 0
            let score = 0;
            let availableFilters = 0;
            if (moveS.value !== "") {
                if (moves[i].startsWith(moveS.value)) {
                    score++;
                } else {
                    return 0;
                }
            }
            if (typeS.value !== -1) {
                if (ontology.children[0].children[typeS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (jouabiliteS.value !== -1) {
                if (ontology.children[1].children[jouabiliteS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (styleS.value !== -1) {
                if (ontology.children[2].children[styleS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (espaceS.value !== -1) {
                if (ontology.children[3].children[espaceS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (popCenturyS.value !== -1) {
                if (ontology.children[4].children[popCenturyS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (popDebIntS.value !== -1) {
                if (ontology.children[5].children[0].children[popDebIntS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (popHighLvlS.value !== -1) {
                if (ontology.children[5].children[1].children[popHighLvlS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (popGrandPub.value !== -1) {
                if (ontology.children[5].children[2].children[popGrandPub.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (nameBasedOnS.value !== -1) {
                if (ontology.children[6].children[nameBasedOnS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (ecoS.value !== -1) {
                if (ontology.children[7].children[ecoS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            if (ligneS.value !== -1) {
                if (ontology.children[8].children[ligneS.value].openings.map(v => v.name).includes(a)) {
                    score++;
                }
                availableFilters++;
            }
            return availableFilters !== 0 ? score : 1;
        }

        function searchInputChanged() {
            console.log("searchInputChanged")
            selectors.forEach(
                (selector) => {
                    console.log(selector.value)
                }
            )
        }
        // Watch searchInput
        watch(typeS, searchInputChanged)
        watch(jouabiliteS, searchInputChanged)
        watch(styleS, searchInputChanged)
        watch(espaceS, searchInputChanged)
        watch(popCenturyS, searchInputChanged)
        watch(popDebIntS, searchInputChanged)
        watch(popHighLvlS, searchInputChanged)
        watch(popGrandPub, searchInputChanged)
        watch(nameBasedOnS, searchInputChanged)
        watch(ecoS, searchInputChanged)
        watch(ligneS, searchInputChanged)
        watch(moveS, searchInputChanged)

        function initSelectors(ontology) {
            let tmp = [];
            let i = 0
            ontology.children.forEach(v => {
                if (v.name === "popularité") {
                    tmp = tmp.concat(v.children.map(v => {
                        return {keys: v.children.map(v => v.name), name: v.name, selector: selectors[i++]}
                    }))
                } else {
                    tmp.push({keys: v.children.map(v => v.name), name: v.name, selector: selectors[i++]})
                }
            })
            return tmp;
        }

        //-------------------------------------------Mounted
        onMounted(() => {
            axios.get('/ontology').then((response) => {
                Object.assign(ontology, response.data);
                Object.assign(selectorKeys, initSelectors(ontology));
            });
            axios.get('/texts').then((response) => {
                Object.assign(openings, response.data[0]);
                Object.assign(moves, response.data[1]);
                searchInputChanged();
            });


        })
        //-------------------------------------------> UI
        return {
            ontology,
            openings,
            moves,
            openingOrder,
            redirectTo,
            selectors,
            selectorKeys,
            moveS
        }
    }
}).mount('#app')
