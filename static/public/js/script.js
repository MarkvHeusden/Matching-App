// Active class in header op basis van URL
const huidigeURL = location.href
const headerItems = document.querySelectorAll('header nav a')

// Voor elk header item kijken of het overeenkomt met de huidige URL
headerItems.forEach((headerItem) => {
    if (headerItem.href === huidigeURL) {
        headerItem.classList.add('active')
    }
})

// const personenEl = document.querySelectorAll('.persoon-sectie');
// personenEl.forEach(personenEl => {
//     personenEl.addEventListener('click', klik);
// })

// function klik() {
//     console.log(this);
// }
