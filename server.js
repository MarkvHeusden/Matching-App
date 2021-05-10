// Express
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./static/public'))

// Template engine
app.set('view engine', 'ejs')


// Tijdelijke data
const personen = [
  {naam: 'Jade', bio: 'Hoi ik ben Jade', img: '1.jpeg'},
  {naam: 'Nina', bio: 'Hoi ik ben Nina', img: '2.jpeg'},
  {naam: 'Lisa', bio: 'Hoi ik ben Lisa', img: '3.jpeg'}
]

const matches = [
  {naam: 'Jade', bericht: 'Hoi ik ben Jade', img: '1.jpeg'},
  {naam: 'Nina', bericht: 'Hoi ik ben Nina', img: '2.jpeg'},
  {naam: 'Lisa', bericht: 'Hoi ik ben Lisa', img: '3.jpeg'}
]

// Routes
app.get('/', (req, res) => {
  res.redirect('/explore')
})

app.get('/explore', (req, res) => {
  res.render('explore', { title: 'Ontdek personen', personen })
})

app.get('/explore/:personId/:slug', (req, res) => {
  res.render('details', { title: `${req.params.slug}`})
})

app.get('/matches', (req, res) => {
  res.render('matches', { title: 'Mijn matches', matches})
})

app.get('/account', (req, res) => {
  res.render('account', { title: 'Mijn account'})
})

// 404 Page
app.use((req, res) => {
  res.status(404).render('404')
})

// Run de server lokaal
app.listen(port, () => {
  console.log(`Bekijk app op http://localhost:${port}`)
})