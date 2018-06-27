var token;
var opts = [];

function printToken(){
    alert(token);
}

$( "#login-btn" ).click(function(event) {
 
    event.preventDefault();
    var voter_id = document.getElementById("vot-id").value;
    var passwd = document.getElementById("passwd").value;
    
    $.ajax({
        type: 'GET',
        url: "https://localhost:3005/token", 
        data: {"voter_id": voter_id, "pwd": passwd}, 
        success: function(data){
            
            response_data = JSON.parse(data);
            
            token = response_data.token;
            opts = response_data.opts;
            console.log(token);
            
            if(token != "0"){
                var dummy = document.getElementById("login-div");
                document.getElementById("main-div2").removeChild(dummy);
                
                var div, div2, input, label, h2, form, btn;
                    
                h2 = document.createElement("h2");
                h2.innerHTML = "Opções";
                
                form = document.createElement("form");
                form.setAttribute("class", "form");
                form.appendChild(h2);
           
                div2 = document.createElement("div");
                div2.setAttribute("class", "limiter");
                
                for(var i = 0; i < opts.length; i++){
                    div = document.createElement("div");
                    div.setAttribute ("class", "inputGroup");
                    var index = i+1;
                    input = document.createElement("input");
                    input.setAttribute("name", "radio");
                    input.setAttribute("id", "radio"+index.toString());
                    input.setAttribute("type", "radio");
                    
                    label = document.createElement("label");
                    label.setAttribute("for", "radio"+index.toString());
                    label.innerHTML = opts[i];
                    
                    div.appendChild(input);
                    div.appendChild(label);
                    form.appendChild(div);
                }
                btn = document.createElement("button");
                btn.setAttribute("class", "login100-form-btn");
                btn.setAttribute("id", "submit-vote");
                btn.setAttribute("onclick", "submitVote(event)");
                btn.innerHTML = "Submeter";
                form.appendChild(btn);
                div2.appendChild(form);
                document.getElementById("main-div1").appendChild(div2);
             
                
                
            }
            else alert ("ERRO! Credenciais inválidas ou já utilizadas.");
        }
        
    });
});

function submitVote(event){
    event.preventDefault();
    console.log("submitting vote");
    
    var vote = 0;
    for(var i = 0; i < opts.length; i++){
        index = i+1;
        console.log(document.getElementById("radio"+index.toString()));
        if(document.getElementById("radio"+index.toString()).checked){
            vote = index.toString();
            break;
        }
    }
    
    console.log("************");
    console.log(vote);
    console.log(token);
    var vote_json = new Object()
    vote_json.vote = vote;
    vote_json.rand = Math.floor(Math.random() * Math.pow(2,128));
    vote_json = JSON.stringify(vote_json);
    
    //Acrescentar código para assinar o vote_json
    
    if(vote != 0){
        
        
        $.ajax({
        type: 'GET', 
        url: "https://localhost:3007/", 
        data: {"vote": vote_json,  "token": token},
        success: function(data){
            if(data == "0") alert("Voto submetido com sucesso");
               else alert("ERRO! Por favor tente de novo");
        },
        error: function(err){console.log("ERRO");}
        });
    }
    else{ 
        alert("Por favor selecione uma opção válida!");
    }
}