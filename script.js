let imageQuery = JSON.parse(localStorage.getItem('imageQuery'));
let storedImageId = JSON.parse(localStorage.getItem('storedImageId'))
let currentImageId = '';
const changeImgBtn = document.querySelector('#changeImgBtn');

changeImgBtn.addEventListener('click', () => setNewBackground(imageQuery));

async function getStoredBackground(stored) {

    if (!stored) {
        setNewBackground(imageQuery);
    } else {

        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const response = await fetch(`https://apis.scrimba.com/unsplash/photos/${stored}`, options);
            const data = await response.json();
            setBackground(data);
        } catch(err) {
            console.error(err);
        }
    }
}

async function setNewBackground(query) {

    if (!query) {
        // if query isn't set go to default (matching placeholder)
        query = 'nature';
    } 

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    try {
        const response = await fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${query}`, options);
        const data = await response.json();
        setBackground(data);
        currentImageId = data.id;
    } catch (err) {
        console.log('Error getting data')
        console.log('Error: ', err);
        // TODO: display error on page        
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


// weather

function getGeoPosition() {
    // function if successful
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        // console.log(`Latitude: ${latitude} \n Longitude: ${longitude}`);
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

async function getWeather(lat,long) {

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=apparent_temperature,weather_code`, options);
        const data = await res.json();
        // console.log('weather data: ',data);
        getLocationName(lat,long);
        const icon = getWeatherIcon(data.current.weather_code);
        document.querySelector('#weatherDisplay').textContent = `${data.current.apparent_temperature}${data.current_units.apparent_temperature} ${icon}`;

    } catch(err) {
        console.log('Error getting weather data',err);
    }
}

async function getLocationName(lat,long) {

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`, options);
        const data = await res.json();
        document.querySelector('#locationDisplay').textContent = `${data.city}, ${data.countryName}`;
    } catch(err) {
        console.log('Error getting location name',err);
    }
}

function getWeatherIcon(code) {
    let icon = '';
    
    if (code == 0) {
        icon = '☀️';
    } else if (code == 1) {
        icon = '🌤️';
    } else if (code == 2) {
        icon = '🌥️';
    } else if (code == 3) {
        icon = '☁️';
    } else if (code == 45 || code == 48) {
        icon = '😶‍🌫️';
    } else if (code == 63 || code == 65 || code == 82) {
        icon = '☔️';
    } else if (code > 50 && code < 70) {
        icon = '🌧️';
    } else if (code == 80 || code == 81) {
        icon = '🌦️';
    } else if (code > 70 && code < 90 ) {
        icon = '🌨️';
    } else if (code > 90 && code < 100) {
        icon = '⛈️'
    } else {
        console.log('error getting weather for code: ',code)
    }
    return icon;
}

// quotes
async function getQuote() {

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const res = await fetch('https://api.quotable.io/quotes/random', options);
    const data = await res.json();
    // console.log('quote data: ',data)
    document.querySelector('#quoteDisplay').innerHTML = `
    <blockquote>${data[0].content}</blockquote>
    <cite>${data[0].author}</cite>`;
}


// Time and date
// ! not very DRY

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
}

// recipe

async function getRecipe() {

    // ? including header with content-type application/json causes error

    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        displayRecipe(data);
    } catch(err) {
        console.log('Error getting recipe data',err)
    }
    
}

function displayRecipe(data) {
    const title = data.meals[0].strMeal;
    const thumbnailUrl = data.meals[0].strMealThumb;
    const linkUrl = data.meals[0].strSource;

    const container = document.querySelector('#displayRecipes');

    const titleEl = document.createElement('p');
    titleEl.textContent = title;

    const imageEl = document.createElement('img');
    imageEl.src = thumbnailUrl;
    imageEl.alt = "meal thumbnail";

    const anchorEl = document.createElement('a');
    anchorEl.href = linkUrl;
    anchorEl.target = "_blank";


    anchorEl.append(imageEl);
    container.append(titleEl,anchorEl);
}


// run once on page load
getStoredBackground(storedImageId);
getTimeAndDate();
getGeoPosition();
getQuote();
getRecipe();


// update time every second
setInterval(getTimeAndDate, 60000);
