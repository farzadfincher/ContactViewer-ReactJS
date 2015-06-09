/**
 * Created by Farzad Sangi on 6/8/15.
 * A React component that shows an array of objects where each object contains the following fields:
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

var TableControls = React.createClass({
    countChanged: function () {
        var dropdownElement = document.getElementById("countDropdown");
        var selectedCount = dropdownElement.options[dropdownElement.selectedIndex].value;
        this.props.countChangeHandler(parseInt(selectedCount));
    },
    render: function () {
        var startRange = this.props.startIndex;
        var endRange = (this.props.startIndex + this.props.count < this.props.totalNum) ? (this.props.startIndex + this.props.count) : (this.props.totalNum);
        return (
            <div>
                <table className='controls-container'>
                    <tr>
                        <td>
                            <button className="btn" onClick={this.props.prevBtnEventHandler} >Prev</button>
                        </td>
                        <td>
                            <span> Item(s) {startRange + 1} to {endRange} of {this.props.totalNum} total contacts </span>
                            <select id="countDropdown"  onChange={this.countChanged}>
                                <option value="5">5 Items</option>
                                <option value="10">10 Items</option>
                                <option value="25">25 Items</option>
                                <option value="50">50 Items</option>
                                <option value="75">75 Items</option>
                                <option value="100">100 Items</option>
                            </select>
                        </td>
                        <td>
                            <button className="btn" onClick={this.props.nextBtnEventHandler} >Next</button>
                        </td>
                    </tr>
                </table >
            </div>
        );

    }
});

var InteractiveTable = React.createClass({

    countChanged: function (newCount) {
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
        DataProvider.getPeopleInfo(startIndex, startIndex + count).then(function (result) {

            if (this.isMounted()) {
                this.setState({
                    peopleData: result.currentPeople,
                    startIndex: startIndex,
                    count: count,
                    totalNum: result.totalNum,
                    showError: false
                });
            }

        }.bind(this), function (errMsg) {
            if (this.isMounted()) {
                this.setState({
                    peopleData: [],
                    startIndex: 0,
                    count: count,
                    totalNum: 0,
                    showError: true
                });
            }
        }.bind(this));

    },
    getInitialState: function () {
        return {
            peopleData: [],
            startIndex: 0,
            count: 5,
            totalNum: 0,
            showError: false
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
                background: (counter % 2 === 1) ? 'white' : 'lightskyblue'
            };
            counter++;

            rows.push(<tr style={rowStyle}>
                <td> {person.name} </td>
                <td> {person.familiName} </td>
                <td> {person.street} </td>
                <td> {person.city} </td>
                <td> {person.state} </td>
                <td> {person.zip} </td>
            </tr>);
        });


        return (
            <div>
                <div className={this.state.showError ? 'hidden-div' : ''}>
                    <TableControls totalNum={this.state.totalNum}
                        startIndex={this.state.startIndex} count={this.state.count}
                        nextBtnEventHandler={this.nextButtonClicked}
                        prevBtnEventHandler={this.prevButtonClicked}
                        countChangeHandler={this.countChanged}
                    />
                    <table className="address-table">
                        <thead className="header-row">
                            <tr>
                                <td>First Name</td>
                                <td>Last Name</td>
                                <td>Street</td>
                                <td>City</td>
                                <td>State</td>
                                <td>Zip Code</td>
                            </tr>
                        </thead>
                        <tbody>
                    {rows}
                        </tbody>
                    </table >
                </div>
                { this.state.showError ? <label className="error">Oops! looks like the server is down.</label> : null }
            </div>
        );

    }
});


React.render(
    <InteractiveTable/>
    , document.getElementById("customTable"));

