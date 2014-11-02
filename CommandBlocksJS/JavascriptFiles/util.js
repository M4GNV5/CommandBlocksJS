//region utility functions
function callOnce(callback, placeRepeater)
{
	call(function()
	{
		command("setblock ~-1 ~ ~ minecraft:air 0 replace", true);
		callback();
	}, placeRepeater);
}
function validate(cmd, callback, placeRepeater)
{
	if(placeRepeater !== false)
		delay();

	sidewards(function()
		{
			queryCommand(cmd, false);
			comparator();
			call(callback, false);
		});
}
function validateSync(cmd, placeRepeater)
{
	cmd = cmd || 'say CommandBlocksJS error invalid call "validateSync();"';
	queryCommand(cmd, placeRepeater);
	comparator();
}
function testfor(statement, callback, placeRepeater)
{
	validate('testfor '+statement, callback, placeRepeater);
}
function testforSync(statement, placeRepeater)
{
	validateSync('testfor '+statement, placeRepeater);
}
function testfornot(statement, callback, placeRepeater)
{
	if(placeRepeater !== false)
		delay();

	sidewards(function()
	{
		queryCommand("testfor "+statement, false);
		comparator();
		block(1);
	});
	delay();
	sidewards(function()
	{
		command("setblock ~-1 ~ ~2 minecraft:unpowered_repeater 1", false);
		delay();
		delay();
		call(callback, false);
	});
}
//endregion

//region timer
function timer(time, callback)
{
	var t = new Timer(callback, {time: time});
	t.start();
	return t;
}
function Timer(callback, options)
{
	if(typeof callback == 'undefined')
		throw "Cannot create timer without callback!";

	options = options || {};
	options.time = options.time || 10;
	options.useScoreboard = options.useScoreboard || (options.tick >= 40) ? true : false;
	options.hardTickLength = options.hardTickLength || 10;
	options.callAsync = options.callAsync || false;
	options.scoreName = options.scoreName || Naming.next("timer");

	var timerScore;
	var scoreTicks;

	if(options.useScoreboard !== false)
	{
		scoreTicks = options.time / options.hardTickLength;
		options.time = options.hardTickLength;
		timerScore = new Score(options.scoreName, "dummy");
		timerScore.set(Selector.allPlayer(), -1);
	}

	var timerFunc = function()
	{
		if(options.useScoreboard == false)
		{
			if(options.callAsync)
				call(callback);
			else
				callback();
		}
		else
		{
			testforSync(timerScore.getSelector(0));
			timerScore.add(Selector.allPlayer(), 1);
			testfor(timerScore.getSelector(scoreTicks), function()
			{
				timerScore.set(Selector.allPlayer(), 0);
				callback();
			});
		}

		delay(options.time);
		call(timerFunc);
	}

	this.start = function()
	{
		if(options.useScoreboard)
		{
			testfor(timerScore.getSelector(-1, -1), timerFunc);
			timerScore.set(Selector.allPlayer(), 0);
		}
		else
		{
			call(timerFunc);
		}
	}
	this.stop = function()
	{
		if(options.useScoreboard == false)
			throw "Cannot stop timer that doesnt use the Scoreboard";
		timerScore.set(Selector.allPlayer(), -1);
	}
}
//endregion
