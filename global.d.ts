
/// <reference types="react-scripts" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
declare module '*.less' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module 'react-split';
declare module "classnames" {
    import classNames from 'classnames'
    export default classNames
}

type RefType = MutableRefObject<unknown> | ((instance: unknown) => void)

type CommonObjectType<T = any> = Record<string, T>
