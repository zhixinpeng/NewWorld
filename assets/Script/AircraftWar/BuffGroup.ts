import { backToNodePool, GameState, genNewNode, patchInitNodePool } from './Shared'
import BuffGenerator from './BuffGenerator'
import Enemy from './Enemy'

const { ccclass, property } = cc._decorator

@ccclass
export default class BuffGroup extends cc.Component {
  @property(BuffGenerator)
  public buffArray: BuffGenerator[] = []

  public currentState: GameState

  protected onLoad(): void {
    this.currentState = GameState.start
    patchInitNodePool(this, this.buffArray)
  }

  // 回收Buff
  public buffDied(node: cc.Node) {
    const poolName = node.getComponent('Buff').poolName
    backToNodePool(this, poolName, node)
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

  // 生成Buff
  public createHeroBuff(node: cc.Node) {
    const enemy: Enemy = node.getComponent('Enemy')
    for (let i = 0; i < this.buffArray.length; i++) {
      if (enemy.buffType === this.buffArray[i].name) {
        if (Math.random() <= this.buffArray[i].probability) {
          this.getNewBuff(this.buffArray[i], node)
        }
      }
    }
  }

  // 获取新的Buff
  public getNewBuff(buff: BuffGenerator, node: cc.Node) {
    const poolName = `${buff.name}Pool`
    const newNode = genNewNode(this[poolName], buff.prefab, this.node)
    const nodePosition = node.getPosition()
    const newPosition = cc.v2(nodePosition.x, nodePosition.y)
    newNode.setPosition(newPosition)
    newNode.getComponent('Buff').poolName = poolName
  }
}
