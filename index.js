/*Note: 
We implemented the top-down method while writing this code:
    which means we implemented functions within functions that did not exist yet
    and then later implemented the code for those non-existant functions

Why we do this: 
    instead of writing a bunch of code - focus on the one thing 
    you are working on and what you want it to do with it- write the names for the 
    nonexistant functions to design the details in the layout */


//Step: write out the classes for member and team 
class Member { //Member class takes a name and position 
    constructor(name, position){
        this.name = name;
        this.position = position;
    }
}
class Team { //Team class that takes in an id of our team and the name 
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.members = [];//empty members array that will contain members once they are added
    }
    addMember(member){ //method within class Team to take a member and add it to this.members[]
        this.members.push(member);
    }
    deleteMember(member){ //method to delete a member within the class Team 
        let index = this.members.indexOf(member); //finding the index of the member inside our members array 
        this.members.splice(index, 1);//take the memebrs array and delete the member at a specified index that we found with the index variable - and only remove one element
    }
}
//Step: Write code to use our classes in relationship with our HTML -- use the data to display it in our HTML 
let teams = []; //array of teams - every team we create will be stored here 
let teamId = 0; //assign an id to each time - increment it each time 



/*In the rest of our code we will create buttons with event listners -- 
the code below makes it so we can call the function 
without having to write new code everytime*/
function onClick (id, action){ //the id is whatever element we want to create an event listener on from our HTML -- action will be a function of what is going to happen when we call onclick 
    let element = document.getElementById(id); //when we call onClick on an element we pass in the ID of that element 
    element.addEventListener('click', action); //take the element we grabbed by its id and pass in a function - that function (action) will happen once it is clicked from the eventListern
    return element; //to keep reference for element 
}
//Example of onClick function we created above...
onClick('new-team', () =>{ //when the button 'new team' (the id parameter) from our HTMl is clicked an arrow function(the action parameter) will run 
    teams.push(new Team(teamId++, getValue('new-team-name'))); //the arrow function is going to push a new instance of Team to the teams array with an incremented team id 
    drawDOM();
}) //getValue('new-team-name) is a function written below and here it is going to find the attribute new-team-name of our class card in our HTMl and push that value along with the incremented team id to the teams array 


function getValue(id){ //a function that will take in an id of an elememt in our HTML and return that element's specified value 
    return document.getElementById(id).value; 
}

//basic functionality of this function: clear out the team div...iterate over the teams and create a table for each team, create a delete button that could be used to delete each team and then the memebers to that team 
function drawDOM(){ 
    let teamDiv = document.getElementById('teams'); //declare a variable to establish that references the div with the id 'teams' which is the div we are adding all our teams to 
    clearElement(teamDiv); //when clearElement is called it will clear the existing div of teams 
    for(team of teams){ //once the div is clear we will iterate through each team of our teams array 
        let table = createTeamTable(team); //this function is going to take an instance of the class team - build a table out of it and return that table 
        let title = document.createElement('h2'); //creating an h2 element for the title of the table 
        title.innerHTML = team.name; //build a title based on the name data attribute inside of an instance of the Team class 
        title.appendChild(createDeleteTeamButton(Team)); //the title is going to have a button element appended to it for the option to delete a team 
        teamDiv.appendChild(title); //appending the title and table we just created to the variable teamDiv that is also the team array div in the HTML 
        teamDiv.appendChild(table);
        for (member of team.members){
            createMemberRow(team, table, member);
        }
    }
}
function createMemberRow (team, table, member){
    let row = table.insertRow(2); //inserts a new row into the table at the third position
    row.insertCell(0).innerHTML = member.name;//inserts a new cell into the newly created row at the first position (index 0) and serts the innerHTML content to the name property of the member object 
    row.insertCell(1).innerHTML = member.position; //inserts another cell into the newly created row at the second position (index 1) and serts the innerHTML content to the position property of the member object 
    let actions = row.insertCell(2); //inserts a third cell into the newly created row at the third position (index 2) 
    actions.appendChild(createDeleteRowButton(team, member)) //appends a child element (a button) to the actions cell created above this line 
}
function createDeleteRowButton (team, member){ //button appended to a member row above that will have an onClick method 
    let btn = document.createElement('button'); //creating a new element of button 
    btn.className = 'btn btn-primary'; //sets the buttons class to be a certain css style for buttons 
    btn.innerHTML = "Delete"; //sets the buttons HTML 
    btn.onclick = () => {
        let index = team.members.indexOf(member); //find the index of the current member row 
        team.members.splice(index, 1); //array members of this given team and splice the index we found 
        drawDOM(); //calling the function drawDOM 
    };
    return btn; //we need to return button to our actions because we are appending a child (createDeleteRowButton) to the createMemberRow to make sure it is there on a row and table level 
}
function createDeleteTeamButton (team){
    let btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.innerHTML ="Delete Team";
    btn.onclick = () => {
        let index = teams.indexOf(team); //finds the index of the team within the teams array and assigns it to the variable index 
        teams.splice(index, 1); //removes one element from the teams array starting at the position specified by index 
        drawDOM(); //because we changed our data we need to re-render what the DOM has 
    };
    return btn;
}

