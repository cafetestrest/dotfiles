import { Widget, App, Applications } from '../imports.js';
import Separator from '../misc/Separator.js';
import PopupWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';
import { launchApp } from '../utils.js';

const WINDOW_NAME = 'applauncher';

const AppItem = app => Widget.Button({
    className: 'app',
    onClicked: () => {
        App.closeWindow(WINDOW_NAME);
        launchApp(app);
    },
    child: Widget.Box({
        children: [
            Widget.Icon({
                icon: app.iconName,
                size: 20,
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Label({
                        className: 'title',
                        label: app.name,
                        xalign: 0,
                        valign: 'center',
                        ellipsize: 3,
                    }),
                    Widget.Label({
                        className: 'description',
                        label: app.description || '',
                        wrap: true,
                        xalign: 0,
                        justification: 'left',
                        valign: 'center',
                    }),
                ],
            }),
        ],
    }),
});

const Applauncher = () => {
    const list = Widget.Box({ vertical: true });

    const placeholder = Widget.Label({
        label: " Couldn't find a match",
        className: 'placeholder',
    });

    const entry = Widget.Entry({
        hexpand: true,
        text: '-',
        placeholderText: 'Search',
        onAccept: ({ text }) => {
            const list = Applications.query(text);
            if (list[0]) {
                App.toggleWindow(WINDOW_NAME);
                launchApp(list[0]);
            }
        },
        onChange: ({ text }) => {
            function containsMathOperation(text) {
                // Define a regular expression to match mathematical operators
                const mathOperationRegex = /[+\-*/]/;

                // Use the test method to check if the text contains a math operation
                return mathOperationRegex.test(text);
            }

            let mathResult = null;

            if (containsMathOperation(text)) {
                try {
                    mathResult = eval(text);
                } catch (error) {
                    // do nothing
                }
            }

            list.children = Applications.query(text).map(app => [
                // Separator(),
                AppItem(app),
            ]).flat();
            list.add(Separator({ className: 'app-separator'}));
            list.show_all();

            // if there is no apps being shown and there is math result, show it as a result
            if (list.children.length === 1 && containsMathOperation(text) && mathResult) {
                list.add(Widget.Label({
                    className: 'math-result',
                    label: 'Result: ' + text + ' = ' + mathResult,
                }));
                list.show_all();
            }

            placeholder.visible = list.children.length === 1;
        },
    });

    return Widget.Box({
        className: 'applauncher',
        properties: [['list', list]],
        vertical: true,
        children: [
            Widget.Box({
                className: 'header',
                children: [
                    Widget.Icon(icons.apps.search),
                    entry,
                ],
            }),
            Widget.Box({
                className: 'header-separator',
            }),
            Widget.Scrollable({
                className: 'scrollable',
                hscroll: 'never',
                child: Widget.Box({
                    vertical: true,
                    children: [list, placeholder],
                }),
            }),
        ],
        connections: [[App, (_, name, visible) => {
            if (name !== WINDOW_NAME)
                return;

            entry.set_text('');
            if (visible)
                entry.grab_focus();
        }]],
    });
};

export default () => PopupWindow({
    name: WINDOW_NAME,
    content: Applauncher(),
});
