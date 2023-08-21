const { Service } = ags;
const { exec, execAsync } = ags.Utils;
const { Button, Icon, Stack } = ags.Widget;

class NightlightService extends Service {
    static { Service.register(this); }

    checkMode() {
        if (this._mode === "auto") {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh enable"]).catch(print);
            this._mode = "on";
        } else if (this._mode === "on") {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh disable"]).catch(print);
            this._mode = "off";
        } else {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh automatic"]).catch(print);
            this._mode = "auto";
        }

        this.emit('changed');
    }

    constructor() {
        super();

        this._mode = exec('pidof wlsunset') ? 'auto' : 'off';
    }

    get mode() { return this._mode; }
}

class Nightlight {
    static { Service.export(this, 'Nightlight'); }
    static instance = new NightlightService;
    static checkMode() { Nightlight.instance.checkMode(); }
    static get mode() { return Nightlight.instance.mode; }
}

export const NightlightToggle = props => Button({
    ...props,
    onClicked: Nightlight.checkMode,
});

export const NightlightIndicator = ({
    on = Icon( 'weather-clear-symbolic' ),
    off = Icon('night-light-disabled-symbolic'),
    auto = Icon('night-light-symbolic'),
    ...rest
} = {}) => Stack({
    ...rest,
    items: [
        ['on', on],
        ['off', off],
        ['auto', auto],
    ],
    connections: [[Nightlight, stack => stack.shown = Nightlight.mode]],
});
