//region say & tellraw
function tellraw(data, options)
{
	say(data, options);
}
function say(data, options)
{
	options = options || {};
	options.selector = options.selector || "@a";
	options.useTellraw = options.useTellraw || true;

	if(!options.useTellraw)
	{
		command("say "+data);
		return;
	}

	data = data || "CommandBlocksJS error invalid call 'say();'";
	if(typeof data != 'object' && typeof data != 'array')
		data = [{text: data}];
	else if(typeof data == 'object')
		data = [data];

	var cmd = 'tellraw '+options.selector+' {"text":"", "extra":[';
	cmd += parseObjectToJson(data[0]);

	for(var i = 1; i < data.length; i++)
	{
		cmd += ','+parseObjectToJson(data[i]);
	}

	for(var key in options)
	{
		if(key != "selector" && key != "useTellraw")
			cmd += ','+'"'+key+'":'+options[key];
	}

	cmd += ']}';

	command(cmd);
}
//enregion

//region execute
function execute(selector, cmd, position, detect)
{
	selector = selector || '@a';
	cmd = cmd || "say CommandBlocksJS error invalid call 'execute();'";

	position = position || "~ ~ ~";
	detect = detect || false;

	if(detect === false)
	{
		command("execute "+selector+" "+position+" "+cmd);
	}
	else
	{
		command("execute "+selector+" "+position+" detect "+detect+" "+cmd);
	}
}
//endregion

function parseObjectToJson(obj)
{
	var json = '{';
	for(var key in obj)
	{
		if(json != '{')
			json += ',';
		json += '"'+key+'":"'+obj[key]+'"';
	}
	json += '}';

	return json;
}
