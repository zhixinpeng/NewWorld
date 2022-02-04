const { ccclass, property } = cc._decorator
import BulletPosition from './BulletPosition'

@ccclass('BulletInfinite')
export default class BulletInfinite {
  @property('string')
  public name: string = ''

  @property('number')
  public freqTime: number = 0

  @property('number')
  public initPoolCount: number = 0

  @property(cc.Prefab)
  public prefab: cc.Prefab = null

  @property(BulletPosition)
  public position: BulletPosition[] = []
}
