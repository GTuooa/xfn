
export function getUuidList(list) {
    const uuidListJs = list.toJS()
    let hash = {}
    const newUuidList = uuidListJs.reduce((item, next) => {
        hash[next.oriUuid] ? '' : hash[next.oriUuid] = true && item.push(next);
        return item
    }, [])
    const finalUuidList = newUuidList.length ? newUuidList.filter(v => v.oriUuid) : []

    return finalUuidList
}
