const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

// class UsageService extends Service {
//     static { Service.register(this); }

//     constructor() {
//         super();
//         this._cpuUsage = null;
//         this._memoryUsage = null;
//     }

//     get cpuUsage() { return this._cpuUsage; }
//     setCpuUsage(percent) {
//         if (percent) {
//             this._cpuUsage = percent
//         }
//     }

//     get memoryUsage() { return this._memoryUsage; }
//     setMemoryUsage(gb) {
//         if (gb) {
//             this._memoryUsage = gb
//         }
//     }

// }

// class Usage {
//     static { Service.export(this, 'Usage'); }
//     static instance = new UsageService;

//     static get cpuUsage() { return Usage.instance.cpuUsage; }
//     static setCpuUsage(percent) { Usage.instance.setCpuUsage(percent); }

//     static get memoryUsage() { return Usage.instance.memoryUsage; }
//     static setMemoryUsage(gb) { Usage.instance.setMemoryUsage(gb); }
// }

Widget.widgets['usagecpu'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[15000, label => execAsync(['bash', '-c', "top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}'"], value => {
        label.label = value.trim();
    })]],
});

Widget.widgets['usagecpu-indicator'] = props => Widget({
    ...props,
    type: 'font-icon',
    icon: '︁',
});

Widget.widgets['usagememory'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[15000, label => execAsync(['bash', '-c', "free --giga -h | grep 'Mem' | awk '{print $3}'"], percentage => {
        label.label = percentage.trim();
    })]],
});

Widget.widgets['usagememory-indicator'] = props => Widget({
    ...props,
    type: 'font-icon',
    icon: '︁',
});

Widget.widgets['usagestorage'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[600000, label => execAsync(['bash', '-c', "df -h / | awk 'NR==2 {print $5}'"], percentage => {
        label.label = percentage.trim();
    })]],
});

Widget.widgets['usagestorage-indicator'] = props => Widget({
    ...props,
    type: 'icon',
    icon: 'drive-harddisk-solidstate-symbolic',
});