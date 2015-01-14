/// <reference path="./../API.ts"/>

module Util
{
	export class Naming
	{
		static names: { [index: string]: number } = {};

		/**
		 * Generates unique names with ´name´ as prefix. Will start at zero when giving a new name.
		 * @param name Prefix for unique name.
		 */
		static next(name: string): string
		{
			this.names[name] = this.names[name] || 0;
			this.names[name]++;
			return name + this.names[name];
		}
	}
}
