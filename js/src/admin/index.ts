import app from "flarum/admin/app";

app.initializers.add("nearata-minecraft-avatars", (app) => {
    app.extensionData.for("nearata-minecraft-avatars").registerSetting({
        setting: "nearata-minecraft-avatars.retrieve_avatar_on_register",
        type: "boolean",
        label: app.translator.trans(
            "nearata-minecraft-avatars.admin.retrieve_avatar_on_registering.label"
        ),
        help: app.translator.trans(
            "nearata-minecraft-avatars.admin.retrieve_avatar_on_registering.help"
        ),
    });
});
