const { execAsync } = ags.Utils;
const { Label, Box, Icon } = ags.Widget;
import FontIcon from '../../misc/FontIcon.js';
import * as vars from '../../variables.js';

const UsagePercentageLabel = (type, title, unit) => Label({
    className: `label ${type}`,
    connections: [[vars[type], label => {
        label.label = `${title}${Math.floor(vars[type].value * 100)}${unit}`;
    }]],
});

const UsageLabel = (type, title, unit) => Label({
    className: `label ${type}`,
    connections: [[vars[type], label => {
        label.label = `${title}${vars[type].value}${unit}`;
    }]],
});

export const UsageCPU = () => Box({
    className: 'cpu usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '︁',
        }),
        UsagePercentageLabel('cpu', '', '%'),
    ]
});

export const UsageRAM = () => Box({
    className: 'ram usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '︁',
        }),
        UsageLabel('ramGB', '', ''),
    ]
});

export const UsageDisk = () => Box({
    className: 'disk usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '',
        }),
        UsagePercentageLabel('disk', '', '%'),
    ]
});
