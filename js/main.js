function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
}

var updatePage = function (data) {
    updateNotificationArea(data.notification);
    updateQuickActions(data.quickActions);
    if (localStorage.pageData != "" && localStorage.pageData != null) {
        updateFolders("quick-reports");
        updateFolders("my-team-folders");
    } else {
        localStorage.pageData = "";
    }
};

var updateFolders = function (tabName) {
    var inputs = all("." + tabName + " .name" + ", ." + tabName + " .url");
    for (i = 0; i < inputs.length; i++) {
        var stringSearch = tabName + ":" + inputs[i].id + "=";
        if (localStorage.pageData.indexOf(stringSearch) != -1) {
            var indexStart = localStorage.pageData.indexOf(stringSearch) + stringSearch.length;
            var indexEnd = localStorage.pageData.indexOf(";", indexStart);
            inputs[i].value = localStorage.pageData.substring(indexStart, indexEnd);
        }
    }
    var pattern = "." + tabName + " .styled-select-list";
    var emptyFlag = true;
    $(pattern).innerHTML = "";
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != "") {
            if (i == 0) {
                $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                all(pattern + " li")[0].title = inputs[i + 1].value;
                $("." + $(pattern).parentNode.parentNode.className + " .frame-window").src = inputs[i + 1].value;
                $("." + $(pattern).parentNode.parentNode.className + " .expand-icon").href = inputs[i + 1].value;

            }
            $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
            all(pattern + " li")[i / 2 + 1].title = inputs[i + 1].value;
            emptyFlag = false;
        }
        i++;
    }
    if (emptyFlag == true) {
        $(pattern).style.display = "none";

        $("." + $(pattern).parentNode.parentNode.className + " .frame-window").src = "";
        $("." + $(pattern).parentNode.parentNode.className + " .expand-icon").href = "";
    } else {
        $(pattern).style.display = "block";
        var listItems = all(pattern + " li");
        for (i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", openIframe);
        }
        var settingsDiv = $("." + $(pattern).parentNode.parentNode.className + " .settings");
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        $("." + tabName + " .settings-icon-wrapper").style.backgroundColor = "transparent";
        listItems[0].click();
    }
};

var updateNotificationArea = function (data) {
    if (data !== undefined) {
        $(".notifications").innerHTML = "<p>" + data + "</p>";
    }
};

var updateQuickActions = function (quickActions) {
    var navSections = all(".nav-section");
    if (quickActions !== undefined) {
        for (var i = 0; i < quickActions.length; i++) {
            navSections[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSections[i].innerHTML;
            navSections[i].style.background = "black url(./img/icons/" + quickActions[i].icon + ".png)  left 50% top 77px no-repeat";
            navSections[i].addEventListener("focus", changeFocusNav, false);
            navSections[i].addEventListener("mouseleave", ignoreClick, false);
        }
        var menuCaptions = all(".menu-caption");
        for (i = 0; i < quickActions.length; i++) {
            menuCaptions[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>";
        }
        var g = 4;
        var q = 0;
        var actionLists = all(".action-list");
        for (i = 0; i < quickActions.length; i++) {
            for (var j = 0; j < quickActions[i].actions.length; j++) {
                actionLists[i].innerHTML += "<li><a tabindex=\"" + g + "\" href=\"" + quickActions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>";
                g++;
                //if (j+1 == quickActions[i].actions.length) {
                all(".action-list li >a")[q].addEventListener("blur", changeFocus, false);
                //}
                q++;
            }
            g++;
        }
    }
};

var ignoreClick = function (e) {
    if (document.activeElement === this) {
        this.blur();
        this.querySelector(".action-list").style.display = "none";
    }
};

var updateTabs = function (iconList) {
    var cls = iconList.preferences.fontPref.prefix;
    var tabs = all(".tabs >ul li a");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].innerHTML = "<i class=\"" + cls + iconList.icons[i].icon.tags[0] + "\"></i>" + tabs[i].innerHTML;
    }
    if (window.location.href.indexOf("#") == -1) {
        $(".tabs>ul>li").className += "active-tab";
        $(".tabs>div").style.display = "block";
    } else {
        var newHash = window.location.href.substring(window.location.href.indexOf("#"));
        $("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
        $(newHash).style.display = "block";
    }
    window.addEventListener("hashchange", changeActiveTab, false);

};

var changeFocus = function (e) {
    this.parentNode.parentNode.style.display = "none";
};

var changeFocusNav = function (e) {
    this.querySelector(".action-list").style.display = "block";
};

var changeActiveTab = function (e) {
    var newHash = e.newURL.substring(e.newURL.indexOf("#"));
    var tabDivs = all(".tabs > div");
    for (var i = 0; i < tabDivs.length; i++) {
        tabDivs[i].style.display = "none";
    }
    $(newHash).style.display = "block";
    $(".active-tab").className = "";
    $("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
};

var toggleSettingsDiv = function () {
    var parentClass = this.parentNode.parentNode.parentNode.className;
    var settingsDiv = $("." + parentClass + "> .settings");
    if (settingsDiv.style.display == "none") {
        settingsDiv.style.display = "block";
        settingsDiv.style.height = "36%";
        this.parentNode.style.backgroundColor = "white";
        $("." + parentClass + " .name").focus();
    }
    else {
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        this.parentNode.style.backgroundColor = "transparent";
    }
};

var savePress = function () {

    var parentClass = this.parentNode.parentNode.parentNode.parentNode.className;
    var inputs = all("." + parentClass + " .name ," + "." + parentClass + " .url");
    var validated = true;
    for (var i = 0; i < inputs.length; i += 2) {
        if (( inputs[i + 1].value != null && inputs[i + 1].value != "") || ( inputs[i].value != null && inputs[i].value != "")) {
            inputs[i].required = true;
            inputs[i + 1].required = true;
            validated = false;
            if (( inputs[i + 1].value != null && inputs[i + 1].value != "") && ( inputs[i].value != null && inputs[i].value != "")) {
                validated = true;
            }
        }
        if (( inputs[i + 1].value == null || inputs[i + 1].value == "") && ( inputs[i].value == null || inputs[i].value == "")) {
            inputs[i].required = false;
            inputs[i + 1].required = false;
            validated = true;
        }
    }
    if (validated == true && this.parentNode.parentNode.checkValidity()) {
        parentClass = this.parentNode.parentNode.parentNode.parentNode.id;
        var pattern = parentClass + ":.+?;";
        var regexp = new RegExp(pattern, "g");
        localStorage.pageData = localStorage.pageData.replace(regexp, "");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                localStorage.pageData = localStorage.pageData + parentClass + ":" + inputs[i].id + "=" + inputs[i].value + ";";
            }
        }
        pattern = "." + this.parentNode.parentNode.parentNode.parentNode.className + " .styled-select-list";
        var emptyFlag = true;
        $(pattern).innerHTML = "";
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                if (i == 0) {
                    $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                    all(pattern + " li")[0].title = inputs[i + 1].value;
                }
                $(pattern).innerHTML = $(pattern).innerHTML + "<li>" + inputs[i].value + "</li>";
                all(pattern + " li")[i / 2 + 1].title = inputs[i + 1].value;
                emptyFlag = false;
            }
            i++;
        }
        if (emptyFlag == true) {
            $(pattern).style.display = "none";
            $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .frame-window").src = "";
            $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .expand-icon").href = "";
        } else {
            $(pattern).style.display = "block";
            var listItems = all(pattern + " li");
            for (i = 0; i < listItems.length; i++) {
                listItems[i].addEventListener("click", openIframe);
            }
        }
        $("." + this.parentNode.parentNode.parentNode.parentNode.className + " .settings-icon").click();
        all(pattern + " li")[0].click();
    }
};

