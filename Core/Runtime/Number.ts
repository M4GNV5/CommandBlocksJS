/// <reference path="../API.ts"/>

module Runtime
{
	export interface Number extends Variable<number>
	{
		Score: Scoreboard.Objective;
		Selector: Entities.Selector;

		operation(operator: string, other: number): void;
		operation(operator: string, other: Number): void;

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
	}
}
