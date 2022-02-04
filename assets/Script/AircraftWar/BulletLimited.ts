import BulletInfinite from './BulletInfinite'

const { ccclass, property } = cc._decorator

@ccclass('BulletLimited')
export default class BulletLimited extends BulletInfinite {
  @property('number')
  public limitedTime: number = 0

  @property('string')
  public originName: string = ''
}
