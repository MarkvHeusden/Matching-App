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
let personen = [{
    id: 52934, // ID om gemakkelijk een detailpagina voor elk account te maken
    naam: 'Jade',
    likedMe: true, // likedMe geeft aan of deze persoon mij ook geliket heeft. Zo ja? Dan vind er een match plaats
    laatsteBericht: "Pizza'tje doen?", // Dit is het laatste chat bericht dat deze persoon heeft verzonden. Is dit leeg dan komt er de tekst te staan dat je een gesprek kunt beginnen.
    imgFull: '1.jpeg', // Volledige afbeelding voor de detail pagina
    img: '1.png', // Cropped afbeelding voor de explore en match pagina
    bio: 'Hoi ik ben Jade, en mijn lievelings...',
    bioLang: 'Hoi ik ben Jade, en mijn lievelingspizza is mozzarella. In het dagelijks leven studeer ik Creative Business (CB) aan de Hogeschool van Amsterdam. Ik zit momenteel in mijn 3e jaar en ben nu net 22 jaar oud. Verder werk ik in een restaurant als bediening en woon ik in Haarlem. In mijn vrije tijd hou ik mij bezig met gezellig wat drinken met vrienden en natuurlijk pizza eten. Like mij als je opzoek bent naar een pizza maatje.'
  },
  {
    id: 52935,
    naam: 'Nina',
    likedMe: true,
    laatsteBericht: '',
    imgFull: '2.jpeg',
    img: '2.jpeg',
    bio: 'Nina hier 👋🏼 Mijn lievelingspizza...',
    bioLang: 'Nina hier 👋🏼 Mijn lievelingspizza is Hawaii 🥴. In het dagelijks leven studeer ik Verpleegkunde op de Hogeschool Leiden. Ik zit momenteel in mijn 2e jaar en ben nu net 20 jaar oud. Verder werk ik als clown in het circus en woon ik in Leiden. In mijn vrije tijd hou ik mij bezig met sporten en natuurlijk af en toe een pizza eten. Like mij als je opzoek bent naar een pizza maatje.'
  },
  {
    id: 52936,
    naam: 'Lisa',
    likedMe: false,
    laatsteBericht: '',
    imgFull: '3.jpeg',
    img: '3.jpeg',
    bio: 'Hey daar! Ik ben Lisa en pizza salami...',
    bioLang: 'Hey daar! Ik ben Lisa en pizza salami is mijn absolute favoriet! In het dagelijks leven studeer ik Ondernemerschap & Retail Management op de Haagse Hogeschool. Ik zit momenteel in mijn 1e jaar en ben nu net 20 jaar oud. Verder werk ik in een restaurant als bezorger en woon ik in in Leidschendam. In mijn vrije tijd hou ik mij bezig met puzzelen en natuurlijk pizza eten. Like mij als je opzoek bent naar een pizza maatje.'
  }
]

let huidigePersoon = personen.find(huidigePersoon => huidigePersoon) // Persoon die je nu aan het beoordelen bent -> persoon bovenaan personen die je moet beoordelen
let matches = [] // Array voor toekomstige matched
let likedPersonen = [] // Array voor toekomstige gelikete personen
let skippedPersonen = [] // Array voor toekomstige geskipte personen

// Routes
app.get('/', (req, res) => {
  res.redirect('/explore') // Stuur mensen door naar de explore pagina
})

app.get('/explore', (req, res) => {
  res.render('explore', {
    title: 'Ontdek personen',
    huidigePersoon
  })
})

app.get('/explore/:persoonId', (req, res) => {
  const persoon = personen.find(persoon => persoon.id === parseInt(req.params.persoonId, 10)) // Vind de persoon op basis van het id dat in de URL staat
  res.render('details', {
    title: persoon.naam,
    persoon
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

// Like / skip
app.post(['/explore', '/explore/:persoonId'], (req, res) => { // Formulier op zowel de ontdek als detailpagina
  if (req.body.rate === 'like') { // Als like knop is gedrukt
    likedPersonen.push(huidigePersoon) // Voeg dan deze persoon toe aan de likedPersonen array
    personen.shift() // En verwijder deze persoon uit de personen die je nog moet beoordelen
    if (huidigePersoon.likedMe) { // Als deze persoon mij ook heeft geliked
      matches.push(huidigePersoon) // Maak dan een match aan
    }
  } else if (req.body.rate === 'skip') {
    skippedPersonen.push(huidigePersoon) // Als skip knop is gedrukt
    personen.shift() // Verwijder deze persoon uit de personen die je nog moet beoordelen
  }
  huidigePersoon = personen.find(huidigePersoon => huidigePersoon) // Update de huidige persoon naar een nieuwe persoon
  res.redirect('/explore') // Stuur mensen door naar de explore pagina. Geen render hier omdat mensen van de detail pagina dan deze URL met id behouden waardoor de nav bar niet meer ziet dat ze op de explore pagina zijn.
})

// 404 Page
app.use((req, res) => {
  res.status(404).render('404')
})

// Run de server lokaal
app.listen(port, () => {
  console.log(`Bekijk app op http://localhost:${port}`)
})
