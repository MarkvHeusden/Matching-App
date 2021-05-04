// Active class in header op basis van URL
const huidigePagina = location.href;
const headerItems = document.querySelectorAll('header nav a');

headerItems.forEach(headerItems => {
    console.log(headerItems.href)
    if(headerItems.href === huidigePagina) {
        headerItems.classList.add('active');
    }
})