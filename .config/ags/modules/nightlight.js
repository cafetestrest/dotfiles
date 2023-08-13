const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class NightlightService extends Service {
    static { Service.register(this); }

    checkMode() {
        if (false === this._mode) {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh enable"]).catch(print);
            this._mode = 'auto';
        } else if (true === this._mode) {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh disable"]).catch(print);
            this._mode = false;
        } else {
            execAsync(['bash', '-c', "~/.config/waybar/scripts/nightlight.sh automatic"]).catch(print);
            this._mode = true;
        }

        this.emit('changed');
    }

    constructor() {
        super();

        this._mode = exec('pidof wlsunset') ? 'auto' : false;
    }

    get mode() { return this._mode; }
}

class Nightlight {
    static { Service.export(this, 'Nightlight'); }
    static instance = new NightlightService;
    static checkMode() { Nightlight.instance.checkMode(); }
    static get mode() { return Nightlight.instance.mode; }
}

Widget.widgets['nightlight/mode-toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Nightlight.checkMode,
    connections: [[Nightlight, button => {
        button.toggleClassName('on', Nightlight.mode === true || Nightlight.profile === false);
    }]],
});

Widget.widgets['nightlight/mode-indicator'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        // { value: true, widget: { type: 'icon', icon: 'daytime-sunset-symbolic' } },
        { value: true, widget: { type: 'font-icon', icon: '' } },
        { value: false, widget: { type: 'icon', icon: 'night-light-disabled-symbolic' } },
        { value: 'auto', widget: { type: 'icon', icon: 'night-light-symbolic' } },
        
    ],
    connections: [[Nightlight, w => w.update(v => v === Nightlight.mode)]],
});

Widget.widgets['nightlight/label'] = props => Widget({
    ...props,
    type: 'label',
    label: 'Night Light',
});

Widget.widgets['nightlight/status-label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Nightlight, label => {
        let mode = Nightlight.mode;

        if (mode === 'auto') {
            label.label = 'Auto';
        } else if (mode) {
            label.label = 'On';
        } else {
            label.label = 'Off';
        }
    }]],
});
