task = [];
var isItImportant = false;
var showHide = true;
var backgroundColor = "#5D0A72";
var serverUrl = "http://fsdi.azurewebsites.net/api";


function toggleDetailsVisibility() {
    //hide and show capture id
    showHide = !showHide;
    if (showHide) {
        $("#capture").show();
        $(".span-show").hide();
        $(".span-hide").show();
        $("#iShow").removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        $("#capture").hide();
        $("#iShow").removeClass("fa-eye-slash").addClass("fa-eye");
        $(".span-show").show();
        $(".span-hide").hide();
    }

}
function checkField(varTitle, varStatus, varDate){
    console.log(": checkField : varStatus: "+varStatus);
    console.log(": checkField : varTitle: "+varTitle);
    console.log(": checkField : varDate: "+varDate);
    
    hideErrorMessage();
    if ( varTitle === "" ){
        alert("Title can not be empty.");
        $('#errorTitle').show();
        return false;
    }else if( varDate === "" ){
        alert("Please Pick a Date.");
        $('#errorDate').show();
        return false;
    } else if(varStatus === null){
        alert("Please select a status.");
        $('#errorStatus').show();
        return false;
    }
    return true;

}
function saveTask() {
    //console.log("saved button was clicked");
    /** Homework class 2
   * get the values from the input fields and put them into variables
   */
    var id = $("#txtId").val();
    var title = $("#txtTitle").val();
    var date = $("#txtDate").val();
    var status = $("#txtStatus").val();
    var location = $("#txtLocation").val();
    var color = $("#txtColor").val();
    var txtTextarea = $("#txtTextarea").val();

    if(color===""){
        //console.log(": saveTask : color is null: "+color);
        color="#d9d2e9";
    }
    if(!checkField(title,status,date)){//check if these fields are empty
        return;
    }

    var myTask = new Task(id, title, isItImportant, date, status, location, color, txtTextarea);

    //console.log("Starting ajax");//first
    createPost(myTask);
    //display the task onto html
    //console.log(myTask);
    //console.log(JSON.stringify(myTask));
    
    //console.log("ending ajax");//second
    
}
function clearForm() {
    //TODO 1: clear screen
    //to clear the inputs, set its val to ''. xxxx.val('');
    $("#txtId").val('');
    $("#txtTitle").val('');
    $("#txtDate").val('');
    $("#txtStatus").val("-- Select a Status --");
    $("#txtLocation").val("");
    $("#txtColor").val("");
    $("#txtTextarea").val("");
    if (isItImportant) {
        $("#iImportant").removeClass("fas").addClass("far");
        isItImportant = !isItImportant;
    } 
    
}
function displayTask(task) {
    //create the syntax
    //console.log(task.id,task.title,task.important,task.dueDate,task.status,task.location,task.color,task.description);
    //TODO 2: - set the background color of the task to the color select by the user.
    var syntax = `
    <div id="task${task.id}" class="tasks-list-item"> 
        <i class="far fa-star" id="important${task.id}" onclick="importantTask(${task.id})"></i>
        <div class="task-title-desc">
            <h4>Title:</h4>
            <p>${task.title}</p> 
            <h4>Description:</h4>
            <p>${task.description}</p>
        </div>
        <div class="task-due-date">
            <h4>Due Date:</h4> 
            <p>${task.dueDate}</p>
            <h4>Location:</h4>
            <p>${task.location}</p>
        </div>
        <i class="fas fa-trash icon-end" onclick="deleteTask(${task.id})" id="delete${task.id}"></i>
 
    </div>
    `;
    //console.log("important is set to: "+task.important);
    if (task.important) {
        $("#tasks-list-important").append(syntax);
    } else {
        $("#tasks-list").append(syntax);
    }
    //console.log("id: "+"#task"+task.id);
    //console.log(": displayTask : color: "+ task.alertText);
    setborder(task);
    setImportant(task);
}

