const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./static/public'))


// Routes
app.get('/', (req, res) => {
  res.send(`<h1>Home</h1>`)
})

app.get('/explore', (req, res) => {
  res.send(`<h1>Explore</h1>`)
})

app.get('/explore/:personId/:slug', (req, res) => {
  res.send(`<h1>Explore ${req.params.slug}</h1>`)
})

app.get('/matches', (req, res) => {
  res.send(`<h1>Matches</h1>`)
})

// 404 Page
app.use((req, res) => {
  res.status(404).sendFile('./views/404.html', { root: __dirname})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})