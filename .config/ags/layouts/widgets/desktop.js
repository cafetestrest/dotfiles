const { Widget } = ags;
const { Theme } = ags.Service;

Widget.widgets['desktop'] = props => Widget({
    ...props,
    type: 'box',
    className: 'desktop',
    children: [{
        type: 'box',
        orientation: 'vertical',
        vexpand: true,
        hexpand: true,
        connections: [[Theme, box => {
            const [halign = 'center', valign = 'center', offset = 64] =
                Theme.getSetting('desktop_clock')?.split(' ') || [];

            box.halign = imports.gi.Gtk.Align[halign.toUpperCase()];
            box.valign = imports.gi.Gtk.Align[valign.toUpperCase()];
            box.setStyle(`margin: ${Number(offset)}px;`);
        }]],
        children: [
            // {
            //     type: 'box',
            //     className: 'clock-box',
            //     children: [{
            //         type: 'clock',
            //         className: 'clock',
            //         format: '%H:%M',
            //     }],
            // },
            // {
            //     type: 'clock',
            //     className: 'date',
            //     format: '%B %e. %A',
            // },
        ],
    }],
});
