import { extend } from "flarum/common/extend";
import app from "flarum/forum/app";
import Button from "flarum/common/components/Button";
import User from "flarum/common/models/User";
import AvatarEditor from "flarum/forum/components/AvatarEditor";

import ChangeMinotarModal from "./components/ChangeMinotarModal";

app.initializers.add("nearata-minecraft-avatars", () => {
    const baseUrl = "https://crafatar.com";
    const defaults = new Set(["MHF_Steve", "MHF_Alex"]);
    const nilUuid = "00000000-0000-0000-0000-000000000000";
    const validate =
        /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-9a-f]{8}[0-9a-f]{4}[1-5][0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12})$/i;

    User.prototype.avatarUrl = function () {
        let minotar: string | null = this.attribute("minotar");
        const avatar: string | null = this.attribute("avatarUrl");

        if (!minotar || avatar) {
            return avatar;
        }

        const avatarUrl = new URL(baseUrl + "/avatars/");

        avatarUrl.searchParams.append("size", "64");

        if (!validate.test(minotar)) {
            if (defaults.has(minotar)) {
                avatarUrl.searchParams.append("default", minotar);
            } else {
                avatarUrl.searchParams.append("default", "MHF_Steve");
            }

            minotar = nilUuid;
        }

        avatarUrl.pathname += minotar;

        return avatarUrl.toString();
    };

    extend(AvatarEditor.prototype, "controlItems", function (items) {
        const minotar: string | null = this.attrs.user.attribute("minotar");
        const changeButton = app.translator.trans(
            "nearata-minecraft-avatars.forum.change_button"
        );
        const useButton = app.translator.trans(
            "nearata-minecraft-avatars.forum.use_button"
        );

        items.add(
            "nearataMinecraftAvatars",
            m(
                Button,
                {
                    icon: "fas fa-cloud-upload-alt",
                    onclick: () =>
                        app.modal.show(ChangeMinotarModal, {
                            user: this.attrs.user,
                        }),
                },
                minotar ? changeButton : useButton
            ),
            1
        );

        const avatarUrl = this.attrs.user.avatarUrl();

        if (avatarUrl === null) {
            return;
        }

        const url = new URL(avatarUrl);

        if (url.searchParams.has("default")) {
            items.remove("remove");
        }
    });

    extend(AvatarEditor.prototype, "remove", function () {
        const minotar: string | null = this.attrs.user.attribute("minotar");

        if (this.attrs.user.attribute("avatarUrl") != null) {
            return;
        }

        if (minotar === null) {
            return;
        }

        if (defaults.has(minotar)) {
            return;
        }

        this.attrs.user
            .save({
                minotar: "",
            })
            // @ts-ignore
            .then(this.success.bind(this), this.failure.bind(this));
    });
});
