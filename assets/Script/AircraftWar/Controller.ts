import { GameState } from './Shared'
import BulletGroup from './BulletGroup'
import Hero from './Hero'
import EnemyGroup from './EnemyGroup'
import BuffGroup from './BuffGroup'

const { ccclass, property } = cc._decorator

@ccclass
export default class Controller extends cc.Component {
  @property(Hero)
  private hero: Hero = null

  @property(BulletGroup)
  private bulletGroup: BulletGroup = null

  @property(EnemyGroup)
  private enemyGroup: EnemyGroup = null

  @property(BuffGroup)
  private buffGroup: BuffGroup = null

  @property(cc.Label)
  private scoreDisplay: cc.Label = null

  @property(cc.Label)
  private bombDisplay: cc.Label = null

  @property(cc.Node)
  private bomb: cc.Node = null

  @property(cc.Button)
  private pause: cc.Button = null

  @property(cc.SpriteFrame)
  private buttonSprite: cc.SpriteFrame[] = []

  public currentState: GameState
  public score: number = 0
  public bombNumber: number = 0
  public isGameOver: boolean = false

  protected onLoad(): void {
    this.currentState = GameState.start
    this.score = 0
    this.bombNumber = 0
    this.isGameOver = false
    this.scoreDisplay.string = `${this.score}`
    this.bombDisplay.string = `${this.bombNumber}`

    this.bulletGroup.startAction()
    this.enemyGroup.startAction()
  }

  public gainScore(score: number) {
    if (this.isGameOver) return
    this.score += score
    this.scoreDisplay.string = `${this.score}`
  }

  public getScore() {
    return parseInt(this.scoreDisplay.string)
  }

  public pauseClick() {
    if (!this.isGameOver) {
      if (this.currentState === GameState.pause) {
        this.resumeAction()
        this.currentState = GameState.start
        this.showBackButtonPausing(false)
      } else if (this.currentState === GameState.start) {
        this.pauseAction()
        this.currentState = GameState.pause
        this.showBackButtonPausing(true)
      }
    }
  }

  // 显示返回按钮
  showBackButtonPausing(bool: boolean) {}

  resumeAction() {
    this.enemyGroup.resumeAction()
    this.bulletGroup.resumeAction()
    this.buffGroup.resumeAction()
    this.hero.onDrag()
    this.pause.getComponent(cc.Sprite).spriteFrame = this.buttonSprite[0]
  }

  pauseAction() {
    this.enemyGroup.pauseAction()
    this.bulletGroup.pauseAction()
    this.buffGroup.pauseAction()
    this.hero.offDrag()
    this.pause.getComponent(cc.Sprite).spriteFrame = this.buttonSprite[1]
  }

  backStartScene() {}
}
