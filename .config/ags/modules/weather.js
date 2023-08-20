const { App, Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

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

Widget.widgets['weather/temperature'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: 'enabled', widget: { type: 'weather/panel-button' } },
    ],
    connections: [[Weather, dynamic => dynamic.update(value => {
        if (!Weather.temperatureWeather)
            return;

        return value === 'enabled';
    })]],
});

Widget.widgets['weather/panel-button'] = props => Widget({
    ...props,
    type: 'button',
    className: 'weather panel-button',
    onClick: () => App.toggleWindow('weather'),
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'weather' && visible);
    }]],
    child: {
        type: 'box',
        children: [
            { type: 'weather/label',}
        ],
    },
});

Widget.widgets['weather/label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Weather, label => {
        if (Weather.temperatureWeather && label.label !== Weather.temperatureWeather) {
            label.label = Weather.temperatureWeather.toString()
        }
    }]],
});

const _weatherinfo = (weatherData) => ({
    type: 'box',
    className: 'weather-info',
    orientation: 'vertical',
    children: [
        // { type: 'label', label: weatherData.justDayOfTheWeek },
        { type: 'label', label: weatherData.dayOfWeek.substring(0, 3).toUpperCase() },
        { type: 'label', label: weatherData.hourFromDate },
        { type: 'label', label: weatherData.icon, className: 'weather-icon' },
        { type: 'label', label: weatherData.temperature, className: 'weather-temperature' },
        // { type: 'label', label: weatherData.LongWeather },
        { type: 'label', label: " " + weatherData.Wind },
        // { type: 'label', label: weatherData.Humidity },
        { type: 'label', label: " " + weatherData.Cloud },
        { type: 'label', label: weatherData.minTemp },
        { type: 'label', label: weatherData.maxTemp },
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
    }]]
});

Widget.widgets['tooltip'] = ({
    weatherinfo = _weatherinfo,
    ...props
}) => Widget({
    ...props,
    type: 'box',
    orientation: 'horizontal',
    connections: [[Weather, box => {
        tooltip = Weather.tooltip;

        if (tooltip) {
            box.get_children().forEach(ch => ch.destroy());

            let todayOnce = true;
            let tomorrowOnce = true;

            tooltip.forEach(w => {
                if (tomorrowOnce && 'Tomorrow' === w.justDayOfTheWeek) {
                    box.add(Widget({
                        type: 'label',
                        className: 'weather-day',
                    }));

                    tomorrowOnce = false;
                }

                if (todayOnce && 'Today' === w.justDayOfTheWeek) {
                    box.add(Widget({
                        type: 'label',
                        className: 'weather-day',
                    }));

                    todayOnce = false;
                }

                if ('Today' !== w.justDayOfTheWeek && 'Tomorrow' !== w.justDayOfTheWeek) {
                    box.add(Widget({
                        type: 'label',
                        className: 'weather-day',
                    }));
                }

                box.add(Widget({
                    type: 'box',
                    children: [
                        weatherinfo(w)
                    ]
                }));
            });
        }
    }]],
});

Widget.widgets['reset-timer'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[600000, label => {
        Weather.weatherData
    }]],
});

Widget.widgets['weather/forecast'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    className: 'datemenu',
    children: [
        {
            type: 'box',
            className: 'tooltip',
            halign: 'center',
            children: [
                { type: 'reset-timer' },
                { type: 'tooltip' },
            ],
        }
    ],
});

Widget.widgets['weather/popup-content'] = () => Widget({
    type: 'box',
    className: 'weather',
    vexpand: false,
    children: [
        {
            type: 'box',
            orientation: 'vertical',
            children: [
                {
                    type: 'weather/forecast',
                    className: 'datemenu',
                },
                {
                    type: 'weather/refresh-button',
                    className: 'header panel-button',
                },
            ],
        },
    ],
});

Widget.widgets['weather/refresh-button'] = props => Widget({
    ...props,
    type: 'button',
    className: 'weather-refresh',
    child: {
        type: 'icon',
        icon: 'view-refresh-symbolic',
        halign: 'end',
    },
    onClick: () => {
        Weather.weatherData
    },
});
