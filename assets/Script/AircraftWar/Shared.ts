export enum GameState {
  none,
  start,
  stop,
  pause,
}

type NodeInfo = { name: string; initPoolCount: number; prefab: cc.Prefab }

export const initNodePool = (node: cc.Component, nodeInfo: NodeInfo) => {
  const name = nodeInfo.name
  const poolName = `${name}Pool`
  node[poolName] = new cc.NodePool()
  const initPoolCount = nodeInfo.initPoolCount
  for (let i = 0; i < initPoolCount; i++) {
    const newNode = cc.instantiate(nodeInfo.prefab)
    node[poolName].put(newNode)
  }
}

export const patchInitNodePool = (node: cc.Component, nodeInfoArray: NodeInfo[]) => {
  for (let i = 0; i < nodeInfoArray.length; i++) {
    const nodeInfo = nodeInfoArray[i]
    initNodePool(node, nodeInfo)
  }
}

export const genNewNode = (pool: cc.NodePool, prefab: cc.Prefab, nodeParent: cc.Node): cc.Node => {
  let newNode = null
  if (pool.size() > 0) {
    newNode = pool.get()
  } else {
    newNode = cc.instantiate(prefab)
  }
  nodeParent.addChild(newNode)
  return newNode
}

export const backToNodePool = (pool: cc.Component, poolNmae: string, node: cc.Node) => {
  pool[poolNmae].put(node)
}

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
