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
        execAsync(['bash', '-c', "~/.config/waybar/scripts/weather.sh -a"]).catch(print);
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
    enabled = PannelButton(),
    ...rest
} = {}) => Stack({
    ...rest,
    items: [
        ['enabled', enabled],
    ],
    connections: [[Weather, stack => stack.shown = 'enabled']],
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
        Label({ label: weatherData.dayOfWeek.substring(0, 3).toUpperCase(), }),
        Label({ label: weatherData.hourFromDate, }),
        Label({ label: weatherData.icon, className: 'weather-icon', }),
        Label({ label: weatherData.temperature, className: 'weather-temperature' }),
        // Label({ label: weatherData.LongWeather, }),
        Label({ label: " " + weatherData.Wind, }),
        // Label({ label: weatherData.Humidity, }),
        Label({ label: " " + weatherData.Cloud, }),
        Label({ label: weatherData.maxTemp, }),
        Label({ label: weatherData.minTemp, }),
    ],
    connections: [[Weather, box => {
        switch (weatherData.icon) {
            case "🌑":
                box.setStyle(`
                    background-color: gray;
                `);
            case "🌕":
                box.setStyle(`
                    background-color: gray;
                `);
            case "":
                box.setStyle(`
                    background-color: gray;
                `);
            case "":
                box.setStyle(`
                    background-color: #5B687B;
                `);
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
