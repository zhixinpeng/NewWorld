const { ccclass, property } = cc._decorator

@ccclass('BuffGenerator')
export default class BuffGenerator {
  @property('string')
  public name: string = ''

  @property('number')
  public initPoolCount: number = 0

  @property('number')
  public probability: number = 0.5

  @property(cc.Prefab)
  public prefab: cc.Prefab = null
}
