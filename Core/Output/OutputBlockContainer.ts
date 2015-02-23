/// <reference path="./../API.ts"/>

module Output
{
	export interface OutputBlockContainer extends OutputBlock
	{
		member: OutputBlock[];
	}
} 