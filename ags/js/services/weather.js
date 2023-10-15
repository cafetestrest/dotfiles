import { Service, Utils } from '../imports.js';

class Weather extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._temperatureWeather = null;
        this._tooltip = null;
    }

    get weatherData() {
        Utils.execAsync(['bash', '-c', "~/.config/scripts/openweathermap.sh ags"]).catch(print);
    }

    get temperatureWeather() {
        return this._temperatureWeather;
    }
    setTemperatureWeather(temp) {
        this._temperatureWeather = temp;
        this.emit('changed');
    }

    get tooltip() {
        return this._tooltip;
    }
    setTooltip(text) { this._tooltip = text }
}

export default new Weather();
