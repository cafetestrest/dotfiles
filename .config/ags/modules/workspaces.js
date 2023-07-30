const { Widget } = ags;
const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;

Widget.widgets['workspaces-custom'] = props => Widget({
    ...props,
    type: 'box',
    className: 'workspaces-custom',
    // box is an instance of Gtk.Box
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

            wsnum = i;
            if (i === 10) {
                wsnum = 0;
            }

            box.add(ags.Widget({
                type: 'button',
                onClick: () => execAsync(`hyprctl dispatch workspace ${i}`),
                child: wsnum.toString(),
                className: Hyprland.active.workspace.id == i ? 'focused' : '',
            }));

        }

        // make the box render it
        box.show_all();
    }]],
});

const forFixed = box => {
    box.get_children().forEach(ch => ch.destroy());
    const { workspaces } = Hyprland;
    for (let i=1; i<fixed+1; ++i) {
        if (workspaces.has(i)) {
            const { windows } = workspaces.get(i);
            box.add(button(windows, i));
            // box.add(button(0, i));
        } else {
            box.add(button(0, i));
        }
    }
};