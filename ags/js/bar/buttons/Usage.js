import FontIcon from '../../misc/FontIcon.js';
import * as vars from '../../variables.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const UsagePercentageLabel = (type, title, unit) => Widget.Label({
    className: `label ${type}`,
    connections: [[vars[type], label => {
        const percentage = Math.floor(vars[type].value * 100);

        label.label = `${title}${percentage}${unit}`;
    }]],
});

const UsageLabel = (type, title, unit) => Widget.Label({
    className: `label ${type}`,
    connections: [[vars[type], label => {
        label.label = `${title}${vars[type].value}${unit}`;
    }]],
});

export const UsageCPU = () => Widget.Box({
    className: 'cpu usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '︁',
        }),
        UsagePercentageLabel('cpu', '', '%'),
    ]
});

export const UsageRAM = () => Widget.Box({
    className: 'ram usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '︁',
        }),
        UsageLabel('ramGB', '', ''),
    ]
});

export const UsageDisk = () => Widget.Box({
    className: 'disk usage panel-button',
    children: [
        FontIcon({
            className: 'icon',
            icon: '',
        }),
        UsagePercentageLabel('disk', '', '%'),
    ]
});
