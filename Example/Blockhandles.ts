/// <reference path="../Core/API.ts"/>

var handle = new Block.BlockHandle(new Util.Vector3(0, 8, 0), "wool", 0);

function fill(x, y, w, h, color)
{
	handle.data = color;
	handle.fill(x, 8 + y, 0, x + w - 1, 8 + y + h - 1, 0);
}

// pretty ugly code but the output looks nice:
// http://i.imgur.com/bJkpFjW.png

fill(0, 0, 16, 9, Block.BlockColor.cyan);

fill(0, 2, 2, 1, Block.BlockColor.green);
fill(1, 3, 7, 1, Block.BlockColor.green);
fill(7, 2, 4, 1, Block.BlockColor.green);
fill(10, 1, 6, 1, Block.BlockColor.green);
fill(2, 6, 3, 2, Block.BlockColor.green);
fill(9, 5, 3, 2, Block.BlockColor.green);
fill(3, 8, 1, 1, Block.BlockColor.green);
fill(10, 7, 1, 1, Block.BlockColor.green);

fill(0, 0, 16, 1, Block.BlockColor.brown);
fill(0, 1, 10, 1, Block.BlockColor.brown);
fill(2, 2, 5, 1, Block.BlockColor.brown);
fill(3, 4, 1, 2, Block.BlockColor.brown);
fill(10, 3, 1, 2, Block.BlockColor.brown);

fill(14, 6, 2, 1, Block.BlockColor.yellow);
fill(13, 7, 3, 2, Block.BlockColor.yellow);