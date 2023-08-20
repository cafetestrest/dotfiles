const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;
const { Box, Button, Label } = ags.Widget;

export const WorkspacesCustom = props => Box({
    ...props,
    className: 'hyprworkspaces panel-button',
    connections: [[Hyprland, box => {
        // remove every children
        box.get_children().forEach(ch => ch.destroy());

        // add a button for each workspace
        // const workspaces = 10;
        const { workspaces } = Hyprland;

        for (let i = 1; i <= 10; ++i) {
            if (!workspaces.has(i)) {
                continue;
            }

            let wsnum = i;
            if (i === 10) {
                wsnum = 0;
            }

            wsnum = wsnum.toString();

            box.add(Button({
                onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
                child: Label(`${wsnum}`),
                className: Hyprland.active.workspace.id == i ? 'focused' : '',
            }));

        }

        // make the box render it
        box.show_all();
    }]],
});
