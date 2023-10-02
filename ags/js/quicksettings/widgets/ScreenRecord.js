import ScreenRecord from '../../services/screenrecord.js';
import { ArrowToggleButton, Menu, opened } from '../ToggleButton.js';
import icons from '../../icons.js';
const { Label, Box, Button, Icon } = ags.Widget;

// todo remove after
import Lockscreen from '../../services/lockscreen.js';

const recorders = [
    {
        name: 'Screenshot',
        icon: icons.screenshot,
        click: () => ScreenRecord.screenshot(true),
    },
    {
        name: 'Screenshot Select',
        icon: icons.select,
        click: () => ScreenRecord.screenshot(),
    },
    {
        name: 'Screen Record',
        icon: icons.recorder.recording,
        click: () => ScreenRecord.start(),
    },
    {
        name: 'Lockscreen',
        icon: icons.powermenu.lock,
        click: () => Lockscreen.lockscreen(),
    },
];

export const ScreenRecordToggle = () => ArrowToggleButton({
    name: 'screenrecord',
    icon: Icon(icons.screenshot),
    label: Label({ label: 'Screenshot' }),
    connection: [opened, () => opened.value === 'screenrecord'],
    activate: () => opened.setValue('screenrecord'),
    activateOnArrow: false,
    deactivate: () => { },
});

export const ScreenRecordSelector = () => Menu({
    name: 'screenrecord',
    icon: Icon(icons.screenshot),
    title: Label('Screenrecord Selector'),
    content: Box({
        vertical: true,
        children: recorders.map(({ name, icon, click }) => Button({
            hexpand: true,
            onClicked: click,
            child: Box({
                children: [
                    Icon(icon),
                    Label(name),
                ],
            }),
        }))
    }),
});
