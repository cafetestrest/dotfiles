const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class IdleService extends Service {
    static { Service.register(this); }

    checkMode() {
        execAsync(['bash', '-c', "~/.config/hypr/scripts/swayidle.sh toggle"])
        this._mode = !this._mode;
        this.emit('changed');
    }

    constructor() {
        super();
        this._mode = exec('pidof swayidle') ? true : false;
    }

    get mode() { return this._mode; }
}

class Idle {
    static { Service.export(this, 'Idle'); }
    static instance = new IdleService;
    static checkMode() { Idle.instance.checkMode(); }
    static get mode() { return Idle.instance.mode; }
}

Widget.widgets['idle/toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Idle.checkMode,
    connections: [[Idle, button => {
        button.toggleClassName('on', Idle.mode === true || Idle.profile === false);
    }]],
});

Widget.widgets['idle/indicator'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: false, widget: { type: 'icon', icon: 'view-conceal-symbolic' } },
        { value: true, widget: { type: 'icon', icon: 'view-reveal-symbolic' } },
    ],
    connections: [[Idle, w => w.update(v => v === Idle.mode)]],
});
