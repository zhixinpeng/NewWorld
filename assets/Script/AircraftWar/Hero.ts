import BulletGroup from './BulletGroup'
import Controller from './Controller'
import Enemy from './Enemy'
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

  @property(BulletGroup)
  private bulletGroup: BulletGroup = null

  @property(cc.Node)
  private heroDropHp: cc.Node = null

  private currentX: number
  private currentY: number
  private currentState: GameState
  private controller: Controller

  protected onLoad(): void {
    const manager = cc.director.getCollisionManager()
    manager.enabled = true
    this.currentState = GameState.none
    this.currentX = 0
    this.currentY = 0
    this.onDrag()

    this.node.x = 0
    this.node.y = -(this.node.parent.height / 2) + this.node.height / 2 + 12

    this.setHeroHPProgress()
    this.controller = cc.find('Controller').getComponent('Controller')
  }

  public onDrag() {
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.dragStart, this)
    this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this)
  }

  public offDrag() {
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.dragStart, this)
    this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this)
  }

  private dragStart(event: cc.Event.EventTouch) {
    this.currentX = event.getLocation().x
    this.currentY = event.getLocation().y
  }

  private dragMove(event: cc.Event.EventTouch) {
    const target = event.getLocation()
    const location = this.node.getPosition()
    const minX = -this.node.parent.width / 2 + this.node.width / 2
    const maxX = -minX
    const minY = -this.node.parent.height / 2 + this.node.height / 2
    const maxY = -minY

    location.x += (target.x - this.currentX) * this.moveRatio
    location.y += (target.y - this.currentY) * this.moveRatio

    this.currentX = target.x
    this.currentY = target.y

    if (location.x < minX) location.x = minX
    if (location.x > maxX) location.x = maxX
    if (location.y < minY) location.y = minY
    if (location.y > maxY) location.y = maxY

    this.node.setPosition(location)
  }

  private setHeroHPProgress() {
    if (this.hp > 0) {
      this.hpProgressBar.width = (this.hp / this.initHp) * this.hpProgressWidth
    } else {
      this.hpProgressBar.width = 0
    }
  }

  protected onCollisionEnter(other: cc.Component, self: cc.Component) {
    if (other.node.group === 'buff') {
      if (other.node.name === 'buffBullet') {
        this.bulletGroup.changeBullet(other.node.name)
      } else if (other.node.name === 'buffBomb') {
        this.controller.getBuffBomb()
      } else if (other.node.name === 'buffHeart') {
        if (this.initHp - this.hp >= 5) {
          this.hp += 5
        } else {
          this.hp = this.initHp
        }
      }
    } else if (other.node.group === 'enemy') {
      const enemy: Enemy = other.node.parent.getComponent('Enemy')
      this.hp -= enemy.heroDropHp
      other.node.group = 'default'
      if (this.hp > 0) this.heroHitByEnemyShowBlood()
    } else {
      return false
    }

    this.setHeroHPProgress()
    if (this.hp <= 0) {
      const animation = this.node.getComponent(cc.Animation)
      animation.play('bomb')
      animation.on('finished', this.onFinished, this)
      this.controller.gameOver()
    }
  }

  // ?????????????????????
  private heroHitByEnemyShowBlood() {
    this.heroDropHp.active = true
    this.heroDropHp.opacity = 0
    cc.tween(this.heroDropHp)
      .to(0.2, { opacity: 100 })
      .to(0.2, { opacity: 0 })
      .call(() => {
        this.heroDropHp.active = false
      })
      .start()
  }

  private onFinished() {
    this.node.destroy()
  }
}
