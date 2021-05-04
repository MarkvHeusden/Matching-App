// Express
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./static/public'))

// Template engine
app.set('view engine', 'ejs')


// Tijdelijke data
const personen = [
  {naam: 'Dave', bio: 'hoi ik ben dave'},
  {naam: 'Jan', bio: 'hoi ik ben Jan'},
  {naam: 'Henk', bio: 'hoi ik ben henk'}
]

const matches = [
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

// 404 Page
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Bekijk app op http://localhost:${port}`)
})