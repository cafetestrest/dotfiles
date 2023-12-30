import Weather from '../../services/weather.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

export const TemperatureIndicator = ({
    disabled = null,
    enabled = PannelButton(),
    ...rest
} = {}) => Widget.Stack({
    ...rest,
    items: [
        ['disabled', disabled],
        ['enabled', enabled],
    ],
    connections: [[Weather, stack => {
        if (Weather.temperatureWeather) {
            return stack.shown = 'enabled';
        }
        return stack.shown = 'disabled';
    }]],
});

export const PannelButton = props => Widget.Button({
    ...props,
    class_name: 'weather panel-button',
    child: Temperature(),
    on_clicked: () => App.toggleWindow('weather'),
    on_secondary_click: () => Weather.weatherData,
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'weather' && visible);
    }]],
});

export const Temperature = props => Widget.Label({
    ...props,
    connections: [[Weather, label => {
        if (Weather.temperatureWeather && label.label !== Weather.temperatureWeather) {
            label.label = Weather.temperatureWeather.toString()
        }
    }]],
});

function weatherBackgroundStyle(icon, box) {
    switch (icon) {
        case "🌇": {//sunset
            box.setCss(`
                background: linear-gradient(to bottom, #ff6f61, #ffca58, #f0e68c);
                color: #000000;
            `);
            break;
        }
        case "🌄": {//sunrise   
            box.setCss(`
                background: linear-gradient(to bottom, #ffcc00, #ff6f61, #ff5e62, #d55f74);
                color: #000000;
            `);
            break;
        }
        case "🌤": {//few clouds
            box.setCss(`
                background: linear-gradient(to bottom, #80b3ff, #ffffff, #ffdb4d);
                color: #000000;
            `);
            break;
        }
        case "🌩": {//thunderstorm
            box.setCss(`
                background: linear-gradient(to bottom, #0c0e23, #1a1c38, #121320, #0c0e23);
                color: #ffffff;
            `);
            break;
        }
        case "🌑": {
            box.setCss(`
                background: linear-gradient(to bottom, #2c3e50, #1a2533);
                color: #ffffff;
            `);
            break;
        }
        case "🌕": {
            box.setCss(`
                background: linear-gradient(to bottom, #001f3f, #002f4f, #003f5f, #004f6f, #005f7f);
                color: #ffffff;
            `);
            break;
        }
        case "☀️": {
            box.setCss(`
                background: linear-gradient(to bottom, #ffeb99, #ffe580, #ffd866, #ffcf4c, #ffc333);
                color: #000000;
            `);
            break;
        }
        case "☁":
        case "☁️": {//cloudy
            box.setCss(`
                background: linear-gradient(to bottom, #c4c4c4, #d1d1d1, #dedede, #ebebeb, #f8f8f8);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #1c2331, #212a38, #263141, #2b3749, #303d51);
                color: #ffffff;
            `);
            break;
        }
        case "": {//fog
            box.setCss(`
                background: linear-gradient(to bottom, #d8d8d8, #e2e2e2, #ececec, #f6f6f6, #ffffff);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #1c2331, #1c2331, #1c2331, #293547, #38475f);
                color: #ffffff;
            `);
            break;
        }
        case "⛈️": {//heavy rain
            box.setCss(`
                background: linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50, #34495e, #2c3e50);
                color: #000000;
            `);
            break;
        }
        case "󰙾": {
            box.setCss(`
                background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                color: #ffffff;
            `);
            break;
        }
        case "🌦️": {//light rain
            box.setCss(`
                background: linear-gradient(to bottom, #547aad, #6692b8, #78a9c3, #8abfd0, #9cd7dd);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #0e1620, #121c2a, #162133, #18273c, #1c2c46);
                color: #ffffff;
            `);
            break;
        }
        case "⛅": {//partly cloudy
            box.setCss(`
                background: linear-gradient(to bottom, #a8c9f0, #c4dfea, #f0f0cc, #ffd700, #f0f0cc, #c4dfea, #a8c9f0);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #040d1c, #081427, #0c1a32, #101f3d, #142348);
                color: #ffffff;
            `);
            break;
        }
        case "🌧️": {//rain showers
            box.setCss(`
                background: linear-gradient(to bottom, #5e7d99, #6a8ba6, #7698b3, #87a5bf, #97b3cb, #a6c0d8, #b4cedf);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                color: #ffffff;
            `);
            break;
        }
        case "🌨": {//snow
            box.setCss(`
                background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #f5fafd, #ffffff);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #0e1620, #162133, #1c263f, #232c4c, #293259);
                color: #ffffff;
            `);
            break;
        }
        case "🌨️": {//sleet
            box.setCss(`
                background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #ffffff, #f0f5f9, #e0f0f5, #d0e6ec);
                color: #000000;
            `);
            break;
        }
        case "": {
            box.setCss(`
                background: linear-gradient(to bottom, #050818, #08142a, #0c1d3b, #101f47, #142556);
                color: #ffffff;
            `);
            break;
        }
        default: {
            box.setCss(`
                background: red;
                color: blue;
            `);
            break;
        }
    }
}

