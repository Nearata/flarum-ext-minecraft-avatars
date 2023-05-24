import MinecraftAvatarsPage from "./components/MinecraftAvatarsPage";
import LinkButton from "flarum/common/components/LinkButton";
import { extend } from "flarum/common/extend";
import User from "flarum/common/models/User";
import app from "flarum/forum/app";
import UserPage from "flarum/forum/components/UserPage";

app.initializers.add("nearata-minecraft-avatars", () => {
  app.routes.minecraftAvatars = {
    path: "/minecraft-avatars",
    component: MinecraftAvatarsPage,
  };

  const baseUrl = "https://crafatar.com";
  const defaults = new Set(["MHF_Steve", "MHF_Alex"]);
  const nilUuid = "00000000-0000-0000-0000-000000000000";
  const validate =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-9a-f]{8}[0-9a-f]{4}[1-5][0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12})$/i;

  User.prototype.avatarUrl = function () {
    let minotar: string | null = this.attribute("minotar");
    const avatar: string | null = this.attribute("avatarUrl");

    if (!minotar) {
      return avatar;
    }

    if (!this.attribute("minotarEnabled")) {
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

  extend(UserPage.prototype, "navItems", function (items) {
    if (app.session.user !== this.user) {
      return;
    }

    items.add(
      "nearataMinecraftAvatars",
      m(
        LinkButton,
        {
          icon: "fas fa-cloud-upload-alt",
          href: app.route("minecraftAvatars"),
        },
        app.translator.trans(
          "nearata-minecraft-avatars.forum.userpage_nav_button"
        )
      ),
      1
    );
  });
});
