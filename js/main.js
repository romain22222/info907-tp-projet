const { createApp, ref, reactive, computed, onMounted, watch } = Vue

createApp({
  setup() {

    let ontology = reactive({})
    let concepts = reactive([])
    let games = reactive([])
    let texts = reactive([])
    let indexes = reactive([])
    let searchInput = ref("");
    let textOrder = reactive([])
      let conceptLimit = ref(5)
      let limit = computed(() => Math.max(Math.min(conceptLimit.value, concepts.length), 0))

      function levenshteinDistance(t1, t2) {
          const m = t1.length;
          const n = t2.length;

          const dp = [];

          for (let i = 0; i <= m; i++) {
              dp[i] = [];
              for (let j = 0; j <= n; j++) {
                  if (i === 0) {
                      dp[i][j] = j;
                  } else if (j === 0) {
                      dp[i][j] = i;
                  } else {
                      dp[i][j] = Math.min(
                          dp[i - 1][j - 1] + (t1.charAt(i - 1) === t2.charAt(j - 1) ? 0 : 1),
                          dp[i - 1][j] + 1,
                          dp[i][j - 1] + 1
                      );
                  }
              }
          }
          return dp[m][n] === Math.max(m, n) ? Infinity : dp[m][n];
      }

      function findClosestsConcept() {
          const text = searchInput.value
          const ranking = concepts.map((item) => {
              return Math.min(...item.name.split("/").concat(item.games).map(v => levenshteinDistance(v, text)))
          })
            const topN = []
            for (let i=0; i<limit.value; i++) {
                const idx = ranking.indexOf(Math.min(...ranking))
                topN.push(concepts[idx])
                ranking[idx] = Infinity
            }
            return topN
      }

    function calcScore(id, concepts) {
        let score = 0
        concepts.forEach((concept, i) => {
            const idx = indexes[id].findIndex((item) => item.name === concept.name)
            if (idx !== -1)
                score += indexes[id][idx].accuracy * (limit.value - i)
        })
        return score
    }

    function searchInputChanged() {
        const concepts = findClosestsConcept()
        const ids = []
        texts.forEach((text, idx) => {
            ids.push({id: idx, score: calcScore(text.id, concepts)})
        })
        ids.sort((a,b) => b.score - a.score)
        Object.assign(textOrder, ids.map((item) => item.id))
    }

    // Watch searchInput
    watch(searchInput, searchInputChanged)
      watch(conceptLimit, searchInputChanged)

    function extractConcepts (dict) {

      let concepts = [{name: dict.name, nbGames: extractGames(dict).length, games: dict.games}]
      for (let sub of dict.subs) {
        concepts = concepts.concat(extractConcepts(sub))
      }
      return concepts.sort((a,b) => b.name > a.name ? -1 : 1)
    }

    function extractGames (dict) {
        let games = dict.games
        for (let sub of dict.subs) {
            games = games.concat(extractGames(sub))
        }
        return games.filter((item, index) => item !== "" && games.indexOf(item) === index).sort()
    }

    function propagateAccuracyDown(subs, accuracy) {
        let indexes = []
        subs.forEach((sub) => {
            indexes = indexes.concat(propagateAccuracyDown(sub.subs, accuracy/2))
            indexes.push({name: sub.name, accuracy: accuracy/2})
        })
        return indexes
    }

    function search(text, word, games) {
        return word.split("/").concat(games).some(w => text.match(new RegExp("\\b"+w+"\\b", "gi")))
    }

    function getIndexesOfText(text,  ontology, path=[]) {
        let indexes = []
        ontology.subs.forEach((sub) => {
            indexes = indexes.concat(getIndexesOfText(text, sub, path.concat([sub.name])));
        })
        if (search(text, ontology.name, ontology.games)) {
            indexes.push({name: ontology.name, accuracy: 1})
            indexes.concat(propagateAccuracyDown(ontology.subs, 1))
            path.forEach((name, idx) => {
                indexes.push({name: name, accuracy: (path.length - idx)/(path.length+1)})
            })
        }
        return indexes
    }

    function getIndexesOfTexts(texts, ontology) {
        // Pour chaque texte, récupère les concepts et les jeux présents
        const indexes = []
        texts.forEach((text) => {
            const i = getIndexesOfText(text, ontology)
            // Add the accuracy of each duplicate
            const i2 = []
            i.forEach((index) => {
                const idx = i2.findIndex((item) => item.name === index.name)
                if (idx === -1)
                    i2.push(index)
                else
                    i2[idx].accuracy += index.accuracy
            })
            // Divide the accuracy by the max accuracy
            const max = Math.max(...i2.map((item) => item.accuracy))
            i2.forEach((index) => {
                index.accuracy /= max
            })
            indexes.push(i2)
        })
        return indexes
    }

    //-------------------------------------------Mounted
    onMounted(() => {
      axios.get('/ontology').then((response) => {
        Object.assign(ontology, response.data);
        Object.assign(concepts, extractConcepts(ontology));
        Object.assign(games, extractGames(ontology));
      });
        axios.get('/texts').then((response) => {
            Object.assign(texts, response.data.map((text, idx) => {return {id: idx, text: text}}));
            Object.assign(indexes, getIndexesOfTexts(texts.map(text => text.text), ontology));
            searchInputChanged();
        });


    })
    //-------------------------------------------> UI
    return {
        ontology,
        concepts,
      games, texts, indexes, searchInput, textOrder,conceptLimit


    }
  }
}).mount('#app')
