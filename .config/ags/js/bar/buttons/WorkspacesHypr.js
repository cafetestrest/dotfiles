const { Hyprland } = ags.Service;
const { Box, Button, Label } = ags.Widget;
const { execAsync } = ags.Utils;

export default () => Box({
    className: 'hyprworkspaces panel-button',
    connections: [[Hyprland, box => {
        // remove every children
        box.get_children().forEach(ch => ch.destroy());

        // add a button for each workspace
        const numberOfWorkspaces = 10;
        const { workspaces } = Hyprland;

        for (let i = 1; i <= numberOfWorkspaces; ++i) {
            if (!workspaces.has(i)) {
                continue;
            }

            let wsnum = i;
            if (i === 10) {
                wsnum = 0;
            }

            box.add(Button({
                onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
                onScrollUp: () => execAsync(`hyprctl dispatch workspace +1`).catch(print),
                onScrollDown: () => execAsync(`hyprctl dispatch workspace -1`).catch(print),
                child: Label(`${wsnum.toString()}`),
                className: Hyprland.active.workspace.id == i ? 'focused' : '',
            }));
        }

        // make the box render it
        box.show_all();
    }]],
});
