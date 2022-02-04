import BulletInfinite from './BulletInfinite'
import BulletLimited from './BulletLimited'
import BulletPosition from './BulletPosition'
import { backToNodePool, GameState, genNewNode, initNodePool, patchInitNodePool } from './Shared'

const { ccclass, property } = cc._decorator

@ccclass
export default class BulletGroup extends cc.Component {
  @property(cc.Node)
  private hero: cc.Node = null

  @property(BulletInfinite)
  private bulletInfinite: BulletInfinite = null

  @property(BulletLimited)
  private bulletLimited: Array<BulletLimited> = []

  public currentState: GameState
  private bulletCallback: Function
  private isDeadBullet: boolean

  protected onLoad(): void {
    this.isDeadBullet = false
    this.currentState = GameState.none
    initNodePool(this, this.bulletInfinite)
    patchInitNodePool(this, this.bulletLimited)
  }

  public startAction() {
    this.currentState = GameState.start
    this.getNewBullet(this.bulletInfinite)
    this.bulletCallback = () => {
      this.getNewBullet(this.bulletInfinite)
      this.isDeadBullet = false
    }
    this.schedule(this.bulletCallback, this.bulletInfinite.freqTime)
  }

  public resumeAction() {
    this.enabled = true
    this.currentState = GameState.start
  }

  public pauseAction() {
    this.enabled = false
    this.currentState = GameState.pause
  }

  public getNewBullet(bullet: BulletInfinite) {
    const poolName = `${bullet.name}Pool`
    for (let i = 0; i < bullet.position.length; i++) {
      const newBullet = genNewNode(this[poolName], bullet.prefab, this.node)
      const newPosition = this.getBulletPosition(bullet.position[i])
      newBullet.setPosition(newPosition)
      newBullet.getComponent('Bullet').poolName = poolName
    }
  }

  public getBulletPosition(position: BulletPosition): cc.Vec2 {
    const heroPosition = this.hero.getPosition()
    const newX = heroPosition.x + parseFloat(position.xAis)
    const newY = heroPosition.y + parseFloat(position.yAxis)
    return cc.v2(newX, newY)
  }

  public bulletDied(node: cc.Node) {
    const poolName = node.getComponent('Bullet').poolName
    backToNodePool(this, poolName, node)
  }
}
