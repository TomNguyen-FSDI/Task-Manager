var taskId=0;
class Task{
    constructor(id,title,important,dateTime,status,location,color,description){
        //this.id=taskId++;
        this.title=title;
        this.important=important;
        this.dueDate=dateTime;
        this.status=status;
        this.location=location;
        this.alertText=color;
        this.description=description;
        
        this.user="Tom";
    }
}