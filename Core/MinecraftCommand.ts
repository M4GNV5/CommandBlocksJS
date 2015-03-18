/// <reference path="./API.ts"/>

class MinecraftCommand
{
	cmd: string;

	constructor(cmd: string)
	{
		this.cmd = cmd;
	}

	run(): void
	{
		command(this.cmd);
	}

	validate(callback?: Function, otherwise?: Function): void
	{
		usedLibs["integer"] = true;

		var name = Util.Naming.next("validate");
		command('summon ArmorStand ~ ~1 ~ {CustomName:"{0}",NoGravity:1,Invincible:1,PersistenceRequired:1}'.format(name));
		command('scoreboard players set @e[name={0}] stdInteger 0'.format(name));
		command('stats block ~1 ~ ~ set SuccessCount @e[name={0}] stdInteger'.format(name));
		command(this.cmd);

		var id: number;

		if (typeof callback != 'undefined')
		{
			id = outputHandler.addFunction(callback);
			outputHandler.addToCurrent(new Output.NestedCall(id, 'execute @e[name={0},score_stdInteger_min=1] ~4 ~-1 ~ %call%'.format(name)));
		}
		if (typeof otherwise != 'undefined')
		{
			id = outputHandler.addFunction(otherwise);
			outputHandler.addToCurrent(new Output.NestedCall(id, 'execute @e[name={0},score_stdInteger=0] ~5 ~-1 ~ %call%'.format(name)));
		}


		command('kill @e[name={0}]'.format(name));
	}

	validateOnce(callback: Function): void
	{
		var cmd = this.cmd;

		sidewards(function ()
		{
			command(cmd);
			comparator();
			call(callback);
		});
	}
}
