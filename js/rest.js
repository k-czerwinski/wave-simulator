var request;
var objJSON;
var id_mongo;
const xhr = new XMLHttpRequest();
 
 
// Lista rekordow w bazie
function _list() {    
   xhr.open("GET", "http://pascal.fis.agh.edu.pl/~1czerwinski/lab12/stud/list", true);   
   xhr.responseType = 'json';
   xhr.addEventListener("load", e => {
      if (xhr.status == 200)    {
         //objJSON = JSON.parse(request.response);
         objJSON = xhr.response ;
         var txt = "";
         for ( var id in objJSON )  {
             txt +=  id+": {" ;
             for ( var prop in objJSON[id] ) {             
                 if ( prop !== '_id')
                   { txt += prop+":"+objJSON[id][prop]+",";  }
                 else
                   { txt += "id:" + objJSON[id][prop]['$oid']+"," ; } 
             }
             txt +="}<br/>";
         }
         document.getElementById('data').innerHTML = '';
         document.getElementById('result').innerHTML = txt;
      }
   })
   xhr.send(null);
}
