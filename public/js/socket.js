const socket = io.connect(window.location.hostname)
const app = document.getElementById('app')

const getCoords = (position) => {
    let lat = position.coords.latitude
    let lon = position.coords.longitude
    socket.emit('getWeatherWithCoords', lat, lon)
}

if (navigator.geolocation) {
    let crd = navigator.geolocation.getCurrentPosition(getCoords)
}

socket.on('sendWeatherInJSON', (data) => {
    const convert = (timestamp) => {
        let a = new Date(timestamp * 1000)
        let hour = a.getHours()
        let min = a.getMinutes()
        return `${hour}:${min}`
    }
    app.innerHTML = `<div class="container">
    <h2 id="subtitle">Meteo de ${data.name} (${data.sys.country})</h2>
    <div class="row">
        <div class="col-md-6 align-content-center">
            <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"
            alt="${data.weather[0].name}" width="100" class="icon">
            <h3>${data.main.temp_max} °C <span id="brief">${data.weather[0].description}</span></h3>
            <ul>
                <li>Latitude : ${data.coord.lat}</li>
                <li>Longitude : ${data.coord.lon}</li>
            </ul>
        </div>
        <div class="col-md-6" id="details">
            <ul>
                <li>Humidité : ${data.main.humidity} %</li>
                <li>Pression : ${data.main.pressure} hPa</li>
                <li>Lever du soleil : ${convert(data.sys.sunrise)}</li>
                <li>Coucher du soleil : ${convert(data.sys.sunset)}</li>
                <li>Orientation du vent : ${data.wind.deg}°</li>
                <li>Vitesse du vent : ${Math.round(data.wind.speed)} km/h</li>
            </ul>
        </div>
    </div>
</div>`
})
