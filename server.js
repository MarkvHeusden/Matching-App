// Express
const express = require('express')
const app = express()
const port = process.env.PORT || 3000 // Gebruik Heroku port of localhost port

// MongoDB & .env
require('dotenv').config()
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')

// Maak variabele database aan
let db

// Verbind met MongoDB
const connectDB = async () => {
    // Pak URI uit .env bestand
    const dbURI = process.env.DB_URI
    // Opties object toegevoegd om waarschuwingen in console te voorkomen
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    const client = new MongoClient(dbURI, options)
    await client.connect()
    db = await client.db(process.env.DB_NAME)
}

connectDB()
    .then(() => {
        // Run de server zodra er een connectie is met de database
        app.listen(port, () => {
            console.log(`Bekijk app op http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })

// Middleware & static bestanden
app.use(express.static('./static/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Template engine
app.set('view engine', 'ejs')

// Routes
app.get('/', (req, res) => {
    res.redirect('/explore') // Stuur mensen door naar de explore pagina
})

app.get('/explore', async (req, res) => {
    const collection = db.collection('personen')
    const query = { rated: false }
    const huidigePersoon = await collection.findOne(query)
    res.render('explore', {
        title: 'Ontdek personen',
        huidigePersoon
    })
})

app.get('/explore/:persoonId', async (req, res, next) => {
    const collection = db.collection('personen')
    const query = { _id: ObjectId(req.params.persoonId) }
    const persoon = await collection.findOne(query)
    if (persoon) {
        res.render('details', { title: persoon.naam, persoon })
    } else {
        return next()
    }
})

app.get('/matches', async (req, res) => {
    const collection = db.collection('personen')
    const query = { matched: true }
    const matches = await collection.find(query).toArray()
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
app.post(['/explore', '/explore/:persoonId'], async (req, res) => {
    const collection = db.collection('personen')
    const query = { rated: false }
    const huidigePersoon = await collection.findOne(query)

    // Formulier op zowel de ontdek als detailpagina
    if (req.body.rate === 'like') {
        // Als like knop is gedrukt
        if (huidigePersoon.likedMe) {
            // Als deze persoon mij ook heeft geliked
            await collection.updateOne(query, {
                $set: { rated: true, liked: true, matched: true } // Geef dan aan dat we een match zijn
            })
        } else {
            await collection.updateOne(query, {
                $set: { rated: true, liked: true } // Geef dan aan dat deze persoon geliked is en beoordeelt is
            })
        }
    } else if (req.body.rate === 'skip') {
        // Als skip knop is gedrukt
        await collection.updateOne(query, {
            $set: { rated: true } // Geef dan aan dat deze persoon beoordeelt is
        })
    } else if (req.body.reset === 'reset') {
        await collection.updateMany(
            {},
            {
                $set: { liked: false, rated: false, matched: false }
            }
        )
    }
    res.redirect('/explore') // Stuur mensen door naar de explore pagina. Geen render hier omdat mensen van de detail pagina dan deze URL met id behouden waardoor de nav bar niet meer ziet dat ze op de explore pagina zijn.
})

// 404 Page
app.use((req, res) => {
    res.status(404).render('404')
})
