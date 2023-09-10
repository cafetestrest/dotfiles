const { Bluetooth } = ags.Service;
const { Label, Box, Icon } = ags.Widget;

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

        box.visible = Bluetooth.connectedDevices.size > 0;
    }]],
});
