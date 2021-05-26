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
    const dbURI = process.env.DB_URI // Pak URI uit .env bestand
    const options = {
        // Opties object toegevoegd om waarschuwingen in console te voorkomen
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    // Maak connectie met opgegeven URI
    const client = new MongoClient(dbURI, options)
    await client.connect()
    db = client.db(process.env.DB_NAME)
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
    const query = { rated: false } // Toon alleen personen die je nog niet beoordeelt hebt
    const huidigePersoon = await collection.findOne(query) // Selecteer 1 persoon bovenaan alle personen om te beoordelen
    res.render('explore', { title: 'Ontdek personen', huidigePersoon })
})

app.get('/explore/:persoonId', async (req, res, next) => {
    const collection = db.collection('personen')
    const query = { _id: ObjectId(req.params.persoonId) } // Pak het ID dat in de URL staat
    const persoon = await collection.findOne(query) // Vind een persoon met dit ID
    if (persoon) {
        res.render('details', { title: persoon.naam, persoon })
    } else {
        return next() // Ga door naar volgende route(s) (404 pagina) als er geen persoon is gevonden
    }
})

app.get('/matches', async (req, res) => {
    const collection = db.collection('personen')
    const query = { matched: true } // Toon alleen personen waarmee ik een match heb
    const matches = await collection.find(query).toArray()
    res.render('matches', { title: 'Mijn matches', matches })
})

app.get('/account', (req, res) => {
    res.render('account', { title: 'Mijn account' })
})

// Like / skip formulier + reset optie
app.post(['/explore', '/explore/:persoonId'], async (req, res) => {
    const collection = db.collection('personen')
    const query = { rated: false } // Toon alleen personen die je nog niet beoordeelt hebt
    const huidigePersoon = await collection.findOne(query) // Selecteer 1 persoon bovenaan alle personen om te beoordelen

    // Als de like knop is gedrukt
    if (req.body.rate === 'like') {
        // En als deze persoon mij heeft geliked
        if (huidigePersoon.likedMe) {
            await collection.updateOne(query, {
                $set: { rated: true, liked: true, matched: true } // Geef dan aan dat de persoon beoordeelt & geliket is & dat we een match zijn
            })
            // En als deze persoon mij (nog) niet heeft geliked
        } else {
            await collection.updateOne(query, {
                $set: { rated: true, liked: true } // Geef dan aan dat de persoon beoordeelt & geliket is
            })
        }
        // Als de skip knop is gedrukt
    } else if (req.body.rate === 'skip') {
        await collection.updateOne(query, {
            $set: { rated: true } // Geef dan aan dat de persoon beoordeelt is
        })
        // Als de reset knop is gedrukt
    } else if (req.body.reset === 'reset') {
        await collection.updateMany(
            // Zet dan voor elke persoon de waardes terug naar false
            {},
            {
                $set: { liked: false, rated: false, matched: false }
            }
        )
    }
    res.redirect('/explore') // Stuur mensen door naar de explore pagina. Geen render hier omdat mensen van de detail pagina dan deze URL met id behouden waardoor de front-end JS van de nav bar niet meer ziet dat ze op de explore pagina zijn.
})

// 404 Page
app.use((req, res) => {
    res.status(404).render('404')
})
