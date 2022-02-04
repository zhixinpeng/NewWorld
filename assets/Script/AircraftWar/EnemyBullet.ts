import EnemyBulletGroup from './EnemyBulletGroup'
import { GameState } from './Shared'

const { ccclass, property } = cc._decorator

@ccclass
export default class EnemyBullet extends cc.Component {
  @property
  private xSpeed: number = 0

  @property
  private ySpeed: number = 0

  @property
  private hpDrop: number = 0

  private enemyBulletGroup: EnemyBulletGroup

  protected onLoad(): void {
    const manager = cc.director.getCollisionManager()
    manager.enabled = true
    this.enemyBulletGroup = this.node.parent.getComponent('EnemyBulletGroup')
  }

  protected update(dt: number): void {
    if (this.enemyBulletGroup.currentState !== GameState.start) return
    this.node.x += dt * this.xSpeed
    this.node.y += dt * this.ySpeed
    if (this.node.y < -this.node.parent.height / 2) this.enemyBulletGroup.bulletDied(this.node)
  }

  // 碰撞检测
  protected onCollisionEnter(other: cc.Component, self: cc.Component) {
    if (other.node.group === 'hero' || other.node.group === 'heroBullet') {
      this.enemyBulletGroup.bulletDied(this.node)
    }
  }
}
