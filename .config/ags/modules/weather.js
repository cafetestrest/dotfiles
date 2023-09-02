const { App, Service } = ags;
const { execAsync } = ags.Utils;
const { Box, Button, Label, Stack, Icon } = ags.Widget;

class WeatherService extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._temperatureWeather = null;
        this._tooltip = null;
    }

    get weatherData() {
        execAsync(['bash', '-c', "~/.config/scripts/openweathermap.sh ags"]).catch(print);
    }

    get temperatureWeather() { return this._temperatureWeather; }
    setTemperatureWeather(temp) {
        this._temperatureWeather = temp;
        this.emit('changed');
    }

    get tooltip() { return this._tooltip; }
    setTooltip(text) { this._tooltip = text }
}

class Weather {
    static { Service.export(this, 'Weather'); }
    static instance = new WeatherService;

    static get weatherData() { return Weather.instance.weatherData; }

    static get temperatureWeather() { return Weather.instance.temperatureWeather; }
    static setTemperatureWeather(temp) { 
        Weather.instance.setTemperatureWeather(temp);
    }

    static get tooltip() { return Weather.instance.tooltip; }
    static setTooltip(text) { Weather.instance.setTooltip(text); }
}

export const TemperatureWidget = ({
    disabled = null,
    enabled = PannelButton(),
    ...rest
} = {}) => Stack({
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

export const PannelButton = props => Button({
    ...props,
    className: 'weather panel-button',
    child: Temperature(),
    onClicked: () => App.toggleWindow('weather'),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'weather' && visible);
    }]],
});

export const Temperature = props => Label({
    ...props,
    connections: [[Weather, label => {
        if (Weather.temperatureWeather && label.label !== Weather.temperatureWeather) {
            label.label = Weather.temperatureWeather.toString()
        }
    }]],
});

export const WeatherInfo = (weatherData) => Box({
    className: 'weather-info',
    vertical: true,
    children: [
        Label({ label: weatherData.date.substring(0, 3).toUpperCase(), }),
        Label({ label: weatherData.hour + 'h', }),
        Label({ label: weatherData.icon, className: 'weather-icon', }),
        Label({ label: weatherData.temperature, className: 'weather-temperature' }),
        Label({ label: "☔ " + weatherData.rain, }),
        Label({ label: " " + weatherData.wind, }),
        // Label({ label: weatherData.humidity, }),
        Label({ label: '↑ ' + weatherData.maxTemp, }),
        Label({ label: '↓ ' + weatherData.minTemp, }),
    ],
    connections: [[Weather, box => {
        switch (weatherData.icon) {
            case "🌇": {//sunset
                box.setStyle(`
                    background: linear-gradient(to bottom, #ff6f61, #ffca58, #f0e68c);
                    color: #000000;
                `);
                break;
            }
            case "🌄": {//sunrise   
                box.setStyle(`
                    background: linear-gradient(to bottom, #ffcc00, #ff6f61, #ff5e62, #d55f74);
                    color: #000000;
                `);
                break;
            }
            case "🌤": {//few clouds
                box.setStyle(`
                    background: linear-gradient(to bottom, #80b3ff, #ffffff, #ffdb4d);
                `);
                break;
            }
            case "🌩": {//thunderstorm
                box.setStyle(`
                    background: linear-gradient(to bottom, #0c0e23, #1a1c38, #121320, #0c0e23);
                `);
                break;
            }
            case "🌑": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #2c3e50, #1a2533);
                `);
                break;
            }
            case "🌕": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #001f3f, #002f4f, #003f5f, #004f6f, #005f7f);
                `);
                break;
            }
            case "☀️": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #ffeb99, #ffe580, #ffd866, #ffcf4c, #ffc333);
                    color: #000000;
                `);
                break;
            }
            case "☁️": {//cloudy
                box.setStyle(`
                    background: linear-gradient(to bottom, #c4c4c4, #d1d1d1, #dedede, #ebebeb, #f8f8f8);
                    color: #000000;
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #1c2331, #212a38, #263141, #2b3749, #303d51);
                `);
                break;
            }
            case "": {//fog
                box.setStyle(`
                    background: linear-gradient(to bottom, #d8d8d8, #e2e2e2, #ececec, #f6f6f6, #ffffff);
                    color: #000000;
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #1c2331, #1c2331, #1c2331, #293547, #38475f);
                `);
                break;
            }
            case "⛈️": {//heavy rain
                box.setStyle(`
                    background: linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50, #34495e, #2c3e50);
                `);
                break;
            }
            case "󰙾": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                `);
                break;
            }
            case "🌦️": {//light rain
                box.setStyle(`
                    background: linear-gradient(to bottom, #547aad, #6692b8, #78a9c3, #8abfd0, #9cd7dd);
                    color: #000000;
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #0e1620, #121c2a, #162133, #18273c, #1c2c46);
                `);
                break;
            }
            case "⛅": {//partly cloudy
                box.setStyle(`
                    background: linear-gradient(to bottom, #a8c9f0, #c4dfea, #f0f0cc, #ffd700, #f0f0cc, #c4dfea, #a8c9f0);
                    color: #000000;
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #040d1c, #081427, #0c1a32, #101f3d, #142348);
                `);
                break;
            }
            case "🌧️": {//rain showers
                box.setStyle(`
                    background: linear-gradient(to bottom, #5e7d99, #6a8ba6, #7698b3, #87a5bf, #97b3cb, #a6c0d8, #b4cedf);
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                `);
                break;
            }
            case "🌨": {//snow
                box.setStyle(`
                    background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #f5fafd, #ffffff);
                    color: #000000;
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #0e1620, #162133, #1c263f, #232c4c, #293259);
                `);
                break;
            }
            case "🌨️": {//sleet
                box.setStyle(`
                    background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #ffffff, #f0f5f9, #e0f0f5, #d0e6ec);
                    color: #000000;
                `);
                break;
            }
            case "": {
                box.setStyle(`
                    background: linear-gradient(to bottom, #050818, #08142a, #0c1d3b, #101f47, #142556);
                `);
                break;
            }
        }
    }]],
});

