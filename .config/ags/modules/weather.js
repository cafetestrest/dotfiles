const { App, Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class WeatherService extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._temperatureWeather = null;
        this._iconWeather = null;
        this._tooltip = null;
    }

    get iconWeather() { return this._iconWeather; }
    setIconWeather(icon) {
        if (icon) {
            this._iconWeather = icon
        }
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

    static get iconWeather() { return Weather.instance.iconWeather; }
    static setIconWeather(icon) { Weather.instance.setIconWeather(icon); }

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

Widget.widgets['tooltip'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Weather, label => {

        tooltip = Weather.tooltip;

        if (!tooltip) {
            temp = Weather.temperatureWeather;

            if (temp) {
                tooltip = Weather.temperatureWeather.toString();
            }
        }

        label.label = tooltip;
    }]],
});

Widget.widgets['reset-timer'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[600000, label => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/weather.sh -a"])
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
            ],
        },
    ],
});

// Widget.widgets['weather/icon-indicator'] = props => Widget({
//     ...props,
//     type: 'icon',
//     icon: 'weather-clear-symbolic',
//     // icon: (() => {
//     //     return this._iconWeather;
//     // })(),
//     connections: [[5000, icon => {
//         // execAsync(['bash', '-c', "~/.config/waybar/scripts/usagememory.sh ags"])

//         // "☀️") icon="☾" ;; weather-clear-night-symbolic
//         // "🌥") icon="" ;; weather-few-clouds-night-symbolic
//         // 01*) get_weather_icon "☀️";;weather-clear-symbolic 
//         // 02*) get_weather_icon "🌤";;weather-few-clouds-symbolic
//         // 03*) get_weather_icon "🌥";;weather-few-clouds-symbolic 
//         // 04*) get_weather_icon "☁";;weather-overcast-symbolic
//         // 09*) get_weather_icon "🌧";;weather-showers-symbolic
//         // 10*) get_weather_icon "🌦";;weather-showers-scattered-symbolic
//         // 11*) get_weather_icon "🌩";;weather-storm-symbolic
//         // 13*) get_weather_icon "🌨";;weather-snow-symbolic
//         // 50*) get_weather_icon "🌫";;weather-fog-symbolic

//         console.log("iconWeather " + Weather.iconWeather)
//         switch (Weather.iconWeather) {
//             case '☾': {
//                 iconName = 'weather-clear-night-symbolic';
//                 break;
//             }
//             case '': {
//                 iconName = 'weather-few-clouds-night-symbolic';
//                 break;
//             }
//             case '☀️': {
//                 // this
//                 iconName = 'weather-clear-symbolic';
//                 break;
//             }
//             case '🌤': {
//                 // this
//                 iconName = 'weather-few-clouds-symbolic';
//                 break;
//             }
//             case '🌥': {
//                 iconName = 'weather-few-clouds-symbolic';
//                 break;
//             }
//             case '☁': {
//                 iconName = 'weather-overcast-symbolic';
//                 break;
//             }
//             case '🌧': {
//                 iconName = 'weather-showers-symbolic';
//                 break;
//             }
//             case '🌦': {
//                 iconName = 'weather-showers-scattered-symbolic';
//                 break;
//             }
//             case '🌩': {
//                 iconName = 'weather-storm-symbolic';
//                 break;
//             }
//             case '🌨': {
//                 iconName = 'weather-snow-symbolic';
//                 break;
//             }
//             case '🌫': {
//                 iconName = 'weather-fog-symbolic';
//                 break;
//             }
//             default: {
//                 iconName = 'weather-severe-alert-symbolic';
//                 break;
//             }
//         }

//         icon.icon_name = iconName;
//     }
//     ]],
// });