export const WeatherInfo = (weatherData) => Widget.Box({
    class_name: 'weather-info',
    vertical: true,
    children: [
        Widget.Label({ label: weatherData.date.substring(0, 3).toUpperCase(), }),
        Widget.Label({ label: weatherData.hour + 'h', }),
        Widget.Label({ label: weatherData.icon, class_name: 'weather-icon', }),
        Widget.Label({ label: weatherData.temperature, class_name: 'weather-temperature' }),
        Widget.Box({ vexpand: true }),
        weatherData.rain !== '0 mm' ? Widget.Label({ label: "☔ " + weatherData.rain, }) : null,
        // Widget.Label({ label: " " + weatherData.wind, }),
        // Widget.Label({ label: weatherData.humidity, }),
        Widget.Label({ label: '↑ ' + weatherData.maxTemp, class_name: 'weather-max', }),
        Widget.Label({ label: '↓ ' + weatherData.minTemp, class_name: 'weather-min', }),
    ],
    connections: [[Weather, box => {
        weatherBackgroundStyle(weatherData.icon, box)
    }]],
});

function getMostCommon(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

function createForecastWidget(w, widget) {
    if (!widget) {
        widget = Widget.Box({
            class_name: 'qs-weather-box-forecast',
            hexpand: true,
        });
    }

    widget.add(
        WeatherBoxChild(w.hour, w.icon, w.temperature, w.rain, w.wind)
    );
}

export const WeatherBoxChild = (hour, icon, temperature, rain, wind) => Widget.Box({
    class_name: 'qs-weather-box-child',
    vertical: true,
    hexpand: true,
    children: [
        Widget.Label({ label: hour + 'h', class_name: 'weather-hour', }),
        Widget.Label({ label: icon, class_name: 'weather-icon', }),
        Widget.Label({ label: temperature, class_name: 'weather-temperature' }),
        Widget.Box({ vexpand: true }),
        rain !== '0 mm' ? Widget.Label({ label: rain, class_name: 'weather-rain', }) : null,
        Widget.Label({ label: "  " + Math.round(wind.replace(/kph$/, '')) + ' kph', class_name: 'weather-wind', }),
    ],
});

export const WeatherMainWidget = (widget, widgetIcon, widgetDate, rain, temperatureDataPerDay) => Widget.Box({
    class_name: 'qsweather-widget',
    vertical: true,
    hexpand: true,
    children: [
        Widget.Box({
            class_name: 'qs-weather-box-main',
            children: [
                Widget.Label({ label: widgetIcon, class_name: 'weather-icon', }),
                Widget.Box({ hexpand: true }),
                rain != 0 ? Widget.Label({ label: "☔ " + rain + 'mm', class_name: 'weather-rain', }): null,
                Widget.Label({ label: '↑ ' + temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].maxTemp + '  ', class_name: 'weather-max', }),
                Widget.Label({ label: '↓ ' + temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].minTemp + '  ', class_name: 'weather-min', }),
                Widget.Label({ label: widgetDate.substring(0, 3).toUpperCase(), class_name: 'weather-hour', }),
            ]
        }),
        widget,
    ],
    connections: [[Weather, box => {
        weatherBackgroundStyle(widgetIcon, box)
    }]]
});

