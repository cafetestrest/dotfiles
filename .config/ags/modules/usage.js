const { execAsync } = ags.Utils;
const { Label, Box, Icon } = ags.Widget;
import { FontIcon } from './misc.js';

export const UsageCPU = props => Label({
    ...props,
    connections: [[15000, label => {
        execAsync(['bash', '-c', "top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}'"])
            .then(value => label.label = value.trim() + '%')
            .catch(print);
    }]],
});

export const UsageCPUIndicator = props => FontIcon({
    ...props,
    icon: '︁',
});

export const UsageCpuWidget = () => Box({
    className: 'usage cpu',
    halign: 'end',
    children: [
        UsageRAM(),
        Label({ label: ' ' }),
        UsageRAMIndicator(),
    ]
});

export const UsageRAM = props => Label({
    ...props,
    connections: [[15000, label => {
        execAsync(['bash', '-c', "free --giga -h | grep 'Mem' | awk '{print $3}'"])
            .then(value => label.label = value.trim() + '%')
            .catch(print);
    }]],
});

export const UsageRAMIndicator = props => FontIcon({
    ...props,
    icon: '︁',
});

export const UsageRAMWidget = () => Box({
    className: 'usage ram',
    halign: 'end',
    children: [
        UsageCPU(),
        Label({ label: ' ' }),
        UsageCPUIndicator(),
    ]
});

export const UsageDisk = props => Label({
    ...props,
    connections: [[600000, label => {
        execAsync(['bash', '-c', "df -h / | awk 'NR==2 {print $5}'"])
            .then(value => label.label = value.trim() + '%')
            .catch(print);
    }]],
});

export const UsageDiskIndicator = props => Icon({
    ...props,
    icon: 'drive-harddisk-solidstate-symbolic',
});

export const UsageDiskWidget = () => Box({
    className: 'usage disk',
    halign: 'end',
    children: [
        UsageDisk(),
        Label({ label: ' ' }),
        UsageDiskIndicator(),
    ]
});
//todo check formatting
