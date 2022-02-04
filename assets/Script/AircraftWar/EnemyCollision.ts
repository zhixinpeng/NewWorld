import Bullet from './Bullet'
import Enemy from './Enemy'

const { ccclass } = cc._decorator

@ccclass
export default class EnemyCollision extends cc.Component {
  protected onLoad(): void {
    const manager = cc.director.getCollisionManager()
    manager.enabled = true
  }

  // 碰撞检测
  onCollisionEnter(other: cc.Component, self: cc.Component) {
    if (self.node.group === 'enemy') {
      const enemy: Enemy = this.node.parent.getComponent('Enemy')
      if (other.node.group === 'heroBullet') {
        const bullet: Bullet = other.node.getComponent('Bullet')
        if (enemy.hp > 0) {
          enemy.hp -= bullet.damage
        } else {
          return
        }
        if (enemy.hp <= 0) {
          this.node.group = 'default'
          enemy.enemyOver(false)
          return
        }
      } else if (other.node.group === 'hero') {
        enemy.hp = 0
        enemy.enemyOver(true)
      }
    }
  }
}
