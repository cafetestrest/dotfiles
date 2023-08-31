import { Uptime } from '../../modules/clock.js';
import { FontIcon, HoverRevealer, Separator } from '../../modules/misc.js';
import * as battery from '../../modules/battery.js';
import * as audio from '../../modules/audio.js';
// import * as brightness from '../../modules/brightness.js';
import * as network from '../../modules/network.js';
import * as bluetooth from '../../modules/bluetooth.js';
import * as notifications from '../../modules/notifications.js';
import * as idle from '../../modules/idle.js';
import * as nightlight from '../../modules/nightlight.js';
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
                    className: 'volume-button',
                    child: audio.SpeakerTypeIndicator(),
                    onClicked: 'pamixer -t',
                    onSecondaryClick: 'pamixer --default-source -t',
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
                    Box({
                        className: 'arrow-icon',
                        children: [ icon, ]
                    }),
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

const DNDToggle = () => SmallToggle(
    notifications.DNDToggle,
    notifications.DNDIndicator,
);

const MuteToggle = () => SmallToggle(
    audio.MicrophoneMuteToggle,
    audio.MicrophoneMuteIndicator,
);

const AsusctlToggle = () => SmallToggle(
    asusctl.ProfileToggle,
    asusctl.ProfileIndicator,
);

const AsusmodeToggle = () => SmallToggle(
    asusctl.ModeToggle,
    asusctl.ModeIndicator,
);

const ThemeToggle = () => Button({
    className: 'toggle',
    onClicked: () => QSMenu.toggle('theme'),
    child: theme.Indicator(),
    connections: [[QSMenu, w => w.toggleClassName('on', QSMenu.opened === 'theme')]],
});

const IdleButtonToggle = () => Button({
    className: 'toggle',
    child: Box({
        className: 'title',
        children: [
            idle.IdleIndicator(),
            Box({
                children: [
                    Label({
                        label: 'Idle Inhibitor',
                    }),
                ]
            })
        ]
    }),
});

const NightlightButtonToggle = () => Button({
    className: 'toggle',
    child: Box({
        className: 'title',
        children: [
            nightlight.NightlightIndicator(),
            Box({
                children: [
                    Label({
                        label: 'Night Light',
                    }),
                ]
            })
        ]
    }),
});

const NotificationButtonToggle = () => Button({
    className: 'toggle',
    child: Box({
        className: 'title',
        children: [
            notifications.DNDIndicator(),
            Box({
                children: [
                    Label({
                        label: 'Do Not Disturb',
                    }),
                ]
            })
        ]
    }),
});

const NotificationToggle = () => SmallToggle(
    notifications.DNDToggle,
    NotificationButtonToggle
);

const NightlightToggle = () => SmallToggle(
    nightlight.NightlightToggle,
    NightlightButtonToggle
);

const IdleToggle = () => SmallToggle(
    idle.IdleToggle,
    IdleButtonToggle
);

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

export const PopupContent2 = () => Box({
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

export const PopupContent = () => Box({
    className: 'quicksettings',
    vertical: true,
    hexpand: false,
    children: [
        // Box({
        //     className: 'header',
        //     children: [
        //         Avatar(),
        //         SystemBox(),
        //     ],
        // }),
        // BrightnessBox(),
        Box({
            className: 'qstoggles',
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
                    className: 'noarrow',
                    children: [
                        // WideIdleToggle(),
                        IdleToggle()
                    ],
                }),
            ],
        }),
        Box({
            vertical: true,
            className: 'bluetoothSelection',
            children: [
                BluetoothSelection(),
            ],
        }),
        Box({
            className: 'qstoggles',
            children:
                [
                    Box({
                        vertical: true,
                        className: 'noarrow',
                        children: [
                            NotificationToggle()
                        ],
                    }),
                    Box({
                        vertical: true,
                        className: 'noarrow',
                        children: [
                            NightlightToggle()
                        ],
                    }),
                    // Box({ children: [DNDToggle(), MuteToggle()] }),
                    // Box({ children: [AppmixerToggle(), ThemeToggle()] }),
                ],
        }),
        Box({
            className: 'qsvolume',
            children: [
                VolumeBox(),
            ],
        }),
        // VolumeBox(),
        Appmixer(),
        // NetworkSelection(),
        ThemeSelection(),
        // media.PopupContent(),
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

export const PanelButton2 = () => Button({
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
            notifications.DNDIndicator({ noisy: null }),
            // { type: 'nightlight/mode-indicator'},
            // { type: 'idle/indicator'},
            idle.IdleIndicator(),
            // bluetooth.BluetoothIndicatorWithBattery({}),
            bluetooth.Indicator({ disabled: null }),
            network.Indicator(),
            audio.MicrophoneMuteIndicator({ unmuted: null }),
            Box({
                className: 'speaker-box',
                halign: 'end',
                children: [
                    audio.SpeakerIndicator(),
                    Label({
                        label: ' ',
                    }),
                    audio.SpeakerPercentLabel(),
                ],
                connections: [[Audio, box => {
                    let alreadyCreated = false;
                    let isHeadsetSelected = Audio.speaker?.iconName === 'audio-headset-analog-usb';
                    let classnameToDisplay = 'headset-icon';

                    box.get_children().forEach(ch => {
                        if (ch.className == classnameToDisplay) {
                            if (isHeadsetSelected) {
                                ch.visible = true;
                            } else {
                                ch.visible = false;
                            }

                            alreadyCreated = true;
                        }
                    });

                    if (alreadyCreated) {
                        return;
                    }

                    if (isHeadsetSelected) {
                        box.add(Box({
                            className: classnameToDisplay,
                            children: [
                                Label({ label: ' ', }),
                                audio.SpeakerTypeIndicator()
                            ]
                        }))
                        box.show_all()
                    }
                }
                ]],
            }),
            // BatteryIndicator(),
        ],
    }),
});
