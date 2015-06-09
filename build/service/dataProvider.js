/**
 * Created by Farzad Sangi on 6/8/15.
 */

var DataProvider = {
    peopleContacts: [],
    initialize: function () {
        var names = ['Jack','Rob','James','Fred','Chris','Mark','Micheal','Brian','Ryan','Derek'];
        var familyNames = ['Holte','Snook','Hogan','Brown','Powell','Cassan','Pangrle','Lang','Holley','Haynes'];
        var cities = ['Seattle','Bellevue','Redmond','Tacoma','Lynnwood','Olympia','Spokane'];

        for (var i=0;i<154; i++){
            //Generate a random index between [0-9]
            var nameIndex = Math.floor((Math.random() * names.length));
            var familyNameIndex = Math.floor((Math.random() * familyNames.length));
            var cityIndex = Math.floor((Math.random() * cities.length));

            var newContact = {
                name: names[nameIndex],
                familiName: familyNames[familyNameIndex],
                street: '1111 Broadway st.',
                city: cities[cityIndex],
                state: 'WA',
                zip: '98000'
            };
            this.peopleContacts.push(newContact);
        }

    },
    getPeopleInfo: function (startIndex, endIndex) {
        return new Promise(function (success, failure) {

            // mock the data if it's not initialized yet
            if (DataProvider.peopleContacts.length === 0) {
                DataProvider.initialize();
            }

            if (startIndex < 0) {
                startIndex = 0;
            }

            if (endIndex > DataProvider.peopleContacts.length){
                endIndex = DataProvider.peopleContacts.length;
            }

            if (true) { //if back-end call was successful
                success({
                    currentPeople: DataProvider.peopleContacts.slice(startIndex,endIndex),
                    totalNum: DataProvider.peopleContacts.length
                });
            } else {
                failure("failure");
            }
        });
    }
};

