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
    imgFull: '1.jpeg',
    img: '1.png', // Cropped afbeelding maken & checken
    bioLang: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.'
  },
  {
    id: 52935,
    naam: 'Nina',
    bio: 'Hoi ik ben Nina',
    imgFull: '2.jpeg',
    img: '2.jpeg',
    bioLang: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.'
  },
  {
    id: 52936,
    naam: 'Lisa',
    bio: 'Hoi ik ben Lisa',
    imgFull: '3.jpeg',
    img: '3.jpeg',
    bioLang: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.'
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

app.get('/explore/:persoonId', (req, res) => {
  const persoon = personen.find(persoon => persoon.id == req.params.persoonId)
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
