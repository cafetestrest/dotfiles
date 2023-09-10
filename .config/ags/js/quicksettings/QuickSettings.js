// import Header from './widgets/Header.js';
import PopupWindow from '../misc/PopupWindow.js';
import { VolumeWithoutPercent, SinkSelector, AppMixer } from './widgets/Volume.js';
// import { NetworkToggle, WifiSelection } from './widgets/Network.js';
import { NetworkToggle } from './widgets/Network.js';
import { BluetoothToggle, BluetoothDevices } from './widgets/Bluetooth.js';
import { ThemeToggle, ThemeSelector } from './widgets/Theme.js';
// import { ProfileToggle, ProfileSelector } from './widgets/AsusProfile.js';
// import Media from './widgets/Media.js';
// import Brightness from './widgets/Brightness.js';
import DND from './widgets/DND.js';
// import MicMute from './widgets/MicMute.js';
import Idle from './widgets/Idle.js';
const { Box } = ags.Widget;

const Row = (toggles, menus = []) => Box({
    className: 'row',
    vertical: true,
    children: [
        Box({
            children: toggles,
        }),
        ...menus,
    ],
});

// const Homogeneous = toggles => Box({
//     homogeneous: true,
//     children: toggles,
// });

export default () => PopupWindow({
    name: 'quicksettings',
    anchor: 'top right',
    layout: 'top right',
    content: Box({
        className: 'quicksettings',
        vertical: true,
        children: [
            // Row(
            //     [Header()],
            // ),
            Row(
                [
                    NetworkToggle(),
                    Box({ className: 'button-spacing' }),
                    BluetoothToggle(),
                ],
                [
                    // WifiSelection(),
                    BluetoothDevices(),
                ],
            ),
            Row(
                [
                    DND(),
                    Box({ className: 'button-spacing' }),
                    // ThemeToggle(),
                    Idle(),
                    // ThemeToggle(),
                        // MicMute()
                ],
                [
                    // ProfileSelector(),
                    ThemeSelector()
                ],
            ),
            Row([Box({
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
                    //     [Brightness()],
                    // ),
                ],
            })]),
            // Row(
            //     [DND(), MicMute()],
            // ),
            // Media(),
        ],
    }),
});
