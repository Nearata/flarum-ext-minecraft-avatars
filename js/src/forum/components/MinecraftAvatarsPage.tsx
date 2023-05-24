import Button from "flarum/common/components/Button";
import Switch from "flarum/common/components/Switch";
import User from "flarum/common/models/User";
import Stream from "flarum/common/utils/Stream";
import app from "flarum/forum/app";
import UserPage from "flarum/forum/components/UserPage";
import type Mithril from "mithril";

const trans = (key: string) => {
  return app.translator.trans(`nearata-minecraft-avatars.forum.${key}`);
};

export default class MinecraftAvatarsPage extends UserPage {
  switchLoading!: boolean;
  loading!: boolean;
  user!: User;
  avatar!: Stream<string>;

  oninit(vnode: any): void {
    super.oninit(vnode);

    this.show(app.session.user!);

    this.switchLoading = false;
    this.loading = false;
    this.avatar = Stream(this.user.attribute("minotar") || "");
  }

  oncreate(vnode: Mithril.VnodeDOM<this>): void {
    super.oncreate(vnode);

    app.setTitle(trans("page_title").toString());
  }

  content() {
    return (
      <div class="MinecraftAvatarsPage">
        <div class="Form">
          <div class="Form-group">
            <input
              class="FormControl"
              type="text"
              name="minotar"
              placeholder={trans("placeholder")}
              autocomplete="off"
              bidi={this.avatar}
            />
            <p class="helpText">{trans("help_text")}</p>
          </div>
          <div class="Form-group">
            <Button
              class="Button Button--primary Button--block"
              disabled={
                this.loading ||
                this.avatar() === this.user.attribute("minotar") ||
                this.avatar().length < 3
              }
              onclick={this.onButtonClick.bind(this)}
            >
              {trans("submit_button")}
            </Button>
          </div>
          <div class="Form-group">
            <Switch
              state={this.user.attribute("minotarEnabled")}
              loading={this.switchLoading}
              disabled={this.switchLoading}
              onchange={this.onSwitchChange.bind(this)}
            >
              {trans("minotar_enabled")}
            </Switch>
          </div>
        </div>
      </div>
    );
  }

  onButtonClick(e: PointerEvent) {
    this.loading = true;

    this.user
      .save({ minotar: this.avatar() })
      .then(() => {
        // @ts-expect-error
        delete this.user.avatarColor;

        this.avatar(this.user.attribute("minotar"));
      })
      .catch((e) => console.error(e))
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  onSwitchChange(value: boolean) {
    this.switchLoading = true;

    this.user
      .save({ minotarEnabled: value })
      .then(() => {
        // @ts-expect-error
        delete this.user.avatarColor;
      })
      .catch((e) => console.error(e))
      .finally(() => {
        this.switchLoading = false;
        m.redraw();
      });
  }
}
