﻿

var component = function () {
    //A component for storing Powered By The Apocalypse-style moves.

    this.getId = function () {
        return "dc-pbta-moves"
    }

    // A component should know how to handle some events
    // called when Wanderer is ready to talk to us
    // a component talks to the rest of the app throught a communicator
    // the communicator will call the components methods like OnNewCharacter and OnSave at the appropreat time
    // the communicator also allows know what to have to write also holds the infomation 
    // all events are optional
    this.OnStart = function (communicator,dependencies) {
        this.communicator = communicator
        this.Dependencies = dependencies
    }
    // called when a new character is created
    this.OnNewCharacter = function () {
        // something like:
        //this.key = "value";
    }
    // called when a character is saved
    this.OnSave = function () {
        // something like:
        //this.communicator.write("key",this.key);
    }
    // called when a characrer is loaded 
    this.OnLoad = function () {
        // something like:
        // if (this.communicator.canRead("key")){
        //this.key = this.communicator.read("key");
        //}else{
        //this.key = "default value"
        //}
    }
    this.OnUpdate = function () {
    }

    this.getRequires = function () {
        return ["dc-pbta-moves"];
    }

    this.getPublic = function () {
        return {
            getDescription: function () {
                return "This is a unimplemented componet";
            },
            getVersion: function () {
                return 1;
            }
        }
    }

    // a component should be able to provide some infomation
    this.getHmtl = function () {
        return "modules/" + this.getId() + "/page.html"
    }
    this.getTitle = function () {
        return "Moves";
    }

    this.OnNewCharacter();

    //Module-specific components
    this.moveslist = [{
        title: "Go Aggro",
        leadin: "When you",
        conditions: "go aggro on someone,",
        body: "roll +hard. On a 10+, they have to choose: Force your hand and suck it up, or cave and do what you want."
    }];

}

g.Wanderer.register(component);
