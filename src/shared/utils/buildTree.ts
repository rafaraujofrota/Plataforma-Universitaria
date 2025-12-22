interface recursiveEntity {
    id: string,
    parentId?: string | null,
    children?: recursiveEntity[]
}

export default function buildTree(entityList: recursiveEntity[]) {
    const map = new Map()
    const roots: any = []

    entityList.forEach(entity => {
        entity.children = []
        map.set(entity.id, entity)
    })

    entityList.forEach(entity => {
        if(entity.parentId) {
            const parent = map.get(entity.parentId)
            if (parent) parent.children.push(entity)
        } else {
            roots.push(entity)
        }
    })

    return roots
}