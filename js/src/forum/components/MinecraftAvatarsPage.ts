import Button from "flarum/common/components/Button";
import Switch from "flarum/common/components/Switch";
import User from "flarum/common/models/User";
import app from "flarum/forum/app";
import UserPage from "flarum/forum/components/UserPage";

const trans = (key: string) => {
    return app.translator.trans(`nearata-minecraft-avatars.forum.${key}`);
};

export default class MinecraftAvatarsPage extends UserPage {
    switchLoading!: boolean;
    loading!: boolean;
    user!: User;
    avatar!: string;

    oninit(vnode: any): void {
        super.oninit(vnode);

        this.show(app.session.user!);

        app.setTitle(trans("page_title").toString());

        this.switchLoading = false;
        this.loading = false;
        this.avatar = this.user.attribute("minotar");
    }

    content() {
        return [
            m(".MinecraftAvatarsPage", [
                m(".Form", [
                    m(".Form-group", [
                        m("input", {
                            type: "name",
                            name: "minotar",
                            class: "FormControl",
                            placeholder: trans("placeholder"),
                            oninput: (e) => (this.avatar = e.target.value),
                            autocomplete: "off",
                            value: this.avatar,
                        }),
                        m("p.helpText", trans("help_text")),
                    ]),
                    m(".Form-group", [
                        m(
                            Button,
                            {
                                class: "Button Button--primary Button--block",
                                disabled:
                                    this.loading ||
                                    this.avatar ===
                                        this.user.attribute("minotar") ||
                                    this.avatar.length < 3,
                                onclick: (e) => {
                                    this.loading = true;

                                    this.user
                                        .save({ minotar: this.avatar })
                                        .then(
                                            () => {
                                                delete this.user.avatarColor;

                                                this.loading = false;
                                                this.avatar =
                                                    this.user.attribute(
                                                        "minotar"
                                                    );

                                                m.redraw();
                                            },
                                            () => {
                                                this.loading = false;
                                                m.redraw();
                                            }
                                        );
                                },
                            },
                            trans("submit_button")
                        ),
                    ]),
                    m(".Form-group", [
                        m(
                            Switch,
                            {
                                state: this.user.attribute("minotarEnabled"),
                                onchange: (value: boolean) => {
                                    this.switchLoading = true;

                                    this.user
                                        .save({ minotarEnabled: value })
                                        .then(() => {
                                            delete this.user.avatarColor;

                                            this.switchLoading = false;

                                            m.redraw();
                                        });
                                },
                                loading: this.switchLoading,
                            },
                            trans("minotar_enabled")
                        ),
                    ]),
                ]),
            ]),
        ];
    }
}
