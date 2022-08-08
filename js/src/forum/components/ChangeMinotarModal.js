import app from "flarum/forum/app";
import Button from "flarum/common/components/Button";
import Modal from "flarum/common/components/Modal";

export default class ChangeMinotarModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.user = this.attrs.user;

        this.success = false;
        this.minotar = this.user.attribute("minotar");
    }

    className() {
        return "NearataMinecraftAvatarsModal Modal--small";
    }

    title() {
        return app.translator.trans("nearata-minecraft-avatars.forum.title");
    }

    content() {
        return [
            m(".Modal-body", [
                m(".Form.Form--centered", [
                    this.success
                        ? [
                              m(
                                  "p.helpText",
                                  app.translator.trans(
                                      "nearata-minecraft-avatars.forum.avatar_changed"
                                  )
                              ),
                              m(".Form-group", [
                                  m(
                                      Button,
                                      {
                                          class: "Button Button--primary Button--block",
                                          onclick: this.hide.bind(this),
                                      },
                                      app.translator.trans(
                                          "nearata-minecraft-avatars.forum.dismiss_button"
                                      )
                                  ),
                              ]),
                          ]
                        : [
                              m(
                                  "p.helpText",
                                  app.translator.trans(
                                      "nearata-minecraft-avatars.forum.help_text"
                                  )
                              ),
                              m(".Form-group", [
                                  m("input", {
                                      type: "name",
                                      name: "minotar",
                                      class: "FormControl",
                                      placeholder: app.translator.trans(
                                          "nearata-minecraft-avatars.forum.placeholder"
                                      ),
                                      oninput: (e) =>
                                          (this.minotar = e.target.value),
                                      disabled: this.loading,
                                      autocomplete: "off",
                                  }),
                              ]),
                              m(".Form-group", [
                                  m(
                                      Button,
                                      {
                                          class: "Button Button--primary Button--block",
                                          type: "submit",
                                          loading: this.loading,
                                      },
                                      app.translator.trans(
                                          "nearata-minecraft-avatars.forum.submit_button"
                                      )
                                  ),
                              ]),
                          ],
                ]),
            ]),
            m(".Modal-footer", [
                m("span", [
                    "Powered by ",
                    m(
                        "a",
                        {
                            href: "https://crafatar.com/",
                            target: "_blank",
                        },
                        "Crafatar"
                    ),
                ]),
            ]),
        ];
    }

    onsubmit(e) {
        e.preventDefault();

        if (this.minotar === this.user.attribute("minotar")) {
            this.hide();
            return;
        }

        this.loading = true;
        this.alertAttrs = null;

        this.user
            .save(
                {
                    minotar: this.minotar,
                },
                {
                    errorHandler: this.onerror.bind(this),
                    meta: { minotar: this.minotar },
                }
            )
            .then(() => (this.success = true))
            .catch(() => {})
            .then(this.loaded.bind(this));
    }

    loaded() {
        delete this.user.avatarColor;

        super.loaded();
    }
}
