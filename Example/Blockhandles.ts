/// <reference path="../Core/API.ts"/>

var block_screen = new Array<Block.BlockHandle>();
for (var x = 0; x < 16; x++)
{
	for (var y = 0; y < 9; y++)
	{
		// Add every handle for easier setting of blocks
		var b = new Block.BlockHandle(x, 8 + y, 0, "wool", Block.WoolColor.black);
		block_screen.push(b);
	}
}

var handle = new Block.BlockHandle(new Util.Vector3(0, 8, 0), "wool", Block.WoolColor.black);
handle.fill(0, 8, 0, 15, 16, 0);

function getHandle(x: number, y: number): Block.BlockHandle
{
	return block_screen[x + y * 16];
}