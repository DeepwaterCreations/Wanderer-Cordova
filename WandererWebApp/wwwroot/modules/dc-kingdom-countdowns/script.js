var DCKingdomCountdowns = {};

DCKingdomCountdowns.component = function () {
    /* MODULE FUNCTIONS AND VARIABLES */

    NUM_PLAYERS = 5; //TODO: Make adjustable?

    this.countdown_list = [];
    that = this;
    ["Crossroads", "Crisis", "Time Passes"].forEach(function (title) {
        countdown = {
            title: title,
            boxlist: []
        }; 
        console.log(title);
        console.log(countdown.title);
        num_boxes = title === "Time Passes" ? NUM_PLAYERS : NUM_PLAYERS+1;
        for (i = 0; i < num_boxes; i++){
            countdown.boxlist.push(false);
        }
        that.countdown_list.push(countdown);
    });

    //Marks a box in the countdown if there are any to mark
    this.markBox = function (countdown) {
        i = countdown.boxlist.indexOf(false);  
        if(i > -1) {
            countdown.boxlist[i] = true;
        }
    };

    //Unmarks a box in the countdown if there are any marked
    this.unmarkBox = function (countdown) {
        i = countdown.boxlist.indexOf(false);
        if(i > 0) {
            countdown.boxlist[i-1] = false;
        } else if (i === -1) {
            countdown.boxlist[countdown.boxlist.length - 1] = false;
        }
    };

    ////////////////////////////////////

    // all component need a unique ID
    this.getId = function () {
        return "dc-kingdom-countdowns";
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

    this.OnNewCharacter = function () {
    };

    this.OnSave = function () {
        this.communicator.write("countdown_list", this.countdown_list);
    };

    this.OnLoad = function () {
        if (this.communicator.canRead("countdown_list")) {
            this.countdown_list = this.communicator.read("countdown_list");
        }
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
        return "Kingdom Countdowns";
    };

    this.OnNewCharacter();
};

g.services.componetService.registerCharacter(DCKingdomCountdowns.component);
