const { execAsync } = ags.Utils;
const { Label, Box, Icon } = ags.Widget;
import FontIcon from '../../misc/FontIcon.js';
import * as vars from '../../variables.js';

const UsageLabel = (type, title, unit) => Label({
    className: `label ${type}`,
    connections: [[vars[type], label => {
        label.label = `${title}${Math.floor(vars[type].value * 100)}${unit}`;
    }]],
});

export const UsageCPU = () => Box({
    className: 'cpu usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '︁',
        }),
        UsageLabel('cpu', '', '%'),
    ]
});

export const UsageRAM = () => Box({
    className: 'ram usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '︁',
        }),
        Label({
            connections: [[5000, label => {
                execAsync(['bash', '-c', "free --giga -h | grep 'Mem' | awk '{print $3}'"])
                    .then(value => label.label = value.trim())
                    .catch(print);
            }]],
        }),
    ]
});

export const UsageDisk = () => Box({
    className: 'disk usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '',
        }),
        Label({
            connections: [[600000, label => {
                execAsync(['bash', '-c', "df -h / | awk 'NR==2 {print $5}'"])
                    .then(value => label.label = value.trim())
                    .catch(print);
            }]],
        })
    ]
});
