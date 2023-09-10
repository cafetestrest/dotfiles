const { Service } = ags;
const { exec, execAsync } = ags.Utils;

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

export default class Weather {
    static { Service.Weather = this; }
    static instance = new WeatherService();

    static get weatherData() { return Weather.instance.weatherData; }

    static get temperatureWeather() { return Weather.instance.temperatureWeather; }
    static setTemperatureWeather(temp) { 
        Weather.instance.setTemperatureWeather(temp);
    }

    static get tooltip() { return Weather.instance.tooltip; }
    static setTooltip(text) { Weather.instance.setTooltip(text); }
}
