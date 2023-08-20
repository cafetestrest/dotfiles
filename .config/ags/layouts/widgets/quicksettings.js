import { Uptime } from '../../modules/clock.js';
import { FontIcon, HoverRevealer, Separator } from '../../modules/misc.js';
import * as battery from '../../modules/battery.js';
import * as audio from '../../modules/audio.js';
// import * as brightness from '../../modules/brightness.js';
import * as network from '../../modules/network.js';
import * as bluetooth from '../../modules/bluetooth.js';
import * as notifications from '../../modules/notifications.js';
// import * as asusctl from '../../modules/asusctl.js';
import * as theme from '../../theme/theme.js';
import * as media from './media.js';
const { Button, Box, Icon, Label, Revealer } = ags.Widget;
const { Service, App } = ags;
const { Bluetooth, Battery, Audio, Network, Theme } = Service;
const { execAsync, timeout, USER } = ags.Utils;

class QSMenu extends Service {
    static { Service.register(this); }
    static instance = new QSMenu();
    static opened = '';
    static toggle(menu) {
        QSMenu.opened = QSMenu.opened === menu ? '' : menu;
        QSMenu.instance.emit('changed');
    }

    constructor() {
        super();
        App.instance.connect('window-toggled', (_a, name, visible) => {
            if (name === 'quicksettings' && !visible) {
                QSMenu.opened = '';
                QSMenu.instance.emit('changed');
            }
        });
    }
}

const Arrow = (menu, toggleOn) => Button({
    className: 'arrow',
    onClicked: () => {
        QSMenu.toggle(menu);
        if (toggleOn)
            toggleOn();
    },
    connections: [[QSMenu, button => {
        button.toggleClassName('opened', QSMenu.opened === menu);
    }]],
    child: Icon({
        icon: 'pan-end-symbolic',
        properties: [
            ['deg', 0],
            ['opened', false],
        ],
        connections: [[QSMenu, icon => {
            if (QSMenu.opened === menu && !icon._opened || QSMenu.opened !== menu && icon._opened) {
                const step = QSMenu.opened === menu ? 10 : -10;
                icon._opened = !icon._opened;
                for (let i = 0; i < 9; ++i) {
                    timeout(5 * i, () => {
                        icon._deg += step;
                        icon.setStyle(`-gtk-icon-transform: rotate(${icon._deg}deg);`);
                    });
                }
            }
        }]],
    }),
});

