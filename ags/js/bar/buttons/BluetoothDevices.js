import { Widget } from '../../imports.js';
import { Bluetooth } from '../../imports.js';

// This one is relying on ags Bluetooth service to provice information and is quicker but does not show battery percentage without gnome
export default () => Widget.Box({
    className: 'bluetooth-indicator panel-button',
    connections: [[Bluetooth, box => {
        box.children = Bluetooth.connectedDevices
            .map(({ iconName, batteryPercentage }) => Widget.Box({
                className: 'btdevice',
                children: [
                    Widget.Icon({
                        className: 'btdevice-icon',
                        icon: iconName + '-symbolic',
                    }),
                    Widget.Label({
                        className: 'btdevice-label',
                        label: batteryPercentage !== 0 ? batteryPercentage.toString() + "%" : ""
                    }),
                ],
            }));

        box.visible = Bluetooth.connectedDevices.length > 0;
    }]],
});
