import EnemyBullet from './EnemyBullet'
import EnemyBulletInfinite from './EnemyBulletInfinite'
import EnemyBulletPosition from './EnemyBulletPosition'
import { backToNodePool, GameState, genNewNode, initNodePool } from './Shared'

const { ccclass, property } = cc._decorator

@ccclass
export default class EnemyBulletGroup extends cc.Component {
  @property(EnemyBulletInfinite)
  private enemyBulletInfinite: EnemyBulletInfinite = null

  public currentState: GameState

  protected onLoad(): void {
    this.currentState = GameState.start
    initNodePool(this, this.enemyBulletInfinite)
  }

  // 暂停行动
  public pauseAction() {
    this.enabled = false
    this.currentState = GameState.pause
  }

  // 恢复行动
  public resumeAction() {
    this.enabled = true
    this.currentState = GameState.start
  }

  // 回收节点
  public bulletDied(node: cc.Node) {
    const poolName = node.getComponent('EnemyBullet').poolName
    backToNodePool(this, poolName, node)
  }

  // 开火
  public getNewBullet(node: cc.Node) {
    const poolName = `${this.enemyBulletInfinite.name}Pool`
    for (let i = 0; i < this.enemyBulletInfinite.position.length; i++) {
      const newNode = genNewNode(this[poolName], this.enemyBulletInfinite.prefab, this.node)
      const newPosition = this.getBulletPosition(this.enemyBulletInfinite.position[i], node)
      newNode.setPosition(newPosition)
      const newNodeComponent = newNode.getComponent('EnemyBullet')
      newNodeComponent.poolName = poolName
      newNodeComponent.ySpeed = node.getComponent('Enemy').ySpeed - 50
    }
  }

  // 获取子弹初始位置
  public getBulletPosition(position: EnemyBulletPosition, node: cc.Node): cc.Vec2 {
    const nodePosition = node.getPosition()
    const newX = nodePosition.x + parseFloat(position.xAis)
    const newY = nodePosition.y + parseFloat(position.yAxis)
    return cc.v2(newX, newY)
  }
}
