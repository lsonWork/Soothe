import localStorage from "./localStorage.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const btnLocation = $('.btn-location');
const searchInput = $('.search-input');
const btnSearch = $('.btn-search');
const temp = $('.temp');
const weather = $('.weather');
const humidValue = $('.humid-value');
const windValue = $('.wind-value');
const city = $('.city');
const humidIcon = $('.fa-droplet');
const windIcon = $('.fa-wind');
const overlay = $('.overlay');
const popNotFound = $('.pop-not-found');
const btnClosePop = $('.btn-close-pop');
const time = $('.time');
let today = new Date();
const background = $('.back-video');
const date = $('.date');
const iconAudio = $('.icon-audio');
const mainAudio = $('.main-audio');
const iconSplashMusic = $('.icon-splash-music');
const iconSplashVolume = $('.icon-splash-volume');
const rangeVolume = $('#volume');
const btnVolume = $('.btn-volume');

let idInterval;
let currentCityTimeZone;
let currentHoursCity;



const app = {
    listSong: [
        {
            path: './music/dné  Highlight.mp3'
        },
        {
            path: './music/Elijah Lee  Dreamy.mp3'
        },
        {
            path: './music/toutou.mp3'
        },
        {
            path: './music/Akira Kosemura  You Official Music Video.mp3'
        },
        {
            path: './music/eau.mp3'
        },
        {
            path: './music/nop nop.mp3'
        },
    ],
    isPlaying: false,
    currentSongIndex: 0,
    timeToChangeBackground: 0,
    backgroundStatus: 0,
    loadSongToApp(index) {
        mainAudio.src = this.listSong[index].path;
    },

    getCurrentCityTime(currentCityTimeZone) {
        idInterval = setInterval(() => {
            var currentTime = new Date();
            var timezoneOffsetInSeconds = currentCityTimeZone; // Giả sử data.timezone là chênh lệch múi giờ tính bằng giây

            // Lấy chênh lệch múi giờ hiện tại của máy tính tính bằng phút so với UTC và chuyển đổi sang giây
            var localTimezoneOffset = currentTime.getTimezoneOffset() * 60;

            // Tính toán thời gian mới với chênh lệch múi giờ
            var correctedTime = new Date(currentTime.getTime() + (timezoneOffsetInSeconds + localTimezoneOffset) * 1000);
            var hours = correctedTime.getHours();
            var minutes = correctedTime.getMinutes();
            var seconds = correctedTime.getSeconds();

            if (!isNaN(hours)) {
                time.innerHTML = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
            }
            
        }, 1000)
    },

    eventHandler() {
        btnLocation.onclick = function () {
            searchInput.focus();
        }

        searchInput.onkeyup = function (e) {
            if (e.code === 'Enter') {
                const cityName = searchInput.value;
                app.getApiData(cityName, '7f19ba76e4d8fac0eb3c946d922a2807');
            }
        }

        btnSearch.onclick = function () {
            const cityName = searchInput.value;
            app.getApiData(cityName, '7f19ba76e4d8fac0eb3c946d922a2807');
        }

        btnClosePop.onclick = function () {
            overlay.classList.add('hide');
            popNotFound.classList.add('hide');
        }

        iconAudio.onclick = function () {
            if (app.isPlaying !== true) {
                mainAudio.play();
                iconSplashMusic.classList.toggle('hide')
                app.isPlaying = true;
            } else {
                mainAudio.pause();
                app.isPlaying = false;
                iconSplashMusic.classList.toggle('hide')
            }
        }

        mainAudio.onended = function () {
            if (app.currentSongIndex === app.listSong.length - 1) {
                app.currentSongIndex = 0;
                var userProfile = {
                    cityName: localStorage.get().cityName,
                    song: app.currentSongIndex,
                };
                localStorage.set(userProfile);
                app.loadSongToApp(app.currentSongIndex);
                mainAudio.play();
            } else {
                app.currentSongIndex++;
                var userProfile = {
                    cityName: localStorage.get().cityName,
                    song: app.currentSongIndex,
                };
                localStorage.set(userProfile);
                app.loadSongToApp(app.currentSongIndex);
                mainAudio.play();
            }
        }

        btnVolume.onclick = function () {
            iconSplashVolume.classList.toggle('hide-splash');
            if (!iconSplashVolume.classList.contains('hide-splash')) {
                mainAudio.muted = true;
            } else {
                mainAudio.muted = false;
            }
        }

        rangeVolume.oninput = function () {
            let volumeValue = parseInt(rangeVolume.value, 10) / 100;
            mainAudio.volume = volumeValue;
            if (volumeValue === 0) {
                iconSplashVolume.classList.remove('hide-splash');
            } else {
                iconSplashVolume.classList.add('hide-splash');
            }
        }

    },

    getApiData(cityName, apiKey) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=vi`;
        time.innerHTML = ``;
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (idInterval) {
                    clearInterval(idInterval);
                }
                temp.innerHTML = `${data.main.temp}°C`;
                weather.innerHTML = data.weather[0].description.substring(0, 1).toUpperCase() + data.weather[0].description.substring(1, data.weather[0].description.length);
                humidValue.innerHTML = data.main.humidity + '%';
                windValue.innerHTML = data.wind.speed + 'm/s';
                city.innerHTML = data.name;
                humidIcon.classList.remove('hide');
                windIcon.classList.remove('hide');

                currentCityTimeZone = data.timezone;

                var currentTime = new Date();
                var timezoneOffsetInSeconds = data.timezone;
                var localTimezoneOffset = currentTime.getTimezoneOffset() * 60;
                var correctedTime = new Date(currentTime.getTime() + (timezoneOffsetInSeconds + localTimezoneOffset) * 1000);
                let check = correctedTime.getHours() < 18;

                idInterval = setInterval(() => {
                    
                    var currentTime = new Date();
                    var timezoneOffsetInSeconds = data.timezone; // Giả sử data.timezone là chênh lệch múi giờ tính bằng giây

                    // Lấy chênh lệch múi giờ hiện tại của máy tính tính bằng phút so với UTC và chuyển đổi sang giây
                    var localTimezoneOffset = currentTime.getTimezoneOffset() * 60;

                    // Tính toán thời gian mới với chênh lệch múi giờ
                    var correctedTime = new Date(currentTime.getTime() + (timezoneOffsetInSeconds + localTimezoneOffset) * 1000);
                    var hours = correctedTime.getHours();
                    var minutes = correctedTime.getMinutes();
                    var seconds = correctedTime.getSeconds();

                    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var todayDate = daysOfWeek[correctedTime.getDay()];

                    date.innerHTML = `${todayDate}, ${monthArr[correctedTime.getMonth()]} ${correctedTime.getDate()}, ${correctedTime.getFullYear()}`;

                    time.innerHTML = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
                    
                    if (hours < 18 && check) {
                        background.src = './video/day.mp4';
                        check = false;
                    } else if (hours >= 18 && !check) {
                        background.src = './video/night.mp4';
                        check = true;
                    }

                    if (hours === 0 && minutes === 0 && seconds === 0) {
                        background.classList.add('show');
                        background.classList.remove('hide');
                    }

                    if (hours === 17 && minutes === 59 && seconds === 56) {
                        background.classList.add('hide');
                        background.classList.remove('show');
                    }

                    if (hours === 18 && minutes === 0 && seconds === 0) {
                        background.classList.add('show');
                        background.classList.remove('hide');
                    }

                    if (hours === 23 && minutes === 59 && seconds === 56) {
                        background.classList.add('hide');
                        background.classList.remove('show');
                    }

                }, 1000)
                

                var userProfile = {
                    cityName: cityName,
                    song: app.currentSongIndex,
                };
                localStorage.set(userProfile);
            })
            .catch(function (error) {
                
                overlay.classList.remove('hide');
                popNotFound.classList.remove('hide');
                app.getCurrentCityTime(currentCityTimeZone);
            })

    },

    start() {
        if (localStorage.get() !== null) {
            app.getApiData(localStorage.get().cityName, '7f19ba76e4d8fac0eb3c946d922a2807');
        }

        if (localStorage.get().song) {
            app.currentSongIndex = localStorage.get().song;
            app.loadSongToApp(app.currentSongIndex);
        } else {
            app.loadSongToApp(0);
        }
        this.eventHandler();
    }
}

app.start();