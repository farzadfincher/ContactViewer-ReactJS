/**
 * Created by Farzad Sangi on 6/8/15.
 * the Distelli assignment: loads an array of objects where each object contains the following fields:
 FirstName
 LastName
 Street
 City
 State
 Zip
 *
 */


// ------------------------------------------------------------------
// the Distelli assignment
// ------------------------------------------------------------------

var TableControls = React.createClass({displayName: "TableControls",
    countChanged: function() {
        var dropdownElement = document.getElementById("countDropdown");
        var selectedCount = dropdownElement.options[dropdownElement.selectedIndex].value;
        this.props.countChangeHandler(parseInt(selectedCount));
    },
    render: function () {
        var startRange = this.props.startIndex;
        var endRange = (this.props.startIndex + this.props.count < this.props.totalNum) ? (this.props.startIndex + this.props.count) : (this.props.totalNum);
        return (
            React.createElement("div", null, 
                React.createElement("table", {className: "controls-container"}, 
                    React.createElement("tr", null, 
                        React.createElement("td", null, 
                            React.createElement("button", {className: "btn", onClick: this.props.prevBtnEventHandler}, "Prev")
                        ), 
                        React.createElement("td", null, 
                            React.createElement("span", null, " Item(s) ", startRange+1, " to ", endRange, " of ", this.props.totalNum, " total contacts "), 
                            React.createElement("select", {id: "countDropdown", onChange: this.countChanged}, 
                                React.createElement("option", {value: "5"}, "5 Items"), 
                                React.createElement("option", {value: "10"}, "10 Items"), 
                                React.createElement("option", {value: "25"}, "25 Items"), 
                                React.createElement("option", {value: "50"}, "50 Items"), 
                                React.createElement("option", {value: "75"}, "75 Items"), 
                                React.createElement("option", {value: "100"}, "100 Items")
                            )
                        ), 
                        React.createElement("td", null, 
                            React.createElement("button", {className: "btn", onClick: this.props.nextBtnEventHandler}, "Next")
                        )
                    )
                )
            )
        );

    }
});

var InteractiveTable = React.createClass({displayName: "InteractiveTable",

    countChanged: function(newCount) {
        this.loadDataFromServer(this.state.startIndex, newCount);
    },
    nextButtonClicked: function () {
        if (this.isMounted()) {
            var newStartIndex = this.state.startIndex + this.state.count;

            // if the new starting index is out of range, we are at the last page
            // nothing to do so just return
            if (newStartIndex > this.state.totalNum) {
                return;
            }

            // get the new data from the server and update the UI
            this.loadDataFromServer(newStartIndex, this.state.count);
        }
    },
    prevButtonClicked: function () {
        if (this.isMounted()) {
            //if already at the begining of the list, there is no previous page.
            // nothing to do so just return
            if (this.state.startIndex === 0) {
                return;
            }

            // calculate the new starting index
            var newStartIndex = this.state.startIndex - this.state.count;

            // if the index is out of range, align it to the begining of the array
            if (newStartIndex < 0) {
                newStartIndex = 0;
            }

            // get the new data from the server and update the UI
            this.loadDataFromServer(newStartIndex, this.state.count);
        }
    },

    loadDataFromServer: function (startIndex, count) {
        DataProvider.getPeopleInfo(startIndex, startIndex+count).then(function (result) {

            if (this.isMounted()) {
                this.setState({
                    peopleData: result.currentPeople,
                    startIndex: startIndex,
                    count: count,
                    totalNum: result.totalNum
                });
            }

        }.bind(this), function (errMsg) {
            //TODO: show some message to the user that the remote server didn't respond
        }.bind(this));

    },
    getInitialState: function () {
        return {
            peopleData: [],
            startIndex: 0,
            count: 5,
            totalNum: 0
        };
    },
    componentDidMount: function () {
        this.loadDataFromServer(this.state.startIndex, this.state.startIndex + this.state.count);
    },
    render: function () {
        var rows = [];
        var counter = 1;
        this.state.peopleData.forEach(function (person) {

            var rowStyle = {
                background: (counter%2 === 1)?'white':'lightskyblue'
            };
            counter++;

            rows.push(React.createElement("tr", {style: rowStyle}, 
                React.createElement("td", null, " ", person.name, " "), 
                React.createElement("td", null, " ", person.familiName, " "), 
                React.createElement("td", null, " ", person.street, " "), 
                React.createElement("td", null, " ", person.city, " "), 
                React.createElement("td", null, " ", person.state, " "), 
                React.createElement("td", null, " ", person.zip, " ")
            ));
        });

        return (
            React.createElement("div", null, 
                React.createElement(TableControls, {totalNum: this.state.totalNum, 
                    startIndex: this.state.startIndex, count: this.state.count, 
                    nextBtnEventHandler: this.nextButtonClicked, 
                    prevBtnEventHandler: this.prevButtonClicked, 
                    countChangeHandler: this.countChanged}
                ), 
                React.createElement("table", {className: "address-table"}, 
                    React.createElement("thead", {className: "header-row"}, 
                        React.createElement("tr", null, 
                            React.createElement("td", null, "First Name"), 
                            React.createElement("td", null, "Last Name"), 
                            React.createElement("td", null, "Street"), 
                            React.createElement("td", null, "City"), 
                            React.createElement("td", null, "State"), 
                            React.createElement("td", null, "Zip Code")
                        )
                    ), 
                    React.createElement("tbody", null, 
                    rows
                    )
                )
            )
        );

    }
});


React.render(
    React.createElement(InteractiveTable, null)
    , document.getElementById("customTable"));

