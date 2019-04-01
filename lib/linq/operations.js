"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Operations {
    constructor() {
        this._stack = [];
        this._removed = [];
    }
    add(operator) {
        this._stack.push(operator);
    }
    remove(operator) {
        var idx = this._stack.indexOf(operator);
        if (idx != -1) {
            this._removed.push(operator);
            operator.remove();
            return true;
        }
        return false;
    }
    first(o) {
        if (o == null)
            return this.values().next().value;
        for (let item of this.values())
            if (item.type === o || (typeof o == 'function' && item instanceof o))
                return item;
        return null;
    }
    *values() {
        while (true) {
            let reset;
            for (let item of this._stack) {
                if (this._removed.indexOf(item) >= 0)
                    continue;
                reset = yield item;
                if (reset === true)
                    break;
            }
            if (reset !== true) // continue while loop if it's resetted
                break;
        }
    }
}
exports.Operations = Operations;
//# sourceMappingURL=operations.js.map