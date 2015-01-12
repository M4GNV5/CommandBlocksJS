module Scoreboard
{
	export class MathOperation
	{
		static addition = new MathOperation("+=");
		static subtraction = new MathOperation("-=");
		static multiplication = new MathOperation("*=");
		static integerDivision = new MathOperation("/=");
		static modularDivision = new MathOperation("%=");
		static assign = new MathOperation("=");
		static min = new MathOperation("<");
		static max = new MathOperation(">");
		static swap = new MathOperation("><");

		operator: string;

		constructor(operation: string)
		{
			this.operator = operation;
		}
	}
}
