import icons from '../../icons.js';
import Spinner from '../../misc/Spinner.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';
import { Bluetooth, Widget } from '../../imports.js';
import Gtk from 'gi://Gtk';

const { instance } = ags.Service.Bluetooth;

let numOfTries = 0;

export const BluetoothToggle = () => ArrowToggleButton({
    name: 'bluetooth',
    icon: Widget.Icon({
        connections: [[Bluetooth, icon => {
            icon.icon = Bluetooth.enabled
                ? icons.bluetooth.enabled
                : icons.bluetooth.disabled;
        }]],
    }),
    label: Widget.Label({
        truncate: 'end',
        connections: [[Bluetooth, label => {
            if (!Bluetooth.enabled)
                return label.label = 'Disabled';

            if (Bluetooth.connectedDevices.length === 0)
                return label.label = 'Not Connected';

            numOfTries = 0;

            if (Bluetooth.connectedDevices.length === 1)
                return label.label = Bluetooth.connectedDevices[0].alias;

            label.label = `${Bluetooth.connectedDevices.length} Connected`;
        }],
        [60000, label => {
            if (label.label === 'Not Connected' && numOfTries < 10 && Bluetooth.connectedDevices.length === 0 && Bluetooth.devices.length > 0) {
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
    icon: Widget.Icon(icons.bluetooth.disabled),
    title: Widget.Label('Bluetooth'),
    content: Widget.Box({
        hexpand: true,
        vertical: true,
        connections: [[Bluetooth, box => {
            box.children = Bluetooth.devices
                .filter(d => d.name)
                .map(device => Widget.Box({
                    className: 'bluetooth-devices',
                    children: [
                        Widget.Icon(device.iconName + '-symbolic'),
                        Widget.Label(device.name),
                        device.batteryPercentage > 0 && Widget.Label(`${device.batteryPercentage}%`),
                        Widget.Box({ hexpand: true }),
                        device.connecting ? Spinner() : Widget({
                            type: Gtk.Switch,
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
