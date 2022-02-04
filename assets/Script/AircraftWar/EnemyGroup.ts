import { backToNodePool, GameState, genNewNode, patchInitNodePool } from './Shared'
import EnemyGenerator from './EnemyGenerator'
import Controller from './Controller'

const { ccclass, property } = cc._decorator

@ccclass
export default class EnemyGroup extends cc.Component {
  @property(EnemyGenerator)
  private enemyArray: EnemyGenerator[] = []

  public currentState: GameState
  public controller: Controller

  protected onLoad(): void {
    this.currentState = GameState.none
    patchInitNodePool(this, this.enemyArray)
    this.controller = cc.find('Controller').getComponent('Controller')
  }

  // 开始行动
  public startAction() {
    this.currentState = GameState.start
    for (let i = 0; i < this.enemyArray.length; i++) {
      const freqTime = this.enemyArray[i].freqTime
      const callback = 'callback_' + i
      this[callback] = function (e: number) {
        this.getNewEnemy(this.enemyArray[e])
      }.bind(this, i)
      this.schedule(this[callback], freqTime)
    }
  }

  // 恢复行动
  public resumeAction() {
    this.enabled = true
    this.currentState = GameState.start
  }

  // 暂停行动
  public pauseAction() {
    this.enabled = false
    this.currentState = GameState.pause
  }

  // 获取新敌人
  public getNewEnemy(enemy: EnemyGenerator) {
    const poolName = `${enemy.name}Pool`
    const newNode = genNewNode(this[poolName], enemy.prefab, this.node)
    const newPosition = this.getNewEnemyPosition(newNode)
    newNode.setPosition(newPosition)
    newNode.getComponent('Enemy').poolName = poolName
    newNode.getComponent('Enemy').init()
  }

  // 获取新敌人的位置
  public getNewEnemyPosition(node: cc.Node): cc.Vec2 {
    const randomX = (Math.random() * 2 - 1) * (this.node.parent.width / 2 - node.width / 2)
    const randomY = this.node.parent.height / 2 + node.height / 2
    return cc.v2(randomX, randomY)
  }

  // 获取当前总分数
  public getScore() {
    return this.controller.getScore()
  }

  // 敌人摧毁与计分
  public enemyDied(node: cc.Node, score: number) {
    const poolName = node.getComponent('Enemy').poolName
    backToNodePool(this, poolName, node)
    if (score > 0) this.controller.gainScore(score)
  }
}
