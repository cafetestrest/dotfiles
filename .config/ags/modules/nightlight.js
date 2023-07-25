const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class NightlightService extends Service {
    static { Service.register(this); }

    checkMode() {
        console.log("1st-mode: " + this._mode)

        // this._mode = exec('pidof wlsunset') ? false : true;

        // if (false === this._mode) {
        //     execAsync(['bash', '-c', "killall wlsunset"])
        // } else {
        //     execAsync(['bash', '-c', "wlsunset -t 3500 -S 06:00 -s 06:01"])
        // }

        if (false === this._mode) {
            execAsync(['bash', '-c', "wlsunset -t 3500 -S 06:00 -s 06:01"])
            this._mode = 'auto';
        } else if (true === this._mode) {
            execAsync(['bash', '-c', "killall wlsunset"])
            this._mode = false;
        } else {
            execAsync(['bash', '-c', "wlsunset -t 3500 -S 07:00 -s 19:00"])
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
