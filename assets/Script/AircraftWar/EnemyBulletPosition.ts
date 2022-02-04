const { ccclass, property } = cc._decorator

@ccclass('EnemyBulletPosition')
export default class EnemyBulletPosition {
  @property('string')
  public xAis: string = ''

  @property('string')
  public yAxis: string = ''
}
