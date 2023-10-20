import Header from './widgets/Header.js';
import PopupWindow from '../misc/PopupWindow.js';
import { VolumeWithoutPercent, Volume, Microhone, SinkSelector, AppMixer } from './widgets/Volume.js';
import { NetworkToggle, WifiSelection } from './widgets/Network.js';
import { BluetoothToggle, BluetoothDevices } from './widgets/Bluetooth.js';
import { ThemeToggle, ThemeSelector } from './widgets/Theme.js';
import { ProfileToggle, ProfileSelector } from './widgets/AsusProfile.js';
import Media from './widgets/Media.js';
import Brightness from './widgets/Brightness.js';
import DND from './widgets/DND.js';
import MicMute from './widgets/MicMute.js';
import { Widget } from '../imports.js';

import { IdleToggle } from './widgets/Idle.js';
import { NightlightToggle } from './widgets/NightLight.js';
import { SysProgress } from '../dashboard/DateColumn.js';
import { QSWidget } from '../bar/buttons/Weather.js';
import { ScreenRecordToggle, ScreenRecordSelector } from './widgets/ScreenRecord.js';

const Row = (toggles, menus = []) => Widget.Box({
    className: 'row',
    vertical: true,
    children: [
        Widget.Box({
            children: toggles,
        }),
        ...menus,
    ],
});

const Homogeneous = toggles => Widget.Box({
    homogeneous: true,
    children: toggles,
});

export default () => PopupWindow({
    name: 'quicksettings',
    anchor: ['top', 'right'],
    layout: 'top right',
    content: Widget.Box({
        className: 'quicksettings',
        vertical: true,
        children: [
            // Row(
            //     [Header()],
            // ),
            Row(
                [
                    // NetworkToggle(),
                    BluetoothToggle(),
                    Widget.Box({ className: 'button-spacing' }),
                    IdleToggle(),
                ],
                [
                    // WifiSelection(),
                    BluetoothDevices(),
                ],
            ),
            Row(
                [
                    DND(),
                    Widget.Box({ className: 'button-spacing' }),
                    NightlightToggle()
                ],
            ),
            Row(
                [
                    ThemeToggle(),
                    Widget.Box({ className: 'button-spacing' }),
                    // MicMute(),
                    ScreenRecordToggle()
                ],
                [
                    // ProfileSelector(),
                    ThemeSelector(),
                    ScreenRecordSelector(),
                ],
            ),
            Row([Widget.Box({
                className: 'qsvolume',
                vertical: true,
                children: [
                    Row(
                        [
                            VolumeWithoutPercent()
                        ],
                        [
                            SinkSelector(),
                            AppMixer()
                        ],
                    ),
                    // Row(
                    //     [Brightness(), Microhone()],
                    // ),
                ],
            })]),
            Row(
                [
                    Widget.Box({
                        className: 'system-info',
                        children: [
                            SysProgress('cpu', 'Cpu', '%'),
                            SysProgress('ram', 'Ram', '%'),
                            SysProgress('disk', 'Disk', '%'),
                            // SysProgress('temp', 'Temperature', '°'),
                        ],
                    }),
                ],
            ),
            QSWidget(),
            // Row([Widget.Box({
            //     className: 'slider-box',
            //     vertical: true,
            //     children: [
            //         Row(
            //             [Volume()],
            //             [SinkSelector(), AppMixer()],
            //         ),
            //         Row(
            //             [Brightness()],
            //         ),
            //     ],
            // })]),
            // Row(
            //     [Homogeneous([NetworkToggle(), BluetoothToggle()]), DND()],
            //     [WifiSelection(), BluetoothDevices()],
            // ),
            // Row(
            //     [Homogeneous([ProfileToggle(), ThemeToggle()]), MicMute()],
            //     [ProfileSelector(), ThemeSelector()],
            // ),
            // Media(),
        ],
    }),
});
