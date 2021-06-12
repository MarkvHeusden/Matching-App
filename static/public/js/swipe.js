// Importeer TinyGesture JavaScript library voor swipe functionaliteit
import TinyGesture from './TinyGesture.js'

// Opties object voor de TinyGesture library
const gestureOpties = {
    // Minimale snelheid waarop een beweging als swipe word herkend
    velocityThreshold: 1,
    // Bereken de afstand waarna snelheid niet meer uitmaakt en iets altijd een swipe is
    disregardVelocityThreshold: (type) =>
        Math.floor(0.2 * (type === 'x' ? 375 : 667)),
    // Voorkom dat een swipe zowel als horizontale swipe en als verticale swipe wordt gezien tegelijk
    diagonalSwipes: false,
    // Luister ook naar muisevent ipv alleen touchevents
    mouseSupport: true
}

const target = document.querySelector('.persoon')
const gesture = new TinyGesture(target, gestureOpties)

// Voorkom dat je perongeluk klikt tijdens het slepen (vooral desktop probleem)
const stopKlik = (e) => {
    e.preventDefault()
}
target.addEventListener('click', stopKlik)

gesture.on('panmove', () => {
    // Als er al een animatie bezig (.animationFrame property = 1 ipv 0) is, return dan de functie om teveel aanvragen tegelijk te voorkomen
    if (gesture.animationFrame) {
        return
    }

    // Voer voor elke drag/swipe beweging 1 frame van de animatie uit
    // Door AnimationFrame op te vragen voorkom je haperen. Je rendert pas de volgende frame wanneer de vorige klaar is
    gesture.animationFrame = window.requestAnimationFrame(() => {
        // Transformeer de kaart op basis van de beweging van de gebruiker
        target.style.transform =
            // Draai Z en verplaats X basis van hoe ver de kaart naar links of rechts geswipet is
            // Verplaats Y op basis van hoe hoog of laag de kaart wordt geswipet (/5 om hoog/laag te beperken omdat het om links en rechts swipen gaat) en verplaat de kaart meer naar boven hoe verder je naar links of rechts hebt geswipet (Math.abs(gesture.touchMoveX))
            `rotateZ(${gesture.touchMoveX / 10}deg) 
            translateX(${gesture.touchMoveX}px)
            translateY(${
                gesture.touchMoveY / 5 - Math.abs(gesture.touchMoveX) / 3
            }px)`

        // Geef hem de class animated zodat de kaart de juiste transitie krijgt in CSS
        target.classList.add('animated')

        // Zet animationFrame weer op null zodat de volgende frame plaats kan vinden
        gesture.animationFrame = null
    })
    // Pak het element dat een hartje of kruisje gaat tonen wanneer je swiped
    const likeSkipFeedback = document.querySelector('.like-skip-feedback')

    if (gesture.swipingDirection === 'horizontal' && gesture.touchMoveX > 7.5) {
        likeSkipFeedback.classList.add('visible')
        likeSkipFeedback.style.backgroundImage = "url('../images/heart.svg')"
    } else if (
        gesture.swipingDirection === 'horizontal' &&
        gesture.touchMoveX < 7.5
    ) {
        likeSkipFeedback.classList.add('visible')
        likeSkipFeedback.style.backgroundImage = "url('../images/cross.svg')"
    } else {
        likeSkipFeedback.classList.remove('visible')
        likeSkipFeedback.style.backgroundImage = 'none'
    }
})

gesture.on('panend', () => {
    // Cancel de laatste AnimationFrame. Dit voorkomt dat de kaart blijft hangen op de laatste positie ipv terugkeert.
    window.cancelAnimationFrame(gesture.animationFrame)

    // Zet animationFrame weer op null. Dit voorkomt dat de panmove functie nog denkt dat er een animatie bezig is en de functie returnt ipv uitvoert
    gesture.animationFrame = null

    // Verwijder de class animated zodat hij weer de juiste transitie krijgt
    target.classList.remove('animated')

    // Zet tranform op null, of te wel zet hem weer op originele plaats
    target.style.transform = null

    // Pak het element dat een hartje of kruisje gaat tonen wanneer je swiped
    const likeSkipFeedback = document.querySelector('.like-skip-feedback')

    // Stijl het element weer zodat je hem niet ziet
    likeSkipFeedback.style.backgroundImage = 'none'
})

gesture.on('swiperight', () => {
    // Wanneer er rechts word geswiped, verplaats kaart naar rechts
    target.style.transform = 'translateX(150%)'

    // En zet de kaart na een halve seconde weer terug, mocht er iets fout gaan.
    setTimeout(() => (target.style.transform = null), 1000)

    // Selecteer de like knop en klik deze
    const likeKnop = document.querySelector('.like-btn')
    likeKnop.click()
})

gesture.on('swipeleft', () => {
    // Wanneer er links word geswiped, verplaats kaart naar links
    target.style.transform = 'translateX(-150%)'

    // En zet de kaart na een halve seconde weer terug, mocht er iets fout gaan.
    setTimeout(() => (target.style.transform = null), 1000)

    // Selecteer de like knop en klik deze
    const skipKnop = document.querySelector('.skip-btn')
    skipKnop.click()
})

// Zorg dat je weer kunt klikken op de kaart als dit ook bewust is
gesture.on('tap', () => {
    target.removeEventListener('click', stopKlik)
})
