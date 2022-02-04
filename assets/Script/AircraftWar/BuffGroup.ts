import { backToNodePool, GameState, patchInitNodePool } from './Shared'
import BuffGenerator from './BuffGenerator'

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

  public buffDied(node: cc.Node) {
    const poolName = node.getComponent('Buff').poolName
    backToNodePool(this, poolName, node)
  }

  public resumeAction() {
    this.enabled = true
    this.currentState = GameState.start
  }

  public pauseAction() {
    this.enabled = false
    this.currentState = GameState.pause
  }

  public createHeroBuff(node: cc.Node) {}
}