export const Tooltip = () => Box({
    connections: [[Weather, box => {
        let tooltip = Weather.tooltip;

        if (tooltip) {
            box.get_children().forEach(ch => ch.destroy());

            let todayOnce = true;
            let tomorrowOnce = true;

            tooltip.forEach(w => {
                if (tomorrowOnce && 'Tomorrow' === w.justDayOfTheWeek) {
                    box.add(
                        Label({ className: 'weather-day', })
                    );

                    tomorrowOnce = false;
                }

                if (todayOnce && 'Today' === w.justDayOfTheWeek) {
                    box.add(
                        Label({ className: 'weather-day', })
                    );

                    todayOnce = false;
                }

                if ('Today' !== w.justDayOfTheWeek && 'Tomorrow' !== w.justDayOfTheWeek) {
                    box.add(
                        Label({ className: 'weather-day', })
                    );
                }

                box.add(
                    WeatherInfo(w)
                );
            });
        }
    }]],
});

export const ResetTimer = props => Label({
    ...props,
    connections: [[600000, label => {
        Weather.weatherData
    }]],
});

export const Forecast = () => Box({
    className: 'datemenu',
    vertical: true,
    children: [
        Box({
            className: 'tooltip',
            halign: 'center',
            children: [
                ResetTimer(),
                Tooltip(),
            ]
        })
    ]
});

export const PopupContent = () => Box({
    className: 'weather',
    vexpand: false,
    children: [
        Box({
            vertical: true,
            children: [
                Forecast({ className: 'datemenu', }),
                RefreshButton({ className: 'header panel-button', }),
            ]
        })
    ]
});

export const RefreshButton = props => Button({
    ...props,
    className: 'weather-refresh',
    child: Icon({
        icon: 'view-refresh-symbolic',
        halign: 'end',
    }),
    onClicked: () => {
        Weather.weatherData
    },
});
