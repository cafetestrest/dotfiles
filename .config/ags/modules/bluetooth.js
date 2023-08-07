const { Widget } = ags;
const { Bluetooth } = ags.Service;
const { instance } = ags.Service.Bluetooth;
const { exec, execAsync } = ags.Utils;

let numOfTries = 0;

Widget.widgets['bluetooth/indicator'] = ({
    enabled = { type: 'icon', icon: 'bluetooth-active-symbolic', className: 'enabled' },
    disabled = { type: 'icon', icon: 'bluetooth-disabled-symbolic', className: 'disabled' },
    ...props
}) => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: true, widget: enabled },
        { value: false, widget: disabled },
    ],
    connections: [[Bluetooth, dynamic => dynamic.update(value => value === Bluetooth.enabled)]],
});

Widget.widgets['bluetooth/toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: () => Bluetooth.enabled = !Bluetooth.enabled,
    connections: [[Bluetooth, button => button.toggleClassName('on', Bluetooth.enabled)]],
});

Widget.widgets['bluetooth/label'] = props => Widget({
    ...props,
    type: 'label',
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
            execAsync(['bash', '-c', "~/.config/waybar/scripts/ags-bt-reset.sh"])
        }
    }]
]});

Widget.widgets['bluetooth/devices'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    connections: [[Bluetooth, box => {
        box.get_children().forEach(ch => ch.destroy());
        for (const [, device] of Bluetooth.devices) {
            box.add(Widget({
                type: 'box',
                hexpand: false,
                children: [
                    {
                        type: 'icon',
                        icon: device.iconName + '-symbolic',
                    },
                    {
                        type: 'label',
                        label: device.name,
                    },
                    { type: 'box', hexpand: true },
                    device._connecting ? { type: 'spinner' } : {
                        type: 'switch',
                        active: device.connected,
                        onActivate: ({ active }) => device.setConnection(active),
                    },
                ],
            }));
        }
        box.show_all();
    }]],
});
