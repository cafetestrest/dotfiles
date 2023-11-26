import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import HoverRevealer from '../../misc/HoverRevealer.js';
import * as mpris from '../../misc/mpris.js';
import options from '../../options.js';

export const getPlayer = (name = options.mpris.preferred.value) =>
    Mpris.getPlayer(name) || Mpris.players[0] || null;

/**
 * @param {Object} o
 * @param {import('types/service/mpris').MprisPlayer} o.player
 * @param {import('../../misc/HoverRevealer').HoverRevealProps['direction']=} o.direction
 */
const Indicator = ({ player, direction = 'right' }) => HoverRevealer({
    class_name: `media panel-button ${player.name}`,
    direction,
    on_primary_click: () => player.playPause(),
    on_scroll_up: () => player.next(),
    on_scroll_down: () => player.previous(),
    on_secondary_click: () => player.playPause(),
    indicator: mpris.PlayerIcon(player),
    child: Widget.Label({
        vexpand: true,
        truncate: 'end',
        max_width_chars: 40,
        connections: [[player, label => {
            label.label = `${player.track_artists.join(', ')}   ${player.track_title}   `;
        }]],
    }),
    connections: [[player, revealer => {
        if (revealer._current === player.track_title)
            return;

        function truncateString(inputString, maxLength) {
            if (!inputString) {
                return inputString;
            }

            if (inputString.length > maxLength) {
                return inputString.slice(0, maxLength);
            } else {
                return inputString;
            }
        }

        // revealer._current = player.track_title;
        revealer._current = truncateString(player.track_title, 50);

        revealer.reveal_child = true;
        Utils.timeout(3000, () => {
            revealer.reveal_child = false;
        });
    }]],
});

/**
 * @param {Object} o
 * @param {import('../../misc/HoverRevealer').HoverRevealProps['direction']=} o.direction
 */
export default ({ direction = 'right' } = {}) => {
    let current = null;

    const update = box => {
        const player = getPlayer();
        box.visible = !!player;

        if (player && player.position && player.position === -1) {
            box.visible = false;
            return;
        }

        if (!player) {
            current = null;
            return;
        }

        if (current === player)
            return;

        current = player;
        box.children = [
            mpris.PreviousButton(player),
            Indicator({ player, direction }),
            mpris.NextButton(player),
        ];
    };

    return Widget.Box({
        class_name: 'media-player',
        connections: [
            [options.mpris.preferred, update],
            [Mpris, update, 'notify::players'],
        ],
    });
};
