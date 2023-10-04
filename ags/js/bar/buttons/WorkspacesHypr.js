import { Hyprland, Widget, Utils } from '../../imports.js';

export default () => Widget.Box({
    className: 'hyprworkspaces panel-button',
    connections: [[Hyprland, box => {
        // remove every children
        box.get_children().forEach(ch => ch.destroy());

        // add a button for each workspace
        const numberOfWorkspaces = 10;

        for (let i = 1; i <= numberOfWorkspaces; ++i) {
            if (Hyprland.getWorkspace(i)?.id !== i) {
                continue;
            }

            let wsnum = i;
            if (i === 10) {
                wsnum = 0;
            }

            box.add(Widget.Button({
                onClicked: () => Utils.execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
                onScrollUp: () => Utils.execAsync(`hyprctl dispatch workspace +1`).catch(print),
                onScrollDown: () => Utils.execAsync(`hyprctl dispatch workspace -1`).catch(print),
                child: Widget.Label(`${wsnum.toString()}`),
                className: Hyprland.active.workspace.id == i ? 'focused' : '',
            }));
        }

        // make the box render it
        box.show_all();
    }]],
});
