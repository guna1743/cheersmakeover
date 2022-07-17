$("#add_user").submit(function(event){
    alert("Appointment Form Submitted Successfully..");
})

//for update tha data

$("#update_user").submit(function(event){
    // console.log("hello")  
     event.preventDefault();

    var unindexed_array=$(this).serializeArray();
    var data={}

    $.map(unindexed_array,function(n,i){
        data[n['name']]=n['value']
    })

    console.log(data);

    var request={
        "url":`https://cheersmakeover.herokuapp.com/api/users/${data.id}`,
        "method":"PUT",
        "data":data
    }
    $.ajax(request).done(function(response){
        alert("Appointment Form Updated Successfully..");
    })
})


if(window.location.pathname =="/adminpage"){
    console.log("hello")
    $ondelete=$(".deletebtn");
    $ondelete.click(function(){
        var id=$(this).attr("data-id")

        var request={
            "url":`https://cheersmakeover.herokuapp.com/api/users/${id}`,
            "method":"DELETE"
        }
        if(confirm("Do you really want to delete this Appointment?")){
            $.ajax(request).done(function(response){
                alert("Appointment Deleted Successfully..");
                location.reload();
            })
        }
    })
}

