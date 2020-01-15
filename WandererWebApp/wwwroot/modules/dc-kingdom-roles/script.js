﻿var DCKingdomRoles = {};

DCKingdomRoles.component = function () {
    
    /* LOCAL FUNCTIONS AND DEFINITIONS */
    this.roles = ["power", "perspective", "touchstone"];

    this.roleRulesRevealed = false;
    this.toggleRoleRules = function () {
        this.roleRulesRevealed = !this.roleRulesRevealed;
        angular.element(document).find('#dc-kingdom-roles .role_explanation_container p:not(:first-child)').toggleClass('revealed', this.roleRulesRevealed);
    };

    ///////////////////////////////////////////////////////
    
    // all component need a unique ID
    this.getId = function () {
        return "dc-kingdom-roles";
    };

    // A component should know how to handle some events
    // called when Wanderer is ready to talk to us
    // a component talks to the rest of the app throught a communicator
    // the communicator will call the components methods like OnNewCharacter and OnSave at the appropreat time
    // the communicator also allows know what to have to write also holds the infomation 
    // all events are optional
    this.OnStart = function (communicator, logger, page, dependencies) {
        this.communicator = communicator;
        this.Dependencies = dependencies;
    };
    // called when a new character is created
    this.OnNewCharacter = function () {
        this.selected_role = "";
    };
    // called when a character is saved
    this.OnSave = function () {
        // something like:
        //this.communicator.write("key",this.key);
    };
    // called when a characrer is loaded 
    this.OnLoad = function () {
        // something like:
        // if (this.communicator.canRead("key")){
        //this.key = this.communicator.read("key");
        //}else{
        //this.key = "default value"
        //}
    };
    this.OnUpdate = function () {
    };

    // hmm is it really safe for this to be a function?
    // we use functions so no one can edit
    this.getRequires = function () {
        // example of a populated list:
        // return ["colin-wielga-tools"]
        return [];
    };

    this.getPublic = function () {
        return {
            getVersion: function () {
                return 1;
            }
        };
    };
    // can your module be close?
    this.canClose = function () {
        return true;
    };
    // a component should be able to provide some infomation
    this.getHmtl = function () {
        return "modules/" + this.getId() + "/page.html";
    };

    this.getRulesHtml = function () {
        return "modules/" + this.getId() + "/rules.html";
    };

    this.getTitle = function () {
        return "Kingdom Roles";
    };

    this.OnNewCharacter();

};

g.services.componetService.registerCharacter(DCKingdomRoles.component);