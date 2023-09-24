import icons from '../icons.js';
import Clock from '../misc/Clock.js';
import * as vars from '../variables.js';
const { Box, Label, Widget, CircularProgress, Icon } = ags.Widget;
import FontIcon from '../misc/FontIcon.js';

export const SysProgress = (type, title, unit) => Box({
    className: `circular-progress-box ${type}`,
    hexpand: true,
    connections: [[vars[type], box => {
        box.tooltipText = `${title}: ${Math.floor(vars[type].value * 100)}${unit}`;
    }]],
    child: CircularProgress({
        hexpand: true,
        className: `circular-progress ${type}`,
        binds: [['value', vars[type]]],
        child: type === 'ram' ? FontIcon({ icon: '︁' })
            : type === 'disk' ? FontIcon({ icon: '' })
            : type === 'cpu' ? FontIcon({ icon: '︁' })
            : Icon(icons.system[type]),
        startAt: 0.75,
    }),
});

export default () => Box({
    vertical: true,
    className: 'datemenu',
    children: [
        Clock({ format: '%H:%M' }),
        // Label({
        //     connections: [[vars.uptime, label => {
        //         label.label = `uptime: ${vars.uptime.value}`;
        //     }]],
        // }),
        Box({
            className: 'calendar',
            children: [
                Widget({
                    type: imports.gi.Gtk.Calendar,
                    hexpand: true,
                    halign: 'center',
                }),
            ],
        }),
        // Box({
        //     className: 'system-info',
        //     children: [
        //         SysProgress('cpu', 'Cpu', '%'),
        //         SysProgress('ram', 'Ram', '%'),
        //         SysProgress('disk', 'Disk', '%'),
        //         // SysProgress('temp', 'Temperature', '°'),
        //     ],
        // }),
    ],
});
