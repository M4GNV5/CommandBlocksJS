using System;

namespace CommandBlocksJS.Core
{
	public interface IWorldHandler
	{
		void PlaceBlock (int id, int data, IntVector3 position);
		void PlaceCommandBlock (string command, IntVector3 position);
		void Save();
	}
}

