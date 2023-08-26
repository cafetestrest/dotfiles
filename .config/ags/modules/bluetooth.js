import { Spinner } from './misc.js';
const { Bluetooth } = ags.Service;
const { Icon, Label, Box, Button, Stack } = ags.Widget;
const { execAsync } = ags.Utils;
const { instance } = ags.Service.Bluetooth;

let numOfTries = 0;

export const Indicator = ({
    enabled = Icon({ icon: 'bluetooth-active-symbolic', className: 'enabled' }),
    disabled = Icon({ icon: 'bluetooth-disabled-symbolic', className: 'disabled' }),
    ...props
} = {}) => Stack({
    ...props,
    items: [
        ['true', enabled],
        ['false', disabled],
    ],
    connections: [[Bluetooth, stack => {
        stack.shown = `${Bluetooth.enabled}`;
    }]],
});

export const Toggle = props => Button({
    ...props,
    onClicked: () => Bluetooth.enabled = !Bluetooth.enabled,
    connections: [[Bluetooth, button => button.toggleClassName('on', Bluetooth.enabled)]],
});

export const ConnectedLabel = props => Label({
    ...props,
    connections: [[Bluetooth, label => {
        if (!Bluetooth.enabled)
            return label.label = 'Disabled';

        if (Bluetooth.connectedDevices.size === 0)
            return label.label = 'Not Connected';

        numOfTries = 0;

        if (Bluetooth.connectedDevices.size === 1)
            return label.label = Bluetooth.connectedDevices.entries().next().value[1].alias;

        label.label = `${Bluetooth.connectedDevices.size} Connected`;
    }],
    [60000, label => {
        if (label.label === 'Not Connected' && numOfTries < 10 && Bluetooth.connectedDevices.size === 0 && Bluetooth.devices.size > 0) {
            // hotfix that forces a reread from GnomeBluetooth (https://github.com/Aylur/dotfiles/issues/49)
            instance._getDevices().forEach(d => {
                instance._deviceRemoved(null, d);
            });

            instance._getDevices().forEach(d => {
                instance._deviceAdded(null, d);
            });
        }
    }]
]});

export const Devices = props => Box({
    ...props,
    vertical: true,
    connections: [[Bluetooth, box => {
        box.children = Array.from(Bluetooth.devices.values()).map(device => Box({
            hexpand: false,
            children: [
                Icon(device.iconName + '-symbolic'),
                Label(device.name),
                Box({ hexpand: true }),
                device._connecting ? Spinner() : ags.Widget({
                    type: imports.gi.Gtk.Switch,
                    active: device.connected,
                    connections: [['activate', ({ active }) => {
                        device.setConnection(active);
                    }]],
                }),
            ],
        }));
    }]],
});


export const BluetoothIndicatorWithBattery = props => Box({
    ...props,
    connections: [[Bluetooth, box => {
        box.children = Array.from(Bluetooth.connectedDevices.values())
            .map(({ iconName, batteryPercentage }) => Box({
                className: 'btdevice',
                children: [
                    Icon({
                        className: 'btdevice-icon',
                        icon: iconName + '-symbolic',
                    }),
                    Label({
                        className: 'btdevice-label',
                        label: batteryPercentage !== 0 ? batteryPercentage.toString() + "%" : ""
                    }),
                ],
            }));

        box.visible = Bluetooth.connectedDevices.size > 0;
    }]],
});