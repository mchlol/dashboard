let imageQuery = localStorage.getItem('imageQuery');

if (!imageQuery) {
    imageQuery = 'nature';
}

async function getBackground() {
    try {
        const response = await fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${imageQuery}`);
        const data = await response.json();
        console.log(data);
        setBackground(data.urls.raw, data.user.name, data.links.html, data.location);
    } catch (err) {
        console.log('Error getting data')
        console.log('Error: ', err);

    }
}

function setBackground(imageUrl, author, link, location) {
    console.log(imageUrl, author);
    document.querySelector('body').style.backgroundImage = `url(${imageUrl})`;
    document.querySelector('#image-credit').innerHTML = location.name ? `<p>${location.name}<br> By <a href="${link}" target="_blank">${author}</a>
    </p>` : `<p>By <a href="${link}" target="_blank">${author}</a></p>`;
}


getBackground()

function getTodaysDate() {
    const today = new Date(Date.now());

    const date = today.getDate();
    const day = getDayName(today);
    const month = getMonthName(today);
    const year = today.getFullYear();
    const dateString = `${day} ${date} ${month} ${year}`;
    console.log(dateString);
    document.querySelector('#dateDisplay').textContent = dateString;
    return dateString;
}

function getMonthName(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[date.getMonth()];
    return month;
}

function getDayName(date) {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = days[date.getDay()];
    return day;
}

getTodaysDate();

// time function can be setInterval every second to update time

