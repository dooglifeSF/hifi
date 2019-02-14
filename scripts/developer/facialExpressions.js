//
// facialExpressions.js
// A script to set different emotions using blend shapes
//
// Author: Elisa Lupin-Jimenez
// (extended for HMD controllers - Doug Wilcox 2/13/2019)
// Copyright High Fidelity 2018
//
// Licensed under the Apache 2.0 License
// See accompanying license file or http://apache.org/
//
// All assets are under CC Attribution Non-Commerical
// http://creativecommons.org/licenses/
//

(function() {

    var TABLET_BUTTON_NAME = "EMOTIONS";
    // TODO: ADD HTML LANDING PAGE

    var TRANSITION_TIME_SECONDS = 0.18;

    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
    var icon = "https://hifi-content.s3.amazonaws.com/elisalj/emoji_scripts/icons/emoji-i.svg";
    var activeIcon = "https://hifi-content.s3.amazonaws.com/elisalj/emoji_scripts/icons/emoji-a.svg";
    var isActive = true;

    var controllerMappingName;
    var controllerMapping;

    var tabletButton = tablet.addButton({
        icon: icon,
        activeIcon: activeIcon,
        text: TABLET_BUTTON_NAME,
        isActive: true
    });

    var toggle = function() {
        isActive = !isActive;
        tabletButton.editProperties({isActive: isActive});
        if (isActive) {
            Controller.enableMapping(controllerMappingName);
        } else {
            setEmotion(DEFAULT);
            Controller.disableMapping(controllerMappingName);
        }
    };

    tabletButton.clicked.connect(toggle);




    var DEFAULT = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 0.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": -0.0 ,
        "MouthRight": -0.0 ,
        "ChinLowerRaise": 0.0 ,
        "BrowsU_C": 0.0 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 0.0 ,
        "JawOpen": 0.0 ,
        "BrowsU_R": 0.0 ,
        "Sneer": 0.0 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 0.0 ,
        "MouthDimple_L": 0.0 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 0.0 ,
        "MouthSmile_R": 0.0 ,
        "MouthDimple_R": 0.0 ,
        "MouthLeft": 0.0 ,
        "LipsLowerClose": -0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.0 ,
        "MouthFrown_L": 0.0 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": -0.0 ,
        "JawLeft": 0.0 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": -0.0 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.0 ,
        "EyeSquint_R": 0.0 ,
        };




    var SMILE = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 1.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": -0.0 ,
        "MouthRight": 0.0 ,
        "ChinLowerRaise": 1.1061 ,
        "BrowsU_C": 0.3208 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 0.3208 ,
        "JawOpen": 0.0 ,
        "BrowsU_R": 0.717 ,
        "Sneer": 0.0 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 1.0 ,
        "MouthDimple_L": 1.0 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 1.0 ,
        "MouthSmile_R": 1.0 ,
        "MouthDimple_R": 1.0 ,
        "MouthLeft": 0.285 ,
        "LipsLowerClose": -0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.0 ,
        "MouthFrown_L": 0.0 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": -0.0 ,
        "JawLeft": 0.1056 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": -0.0 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.0 ,
        "EyeSquint_R": 0.0 ,
        };


    var LAUGH = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 1.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": -0.0 ,
        "MouthRight": 0.051 ,
        "ChinLowerRaise": 0.0 ,
        "BrowsU_C": 0.0 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 0.0 ,
        "JawOpen": 0.3374 ,
        "BrowsU_R": 0.0 ,
        "Sneer": 0.2935 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 1.0 ,
        "MouthDimple_L": 1.0 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 1.0 ,
        "MouthSmile_R": 1.0 ,
        "MouthDimple_R": 1.0 ,
        "MouthLeft": 0.0 ,
        "LipsLowerClose": -0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.4 ,
        "MouthFrown_L": 0.0 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": 0.2164 ,
        "JawLeft": 0.2452 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": 0.0199 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.0 ,
        "EyeSquint_R": 0.4 ,
        };

    var FLIRT = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 0.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": -0.0 ,
        "MouthRight": 0.8509 ,
        "ChinLowerRaise": 1.1061 ,
        "BrowsU_C": 0.0 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 0.0 ,
        "JawOpen": 0.0 ,
        "BrowsU_R": 1.0 ,
        "Sneer": 0.0 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 0.0 ,
        "MouthDimple_L": 1.0 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 1.0 ,
        "MouthSmile_R": 1.0 ,
        "MouthDimple_R": 1.0 ,
        "MouthLeft": 0.0 ,
        "LipsLowerClose": -0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.0 ,
        "MouthFrown_L": 0.0 ,
        "EyeBlink_L": 0.1 ,
        "Puff": 0.0 ,
        "BrowsD_R": -0.0 ,
        "JawLeft": 0.1056 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": -0.0 ,
        "EyeBlink_R": 0.1 ,
        "MouthFrown_R": 0.0 ,
        "EyeSquint_R": 0.0 ,
        };

    var SAD = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 1.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": 0.1566 ,
        "MouthRight": 0.0 ,
        "ChinLowerRaise": 1.2544 ,
        "BrowsU_C": 0.0 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 0.0 ,
        "JawOpen": 0.0 ,
        "BrowsU_R": 0.0 ,
        "Sneer": 0.0 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 1.0 ,
        "MouthDimple_L": 0.0 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 0.0 ,
        "MouthSmile_R": 0.0 ,
        "MouthDimple_R": 0.0 ,
        "MouthLeft": 0.0002 ,
        "LipsLowerClose": -0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.0 ,
        "MouthFrown_L": 0.4793 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": -0.0 ,
        "JawLeft": 0.512 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": -0.0 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.3925 ,
        "EyeSquint_R": 0.0 ,
        };

    var ANGRY = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 0.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": -0.0 ,
        "MouthRight": 0.0 ,
        "ChinLowerRaise": 1.6646 ,
        "BrowsU_C": 0.0 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 0.0 ,
        "JawOpen": 0.0 ,
        "BrowsU_R": 0.0 ,
        "Sneer": 0.4939 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 0.0 ,
        "MouthDimple_L": 0.0 ,
        "LipsLowerOpen": 0.3972 ,
        "MouthSmile_L": 0.0 ,
        "MouthSmile_R": 0.0 ,
        "MouthDimple_R": 0.0 ,
        "MouthLeft": 0.3645 ,
        "LipsLowerClose": 0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 1.0 ,
        "MouthFrown_L": 0.0 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": 0.594 ,
        "JawLeft": 0.1334 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": 0.594 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.0 ,
        "EyeSquint_R": 1.0 ,
        };

    var FEAR = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 1.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": 0.2352 ,
        "MouthRight": 0.0899 ,
        "ChinLowerRaise": 0.2351 ,
        "BrowsU_C": 0.0 ,
        "ChinUpperRaise": 0.1656 ,
        "BrowsU_L": 0.0 ,
        "JawOpen": 0.0 ,
        "BrowsU_R": 0.0 ,
        "Sneer": 0.3348 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 1.0 ,
        "MouthDimple_L": 0.0 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 0.0 ,
        "MouthSmile_R": 0.0 ,
        "MouthDimple_R": 0.0 ,
        "MouthLeft": 0.0 ,
        "LipsLowerClose": 0.9936 ,
        "LipsUpperUp": 0.1656 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.0 ,
        "MouthFrown_L": 0.2119 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": 0.3014 ,
        "JawLeft": 0.1802 ,
        "LipsUpperClose": 0.7245 ,
        "BrowsD_L": 0.3014 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.1372 ,
        "EyeSquint_R": 0.0 ,
        };




    var DISGUST = {
        "LipsLowerDown": 0.0 ,
        "EyeOpen_L": 1.0 ,
        "LipsFunnel": 0.0 ,
        "LipsPucker": -0.0 ,
        "MouthRight": 0.0 ,
        "ChinLowerRaise": 0.0 ,
        "BrowsU_C": 1.0 ,
        "ChinUpperRaise": 0.0 ,
        "BrowsU_L": 1.0 ,
        "JawOpen": 0.5706 ,
        "BrowsU_R": 1.0 ,
        "Sneer": 0.0 ,
        "JawRight": 0.0 ,
        "LipsUpperOpen": 0.0 ,
        "EyeOpen_R": 1.0 ,
        "MouthDimple_L": 0.5489 ,
        "LipsLowerOpen": 0.0 ,
        "MouthSmile_L": 0.5489 ,
        "MouthSmile_R": 0.4785 ,
        "MouthDimple_R": 0.4785 ,
        "MouthLeft": 0.5002 ,
        "LipsLowerClose": -0.0 ,
        "LipsUpperUp": 0.0 ,
        "JawFwd": 0.0 ,
        "EyeSquint_L": 0.0 ,
        "MouthFrown_L": 0.0 ,
        "EyeBlink_L": 0.0 ,
        "Puff": 0.0 ,
        "BrowsD_R": -0.0 ,
        "JawLeft": 0.0 ,
        "LipsUpperClose": -0.0 ,
        "BrowsD_L": -0.0 ,
        "EyeBlink_R": 0.0 ,
        "MouthFrown_R": 0.0 ,
        "EyeSquint_R": 0.0 ,
        };


    // function clamp(val, min, max) {
    //     return Math.min(Math.max(val, min), max);
    // }


    function mixValue(valueA, valueB, percentage) {
        valueA = typeof valueA === "number" ? valueA : 0;
        valueB = typeof valueB === "number" ? valueB : 0;

        return valueA + ((valueB - valueA) * percentage);

    }

    var lastEmotionUsed = DEFAULT;
    var emotion = DEFAULT;
    var isChangingEmotion = false;
    var changingEmotionPercentage = 0.0;

    Script.update.connect(function(deltaTime) {

    //CLEANUP if all HMD controls are off
        // var allInputs = clamp(
        // //grips
        // Controller.getValue(Controller.Standard.LT) +
        // Controller.getValue(Controller.Standard.LeftGrip)+
        // Controller.getValue(Controller.Standard.LT)+
        // Controller.getValue(Controller.Standard.LT)+
        // //finger/thumb touches
        // Controller.getValue(Controller.Standard.LeftIndexPoint)+
        // Controller.getValue(Controller.Standard.RightIndexPoint)+
        // Controller.getValue(Controller.Standard.LeftThumbUp)+
        // Controller.getValue(Controller.Standard.RightThumbUp)
        // , 0, 1);




        if (!isChangingEmotion) {
            return;
        }

        changingEmotionPercentage += deltaTime / TRANSITION_TIME_SECONDS;

        if (changingEmotionPercentage >= 1.0) {
            changingEmotionPercentage = 1.0;
            isChangingEmotion = false;
            if (emotion === DEFAULT) {
                MyAvatar.hasScriptedBlendshapes = false;
            }
        }

        //DOUG: this doesn't support different sized emotion dictionaries.  Bug.
        for (var blendshape in emotion) {
            var mixValueSum = mixValue(lastEmotionUsed[blendshape], emotion[blendshape], changingEmotionPercentage);

            // console.log("blendshape:" + blendshape, mixValueSum);

            MyAvatar.setBlendshape(blendshape,
                mixValueSum);
        }

        // if (allInputs === 0){
        //     setEmotion(DEFAULT);
        // }

    });

    function setEmotion(currentEmotion) {
        if (emotion !== lastEmotionUsed) {
            lastEmotionUsed = emotion;
        }
        if (currentEmotion !== lastEmotionUsed) {
            changingEmotionPercentage = 0.0;
            emotion = currentEmotion;
            isChangingEmotion = true;
            MyAvatar.hasScriptedBlendshapes = true;
        }
    }


    controllerMappingName = 'Hifi-FacialExpressions-Mapping';
    controllerMapping = Controller.newMapping(controllerMappingName);

    controllerMapping.from(Controller.Hardware.Keyboard.H).to(function(value) {
        if (value !== 0) {
            setEmotion(SMILE);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.J).to(function(value) {
        if (value !== 0) {
            setEmotion(LAUGH);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.K).to(function(value) {
        if (value !== 0) {
            setEmotion(FLIRT);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.L).to(function(value) {
        if (value !== 0) {
            setEmotion(SAD);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.V).to(function(value) {
        if (value !== 0) {
            setEmotion(ANGRY);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.B).to(function(value) {
        if (value !== 0) {
            setEmotion(FEAR);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.M).to(function(value) {
        if (value !== 0) {
            setEmotion(DISGUST);
        }
    });

    controllerMapping.from(Controller.Hardware.Keyboard.N).to(function(value) {
        if (value !== 0) {
            setEmotion(DEFAULT);
        }
    });



    //CONTROLLER MAPS
    controllerMapping.from(Controller.Standard.LeftGrip).to(function(value) {
        if (value !== 0) {
            setEmotion(DISGUST);
            // console.log("DISGUST ON");
        }
    });

    controllerMapping.from(Controller.Standard.RightGrip).to(function(value) {
        if (value !== 0) {
            setEmotion(LAUGH);
        }
    });

    controllerMapping.from(Controller.Standard.LSTouch).to(function(value) {
        if (value !== 0) {
            setEmotion(FEAR);
        }
    });

    controllerMapping.from(Controller.Standard.RSTouch).to(function(value) {
        if (value !== 0) {
            setEmotion(FLIRT);
        }
    });

    controllerMapping.from(Controller.Standard.LTClick).to(function(value) {
        if (value !== 0) {
            setEmotion(ANGRY);
        }
    });

    controllerMapping.from(Controller.Standard.RTClick).to(function(value) {
        if (value !== 0) {
            setEmotion(SMILE);
        }
    });

    controllerMapping.from(Controller.Standard.A).to(function(value) {
        if (value !== 0) {
            setEmotion(DEFAULT);
            // console.log("DEFAULT ON");
        }
    });

    Controller.enableMapping(controllerMappingName);

    Script.scriptEnding.connect(function() {
        tabletButton.clicked.disconnect(toggle);
        tablet.removeButton(tabletButton);
        Controller.disableMapping(controllerMappingName);

        if (emotion !== DEFAULT || isChangingEmotion) {
            isChangingEmotion = false;
            for (var blendshape in DEFAULT) {
                MyAvatar.setBlendshape(blendshape, DEFAULT[blendshape]);
            }
            MyAvatar.hasScriptedBlendshapes = false;
        }
    });

}());