export const Tooltip = (total) => Widget.Box({
    connections: [[Weather, box => {
        let tooltip = Weather.tooltip;

        if (tooltip) {
            box.get_children().forEach(ch => ch.destroy());

            let count = 0;
            let now = false;
            let widget = null;
            let prevDayName = null;
            let temperatureDataPerDay = {};
            let weatherStatusIconArray = [];

            let totalWeatherForecasts = total;
            let forecastWidgetsNumber = 0;

            tooltip.forEach(w => {
                if (w.date !== prevDayName) {
                    weatherStatusIconArray = [];
                    prevDayName = w.date;
                    forecastWidgetsNumber = 0;
                }

                // used to retrieve min/max temp per day
                const date = w.date.substring(0, 3).toUpperCase();
                const temperature = parseInt(w.temperature);

                const rain = w.rain.replace(/ mm$/, '');
                forecastWidgetsNumber = forecastWidgetsNumber + 1;

                // If the date is not already in the object, initialize it
                if (!temperatureDataPerDay[date]) {
                    temperatureDataPerDay[date] = {
                    minTemp: temperature,
                    maxTemp: temperature,
                    rain: rain,
                    widgetsNumber: forecastWidgetsNumber,
                    icons: []
                    };
                } else {
                    // Update min and max temperatures if necessary
                    temperatureDataPerDay[date].minTemp = Math.min(temperatureDataPerDay[date].minTemp, temperature);
                    temperatureDataPerDay[date].maxTemp = Math.max(temperatureDataPerDay[date].maxTemp, temperature);
                    temperatureDataPerDay[date].rain = Math.max(temperatureDataPerDay[date].rain, rain);
                    temperatureDataPerDay[date].icons = weatherStatusIconArray;
                    temperatureDataPerDay[date].widgetsNumber = forecastWidgetsNumber;
                }

                // add icon to the array in between somewhat sunny hours, used to later get most common icon for main widget days
                if (w.hour >= 7 && w.hour <= 19) {
                    weatherStatusIconArray.push(w.icon);
                }
            });

            // clear for next loop
            prevDayName = null;
            
            let widgetIcon = null;
            let widgetDate = null;

            let w = null;
            for (let i = 0; i < tooltip.length; i++) {
                w = tooltip[i];

                // console.log('loop ' + w.date + ' h ' + w.hour + ' i ' + w.icon )

                // used to limit forecast to specified amount
                if (totalWeatherForecasts >= 0) {
                    if (!widgetIcon) {
                        widgetIcon = w.icon;
                    }

                    if (!widgetDate) {
                        widgetDate = w.date;
                    }

                    const rain = temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].rain;

                    if (totalWeatherForecasts === 0) {
                        widget = null;

                        box.add(
                            WeatherMainWidget(widget, widgetIcon, widgetDate, rain, temperatureDataPerDay)
                        );
                        break;
                    }

                    // createForecastWidget(w, widget);
                    if (!widget) {
                        widget = Widget.Box({
                            class_name: 'qs-weather-box-forecast',
                            hexpand: true,
                        });
                    }

                    widget.add(
                        WeatherBoxChild(w.hour, w.icon, w.temperature, w.rain, w.wind)
                    );

                    totalWeatherForecasts = totalWeatherForecasts - 1;
                    continue;
                }

                // if provided date differs to previous day name, by default prevDayName is null
                if ( w.date !== prevDayName) {
                    now = true; //creates main widget - WeatherMainWidget

                    widget = Widget.Box({
                        class_name: 'qs-weather-box-forecast',
                        hexpand: true,
                    });

                    // adds spacing
                    if (count > 0 && now) {
                        box.add(
                            Widget.Box({
                                children: [
                                    Widget.Label({ label: ' ', class_name: 'weather-spacing' }),
                                ],
                            }),
                        );
                    }
                }

                prevDayName = w.date;

                // this is weather forecast per hour
                createForecastWidget(w, widget);

                if (temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].widgetsNumber === 1) {
                    box.add(WeatherInfo(w));
                    widget = null;
                    count = count + 1;
                    continue;
                }

                // this one creates main one
                if (now) {
                    now = false;

                    const rain = temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].rain;
                    let icon = getMostCommon(temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].icons);
                    widgetDate = w.date;

                    if (!icon) {
                        icon = w.icon;
                    }

                    widgetIcon = icon;

                    box.add(
                        WeatherMainWidget(widget, widgetIcon, widgetDate, rain, temperatureDataPerDay)
                    );
                }

                count = count + 1;
            };
        }
    }]],
});