function setborder(task) {
    //var myGradientString="linear-gradient(to top, "+ task.color +"," + backgroundColor+")1";
    //document.getElementById("task"+task.id).style.borderImage = myGradientString;
    //document.getElementById("task"+task.id).style.backgroundImage = myGradientString;
    //console.log(": setborder : "+ task.alertText);
    document.getElementById("task" + task.id).style.borderColor = task.alertText;
    //console.log(`: setborder : r: ${rRGB}, ${gRGB}, ${bRGB}`);
    //$("#task"+task.id).css('background-color',`rgba(${rRGB},${gRGB},${bRGB},0.5)`);
    document.getElementById("task" + task.id).style.backgroundColor = task.alertText;
    if (task.alertText[0] === "#"){
        var rRGB = parseInt(task.alertText.substring(1,3),16);
        var gRGB = parseInt(task.alertText.substring(3,5),16);
        var bRGB = parseInt(task.alertText.substring(5,7),16);
        var backgroundIsDark=rRGB*0.299+gRGB*0.587+bRGB*0.114;
        if (backgroundIsDark<150){
            $("#task"+task.id).css('color','whitesmoke');
     
        }
        //console.log(": setborder : dynamic if-statement:");
    }else if(task.alertText ==="black"){
        //console.log(": setborder : if-statement : ");
        $("#task"+task.id).css('color','whitesmoke');
    }
    //console.log(": setborder : split: " + task.alertText[1]+task.alertText[2],task.alertText[3]+task.alertText[4],task.alertText[5]+task.alertText[6]);
}
function testRequest() {
    $.ajax({
        type: "GET",
        url: "https://restclass.azurewebsites.net/api/test",
        success: function (response) {
            console.log("yeei it worked!", response);
        },
        error: function (errorDetails) {
            console.log("error it didn't work ", errorDetails);
        }
    });
}
function createPost(myNewTask) {
    //console.log(": createPost : "+myNewTask);
    $.ajax({
        type: "POST",
        url: serverUrl + '/tasks',
        data: JSON.stringify(myNewTask),
        contentType: "application/json",
        success: function (res) {
            //console.log("Server says: createPost : ", res);
            displayTask(res);
            clearForm();
        },
        error: function (errorDet) {
            console.log("Error : createPost : ", errorDet);
            alert("Can't leave the Title/Date blank.");
        }
    });
}
function importantTask(taskId) {
    //create a new task
    // opposite of important because clicked on
    var myNewTask = "";
   //console.log(": important Task : " + taskId);
    $.ajax({//third
        type: "GET",
        url: serverUrl + '/tasks/' + taskId,
        success: function (res) {
            //console.log("success : importantTask : ", res);
            myNewTask = new Task(res.id, res.title, !res.important, res.dueDate, res.status, res.location, res.alertText, res.description, res.user);
            //console.log("success : importantTask : ", myNewTask);
            createPost(myNewTask);
        },
        error: function (errorDet) {
            console.log("Error : importantTask : ", errorDet);
        }
    });

    //console.log(taskId,taskTitle,taskImportant,taskdueDate,taskStatus,taskLocation,taskColor,taskDescription);

    //display new task onto html
    //console.log(myTask);    

    
    //var newTask = new Task(0, task.title, !task.important, task.dueDate, task.status, task.location, task.color, task.description);

    //hide current task.id
    deleteTask(taskId);

    //reload displayTask(task)
    // displayTask(newTask);
}
function setImportant(task) {
    //set important icon to show/no show
    //console.log("important is set to: "+task.important);
    if (task.important) {
        //$("#important"+task.id).show();
        $("#important" + task.id).removeClass("far").addClass("fas icon-start");
        // console.log("inside");
    }//else{
    //$('#important'+task.id).hide();
    //$("#important"+task.id).removeClass("icon-start")
    //   $("#important"+task.id).removeClass("fas").addClass("far");
    // }
}


function toggleImportant() {
    if (isItImportant) {
        $("#iImportant").removeClass("fas").addClass("far");
    } else {
        $("#iImportant").removeClass("far").addClass("fas");
    }
    isItImportant = !isItImportant;
}
function deleteTask(itemId) {
    //TODO 3 - Delete task (optinal)
    //console.log("itemId: deleteTask : " + itemId);
    $.ajax({
        type: "DELETE",
        url: serverUrl + '/tasks/' + itemId,
        success: function (res) {
            //console.log("success : deleteTask: ", res);
            $("#task" + itemId).hide();
        },
        error: function (errorDet) {
            console.log("error inside: deleteTask : ", errorDet);
        }
    });
    //on success function -> remove it from the screen
}
function retrieveData() {
    $.ajax({//third
        type: "GET",
        url: serverUrl + '/tasks',
        success: function (res) {
            //console.log(": retrieveData : returns an array: ", res);
            for (let i = 0; i < res.length; i++) {
                let task = res[i];
                if (task.user === "Tom") {
                    displayTask(task);
                }
            }
        },
        error: function (errorDet) {
            console.log("Error retrieving", errorDet);
        }
    });
}
function footer(){
    var syntax=`<p>Copyright <i class="far fa-copyright"></i> 2021 by Tom Nguyen</p>`;
    $('.container-copyright').append(syntax);
    
}
function hideErrorMessage(){
    $('#errorTitle').hide();
    $('#errorStatus').hide();
    $('#errorDate').hide();
}
function init() {
    //console.log("task manager");
    $('#txtColor').spectrum({
        type: "component"
    });
    retrieveData();
    $('#iImportant').click(toggleImportant);
    $('#saveBtn').click(saveTask);
    hideErrorMessage();
    $("#iShow").removeClass("fa-eye").addClass("fa-eye-slash");
    $(".span-show").hide();
    $("#btnDetails").click(toggleDetailsVisibility);
    footer();
}

window.onload = init;


