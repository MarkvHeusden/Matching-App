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

// Error handling
app.use(function (req, res, next) {
  res.status(404).send(`<iframe src="https://giphy.com/embed/5xaOcLyjXRo4hX5UhSU" width="100%" height="100%" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><style>body{background:black;height:100vh;display:grid;place-items:center;overflow:hidden;}</style>`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})