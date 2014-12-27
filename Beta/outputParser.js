/// <reference path="base.ts"/>

var OutputParser = (function () {
    function OutputParser() {
    }
    OutputParser.start = function () {
        this.position = startPosition;
        var functions = outputHandler.output;

        for (var i = 0; i < functions.length; i++) {
            this.functionPositions[i] = this.position.clone();

            var sidewards = this.getMaxSidewards(functions[i]);

            this.updatePosition(function () {
                OutputParser.position.z -= sidewards;
            }, function () {
                OutputParser.position.z += sidewards;
            }, function () {
                OutputParser.position.z -= sidewards;
            }, function () {
                OutputParser.position.z += sidewards;
            });
        }

        for (var i = 0; i < functions.length; i++) {
            var source = functions[i];
            this.position = this.functionPositions[i].clone();
            this.parseFunction(source);
        }

        api.save();
    };
    OutputParser.getMaxSidewards = function (source) {
        var sidewards = 2;
        var splitted = source.split(';');
        for (var i = 0; i < splitted.length; i++) {
            var splittedCall = splitted[i].split('|');
            if (splittedCall.length > sidewards) {
                sidewards = splittedCall.length;
            }
        }
        return sidewards;
    };

    OutputParser.parseFunction = function (source) {
        if (source == '')
            return;

        var calls = source.split(';');

        for (var i = 0; i < calls.length; i++) {
            var _call = calls[i].trim();

            if (_call == '')
                continue;

            this.parseCall(_call);

            this.updatePosition(function () {
                OutputParser.position.x--;
            }, function () {
                OutputParser.position.x++;
            }, function () {
                OutputParser.position.z--;
            }, function () {
                OutputParser.position.z++;
            });
        }
    };

    OutputParser.parseCall = function (source) {
        if (source.length < 1)
            return;

        switch (source[0]) {
            case 'c':
                var command = source.substring(1);
                api.placeCommandBlock(command, this.position.x, this.position.y, this.position.z);
                break;
            case 'q':
                var qCommand = source.substring(1);

                api.placeCommandBlock(qCommand, this.position.x, this.position.y, this.position.z);

                var torchPos = new Vector3(this.position.x, this.position.y + 1, this.position.z);
                api.placeBlock(75, 5, torchPos.x, torchPos.y, torchPos.z);

                var resetCbPos = new Vector3(this.position.x, this.position.y + 2, this.position.z);
                var escapedCommand = qCommand.replace("\"", "\\\"");
                var resetCommand = "setblock ~ ~-2 ~ minecraft:command_block 0 replace {Command:\"%cmd%\"}".replace("%cmd%", escapedCommand);
                api.placeCommandBlock(resetCommand, resetCbPos.x, resetCbPos.y, resetCbPos.z);
                break;
            case 'b':
                var blockInfo = source.substring(1).split('_');
                api.placeBlock(parseInt(blockInfo[0]), parseInt(blockInfo[1]), this.position.x, this.position.y, this.position.z);
                break;
            case 's':
                var calls = source.substring(1).split('|');

                var oldPos = this.position.clone();
                direction++;
                for (var i = 0; i < calls.length; i++) {
                    this.parseCall(calls[i].trim());
                    this.updatePosition(function () {
                        OutputParser.position.x--;
                    }, function () {
                        OutputParser.position.x++;
                    }, function () {
                        OutputParser.position.z--;
                    }, function () {
                        OutputParser.position.z++;
                    });
                }
                direction--;
                this.position = oldPos;
                break;
            case 'e':
                var ePosition = this.functionPositions[source.substring(1)];

                var offX = ePosition.x - this.position.x;
                var offY = ePosition.y - this.position.y;
                var offZ = ePosition.z - this.position.z;

                var eCommand = "setblock ~" + offX + " ~" + offY + " ~" + offZ + " minecraft:redstone_block 0 replace";

                api.placeCommandBlock(eCommand, this.position.x, this.position.y, this.position.z);
                break;
            case 'n':
                var lines = source.substring(1).split('_');
                var signDirection = lines[lines.length - 1];
                lines[lines.length - 1] = '';
                api.placeSign(lines, parseInt(signDirection), this.position.x, this.position.y, this.position.z);
                break;
            default:
                api.log("Unknown Source: '" + source + "'");
                break;
        }
    };

    OutputParser.updatePosition = function (xMinus, xPlus, zMinus, zPlus) {
        switch (direction) {
            case 0:
                zMinus();
                break;
            case 1:
                xPlus();
                break;
            case 2:
                zPlus();
                break;
            case 3:
                xMinus();
                break;
        }
    };
    OutputParser.direction = 1;

    OutputParser.functionPositions = {};
    return OutputParser;
})();
