const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class UsageService extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._cpuUsage = null;
        this._memoryUsage = null;
    }

    get cpuUsage() { return this._cpuUsage; }
    setCpuUsage(percent) {
        if (percent) {
            this._cpuUsage = percent
        }
    }

    get memoryUsage() { return this._memoryUsage; }
    setMemoryUsage(gb) {
        if (gb) {
            this._memoryUsage = gb
        }
    }

}

class Usage {
    static { Service.export(this, 'Usage'); }
    static instance = new UsageService;

    static get cpuUsage() { return Usage.instance.cpuUsage; }
    static setCpuUsage(percent) { Usage.instance.setCpuUsage(percent); }

    static get memoryUsage() { return Usage.instance.memoryUsage; }
    static setMemoryUsage(gb) { Usage.instance.setMemoryUsage(gb); }
}

Widget.widgets['usagecpu'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[30000, label => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/usagecpu.sh ags"])

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

Widget.widgets['usagememory'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[30000, label => {
        execAsync(['bash', '-c', "~/.config/waybar/scripts/usagememory.sh ags"])

        if (Usage.memoryUsage) {
            label.label = Usage.memoryUsage
        } else {
            label.label = null
        }
    }
    ]],
});

Widget.widgets['usagememory-indicator'] = props => Widget({
    ...props,
    type: 'font-icon',
    icon: '︁',
});
