import Separator from '../misc/Separator.js';
import PopupWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';
const { App } = ags;
const { Applications } = ags.Service;
const { Label, Box, Icon, Button, Scrollable, Entry } = ags.Widget;

const AppItem = (app, window) => Button({
    className: 'app',
    connections: [['clicked', () => {
        App.closeWindow(window);
        app.launch();
    }]],
    child: Box({
        children: [
            Icon({
                icon: app.app.get_string('Icon'),
                size: 20,
            }),
            Box({
                vertical: true,
                children: [
                    Label({
                        className: 'title',
                        label: app.name,
                        xalign: 0,
                        valign: 'center',
                        ellipsize: 3,
                    }),
                    Label({
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

const Applauncher = ({ windowName = 'applauncher' } = {}) => {
    const list = Box({ vertical: true });
    const placeholder = Label({
        label: " Couldn't find a match",
        className: 'placeholder',
    });
    const entry = Entry({
        hexpand: true,
        placeholderText: 'Search',
        onAccept: ({ text }) => {
            const list = Applications.query(text);
            if (list[0]) {
                App.toggleWindow(windowName);
                list[0].launch();
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
                AppItem(app, windowName),
            ]).flat();
            list.add(Separator({ className: 'app-separator'}));
            list.show_all();

            // if there is no apps being shown and there is math result, show it as a result
            if (list.children.length === 1 && containsMathOperation(text) && mathResult) {
                list.add(Label({
                    className: 'math-result',
                    label: 'Result: ' + text + ' = ' + mathResult,
                }));
                list.show_all();
            }

            placeholder.visible = list.children.length === 1;
        },
    });

    return Box({
        className: 'applauncher',
        properties: [['list', list]],
        vertical: true,
        children: [
            Box({
                className: 'header',
                children: [
                    Icon(icons.apps.search),
                    entry,
                ],
            }),
            Box({
                className: 'header-separator',
            }),
            Scrollable({
                className: 'scrollable',
                hscroll: 'never',
                child: Box({
                    vertical: true,
                    children: [list, placeholder],
                }),
            }),
        ],
        connections: [[App, (_b, name, visible) => {
            if (name !== windowName)
                return;

            entry.set_text('-'); // force onChange
            entry.set_text('');
            if (visible)
                entry.grab_focus();
        }]],
    });
};

export default () => PopupWindow({
    name: 'applauncher',
    content: Applauncher(),
});
