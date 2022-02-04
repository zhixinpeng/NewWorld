const { ccclass, property } = cc._decorator

@ccclass('BulletPosition')
export default class BulletPosition {
  @property('string')
  public xAis: string = ''

  @property('string')
  public yAxis: string = ''
}
