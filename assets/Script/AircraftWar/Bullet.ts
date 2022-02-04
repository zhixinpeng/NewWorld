import BulletGroup from './BulletGroup'
import { GameState } from './Shared'

const { ccclass, property } = cc._decorator

@ccclass
export default class Bullet extends cc.Component {
  @property
  private xSpeed: number = 0

  @property
  private ySpeed: number = 250

  @property
  public damage: number = 1

  private bulletGroup: BulletGroup

  protected onLoad(): void {
    const manager = cc.director.getCollisionManager()
    manager.enabled = true
    this.bulletGroup = this.node.parent.getComponent('BulletGroup')
  }

  // 子弹位置更新及回收
  protected update(dt: number): void {
    if (this.bulletGroup.currentState !== GameState.start) return
    this.node.x += dt * this.xSpeed
    this.node.y += dt * this.ySpeed
    if (this.node.y > this.node.parent.height / 2) this.bulletGroup.bulletDied(this.node)
  }

  // 碰撞检测
  onCollisionEnter(other: cc.Component, self: cc.Component) {
    this.bulletGroup.bulletDied(self.node)
  }
}
