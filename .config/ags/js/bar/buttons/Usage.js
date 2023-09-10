const { execAsync } = ags.Utils;
const { Label, Box, Icon } = ags.Widget;
import FontIcon from '../../misc/FontIcon.js';

export const UsageCPU = () => Box({
    className: 'usage cpu panel-button',
    children: [
        FontIcon({
            icon: '︁',
        }),
        Label({
            connections: [[5000, label => {
                execAsync(['bash', '-c', "top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}'"])
                    .then(value => label.label = value.trim() + '%')
                    .catch(print);
            }]],
        })
    ]
});

export const UsageRAM = () => Box({
    className: 'usage ram panel-button',
    children: [
        FontIcon({
            icon: '︁',
        }),
        Label({
            connections: [[5000, label => {
                execAsync(['bash', '-c', "free --giga -h | grep 'Mem' | awk '{print $3}'"])
                    .then(value => label.label = value.trim())
                    .catch(print);
            }]],
        })
    ]
});

export const UsageDisk = () => Box({
    className: 'usage disk panel-button',
    children: [
        FontIcon({
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
