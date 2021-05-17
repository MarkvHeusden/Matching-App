// Express
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./static/public'))
app.use(express.json())
app.use(express.urlencoded())

// Template engine
app.set('view engine', 'ejs')

// Tijdelijke data
const personen = [{
    id: 52934,
    naam: 'Jade',
    bio: 'Hoi ik ben Jade',
    img: '1.png' // Cropped afbeelding maken & checken
  },
  {
    id: 52935,
    naam: 'Nina',
    bio: 'Hoi ik ben Nina',
    img: '2.jpeg'
  },
  {
    id: 52936,
    naam: 'Lisa',
    bio: 'Hoi ik ben Lisa',
    img: '3.jpeg'
  }
]

const huidigePersoon = personen.find(huidigePersoon => huidigePersoon)

let matches = []
let likedPersonen = []
let dislikedPersonen = []

// Routes
app.get('/', (req, res) => {
  res.redirect('/explore')
})

app.get('/explore', (req, res) => {
  res.render('explore', {
    title: 'Ontdek personen',
    huidigePersoon
  })
})

app.get('/explore/:personId', (req, res) => {
  const persoon = personen.find(persoon => persoon.id == req.params.personId)
  res.render('details', {
    title: persoon.naam,
    persoon
  })
})

// Like / dislike
app.post('/explore', (req, res) => {
  console.log(req.body)
  res.render('explore', {
    title: 'Ontdek personen',
    personen
  })
})

app.get('/matches', (req, res) => {
  res.render('matches', {
    title: 'Mijn matches',
    matches
  })
})

app.get('/account', (req, res) => {
  res.render('account', {
    title: 'Mijn account'
  })
})

// 404 Page
app.use((req, res) => {
  res.status(404).render('404')
})

// Run de server lokaal
app.listen(port, () => {
  console.log(`Bekijk app op http://localhost:${port}`)
})
