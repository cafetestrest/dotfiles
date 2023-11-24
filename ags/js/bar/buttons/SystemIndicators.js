import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import HoverRevealer from '../../misc/HoverRevealer.js';
import PanelButton from '../PanelButton.js';
import Asusctl from '../../services/asusctl.js';
import Indicator from '../../services/onScreenIndicator.js';
import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';

import { PercentLabel, VolumeIndicator } from '../../quicksettings/widgets/Volume.js';
import { IdleIndicator } from '../../quicksettings/widgets/Idle.js';
import { NightlightIndicator } from '../../quicksettings/widgets/NightLight.js';

const ProfileIndicator = () => Widget.Icon({
    connections: [[Asusctl, icon => {
        icon.visible = Asusctl.profile !== 'Balanced';
        icon.icon = icons.asusctl.profile[Asusctl.profile];
    }]],
});

const ModeIndicator = () => FontIcon({
    connections: [[Asusctl, icon => {
        icon.visible = Asusctl.mode !== 'Hybrid';
        icon.icon = icons.asusctl.mode[Asusctl.mode];
    }]],
});

const MicrophoneIndicator = () => Widget.Icon({
    connections: [[Audio, icon => {
        if (!Audio.microphone)
            return;

        const { muted, low, medium, high } = icons.audio.mic;
        if (Audio.microphone.is_muted)
            return icon.icon = muted;

        /** @type {Array<[number, string]>} */
        const cons = [[67, high], [34, medium], [1, low], [0, muted]];
        icon.icon = cons.find(([n]) => n <= Audio.microphone.volume * 100)?.[1] || '';

        icon.visible = Audio.recorders.length > 0 || Audio.microphone.is_muted;
    }]],
});

const DNDIndicator = () => Widget.Icon({
    icon: icons.notifications.silent,
    binds: [['visible', Notifications, 'dnd']],
});

const BluetoothDevicesIndicator = () => Widget.Box({
    connections: [[Bluetooth, box => {
        box.children = Bluetooth.connectedDevices
            .map(({ iconName, name }) => HoverRevealer({
                indicator: Widget.Icon(iconName + '-symbolic'),
                child: Widget.Label(name),
            }));

        box.visible = Bluetooth.connectedDevices.length > 0;
    }, 'notify::connected-devices']],
});

const BluetoothIndicator = () => Widget.Icon({
    class_name: 'bluetooth',
    icon: icons.bluetooth.enabled,
    binds: [['visible', Bluetooth, 'enabled']],
});

const NetworkIndicator = () => Widget.Icon({
    connections: [[Network, self => {
        const icon = Network[Network.primary || 'wifi']?.iconName;
        self.icon = icon || '';
        self.visible = icon;
    }]],
});

const AudioIndicator = () => Widget.Icon({
    connections: [[Audio, icon => {
        if (!Audio.speaker)
            return;

        const { muted, low, medium, high, overamplified } = icons.audio.volume;
        if (Audio.speaker.is_muted)
            return icon.icon = muted;


        /** @type {Array<[number, string]>} */
        const cons = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]];
        icon.icon = cons.find(([n]) => n <= Audio.speaker.volume * 100)?.[1] || '';
    }, 'speaker-changed']],
});

const SpeakerIndicator = () => Widget.Box({
    class_name: 'system-volume',
    children: [
        AudioIndicator(),
        Widget.Label({ label: ' ' }),
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
            box.add(Widget.Box({
                class_name: classnameToDisplay,
                children: [
                    Widget.Label({ label: ' ', }),
                    VolumeIndicator('speaker')
                ]
            }))
            box.show_all()
        }
    }
    ]],
});

export default () => PanelButton({
    class_name: 'quicksettings panel-button',
    on_clicked: () => App.toggleWindow('quicksettings'),
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
    child: Widget.Box({
        children: [
            // Asusctl?.available && ProfileIndicator(),
            // Asusctl?.available && ModeIndicator(),
            DNDIndicator(),
            IdleIndicator(),
            NightlightIndicator(),
            // BluetoothDevicesIndicator(),
            BluetoothIndicator(),
            NetworkIndicator(),
            // AudioIndicator(),
            MicrophoneIndicator(),
            SpeakerIndicator(),
        ],
    }),
});
