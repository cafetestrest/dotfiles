const { Bluetooth } = ags.Service;
const { Label, Box, Icon } = ags.Widget;

// This one is relying on ags Bluetooth service to provice information and is quicker but does not show battery percentage without gnome
export default () => Box({
    className: 'bluetooth-indicator panel-button',
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

        box.visible = Bluetooth.connectedDevices.length > 0;
    }]],
});
