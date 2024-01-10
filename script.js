let imageQuery = JSON.parse(localStorage.getItem('imageQuery'));
let storedImageId = JSON.parse(localStorage.getItem('storedImageId'))
let currentImageId = '';
const changeImgBtn = document.querySelector('#changeImgBtn');

changeImgBtn.addEventListener('click', () => setNewBackground(imageQuery));

async function getStoredBackground(stored) {

    if (!stored) {
        setNewBackground(imageQuery);
    } else {

        try {
            const response = await fetch(`https://apis.scrimba.com/unsplash/photos/${stored}`);
            const data = await response.json();
            console.log('stored data: ', data);
            setBackground(data);
        } catch(err) {
            console.error(err);
        }
    }
}

async function setNewBackground(query) {

    if (!query) {
        // if query isn't set go to default matching html placeholder
        query = 'nature';
    } 
    
    try {
        const response = await fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${query}`);
        const data = await response.json();
        console.log(data);
        setBackground(data);
        currentImageId = data.id;
    } catch (err) {
        console.log('Error getting data')
        console.log('Error: ', err);
    }
}

function setBackground(data) {
    const imageUrl = data.urls.raw;
    const author = data.user.name;
    const link = data.links.html;
    const location = data.location;
    document.querySelector('body').style.backgroundImage = `url(${imageUrl})`;
    document.querySelector('#image-credit').innerHTML = location.name ? `<p>${location.name}<br> By <a href="${link}" target="_blank">${author}</a>
    </p>` : `<p>By <a href="${link}" target="_blank">${author}</a></p>`;
}

// * change the image query

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target)
    const query = document.querySelector('#imageQueryInput').value;
    console.log('query: ',query);
    localStorage.setItem('imageQuery',JSON.stringify(query))
    setNewBackground(query);
})

function storeImage(id) {
    localStorage.setItem('storedImageId', JSON.stringify(id));
}

document.querySelector('#storeImgBtn').addEventListener('click', () => storeImage(currentImageId))


// ! weather - IN PROGRESS
// get the users location
// call the open-meteo api to get temp & weather
getGeoPosition();


async function getWeather(lat,long) {


    try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&timezone=Australia%2FSydney`);
        const data = await res.json();
        console.log(data);
    } catch(err) {
        console.log('Error getting weather data',err);
    }
    
    
}

function getGeoPosition() {
    // function if successful
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude} \n Longitude: ${longitude}`);
        getWeather(latitude, longitude);
        
    }
    
    // function if error
    function error() {
        console.log('Unable to get location')
    }
    
    if (!navigator.geolocation) {
        console.log('Browser could not provide location');
    } else {
        const location = navigator.geolocation.getCurrentPosition(success, error);
    }

}


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

// ! only in 24 hour time
function getTime() {
    const time = new Date(Date.now());
    const hour = time.getHours() 
    let min = time.getMinutes();
    min = min < 10 ? `0${min}` : min;
    const timeString = hour < 12 ? `${hour}:${min} AM` : `${hour}:${min} PM`;
    document.querySelector('#timeDisplay').textContent = timeString;
    return timeString;
}

function getTimeAndDate() {
    getTime();
    getTodaysDate();
    console.log(getTime(), getTodaysDate());
}

// run once on page load
getStoredBackground(storedImageId);
getTimeAndDate();
getGeoPosition();

// update time every second
setInterval(getTimeAndDate, 60000);
