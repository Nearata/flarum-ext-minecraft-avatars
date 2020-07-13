import Button from 'flarum/components/Button';
import Modal from 'flarum/components/Modal';

export default class ChangeMinotarModal extends Modal {
    init() {
        this.success = false;
        this.oldMinotar = app.session.user.attribute('minotar');
        this.minotar = m.prop(app.session.user.attribute('minotar'));
    }

    className() {
        return 'ChangeMinecraftAvatarModal Modal--small';
    }

    title() {
        return app.translator.trans('nearata-minecraft-avatars.forum.title');
    }

    content() {
        if (this.success) {
            return (
                <div className="Modal-body">
                    <div className="Form Form--centered">
                        <p className="helpText">{app.translator.trans('nearata-minecraft-avatars.forum.avatar_changed')}</p>
                        <div className="Form-group">
                            <Button className="Button Button--primary Button--block" onclick={this.hide.bind(this)}>
                                {app.translator.trans('nearata-minecraft-avatars.forum.dismiss_button')}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="Modal-body">
                <div className="Form">
                    <p className="helpText">{app.translator.trans('nearata-minecraft-avatars.forum.help_text')}</p>
                    <div className="Form-group">
                        <input
                            type="name"
                            name="minotar"
                            className="FormControl"
                            placeholder={this.oldMinotar ? this.oldMinotar : 'Notch'}
                            bidi={this.minotar}
                            disabled={this.loading}
                            autocomplete="off"
                        />
                    </div>
                    <div className="Form-group">
                        {Button.component({
                            className: 'Button Button--primary Button--block',
                            type: 'submit',
                            loading: this.loading,
                            children: app.translator.trans('nearata-minecraft-avatars.forum.submit_button'),
                        })}
                    </div>
                    <small>
                        {app.translator.trans('nearata-minecraft-avatars.forum.note')}
                    </small>
                </div>
            </div>
        );
    }

    onsubmit(e) {
        e.preventDefault();

        if (this.minotar() === this.oldMinotar) {
            this.hide();
            return;
        }

        this.loading = true;

        app.session.user.save({
            minotar: this.minotar()
        }, {
            errorHandler: this.onerror.bind(this),
            meta: { minotar: this.minotar() }
        })
        .then(() => this.success = true)
        .catch(() => {})
        .then(this.loaded.bind(this));
    }
}