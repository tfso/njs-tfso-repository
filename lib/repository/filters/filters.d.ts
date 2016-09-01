import { IFilter } from './filter';
import { IFilterCriteria } from './filtercriteria';
export interface IFilters {
    groups: Array<IFilter>;
    getUnion(): Array<IFilterCriteria>;
    getIntersection(): Array<IFilterCriteria>;
}
export declare class Filters<TEntity> implements IFilters {
    private _groups;
    constructor(predicate: (it: TEntity) => boolean, ...parameters: any[]);
    groups: IFilter[];
    getUnion(): IFilterCriteria[];
    getIntersection(): IFilterCriteria[];
}
