import { Operator, OperatorType } from './operator';

export class SelectOperator<TEntity> extends Operator<TEntity> {
    private selector: (it: TEntity) => {}
    
    constructor(selector:  string | ((it: TEntity) => {})) {
        super(OperatorType.Select);

        if(typeof selector == 'string') {
            let keys = selector ? selector.split(',').map(sel => sel.trim()) : []

            this.selector = (it) => remapper(keys, it)
        }
        else {
            this.selector = selector
        }
    }

    public* evaluate(items: Iterable<TEntity>): IterableIterator<any> {
        let idx = 0;

        for (let item of items) {
            yield this.selector(item)
        }
    }

    public async * evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<any> {
        let idx = 0;

        for await (let item of items) {
            yield this.selector(item)
        }
    }
}

function remapper(keys: string[], object: Record<string, any>): Record<string, any> {
    if(!keys || keys.length == 0)
        return object

    let remapped = {},
        groups: { [key: string]: string[] } = {}

    for(let key of keys) {
        let match = /([^/]+)\/(.*)/i.exec(key)

        if(match) {
            if(!groups[match[1]]) 
                groups[match[1]] = []

            groups[match[1]].push(match[2])
        }
        else {
            remapped[key] = object[key]
        }
    }

    for(let [prop, keys] of Object.entries(groups)) {
        remapped[prop] = remapper(keys, object[prop])
    }

    return remapped
}