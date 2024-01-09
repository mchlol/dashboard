let imageQuery = JSON.parse(localStorage.getItem('imageQuery'));

if (!imageQuery) {
    imageQuery = 'nature';
} else {
    document.querySelector('#imageQuery').value = imageQuery;
}

async function getBackground(query) {
    if (!query) {
        query = 'dogs'
    }
    try {
        const response = await fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${query}`);
        const data = await response.json();
        console.log(data);
        setBackground(data.urls.raw, data.user.name, data.links.html, data.location);
    } catch (err) {
        console.log('Error getting data')
        console.log('Error: ', err);

    }
}

function setBackground(imageUrl, author, link, location) {
    document.querySelector('body').style.backgroundImage = `url(${imageUrl})`;
    document.querySelector('#image-credit').innerHTML = location.name ? `<p>${location.name}<br> By <a href="${link}" target="_blank">${author}</a>
    </p>` : `<p>By <a href="${link}" target="_blank">${author}</a></p>`;
}

// change the image query

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target)
    const query = document.querySelector('#imageQuery').value;
    console.log(query);
    localStorage.setItem('imageQuery',JSON.stringify(query))
    getBackground(query);
})


// ! Time and date - not very DRY

function getTodaysDate() {
    const today = new Date(Date.now());

    const date = today.getDate();
    const day = getDayName(today);
    const month = getMonthName(today);
    const year = today.getFullYear();
    const dateString = `${day} ${date} ${month} ${year}`;
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

// 24 hour time
function getTime() {
    const time = new Date(Date.now());
    const hour = time.getHours();
    const min = time.getMinutes();
    const timeString = `${hour}:${min}`;
    document.querySelector('#timeDisplay').textContent = timeString;
    return timeString;
}

function getTimeAndDate() {
    getTime();
    getTodaysDate();
    console.log(getTime(), getTodaysDate());
}

// run once on page load
getBackground(imageQuery)
getTimeAndDate();

// time function can be setInterval every second to update time
setInterval(getTimeAndDate, 60000);
