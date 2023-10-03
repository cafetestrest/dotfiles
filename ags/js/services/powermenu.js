import { App, Service } from '../imports.js';

class PowerMenu extends Service {
    static {
        Service.register(this, {}, {
            'title': ['string'],
            'cmd': ['string'],
        });
    }

    get title() { return this._title || ''; }
    get cmd() { return this._cmd || ''; }

    action(action) {
        [this._cmd, this._title] = {
            'lock': [`/home/${ags.Utils.USER}/.config/scripts/idle.sh l`, 'Lock'],
            'sleep': [`/home/${ags.Utils.USER}/.config/scripts/idle.sh s`, 'Sleep'],
            'reboot': ['systemctl reboot', 'Reboot'],
            'logout': [`loginctl terminate-user ${ags.Utils.USER}`, 'Log Out'],
            'shutdown': ['shutdown now', 'Shutdown'],
        }[action];

        this.notify('cmd');
        this.notify('title');
        this.emit('changed');
        App.closeWindow('powermenu');
        // App.openWindow('verification');//todo if not working, check logic in verification (missing this: ags.Utils.exec(PowerMenu.instance.cmd))
    }
}

export default new PowerMenu();
