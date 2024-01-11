// background image

let imageQuery = JSON.parse(localStorage.getItem('imageQuery'));

if (!imageQuery) {
    // if query isn't set go to default (matching placeholder)
    imageQuery = 'nature';
} 

let storedImageId = JSON.parse(localStorage.getItem('storedImageId'))
let currentImageId = '';
const changeImgBtn = document.querySelector('#changeImgBtn');
changeImgBtn.textContent = `Get new ${imageQuery} image`;

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
            const res = await fetch(`https://apis.scrimba.com/unsplash/photos/${stored}`, options);
            if (!res.ok) {
                throw Error('Something went wrong');
            } else {
                const data = await res.json();
                setBackground(data);
            }
            
        } catch(err) {
            console.error(err);
        }
    }
}

async function setNewBackground(query) {
    
    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    try {
        const response = await fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${query}`, options);
        if (!response.ok) {
            throw Error('Something went wrong');
        } else {
            const data = await response.json();
            setBackground(data);
            currentImageId = data.id;
        }
    } catch (err) {
        console.log('Error getting data')
        console.log('Error: ', err);
        // TODO: display error on page        
    }
}

function setBackground(data) {
    const imageUrl = data.urls.full;
    const author = data.user.name;
    const link = data.links.html;
    const location = data.location;
    document.querySelector('body').style.backgroundImage = `url(${imageUrl})`;
    document.querySelector('#image-info').innerHTML = location.name ? `<p>Image by <a href="${link}" target="_blank">${author} <br> ${location.name}<br> </a>
    </p>` : `<p>Image by <a href="${link}" target="_blank">${author}</a></p>`;
}

// * change the image query

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.querySelector('#imageQueryInput').value;
    localStorage.setItem('imageQuery',JSON.stringify(query));
    imageQuery = query;
    changeImgBtn.textContent = `Get new ${imageQuery} image`;
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
    const weatherDisplay = document.querySelector('#weatherDisplay');

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=apparent_temperature,weather_code`, options);
        const data = await res.json();
        if (!res.ok) {
            throw Error('Something went wrong');
        } else {
            getLocationName(lat,long);
            const icon = getWeatherIcon(data.current.weather_code);
            weatherDisplay.textContent = `${data.current.apparent_temperature}${data.current_units.apparent_temperature} ${icon}`;
        }
    } catch(err) {
        console.log('Error getting weather data',err);
    }
}

async function getLocationName(lat,long) {
    const locationDisplay = document.querySelector('#locationDisplay');

    const options = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`, options);
        if (!res.ok) {
            throw Error('Something went wrong');
        } else {
            const data = await res.json();
            locationDisplay.textContent = `${data.city}, ${data.countryName}`;
        }
    } catch(err) {
        console.log('Error getting location name',err);
        weatherDisplay.textContent = 'Error getting weather data, please check location permissions.';
        locationDisplay.textContent = 'Error getting location';
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
    try {
        const res = await fetch('https://api.quotable.io/quotes/random', options);
        if (!res.ok) {
            throw Error('Something went wrong');
        } else {
            const data = await res.json();
            const searchWiki = `https://en.wikipedia.org/w/index.php?search=${data[0].author}`;
            document.querySelector('#quoteDisplay').innerHTML = `
            <blockquote>${data[0].content}</blockquote>
            <cite><a href="${searchWiki}" target="_blank">${data[0].author}</a></cite>`;
        }
    } catch(err) {
        console.log('Error getting quote data',err);
        document.querySelector('#quoteDisplay').textContent = 'Error getting quote'
    }
}


// Time and date
// ! not very DRY

function getTodaysDate() {
    const today = new Date();

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
function getTime() {
    const time = new Date();
    const hour = time.getHours() 

    const timeString = time.toLocaleTimeString("en-us", {timeStyle: "short"});

    document.querySelector('#timeDisplay').textContent = timeString;
    return timeString;
}

function getTimeAndDate() {
    getTime();
    getTodaysDate();
}

// recipe

async function getRecipe() {

    // ? including header with content-type application/json causes error - php?

    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!res.ok) {
            throw Error('Something went wrong');
        } else {
            const data = await res.json();
            displayRecipe(data);
        }
    } catch(err) {
        console.log('Error getting recipe data',err)
        document.querySelector('#displayRecipes').textContent = 'Error getting recipe'
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
setInterval(getTime, 60000);
