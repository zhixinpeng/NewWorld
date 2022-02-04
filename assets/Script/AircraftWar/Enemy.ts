import BuffGroup from './BuffGroup'
import EnemyGroup from './EnemyGroup'
import { GameState } from './Shared'

const { ccclass, property } = cc._decorator

@ccclass
export default class Enemy extends cc.Component {
  @property
  private xMinSpeed: number = 0

  @property
  private xMaxSpeed: number = 0

  @property
  private yMinSpeed: number = 0

  @property
  private yMaxSpeed: number = 0

  @property
  private initHp: number = 0

  @property
  private score: number = 0

  @property
  private enemyType: number = 1

  @property
  private enemyBulletFreq: number = 5

  @property
  private heroDropHp: number = 5

  @property
  private initSize: number = 30

  @property
  private buffType: string = 'none'

  @property(cc.Node)
  private nodeCollision: cc.Node = null

  @property(cc.Node)
  private image: cc.Node = null

  @property(cc.ParticleSystem)
  private particleSystemA: cc.ParticleSystem = null

  @property(cc.ParticleSystem)
  private particleSystemB: cc.ParticleSystem = null

  hp: number = 0

  private xSpeed: number
  private ySpeed: number
  private enemyGroup: EnemyGroup
  private buffGroup: BuffGroup

  protected onLoad(): void {
    this.xSpeed = Math.random() * (this.xMaxSpeed - this.xMinSpeed) + this.xMinSpeed
    if (this.xMaxSpeed && Math.ceil(Math.random() * 10) < 5) this.xSpeed = -this.xSpeed
    this.ySpeed = Math.random() * (this.yMaxSpeed - this.yMinSpeed) + this.yMinSpeed
    this.enemyGroup = this.node.parent.getComponent('EnemyGroup')
    this.buffGroup = cc.find('Canvas/Buff Group').getComponent('BuffGroup')
  }

  public init() {
    if (this.node.group !== 'enemy') this.node.group = 'enemy'
    if (this.initHp !== this.hp) this.hp = this.initHp
    this.image.active = true
    this.nodeCollision.group = 'enemy'
    if (this.particleSystemA && this.particleSystemB) {
      this.particleSystemA.resetSystem()
      this.particleSystemB.resetSystem()
    }
  }

  protected update(dt: number): void {
    if (this.enemyGroup.currentState !== GameState.start) return
    if (this.hp === 0) return
    let x = this.node.x
    x += dt * this.xSpeed
    if (x <= -(this.node.parent.width - this.node.width) / 2) {
      x = (this.node.parent.width - this.node.width) / 2
      this.xSpeed = -this.xSpeed
    } else if (x >= (this.node.parent.width - this.node.width) / 2) {
      x = (this.node.parent.width - this.node.width) / 2
      this.xSpeed = -this.xSpeed
    } else {
      this.node.x = x
    }
    const score = this.enemyGroup.getScore()
    if (this.enemyType === 1) {
      if (score <= 500000) {
        this.node.y += dt * this.ySpeed
      } else if (score > 500000 && score <= 1000000) {
        this.node.y += dt * this.ySpeed - 0.5
      } else if (score > 1000000 && score <= 2000000) {
        this.node.y += dt * this.ySpeed - 1
      } else if (score > 2000000 && score <= 3000000) {
        this.node.y += dt * this.ySpeed - 1.5
      } else if (score > 3000000 && score <= 4000000) {
        this.node.y += dt * this.ySpeed - 2
      } else {
        this.node.y += dt * this.ySpeed
      }
    } else {
      this.node.y += dt * this.ySpeed
    }

    if (this.node.y < -this.node.parent.height / 2 - this.node.height / 2) {
      this.enemyGroup.enemyDied(this.node, 0)
    }
  }

  // 敌人被消灭
  public enemyOver(isHero: boolean) {
    let score = 0
    const animation = this.node.getComponent(cc.Animation)
    const animationName = 'bomb'
    if (!isHero) score = this.score
    this.image.active = false
    this.buffGroup.createHeroBuff(this.node)
    if (this.particleSystemA && this.particleSystemB) {
      this.particleSystemA.stopSystem()
      this.particleSystemB.stopSystem()
    }
    animation.play(animationName)
    animation.on('finished', () => {
      this.node.getComponent(cc.Sprite).spriteFrame = null
      this.node.width = this.initSize
      this.node.height = this.initSize
      this.enemyGroup.enemyDied(this.node, score)
    })
  }
}
