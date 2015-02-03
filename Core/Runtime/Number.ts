/// <reference path="../API.ts"/>

module Runtime
{
	export interface Number extends Variable<number>
	{
		set(value: number, mode?: NumberSetMode): void;
		set(value: Number, mode?: NumberSetMode): void;

		add(other: number): void;
		add(other: Number): void;

		remove(other: number): void;
		remove(other: Number): void;

		multiplicate(other: number): void;
		multiplicate(other: Number): void;

		divide(other: number): void;
		divide(other: Number): void;

		swap(other: Number): void;

		clone(cloneName?: string): Number;

		toInteger(): Integer;
	}
}
