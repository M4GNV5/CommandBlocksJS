/// <reference path="../API.ts"/>

module Entities
{

	export class Player extends Selector
	{
		name: string;

		constructor(name: string)
		{
			super();

			this.name = name;
		}

		toString(): string
		{
			return this.name;
		}
	}
}
