
declare module 'deepmerge' {
	/** Recursively merge values in a javascript object. */
	export default function mergeDeep<T, U>(orig: T, objects: U): T & U;
	export default function mergeDeep<T, U, V>(orig: T, objects1: U, objects2: V): T & U & V;
	export default function mergeDeep<T, U, V, W>(orig: T, objects1: U, objects2: V, objects3: W): T & U & V & W;
	export default function mergeDeep<T, U, V, W, X>(orig: T, objects1: U, objects2: V, objects3: W, objects4: X): T & U & V & W & X;
	export default function mergeDeep(target: any, ...sources: any[]): any;
}
