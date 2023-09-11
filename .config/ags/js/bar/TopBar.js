import OverviewButton from './buttons/OverviewButton.js';
// import Workspaces from './buttons/Workspaces.js';
import WorkspacesHypr from './buttons/WorkspacesHypr.js';
// import FocusedClient from './buttons/FocusedClient.js';
import MediaIndicator from './buttons/MediaIndicator.js';
import DateButton from './buttons/DateButton.js';
import NotificationIndicator from './buttons/NotificationIndicator.js';
import SysTray from './buttons/SysTray.js';
import ColorPicker from './buttons/ColorPicker.js';
import SystemIndicators from './buttons/SystemIndicators.js';
import PowerMenu from './buttons/PowerMenu.js';
import Separator from '../misc/Separator.js';
import ScreenRecord from './buttons/ScreenRecord.js';
// import BatteryBar from './buttons/BatteryBar.js';
// import SubMenu from './buttons/SubMenu.js';
const { Window, CenterBox, Box } = ags.Widget;
const { SystemTray } = ags.Service;
import { Taskbar } from '../dock/Dock.js';
import Screenshot from './buttons/Screenshot.js';
import Note from './buttons/Note.js';
import { UsageCPU, UsageDisk, UsageRAM } from './buttons/Usage.js';
import BluetoothDevices from './buttons/BluetoothDevices.js';
import { TemperatureIndicator } from './buttons/Weather.js';

const submenuItems = ags.Variable(1);
SystemTray.instance.connect('changed', () => {
    submenuItems.setValue(SystemTray.items.length + 1);
});

const SeparatorDot = (service, condition) => Separator({
    orientation: 'vertical',
    valign: 'center',
    connections: service && [[service, dot => dot.visible = condition()]],
});

const Start = () => Box({
    className: 'start',
    children: [
        OverviewButton(),
        SeparatorDot(),
        // Workspaces(),
        Taskbar(),
        SeparatorDot(),
        WorkspacesHypr(),
        SeparatorDot(),
        // FocusedClient(),
        Box({ hexpand: true }),
        MediaIndicator({ direction: 'left' }),
        SeparatorDot(
            ags.Service.Mpris,
            () => !!ags.Service.Mpris.getPlayer(),
        ),
    ],
});

const Center = () => Box({
    className: 'center',
    children: [
        DateButton({ format: '%a %b %e   %H:%M:%S' }),
        TemperatureIndicator(),
    ],
});

const End = () => Box({
    className: 'end',
    children: [
        SeparatorDot(
            ags.Service.Notifications,
            () => ags.Service.Notifications.notifications.length > 0,
        ),
        NotificationIndicator({ direction: 'right' }),
        Box({ hexpand: true }),
        UsageCPU(),
        UsageRAM(),
        UsageDisk(),
        BluetoothDevices(),
        SysTray(),
        ColorPicker(),
        // SubMenu({
        //     items: submenuItems,
        //     children: [
        //         SysTray(),
        //         ColorPicker(),
        //     ],
        // }),
        SeparatorDot(),
        ScreenRecord(),
        SeparatorDot(
            ags.Service.Recorder,
            () => ags.Service.Recorder.recording,
        ),
        // BatteryBar(),
        // SeparatorDot(
        //     ags.Service.Battery,
        //     () => ags.Service.Battery.available,
        // ),
        Note(),
        Screenshot(),
        SeparatorDot(),
        SystemIndicators(),
        SeparatorDot(),
        PowerMenu(),
    ],
});

export default monitor => Window({
    name: `bar${monitor}`,
    exclusive: true,
    monitor,
    anchor: 'top left right',
    child: CenterBox({
        className: 'panel',
        startWidget: Start(),
        centerWidget: Center(),
        endWidget: End(),
    }),
});
