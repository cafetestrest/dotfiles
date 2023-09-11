import HoverRevealer from '../../misc/HoverRevealer.js';
import PanelButton from '../PanelButton.js';
import Asusctl from '../../services/asusctl.js';
import Indicator from '../../services/onScreenIndicator.js';
import icons from '../../icons.js';
import { PercentLabel, TypeIndicator } from '../../quicksettings/widgets/Volume.js';
const { App } = ags;
const { Bluetooth, Audio, Notifications, Network } = ags.Service;
const { Box, Label, Icon, Stack } = ags.Widget;
import { IdleIndicator } from '../../quicksettings/widgets/Idle.js';
import { NightlightIndicator } from '../../quicksettings/widgets/NightLight.js';

const ProfileIndicator = () => Icon({
    connections: [[Asusctl, icon => {
        icon.visible = Asusctl.profile !== 'Balanced';
        icon.icon = icons.asusctl.profile[Asusctl.profile];
    }]],
});

const ModeIndicator = () => Icon({
    connections: [[Asusctl, icon => {
        icon.visible = Asusctl.mode !== 'Hybrid';
        icon.icon = icons.asusctl.mode[Asusctl.mode];
    }]],
});

const MicrophoneMuteIndicator = () => Icon({
    icon: icons.audio.mic.muted,
    connections: [[Audio, icon => {
        icon.visible = Audio.microphone?.isMuted;
    }, 'microphone-changed']],
});

const DNDIndicator = () => Icon({
    icon: icons.notifications.silent,
    connections: [[Notifications, icon => {
        icon.visible = Notifications.dnd;
    }]],
});

// todo revert back to name isntead of batteryLevel
const BluetoothDevicesIndicator = () => Box({
    connections: [[Bluetooth, box => {
        box.children = Bluetooth.connectedDevices
            .map(({ iconName, batteryLevel }) => HoverRevealer({
                indicator: Icon(iconName + '-symbolic'),
                child: Label(batteryLevel.toString()),
            }));

        box.visible = Bluetooth.connectedDevices.length > 0;
    }]],
});

const BluetoothIndicator = () => Icon({
    className: 'bluetooth',
    icon: icons.bluetooth.enabled,
    binds: [['visible', Bluetooth, 'enabled']],
});

const NetworkIndicator = () => Stack({
    items: [
        ['wifi', Icon({
            connections: [[Network, icon => {
                icon.icon = Network.wifi?.iconName;
            }]],
        })],
        ['wired', Icon({
            connections: [[Network, icon => {
                icon.icon = Network.wired?.iconName;
            }]],
        })],
    ],
    connections: [[Network, stack => {
        stack.shown = Network.primary || 'wifi';
    }]],
});

const AudioIndicator = () => Icon({
    connections: [[Audio, icon => {
        if (!Audio.speaker)
            return;

        const { muted, low, medium, high, overamplified } = icons.audio.volume;
        if (Audio.speaker.isMuted)
            return icon.icon = muted;

        icon.icon = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]]
            .find(([threshold]) => threshold <= Audio.speaker.volume * 100)[1];
    }, 'speaker-changed']],
});

export default () => PanelButton({
    className: 'quicksettings panel-button',
    onClicked: () => App.toggleWindow('quicksettings'),
    onScrollUp: () => {
        Audio.speaker.volume += 0.02;
        Indicator.speaker();
    },
    onScrollDown: () => {
        Audio.speaker.volume -= 0.02;
        Indicator.speaker();
    },
    connections: [[App, (btn, win, visible) => {
        btn.toggleClassName('active', win === 'quicksettings' && visible);
    }]],
    child: Box({
        children: [
            // Asusctl?.available && ProfileIndicator(),
            // Asusctl?.available && ModeIndicator(),
            MicrophoneMuteIndicator(),
            DNDIndicator(),
            IdleIndicator(),
            NightlightIndicator(),
            // BluetoothDevicesIndicator(),
            BluetoothIndicator(),
            NetworkIndicator(),
            Box({
                className: 'system-volume',
                children: [
                    AudioIndicator(),
                    Label({ label: ' ' }),
                    PercentLabel(),
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
                                TypeIndicator()
                            ]
                        }))
                        box.show_all()
                    }
                }
                ]],
            })
        ],
    }),
});
