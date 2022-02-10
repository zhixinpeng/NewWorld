import { GameState } from './Shared'
import BulletGroup from './BulletGroup'
import Hero from './Hero'
import EnemyGroup from './EnemyGroup'
import BuffGroup from './BuffGroup'
import Enemy from './Enemy'
import EnemyBulletGroup from './EnemyBulletGroup'

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

  @property(cc.Node)
  private gameOverMask: cc.Node = null

  @property(cc.Label)
  private currestScoreLabel: cc.Label = null

  @property(cc.Label)
  private bestScoreLabel: cc.Label = null

  @property(EnemyBulletGroup)
  private enemyBulletGroup: EnemyBulletGroup = null

  @property(cc.Node)
  private pauseBackButton: cc.Node = null

  public currentState: GameState
  public score: number = 0
  public bombNumber: number = 0
  public isGameOver: boolean = false
  public bestScore: number = 0

  protected onLoad(): void {
    this.currentState = GameState.start
    this.score = 0
    this.bombNumber = 0
    this.isGameOver = false
    this.scoreDisplay.string = `${this.score}`
    this.bombDisplay.string = `${this.bombNumber}`
    this.bestScore = 0
    this.bestScoreLabel.string = `Best Score: ${this.bestScore}`

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
  public showBackButtonPausing(bool: boolean) {
    this.pauseBackButton.active = bool
    if (bool) {
      this.pauseBackButton.opacity = 0
      this.pauseBackButton.scale = 0.95
      cc.tween(this.pauseBackButton).to(0.2, { scale: 1, opacity: 255 }).start()
    }
  }

  // 恢复行动
  public resumeAction() {
    this.enemyGroup.resumeAction()
    this.enemyBulletGroup.resumeAction()
    this.bulletGroup.resumeAction()
    this.buffGroup.resumeAction()
    this.hero.onDrag()
    this.pause.getComponent(cc.Sprite).spriteFrame = this.buttonSprite[0]
  }

  // 暂停行动
  public pauseAction() {
    this.enemyGroup.pauseAction()
    this.enemyBulletGroup.pauseAction()
    this.bulletGroup.pauseAction()
    this.buffGroup.pauseAction()
    this.hero.offDrag()
    this.pause.getComponent(cc.Sprite).spriteFrame = this.buttonSprite[1]
  }

  // 回到开始场景
  public backStartScene() {
    cc.director.loadScene('Start')
  }

  // 接到炸弹Buff
  public getBuffBomb() {
    const number = parseInt(this.bombDisplay.string)
    if (number < 3) this.bombDisplay.string = `${number + 1}`
  }

  // 使用炸弹
  public bombOnClick() {
    if (this.isGameOver) return
    const bombNumber = parseInt(this.bombDisplay.string)
    if (bombNumber > 0) {
      this.bombDisplay.string = `${bombNumber - 1}`
      this.removeAllEnemy()
    }
  }

  // 清除掉所有敌人与子弹
  public removeAllEnemy() {
    const children = this.enemyGroup.node.children
    for (let i = 0; i < children.length; i++) {
      const component: Enemy = children[i].getComponent('Enemy')
      component.hp = 0
      component.enemyOver(false)
    }
    const enemyBulletChildren = this.enemyBulletGroup.node.children
    for (let i = 0; i < enemyBulletChildren.length; i++) {
      this.enemyBulletGroup.bulletDied(enemyBulletChildren[i])
    }
  }

  // 游戏结束
  public gameOver() {
    this.isGameOver = true
    this.pauseAction()
    this.showGameOver()
  }

  // 显示游戏结束
  public showGameOver() {
    this.gameOverMask.active = true
    this.gameOverMask.opacity = 1
    cc.tween(this.gameOverMask).to(0.3, { opacity: 255 }).start()
    if (this.score > this.bestScore) {
      this.bestScore = this.score
    }
    this.bestScoreLabel.string = `Best Score: ${this.bestScore}`
    this.currestScoreLabel.string = `Current Score: ${this.score}`
  }

  // 再来一把
  public playAgain() {
    cc.tween(this.gameOverMask)
      .to(0.3, { opacity: 0 })
      .call(() => {
        cc.director.loadScene('Game')
      })
      .start()
  }
}
