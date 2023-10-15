import { App, Service, Utils } from '../imports.js';

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
            'lock': [`/home/${Utils.USER}/.config/scripts/idle.sh l`, 'Lock'],
            'sleep': [`/home/${Utils.USER}/.config/scripts/idle.sh s`, 'Sleep'],
            'reboot': ['systemctl reboot', 'Reboot'],
            'logout': [`loginctl terminate-user ${Utils.USER}`, 'Log Out'],
            'shutdown': ['shutdown now', 'Shutdown'],
        }[action];

        this.notify('cmd');
        this.notify('title');
        this.emit('changed');
        App.closeWindow('powermenu');
        // App.openWindow('verification');
        Utils.exec(this._cmd);
    }
}

export default new PowerMenu();
