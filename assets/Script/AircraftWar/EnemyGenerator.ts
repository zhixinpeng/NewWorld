const { ccclass, property } = cc._decorator

@ccclass('EnemyGenerator')
export default class EnemyGenerator {
  @property('string')
  public name: string = ''

  @property('number')
  public initPoolCount: number = 0

  @property('number')
  public freqTime: number = 0

  @property(cc.Prefab)
  public prefab: cc.Prefab = null
}