const wideToggle = ({ icon, label, toggle, status, name }) => ({
    type: toggle,
    className: `toggle ${name}`,
    child: {
        type: 'box',
        orientation: 'horizontal',
        valign: 'center',
        children: [
            {
                type: 'button',
                valign: 'center',
                hexpand: true,
                child: {
                    type: 'box',
                    children: [
                        {
                            type: 'box',
                            className: 'quicksettings__button_icon',
                            orientation: 'horizontal',
                            children: [
                                { type: icon },
                            ],
                        },
                        {
                            type: 'box',
                            orientation: 'vertical',
                            hexpand: false,
                            children: [
                                {
                                    type: label,
                                    className: 'text__bold',
                                    halign: 'start',
                                },
                                {
                                    type: status,
                                    halign: 'start',
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
});

const RevealerMenu = (name, child) => Box({
    children: [Revealer({
        transition: 'slide_down',
        connections: [[QSMenu, r => r.reveal_child = name === QSMenu.opened]],
        child,
    })],
});

const Avatar = () => Box({
    className: 'avatar',
    connections: [[Theme, box => {
        box.setStyle(`
            background-image: url('${Theme.getSetting('avatar')}');
            background-size: cover;
        `);
    }]],
    children: [Box({
        className: 'shader',
        hexpand: true,
        children: [Label({
            className: 'user',
            halign: 'start',
            valign: 'end',
            label: '@' + USER,
        })],
    })],
});

const SysButton = (icon, action, className = '') => Button({
    className,
    onClicked: () => Service.System.action(action),
    tooltipText: action,
    child: Icon(icon),
});

const SystemBox = () => Box({
    vertical: true,
    halign: 'end',
    valign: 'center',
    children: [
        Box({
            valign: 'center',
            className: 'system',
            children: [
                Button({
                    className: 'settings',
                    onClicked: () => { App.toggleWindow('quicksettings'); Theme.openSettings(); },
                    tooltipText: 'Settings',
                    child: Icon('org.gnome.Settings-symbolic'),
                }),
                Box({
                    className: 'uptime',
                    children: [
                        Label('uptime: '),
                        Uptime(),
                    ],
                }),
                SysButton('system-log-out-symbolic', 'Log Out'),
                SysButton('system-shutdown-symbolic', 'Shutdown', 'shutdown'),
            ],
        }),
        // battery.BatteryProgress(),
    ],
});

const VolumeBox = () => Box({
    vertical: true,
    className: 'volume-box',
    children: [
        Box({
            className: 'volume',
            children: [
                Button({
                    child: audio.SpeakerTypeIndicator(),
                    onClicked: 'pamixer --default-source -t',
                }),
                audio.SpeakerSlider({ hexpand: true }),
                audio.SpeakerPercentLabel(),
                Arrow('stream-selector'),
            ],
        }),
        RevealerMenu('stream-selector', Box({
            vertical: true,
            className: 'menu',
            children: [
                audio.StreamSelector(),
                Separator(),
                Button({
                    onClicked: () => {
                        execAsync('pavucontrol').catch(print);
                        App.closeWindow('quicksettings');
                    },
                    child: Label({
                        label: 'Settings',
                        xalign: 0,
                    }),
                }),
            ],
        })),
    ],
});

const speaker = {
    type: 'box',
    className: 'speaker-box',
    halign: 'end',
    children: [
        {
            type: 'audio/speaker-indicator',
        },
        ' ',
        {
            type: 'audio/speaker-percent-label',
        },
        '%',
    ],
};

const usageCpu = {
    type: 'box',
    className: 'usagecpu-box',
    halign: 'end',
    children: [
        {
            type: 'usagecpu-indicator',
        },
        ' ',
        {
            type: 'usagecpu',
        },
        '%',
    ],
};

const usageMemory = {
    type: 'box',
    className: 'usagememory-box',
    halign: 'end',
    children: [
        {
            type: 'usagememory-indicator',
        },
        ' ',
        {
            type: 'usagememory',
        },
        // '%',
    ],
};

const usageStorage = {
    type: 'box',
    className: 'usagestorage-box',
    halign: 'end',
    children: [
        {
            type: 'usagestorage-indicator',
        },
        ' ',
        {
            type: 'usagestorage',
        },
        // '%',
    ],
};

// const BrightnessBox = () => Box({
//     className: 'brightness',
//     children: [
//         Button({
//             onClicked: () => {
//                 execAsync('wl-gammactl').catch(print);
//                 App.closeWindow('quicksettings');
//             },
//             child: brightness.Indicator(),
//         }),
//         brightness.BrightnessSlider(),
//         brightness.PercentLabel(),
//     ],
// });

const ArrowToggle = ({ icon, label, connection, toggle, name, toggleOn }) => Box({
    connections: [[
        connection.service,
        w => w.toggleClassName('active', connection.callback()),
    ]],
    className: `arrow toggle ${name}`,
    children: [
        Button({
            hexpand: true,
            className: 'toggle',
            onClicked: toggle,
            child: Box({
                children: [
                    icon,
                    label,
                ],
            }),
        }),
        Arrow(name, toggleOn),
    ],
});

const NetworkToggle = () => ArrowToggle({
    icon: network.WifiIndicator(),
    label: network.SSIDLabel(),
    connection: {
        service: Network,
        callback: () => Network.wifi?.enabled,
    },
    toggle: Network.toggleWifi,
    toggleOn: () => {
        Network.wifi.enabled = true;
        Network.wifi.scan();
    },
    name: 'network',
});

const BluetoothToggle = () => ArrowToggle({
    icon: bluetooth.Indicator(),
    label: bluetooth.ConnectedLabel(),
    connection: {
        service: Bluetooth,
        callback: () => Bluetooth.enabled,
    },
    toggle: () => Bluetooth.enabled = !Bluetooth.enabled,
    toggleOn: () => {
        Bluetooth.enabled = QSMenu.opened === 'bluetooth'
            ? true : Bluetooth.enabled;
    },
    name: 'bluetooth',
});

const SmallToggle = (toggle, indicator) => toggle({
    className: 'toggle',
    halign: 'fill',
    hexpand: true,
    vexpand: true,
    child: indicator({ halign: 'center' }),
});

const notificationsToggle = wideToggle({
    icon: 'notifications/dnd-indicator',
    label: 'notifications/label',
    toggle: 'notifications/dnd-toggle',
    status: 'notifications/status-label',
    name: 'notificationsToggle',
});

const wideIdleToggle = wideToggle({
    icon: 'idle/indicator',
    label: 'idle/label',
    toggle: 'idle/toggle',
    status: 'idle/status-label',
    name: 'idleToggle',
});

const wideMuteToggle = wideToggle({
    icon: 'audio/microphone-mute-indicator',
    label: 'audio/microphone-mute-label',
    toggle: 'audio/microphone-mute-toggle',
    status: 'audio/microphone-mute-status-label',
    name: 'microphoneToggle',
});

const wideNightlightToggle = wideToggle({
    icon: 'nightlight/mode-indicator',
    label: 'nightlight/label',
    toggle: 'nightlight/mode-toggle',
    status: 'nightlight/status-label',
    name: 'idleToggle',
});

const DNDToggle = () => SmallToggle(
    notifications.DNDToggle,
    notifications.DNDIndicator,
);

const MuteToggle = () => SmallToggle(
    audio.MicrophoneMuteToggle,
    audio.MicrophoneMuteIndicator,
);

// const idleToggle = SmallToggle(
//     'idle/toggle',
//     'idle/indicator',
// ); todo

const AsusctlToggle = () => SmallToggle(
    asusctl.ProfileToggle,
    asusctl.ProfileIndicator,
);

const AsusmodeToggle = () => SmallToggle(
    asusctl.ModeToggle,
    asusctl.ModeIndicator,
);

// const nightlightToggle = SmallToggle(
//     'nightlight/mode-toggle',
//     'nightlight/mode-indicator',
// ); todo

const ThemeToggle = () => Button({
    className: 'toggle',
    onClicked: () => QSMenu.toggle('theme'),
    child: theme.Indicator(),
    connections: [[QSMenu, w => w.toggleClassName('on', QSMenu.opened === 'theme')]],
});

const AppmixerToggle = () => Button({
    className: 'toggle',
    onClicked: () => QSMenu.toggle('app-mixer'),
    child: FontIcon({ icon: '' }),
    tooltipText: 'App Mixer',
    connections: [[QSMenu, w => w.toggleClassName('on', QSMenu.opened === 'app-mixer')]],
});

const Submenu = ({ menuName, icon, title, contentType }) => RevealerMenu(menuName, Box({
    vertical: true,
    className: `submenu ${menuName}`,
    children: [
        Box({ className: 'title', children: [icon, Label(title)] }),
        contentType({ className: 'content', hexpand: true }),
    ],
}));

const Appmixer = () => Submenu({
    menuName: 'app-mixer',
    icon: FontIcon({ icon: '' }),
    title: 'App Mixer',
    contentType: audio.AppMixer,
});

const NetworkSelection = () => Submenu({
    menuName: 'network',
    icon: Icon('network-wireless-symbolic'),
    title: 'Wireless Networks',
    contentType: network.WifiSelection,
});

const BluetoothSelection = () => Submenu({
    menuName: 'bluetooth',
    icon: Icon('bluetooth-symbolic'),
    title: 'Bluetooth',
    contentType: bluetooth.Devices,
});

const ThemeSelection = () => Submenu({
    menuName: 'theme',
    icon: Icon('preferences-desktop-theme-symbolic'),
    title: 'Theme',
    contentType: theme.Selector,
});

export const PopupContent = () => Box({
    className: 'quicksettings',
    vertical: true,
    hexpand: false,
    children: [
        Box({
            className: 'header',
            children: [
                Avatar(),
                SystemBox(),
            ],
        }),
        VolumeBox(),
        // BrightnessBox(),
        Box({
            className: 'toggles-box',
            children: [
                Box({
                    vertical: true,
                    className: 'arrow-toggles',
                    children: [
                        // NetworkToggle(),
                        BluetoothToggle()
                    ],
                }),
                Box({
                    vertical: true,
                    className: 'small-toggles',
                    vexpand: true,
                    hexpand: false,
                    children:
                        [
                            Box({ children: [DNDToggle(), MuteToggle()] }),
                            Box({ children: [AppmixerToggle(), ThemeToggle()] }),
                        ],
                }),
            ],
        }),
        Appmixer(),
        // NetworkSelection(),
        BluetoothSelection(),
        ThemeSelection(),
        media.PopupContent(),
    ],
});

const BluetoothIndicator = () => Box({
    connections: [[Bluetooth, box => {
        box.children = Array.from(Bluetooth.connectedDevices.values())
            .map(({ iconName, name }) => HoverRevealer({
                indicator: Icon(iconName + '-symbolic'),
                child: Label(name),
            }));

        box.visible = Bluetooth.connectedDevices.size > 0;
    }]],
});

const BatteryIndicator = () => HoverRevealer({
    direction: 'right',
    indicator: battery.Indicator(),
    child: battery.LevelLabel(),
    connections: [[Battery, revealer => {
        revealer.reveal_child = Battery.percent < 100;
    }]],
});

export const PanelButton = () => Button({
    className: 'quicksettings panel-button',
    onClicked: () => App.toggleWindow('quicksettings'),
    onScrollUp: () => {
        Audio.speaker.volume += 0.02;
        Service.Indicator.speaker();
    },
    onScrollDown: () => {
        Audio.speaker.volume -= 0.02;
        Service.Indicator.speaker();
    },
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'quicksettings' && visible);
    }]],
    child: Box({
        children: [
            // Service.Asusctl?.available && asusctl.ProfileIndicator({ balanced: null }),
            // Service.Asusctl?.available && asusctl.ModeIndicator({ hybrid: null }),
            audio.MicrophoneMuteIndicator({ unmuted: null }),
            notifications.DNDIndicator({ noisy: null }),
            BluetoothIndicator(),
            bluetooth.Indicator({ disabled: null }),
            network.Indicator(),
            audio.SpeakerIndicator(),
            BatteryIndicator(),
        ],
    }),
});

// Widget.widgets['usageCpu'] = () => Widget({
//     type: 'box',
//     className: 'panel-button',
//     children: [
//         usageCpu,
//     ],
// });

// Widget.widgets['usageMemory'] = () => Widget({
//     type: 'box',
//     className: 'panel-button',
//     children: [
//         usageMemory,
//     ],
// });

// Widget.widgets['usageStorage'] = () => Widget({
//     type: 'box',
//     className: 'panel-button',
//     children: [
//         usageStorage,
//     ],
// });

// Widget.widgets['bluetooth/devices-battery'] = () => Widget({
//     type: 'box',
//     className: 'bluetooth devices',
//     connections: [[Bluetooth, box => {
//         box.get_children().forEach(ch => ch.destroy());
//         for (const [, device] of Bluetooth.connectedDevices) {
//             batteryPercentage = device.batteryPercentage;

//             box.add(Widget({
//                 // type: 'hover-revealer',
//                 // indicator: { type: 'icon', icon: device.iconName + '-symbolic' },
//                 // child: { type: 'label', label: device.name },
//                 type: 'box',
//                 // indicator: { type: 'icon', icon: device.iconName + '-symbolic' },
//                 children: [
//                     { type: 'icon', icon: device.iconName + '-symbolic', className: 'btdevice' },
//                     { type: 'label', label: batteryPercentage !== 0 ? " " + batteryPercentage.toString() + "%" : "  " },
//                 ],
//             }));
//         }
//         box.show_all();
//         box.visible = Bluetooth.connectedDevices.size > 0;
//     }]],
// }); todo
