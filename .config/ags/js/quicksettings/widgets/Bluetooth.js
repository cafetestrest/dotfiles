import icons from '../../icons.js';
import Spinner from '../../misc/Spinner.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';
const { Bluetooth } = ags.Service;
const { Icon, Label, Box } = ags.Widget;

let numOfTries = 0;

export const BluetoothToggle = () => ArrowToggleButton({
    name: 'bluetooth',
    icon: Icon({
        connections: [[Bluetooth, icon => {
            icon.icon = Bluetooth.enabled
                ? icons.bluetooth.enabled
                : icons.bluetooth.disabled;
        }]],
    }),
    label: Label({
        truncate: 'end',
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
        }]],
    }),
    connection: [Bluetooth, () => Bluetooth.enabled],
    deactivate: () => Bluetooth.enabled = false,
    activate: () => Bluetooth.enabled = true,
});

export const BluetoothDevices = () => Menu({
    name: 'bluetooth',
    icon: Icon(icons.bluetooth.disabled),
    title: Label('Bluetooth'),
    content: Box({
        hexpand: true,
        vertical: true,
        connections: [[Bluetooth, box => {
            box.children = Array.from(Bluetooth.devices.values()).map(device => Box({
                hexpand: false,
                children: [
                    Icon(device.iconName + '-symbolic'),
                    Label(device.name),
                    Box({ hexpand: true }),
                    device.connecting ? Spinner() : ags.Widget({
                        type: imports.gi.Gtk.Switch,
                        active: device.connected,
                        connections: [['notify::active', ({ active }) => {
                            device.setConnection(active);
                        }]],
                    }),
                ],
            }));
        }]],
    }),
});
