const { Service } = ags;
const { exec, execAsync } = ags.Utils;
const { Button, Icon, Stack } = ags.Widget;
import { FontIcon } from './misc.js';

class NightlightService extends Service {
    static { Service.register(this); }

    checkMode() {
        if ('off' === this._mode) {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh enable"]).catch(print);
            this._mode = 'auto';
        } else if ('on' === this._mode) {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh disable"]).catch(print);
            this._mode = 'off';
        } else {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh automatic"]).catch(print);
            this._mode = 'on';
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
    connections: [[Nightlight, button => {
        button.toggleClassName('on', Nightlight.mode == 'on' || Nightlight.mode == 'auto');
    }]],
});

export const NightlightIndicator = ({
    on = FontIcon({ icon: '' }),
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
