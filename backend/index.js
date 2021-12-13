const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const port = 5000

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

let heroes = require("./heroes.json")

//middlewear//
const checkheroes = (req, res, next) => {
    const { slug } = req.body
    const existhero = heroes.find(hero => hero.slug === slug)
  
    if (existhero) {
      res.status(409).send("le héro existe déjà")
    } else {
        next()
    }
}

//middlewear//
const validateHero = (req, res, next) => {
   const firstElement = heroes[0]
   const cle = Object.keys(firstElement)
   const bodyKeys = Object.keys(req.body)
   const invalid = bodyKeys.find(key => !cle.includes(key))
    if (invalid) {
      res.status(400).send(`la clé ${invalid} existe pas`)
    } else {
        next()
    }
}   

//lire la liste de tout les heros
app.get("/heroes", (req, res) => {
    res.json(heroes)
})

//recupere un super-héro
app.get("/heroes/:slug",(req, res) => {
    const { slug } = req.params
    console.log(slug);
    console.log(heroes);
    const hero = heroes.find(hero => hero.slug === slug)
    console.log(hero);
    
    res.json(hero)
})

//récupère les pouvoirs d'un super-héro
app.get("/heroes/:slug/powers", (req, res) => {
    const { slug } = req.params
    const hero = heroes.find(hero => hero.slug === slug)
    console.log(hero);
    const powers = hero.power
    console.log(powers);

    res.json(
        powers
    )
})

//ajoute un super-héro
app.post('/heroes', checkheroes, validateHero, (req, res) => {
    console.log(req.body)

    const hero = {
        ...req.body
    }

    heroes = [...heroes, hero]

    res.json(hero)
})

//ajoute un pouvoir à un super-héro
app.put('/heroes/:slug/powers', (req, res) => {
    const { slug } = req.params
    const hero = heroes.find(hero => hero.slug === slug)
    const superpower = req.body.power
    const powers = [...hero.power, superpower]
    res.json(powers)
})

//efface un héro de la liste
app.delete("/:slug", checkheroes, (req, res) => {
    const { slug } = req.params
    const index = heroes.findIndex(hero => hero.slug === slug)
    
    heroes.splice(index, 1)
    res.status(204).send(`${slug} effacé correctement`)
  })

  //efface un pouvoir d'un super-héro
  app.delete("/heroes/:slug/power/:power", checkheroes, (req, res) => {
    const { slug, power } = req.params
    const hero = heroes.find(hero => hero.slug === slug)
    const index = hero.power.findIndex(hero => hero === power)
    
    hero.power.splice(index, 1)
    res.status(204).send(`${slug} effacé correctement`)
  })

//remplace toute les informations du héro par celle qui arrive dans la requête
  app.put("/heroes/:slug"), validateHero, (req, res) => {
      const { slug } = req.params
      const indexHero = heroes.findIndex(e => e.slug === slug)

      heroes[indexHero].slug = req.body.slug
      heroes[indexHero].name = req.body.name
      heroes[indexHero].power = req.body.power
      heroes[indexHero].color = req.body.color
      heroes[indexHero].isAlive = req.body.isAlive
      heroes[indexHero].age = req.body.age
      heroes[indexHero].image = req.body.image
      res.json(heroes[indexHero])

  }

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})