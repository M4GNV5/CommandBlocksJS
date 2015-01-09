module Entities
{
	export class EntityType
	{
		static DroppedItem = new EntityType("Item");
		static ExperienceOrb = new EntityType("XPOrb");

		static Leash = new EntityType("LeashKnot");
		static Painting = new EntityType("Painting");
		static ItemFrame = new EntityType("ItemFrame");
		static ArmorStand = new EntityType("ArmorStand");
		static EnderCrystal = new EntityType("EnderCrystal");

		static Arrow = new EntityType("Arrow");
		static Snowball = new EntityType("Snowball");
		static FireballGhast = new EntityType("Fireball");
		static FireballBlaze = new EntityType("SmallFireball");
		static EnderPearl = new EntityType("ThrownEnderpearl");
		static EnderEye = new EntityType("EyeOfEnderSignal");
		static Potion = new EntityType("ThrownPotion");
		static ExperienceBottle = new EntityType("ThrownExpBottle");
		/** Alias for ExperienceBottle */
		static BottleOEnchanting = new EntityType("ThrownExpBottle");
		static WitherSkull = new EntityType("WitherSkull");
		static Firework = new EntityType("FireworksRocketEntity");

		static TNT = new EntityType("PrimedTnt");
		static FallingBlock = new EntityType("FallingSand");

		static Boat = new EntityType("FallingSand");
		static Minecart = new EntityType("MinecartRideable");
		static MinecartChest = new EntityType("MinecartChest");
		static MinecartFurnace = new EntityType("MinecartFurnace");
		static MinecartTNT = new EntityType("MinecartTNT");
		static MinecartCommandBlock = new EntityType("MinecartCommandBlock");
		static MinecartHopper = new EntityType("MinecartHopper");
		static MinecartWithSpawner = new EntityType("MinecartSpawner");

		static Mob = new EntityType("Mob");
		static Player = new EntityType("Player");

		static Creeper = new EntityType("Creeper");
		static Skeleton = new EntityType("Skeleton");
		static Spider = new EntityType("Spider");
		static Giant = new EntityType("Giant");
		static Zombie = new EntityType("Zombie");
		static Slime = new EntityType("Slime");
		static Ghast = new EntityType("Ghast");
		static ZombiePigman = new EntityType("PigZombie");
		static Enderman = new EntityType("Enderman");
		static CaveSpider = new EntityType("CaveSpider");
		static Silverfish = new EntityType("Silverfish");
		static Blaze = new EntityType("Blaze");
		static MagmaCube = new EntityType("LavaSlime");
		static EnderDragon = new EntityType("EnderDragon");
		static Wither = new EntityType("WitherBoss");
		static Witch = new EntityType("Witch");
		static Endermite = new EntityType("Endermite");
		static Guardian = new EntityType("Guardian");

		static Bat = new EntityType("Bat");
		static Pig = new EntityType("Pig");
		static Sheep = new EntityType("Sheep");
		static Cow = new EntityType("Cow");
		static Chicken = new EntityType("Chicken");
		static Squid = new EntityType("Squid");
		static Wolf = new EntityType("Wolf");
		static MushroomCow = new EntityType("MushroomCow");
		static SnowMan = new EntityType("SnowMan");
		/** Alias for SnowMan */
		static SnowGolem = new EntityType("SnowMan");
		static Ocelot = new EntityType("Ocelot");
		/** Alias for Ocelot */
		static Ozelot = new EntityType("Ozelot");
		static IronGolem = new EntityType("VillagerGolem");
		static Horse = new EntityType("EntityHorse");
		static Rabbit = new EntityType("Rabbit");

		static Villager = new EntityType("Villager");

		static LightningBolt = new EntityType("LightningBolt");

		name: string;
		constructor(name: string)
		{
			assert(["Item", "XPOrb", "LeashKnot", "Painting", "ItemFrame", "ArmorStand", "EnderCrystal", "Arrow", "Snowball", "Fireball", "SmallFireball", "ThrownEnderpearl", "EyeOfEnderSignal", "ThrownPotion", "ThrownExpBottle", "ThrownExpBottle", "WitherSkull", "FireworksRocketEntity", "PrimedTnt", "FallingSand", "FallingSand", "MinecartRideable", "MinecartChest", "MinecartFurnace", "MinecartTNT", "MinecartCommandBlock", "MinecartHopper", "MinecartSpawner", "Mob", "Player", "Creeper", "Skeleton", "Spider", "Giant", "Zombie", "Slime", "Ghast", "PigZombie", "Enderman", "CaveSpider", "Silverfish", "Blaze", "LavaSlime", "EnderDragon", "WitherBoss", "Witch", "Endermite", "Guardian", "Bat", "Pig", "Sheep", "Cow", "Chicken", "Squid", "Wolf", "MushroomCow", "SnowMan", "SnowMan", "Ocelot", "Ozelot", "VillagerGolem", "EntityHorse", "Rabbit", "Villager", "LightningBolt"]
				.indexOf(name) != -1, "Unknown EntityType: " + name);
			this.name = name;
		}
	}
}
