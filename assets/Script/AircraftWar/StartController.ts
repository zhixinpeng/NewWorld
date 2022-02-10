const { ccclass, property } = cc._decorator

@ccclass
export default class StartController extends cc.Component {
  protected onLoad(): void {
    cc.director.preloadScene('Game')
  }

  public startGame() {
    cc.director.loadScene('Game')
  }
}
