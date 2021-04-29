// Express
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./static/public'))

// Template engine
app.set('view engine', 'ejs')


// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home'})
})

app.get('/explore', (req, res) => {
  const personen = [
    {naam: 'Dave', bio: 'hoi ik ben dave'},
    {naam: 'Jan', bio: 'hoi ik ben Jan'},
    {naam: 'Henk', bio: 'hoi ik ben henk'}
  ]
  res.render('explore', { title: 'Ontdek', personen })
})

app.get('/explore/:personId/:slug', (req, res) => {
  res.send(`<h1>Explore ${req.params.slug}</h1>`)
})

app.get('/matches', (req, res) => {
  res.render('matches')
})

// 404 Page
app.use((req, res) => {
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})