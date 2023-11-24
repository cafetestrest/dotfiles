// import { PopupContent } from '../bar/buttons/Weather.js';
// import PopupWindow from '../misc/PopupWindow.js';
// import Widget from 'resource:///com/github/Aylur/ags/widget.js';

// export default ({ anchor = ['top'], layout = 'top' } = {}) => PopupWindow({
//     name: 'weather',
//     layout,
//     anchor,
//     content: Widget.Box({
//         class_name: 'dashboard',
//         children: [
//             PopupContent(),
//         ],
//     }),
// });


import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PopupWindow from '../misc/PopupWindow.js';
import options from '../options.js';

export default () => PopupWindow({
    name: 'weather',
    connections: [[options.bar.position, self => {
        self.anchor = [options.bar.position.value];
        if (options.bar.position.value === 'top')
            self.transition = 'slide_down';

        if (options.bar.position.value === 'bottom')
            self.transition = 'slide_up';
    }]],
    child: Widget.Box({
        class_name: 'dashboard',
        children: [
//todo just updated? maybe something missing here, also remove comments up
            // PopupWindow(), 
        ],
    }),
});
