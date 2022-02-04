import EnemyBulletPosition from "./EnemyBulletPosition"

const { ccclass, property } = cc._decorator

@ccclass('EnemyBulletInfinite')
export default class EnemyBulletInfinite {
  @property('string')
  public name: string = ''

  @property('number')
  public freqTime: number = 0

  @property('number')
  public initPoolCount: number = 0

  @property(cc.Prefab)
  public prefab: cc.Prefab = null

  @property(EnemyBulletPosition)
  public position: EnemyBulletPosition[] = []
}