export const ResetTimer = props => Widget.Label({
    ...props,
    connections: [[600000, label => {
        Weather.weatherData
    }]],
});

export const Forecast = () => Widget.Box({
    class_name: 'datemenu',
    vertical: true,
    children: [
        Widget.Box({
            class_name: 'tooltip',
            children: [
                ResetTimer(),
                Tooltip(),
            ]
        })
    ]
});

export const PopupContent = () => Widget.Box({
    class_name: 'weather',
    vexpand: false,
    children: [
        Widget.Box({
            vertical: true,
            children: [
                Forecast(),
                // RefreshButton({ class_name: 'header panel-button', }),
            ]
        })
    ]
});

export const RefreshButton = props => Widget.Button({
    ...props,
    class_name: 'weather-refresh',
    child: Widget.Icon({
        icon: 'view-refresh-symbolic',
        hpack: 'end',
    }),
    on_clicked: () => {
        Weather.weatherData
    },
});

// export const QSWidget = () => Widget.Box({
//     connections: [[Weather, box => {
//         let tooltip = Weather.tooltip;

//         let count = 6;

//         if (tooltip) {
//             box.get_children().forEach(ch => ch.destroy());

//             let now = true;
//             let widget = null;

//             tooltip.forEach(w => {
//                 if (count > 0 && now === false) {
//                     widget.add(
//                         Widget.Box({
//                             class_name: 'qs-weather-box-child',
//                             vertical: true,
//                             hexpand: true,
//                             children: [
//                                 Widget.Label({ label: w.hour + 'h', class_name: 'weather-hour', }),
//                                 Widget.Label({ label: w.icon, class_name: 'weather-icon', }),
//                                 Widget.Label({ label: w.temperature, class_name: 'weather-temperature' }),
//                                 Widget.Label({ label: w.rain, class_name: 'weather-rain', }),
//                             ],
//                         }),
//                     );
//                 }

//                 if (count > 0 && now) {
//                     now = false;

//                     widget = Widget.Box({
//                         class_name: 'qs-weather-box-forecast',
//                         hexpand: true,
//                     });

//                     box.add(
//                         Widget.Box({
//                             class_name: 'qsweather-widget',
//                             vertical: true,
//                             hexpand: true,
//                             children: [
//                                 Widget.Box({
//                                     class_name: 'qs-weather-box-main',
//                                     children: [
//                                         Widget.Label({ label: w.temperature, class_name: 'weather-temperature' }),
//                                         Widget.Label({ label: w.icon, class_name: 'weather-icon', }),
//                                         Widget.Box({ hexpand: true }),
//                                         Widget.Label({ label: "☔ " + w.rain, class_name: 'weather-rain', }),
//                                         Widget.Label({ label: w.hour + 'h', class_name: 'weather-hour', }),
//                                     ]
//                                 }),
//                                 widget
//                             ],
//                             connections: [[Weather, box => {
//                                 weatherBackgroundStyle(w.icon, box)
//                             }]]
//                         })
//                     );
//                 }

//                 count = count - 1;
//             });
//         }
//     }]],
// });
