const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class UsageService extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._cpuUsage = null;
    }

    setCpuUsage(percent) {
        if (percent) {
            this._cpuUsage = percent
        }
    }

    get cpuUsage() { return this._cpuUsage; }
}

class Usage {
    static { Service.export(this, 'Usage'); }
    static instance = new UsageService;

    static get cpuUsage() { return Usage.instance.cpuUsage; }
    static setCpuUsage(percent) { Usage.instance.setCpuUsage(percent); }

}

Widget.widgets['usagecpu'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[30000, label => {
        execAsync(['bash', '-c', "~/.config/waybar/111.sh ags"])

        if (Usage.cpuUsage) {
            label.label = Usage.cpuUsage
        } else {
            label.label = null
        }
    }
    ]],
});

Widget.widgets['usagecpu-indicator'] = props => Widget({
    ...props,
    type: 'font-icon',
    icon: '︁',
});
