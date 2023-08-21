const { Service } = ags;
const { exec, execAsync } = ags.Utils;
const { Button, Icon, Stack, Label } = ags.Widget;

class IdleService extends Service {
    static { Service.register(this); }

    checkMode() {
        execAsync(['bash', '-c', "~/.config/hypr/scripts/swayidle.sh toggle"]).catch(print);

        if (this._mode == 'on') {
            this._mode = 'off';
        } else {
            this._mode = 'on';
        }

        this.emit('changed');
    }

    constructor() {
        super();
        this._mode = exec('pidof swayidle') ? 'on' : 'off';
    }

    get mode() { return this._mode; }
}

class Idle {
    static { Service.export(this, 'Idle'); }
    static instance = new IdleService;
    static checkMode() { Idle.instance.checkMode(); }
    static get mode() { return Idle.instance.mode; }
}

export const IdleToggle = props => Button({
    ...props,
    onClicked: Idle.checkMode,
    connections: [[Idle, button => {
        button.toggleClassName('on', Idle.mode == 'on');
    }]],
});

export const IdleIndicator = ({
    off = Icon('view-conceal-symbolic'),
    on = Icon('view-reveal-symbolic'),
    ...rest
} = {}) => Stack({
    ...rest,
    items: [
        ['on', on],
        ['off', off],
    ],
    connections: [[Idle, stack => stack.shown = Idle.mode]],
});

export const IdleStatus = props => Label({
    ...props,
    connections: [[Idle, label => label.label = (Idle.mode ? 'On' : 'Off')]],
});
