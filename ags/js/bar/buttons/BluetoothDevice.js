const { Label, Box, Icon } = ags.Widget;
import Btdevice from '../../services/btdevice.js';

// This one is a custom scrips that looks for data in bluetoothctl, it is slower and is refreshed once every 10 seconds
// used just as the Bluetooth service does not display battery percentage without gnome
export default () => Box({
    className: 'bluetooth-indicator panel-button',
    connections: [[10000, box => {
        Btdevice.callBtDeviceInfoScript

        let data = Btdevice.data;

        if (data) {
            box.get_children().forEach(ch => ch.destroy());

            data.forEach(({ iconName, batteryPercentage }) => 
                box.add(Box({
                    className: 'btdevice',
                    children: [
                        Icon({
                            className: 'btdevice-icon',
                            icon: iconName + '-symbolic',
                        }),
                        Label({
                            className: 'btdevice-label',
                            label: batteryPercentage !== "" ? batteryPercentage.toString() + "%" : ""
                        }),
                    ],
                }))
            );
        }
    }]],
});