var openIframe = function () {
    $("." + this.parentNode.parentNode.parentNode.className + " .frame-window").src = this.title;
    $("." + this.parentNode.parentNode.parentNode.className + " .expand-icon").href = this.title;
    this.parentNode.parentNode.querySelector("li").title = this.title;
    this.parentNode.parentNode.querySelector("li").innerHTML = this.innerHTML;
    this.parentNode.parentNode.querySelector("li").addEventListener("click", openIframe);
};

var cancelPress = function () {
    var parentClass = this.parentNode.parentNode.parentNode.parentNode.className;
    var inputsList = all("." + parentClass + " .url ," + "." + parentClass + " .name");
    for (var i = 0; i < inputsList.length; ++i) {
        inputsList[i].value = "";
    }
    var settingsDiv = $("." + parentClass + " .settings");
    settingsDiv.style.display = "none";
    settingsDiv.style.height = "0";
    $("." + parentClass + " .settings-icon-wrapper").style.backgroundColor = "transparent";
    updateFolders(parentClass);
};


var searchEnter = function (e) {
    var enteredKey = e.which;
    if (enteredKey == 13) {
        var dropDownList=all(".styled-select-list li");
        for (var i=0; i<dropDownList.length; i++) {
            if (dropDownList[i].innerHTML == this.value) {
                $(".tabs ul li a[href=\"#" +dropDownList[i].parentNode.parentNode.parentNode.className +"\"]" ).click();
                dropDownList[i].click();
                i=dropDownList.length +1;
            }
        }
        if (i ==dropDownList.length) {
            $(".notifications").innerHTML = "<p>" + "The searched report " + this.value +" was not found"+ "</p>";
        }
    }
};

var inputKeyPress = function (e) {
    var keynum = e.which;
    if (keynum == 0) {
        var className = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className;
        $("." + className + " .cancel").click();
    } else if (keynum == 13) {
        $("." + className + " .save").click();
    }
};

function initialize() {
    UTILS.ajax("data/config.json", {done: updatePage});
    UTILS.ajax("fonts/selection.json", {done: updateTabs});
    var sButtons = all(".settings-icon");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", toggleSettingsDiv);
    }
    sButtons = all(".cancel");
    for (i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", cancelPress);
    }
    sButtons = all(".save");
    for (i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", savePress);
    }
    var inputs = all(".name , .url");
    for (i = 0; i < inputs.length; ++i) {
        inputs[i].addEventListener("keypress", inputKeyPress);
    }
    $(".input-search").addEventListener("keypress", searchEnter);
}

window.onLoad = initialize();



