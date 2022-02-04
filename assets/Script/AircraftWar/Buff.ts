import BuffGroup from './BuffGroup'
import { GameState } from './Shared'

const { ccclass, property } = cc._decorator

@ccclass
export default class Buff extends cc.Component {
  @property
  public xMinSpeed: number = 0

  @property
  public xMaxSpeed: number = 0

  @property
  public yMinSpeed: number = 0

  @property
  public yMaxSpeed: number = 0

  private xSpeed: number = 0
  private ySpeed: number = 0
  private buffGroup: BuffGroup

  protected onLoad(): void {
    this.xSpeed = Math.random() * (this.xMaxSpeed - this.xMinSpeed) + this.xMinSpeed
    if (Math.ceil(Math.random() * 10) < 5) this.xSpeed = -this.xSpeed
    this.ySpeed = Math.random() * (this.yMaxSpeed - this.yMinSpeed) + this.yMinSpeed
    this.buffGroup = this.node.parent.getComponent('BuffGroup')
  }

  protected update(dt: number): void {
    if (this.buffGroup.currentState !== GameState.start) return
    let newX = this.node.x
    let newY = this.node.y
    newX += dt * this.xSpeed
    newY += dt * this.ySpeed
    if (newX <= -(this.node.parent.width - this.node.width) / 2) {
      newX = (this.node.parent.width - this.node.width) / 2
      this.xSpeed = -this.xSpeed
    } else if (newX >= (this.node.parent.width - this.node.width) / 2) {
      newX = (this.node.parent.width - this.node.width) / 2
      this.xSpeed = -this.xSpeed
    } else {
      this.node.x = newX
    }
    this.node.y = newY
    if (this.node.y < -this.node.parent.height / 2) {
      this.buffGroup.buffDied(this.node)
    }
  }

  onCollisionEnter(other: cc.Component, self: cc.Component) {
    this.buffGroup.buffDied(self.node)
  }
}
