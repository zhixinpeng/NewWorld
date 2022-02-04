import { GameState } from './Shared'
const { ccclass, property } = cc._decorator

@ccclass
export default class Hero extends cc.Component {
  @property
  private moveRatio: number = 1

  @property
  private hp: number = 10

  @property
  private initHp: number = 10

  @property
  private hpProgressWidth: number = 46

  @property(cc.Node)
  private hpProgressBar: cc.Node = null

  private currentX: number
  private currentState: GameState

  protected onLoad(): void {
    const manager = cc.director.getCollisionManager()
    manager.enabled = true
    this.currentState = GameState.none
    this.currentX = 0
    this.onDrag()

    this.node.x = 0
    this.node.y = -(this.node.parent.height / 2) + this.node.height / 2 + 12

    this.setHeroHPProgress()
  }

  public onDrag() {
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.dragStart, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this)
  }

  public offDrag(){
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.dragStart, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this)
  }

  private dragStart(event: cc.Event.EventTouch) {
    this.currentX = event.getLocation().x
  }

  private dragMove(event: cc.Event.EventTouch) {
    const target = event.getLocation()
    const location = this.node.getPosition()
    const minX = -this.node.parent.width / 2 + this.node.width / 2
    const maxX = -minX

    location.x += (target.x - this.currentX) * this.moveRatio

    this.currentX = target.x

    if (location.x < minX) location.x = minX
    if (location.x > maxX) location.x = maxX

    this.node.setPosition(location)
  }

  private setHeroHPProgress() {
    if (this.hp > 0) {
      this.hpProgressBar.width = (this.hp / this.initHp) * this.hpProgressWidth
    } else {
      this.hpProgressBar.width = 0
    }
  }

  onCollisionEnter(other: cc.Component, self: cc.Component) {
    // console.log(other, self)
  }
}
