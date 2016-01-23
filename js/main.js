function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
}

var updatePage = function (data) {
    updateNotification(data.notification);
    updateQuickActions(data.quickActions);
    if (localStorage.pageData != "" && localStorage.pageData != null) {
        updateFolders();
    } else {
        localStorage.pageData = "";
    }
};

var updateFolders = function () {
    var inputs = all(".name ,.url");
    for (i = 0; i < inputs.length; i++) {
        var stringSearch = "quick-reports:" + inputs[i].id + "=";
        if (localStorage.pageData.indexOf(stringSearch) != -1) {
            var indexStart = localStorage.pageData.indexOf(stringSearch) + stringSearch.length;
            var indexEnd = localStorage.pageData.indexOf(";", indexStart);
            inputs[i].value = localStorage.pageData.substring(indexStart, indexEnd);

        }
    }

    var pattern = "." + "quick-reports"+ " .styled-select-list";
    $(pattern).innerHTML = "";
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != "") {
            $(pattern).innerHTML = $(pattern).innerHTML + "<li><a href=\"" + inputs[i + 1].value + "\">" + inputs[i].value + "</a></li>"
        }
        i++;
    }


};

var updateNotification = function (data) {
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
                actionLists[i].innerHTML += "<li><a tabindex=\"" + g + "\" href=\"" + quickActions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>"
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

}

var changeFocus = function (e) {
    this.parentNode.parentNode.style.display = "none";
}

var changeFocusNav = function (e) {
    this.querySelector(".action-list").style.display = "block";
}

var changeActiveTab = function (e) {
    var newHash = e.newURL.substring(e.newURL.indexOf("#"));
    var tabDivs = all(".tabs > div");
    for (var i = 0; i < tabDivs.length; i++) {
        tabDivs[i].style.display = "none";
    }
    $(newHash).style.display = "block";
    $(".active-tab").className = "";
    $("a[href=\"" + newHash + "\"]").parentNode.className = "active-tab";
}

/*var validateUrl = function (urlToValidate) {
    var myRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

    if (!myRegExp.test(urlToValidate)) {
        return false;
    } else {
        return true;
    }
}*/

var toggleSettingsDiv = function () {
    var parentClass = this.parentNode.parentNode.parentNode.className;
    var settingsDiv = $("." + parentClass + "> .settings");
    if (settingsDiv.style.display == "none") {
        settingsDiv.style.display = "block";
        settingsDiv.style.height = "36%";
        this.parentNode.style.backgroundColor = "white";
    }
    else {
        settingsDiv.style.display = "none";
        settingsDiv.style.height = "0";
        this.parentNode.style.backgroundColor = "transparent";
    }
}

var fieldsValidate = function () {
    var parentClass = this.parentNode.className;
    var inputs = all("." + parentClass + " .name ," + "." + parentClass + " .url");
    var validated = true;
    for (var i = 0; i < inputs.length; i += 2) {
        if (( inputs[i + 1].value != null && inputs[i + 1].value != "") || ( inputs[i].value != null && inputs[i].value != "")) {
            inputs[i].required = true;
            inputs[i + 1].required = true;
            validated= false;
        }
        if (( inputs[i + 1].value == null || inputs[i + 1].value == "") && ( inputs[i].value == null || inputs[i].value == "")) {
            inputs[i].required = false;
            inputs[i + 1].required = false;
        }
    }
    /*if (!this.checkValidity()) {
     $("." + this.parentNode.parentNode.className + " .save").click();
     }*/

    return validated;
}

var savePress = function () {
    var parentClass = this.parentNode.parentNode.className;
    var inputs = all("." + parentClass + " .name ," + "." + parentClass + " .url");

    var validated = true;
    for (var i = 0; i < inputs.length; i += 2) {
        if (( inputs[i + 1].value != null && inputs[i + 1].value != "") || ( inputs[i].value != null && inputs[i].value != "")) {
            inputs[i].required = true;
            inputs[i + 1].required = true;
            validated = false;
            if(( inputs[i + 1].value != null && inputs[i + 1].value != "") && ( inputs[i].value != null && inputs[i].value != "")) {
                validated = true;
            }
        }
        if (( inputs[i + 1].value == null || inputs[i + 1].value == "") && ( inputs[i].value == null || inputs[i].value == "")) {
            inputs[i].required = false;
            inputs[i + 1].required = false;
            validated = true;
        }
    }
    if (validated == true && this.parentNode.checkValidity()) {
        parentClass = this.parentNode.parentNode.parentNode.id;
        var pattern = parentClass + ":.+?;";
        var regexp = new RegExp(pattern, "g");
        localStorage.pageData = localStorage.pageData.replace(regexp, "");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                localStorage.pageData = localStorage.pageData + parentClass + ":" + inputs[i].id + "=" + inputs[i].value + ";";
            }
        }
        pattern = "." + this.parentNode.parentNode.parentNode.className + " .styled-select-list";
        $(pattern).innerHTML = "";
        $(pattern).style.display="none";
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value != null && inputs[i].value != "") {
                $(pattern).innerHTML = $(pattern).innerHTML + "<li><a href=\"" + inputs[i + 1].value + "\">" + inputs[i].value + "</a></li>"
            }
            i++;
        }
        $("." + this.parentNode.parentNode.parentNode.className + " .settings-icon").click();
    }
};

var cancelPress = function () {
    var parentClass = this.parentNode.parentNode.className;
    var inputsList = all("." + parentClass + " .url ," + "." + parentClass + " .name");
    for (var i = 0; i < inputsList.length; ++i) {
        inputsList[i].value = "";
    }

    var settingsDiv = $("." + parentClass);
    settingsDiv.style.display = "none";
    settingsDiv.style.height = "0";
    this.parentNode.parentNode.parentNode.querySelector(".settings-icon-wrapper").style.backgroundColor = "transparent";

    updateFolders();
}

function initialize() {
    UTILS.ajax("data/config.json", {done: updatePage});
    UTILS.ajax("fonts/selection.json", {done: updateTabs});
    var sButtons = all(".settings-icon");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", toggleSettingsDiv);
    }
    sButtons = all(".cancel");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", cancelPress);
    }
    sButtons = all(".save");
    for (var i = 0; i < sButtons.length; ++i) {
        sButtons[i].addEventListener("click", savePress);
    }
 /*   var forms = all(".settings > form");
    for (var i = 0; i < forms.length; ++i) {
        forms[i].addEventListener("keyup", fieldsValidate);
    }*/
}

window.onLoad = initialize();