function createNewMemberButton(team){
    let btn = document.createElement('button'); //creates a button
    btn.className = 'btn btn-primary'; //assigns the class style css to the button
    btn.innerHTML ='Create';//assigns the text to the button 
    btn.onclick = () =>{ //method of the button 
       team.members.push(new Member(getValue(`name-input-${team.id}`), getValue(`position-input-${team.id}`)));
       drawDOM();
    }
    //btn.onclick arrow function retrives the values from the input fields for the member's name and position - a new Member object is created using these values and then adds it to the team.members array 
    return btn;
}

//Function takes a team and builds a table off of that team --building out a table like in HTML but in JS 
function createTeamTable(team){
    let table = document.createElement('table');//create an element table 
    table.setAttribute('class', 'table table-dark table-striped');//the table will have attributes of a class css style 

    let row = table.insertRow(0); //create rows within the table and inserting them 
    let nameColumn = document.createElement('th'); //create two columns within the header row of name and position
    let positionColumn = document.createElement('th');
    nameColumn.innerHTML = "Name"; //establishing the text for the columns assigned to Name and Position
    positionColumn.innerHTML = "Position";
    row.appendChild(nameColumn);//appending those columns to the row 
    row.appendChild(positionColumn);

    let formRow = table.insertRow(1); //create another row with a form to insert new team members
    let nameTh = document.createElement('th');
    let positionTh = document.createElement('th');
    let createTh = document.createElement('th');

    let nameInput = document.createElement('input'); //creating an input form for name of team 
    nameInput.setAttribute('id', `name-input-${team.id}`); //assigns a unique id to the nameInput element based on the id of the team 
    nameInput.setAttribute('type', 'text'); //the type of input we want it to be 
    nameInput.setAttribute('class','form-control'); //set the style for the name input form 

    let positionInput = document.createElement('input'); //creating an input form for the position of team 
    positionInput.setAttribute('id', `position-input-${team.id}`);
    positionInput.setAttribute('type', 'text');
    positionInput.setAttribute('class','form-control');

    let newMemberButton = createNewMemberButton(team); //the result of the function createNewMemberButton is called with the team argument and the result is assigned to the variable newMemberButton

    nameTh.appendChild(nameInput); //append the input from the nameInput form to the table header row nameTh
    positionTh.appendChild(positionInput); //append the input from the positionInput form to the table header row positionTh
    createTh.appendChild(newMemberButton); //append the button from the newMemberButton function to create a new button to the table header row createTh

    formRow.appendChild(nameTh); //appends the name position and create headers row to the table in our HTML 
    formRow.appendChild(positionTh);
    formRow.appendChild(createTh);

    return table
}

function clearElement(element){  //function will take an element and while that element has appended children we will remove them until it is cleared out 
    while(element.firstChild) { 
        element.removeChild(element.firstChild);
    }
}