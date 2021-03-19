import Button from 'flarum/common/components/Button';
import Modal from 'flarum/common/components/Modal';

export default class ChangeMinotarModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.success = false;
        this.oldMinotar = app.session.user.attribute('minotar');
        this.minotar = app.session.user.attribute('minotar');
    }

    className() {
        return 'NearataMinecraftAvatarsModal Modal--small';
    }

    title() {
        return app.translator.trans('nearata-minecraft-avatars.forum.title');
    }

    content() {
        return [
            m('.Modal-body', [
                m('.Form.Form--centered', [
                    this.success ? [
                        m('p.helpText', app.translator.trans('nearata-minecraft-avatars.forum.avatar_changed')),
                        m('.Form-group', [
                            m(Button, {
                                class: 'Button Button--primary Button--block',
                                onclick: this.hide.bind(this)
                            }, app.translator.trans('nearata-minecraft-avatars.forum.dismiss_button'))
                        ])
                    ] : [
                        m('p.helpText', app.translator.trans('nearata-minecraft-avatars.forum.help_text')),
                        m('.Form-group', [
                            m('input', {
                                type: 'name',
                                name: 'minotar',
                                class: 'FormControl',
                                placeholder: this.oldMinotar || 'Notch',
                                oninput: e => this.minotar = e.target.value,
                                disabled: this.loading,
                                autocomplete: 'off'
                            })
                        ]),
                        m('.Form-group', [
                            m(Button, {
                                class: 'Button Button--primary Button--block',
                                type: 'submit',
                                loading: this.loading
                            }, app.translator.trans('nearata-minecraft-avatars.forum.submit_button'))
                        ])
                    ]
                ])
            ]),
            m('.Modal-footer', [
                m('span', [
                    'Powered by ',
                    m('a', {
                        href: 'https://crafatar.com/',
                        target: '_blank'
                    }, 'Crafatar')
                ])
            ])
        ]
    }

    onsubmit(e) {
        e.preventDefault();

        if (this.minotar === this.oldMinotar) {
            this.hide();
            return;
        }

        this.loading = true;

        app.session.user.save({
            minotar: this.minotar
        }, {
            errorHandler: this.onerror.bind(this),
            meta: { minotar: this.minotar }
        })
        .then(() => this.success = true)
        .catch(() => {})
        .then(this.loaded.bind(this));
    }
}
