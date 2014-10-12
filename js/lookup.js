
window.endpoint = "http://localhost:3030/bc/query?query=";
window.collectionParam = getURLParameter("collection");
window.propParam = encodeURIComponent("http://www.homermultitext.org/hmt/citedata/") + getURLParameter("property");
 



$(document).ready(function(){

        var tempQuery = collectionQuery();

        $.getJSON( tempQuery, function( data ) {
                collectionJSON = data;
                populateCollections(collectionJSON);
        });


});

function populateCollections(data){
        var items = [];
        $("#collectionOption").html("");

        $.each( data.results.bindings, function() {
            ts = "<option value='" + this.coll.value + "'>";
            ts += this.label.value + "</option>";
            $("#collectionOption").append(ts);
        });
        if (window.collectionParam != null){
            $("#collectionOption").val(window.collectionParam);
            queryFields(window.collectionParam);
        }
        $("#collectionOption").change(function(){
                window.collectionParam = this.value;
                queryFields(this.value);
        });
}

function queryFields(collURN){
        var tempQuery = propertiesQuery(collURN);

        $.getJSON( tempQuery, function( data ) {
                propJSON = data;
                populateProperties(propJSON);
        });

}

function populateProperties(data){

        var items = [];
        $("#fieldOption").html("");

        $.each( data.results.bindings, function() {
            ts = "<option value='" + this.property.value + "'>";
            ts += this.property.value.split("_")[1] + "</option>";
            $("#fieldOption").append(ts);
            $("#fieldOption").val('');
        });
        if (window.propParam != null){
            console.log(window.propParam);
            var myProp = decodeURIComponent(window.propParam);
            console.log(myProp);
            $("#fieldOption").val(myProp);
                $("#lookUpButton").removeAttr("disabled");
                $("#lookUpButton").bind("click",function(){
                    doQuery();       
                });
        }

        $("#fieldOption").change(function(){
                console.log(this.value);
                
                $("#lookUpButton").removeAttr("disabled");
                fieldParam = this.value;
                $("#lookUpButton").bind("click",function(){
                    doQuery();       
                });
        });
}


function doQuery(){
   var  qString = $.trim($("#text2find").val());
   var qColl = $("#collectionOption").val();
   var qField = $("#fieldOption").val(); 
    console.log("Will query on...");
    console.log(qString);
    console.log(qColl);
    console.log(qField);
    var q = stringQuery(qColl,qField,qString);
    $.getJSON( q, function( data ) {
                resultsJSON = data;
                showResults(resultsJSON);
     });

}

function showResults(data){
    var thtml = ""
    $.each( data.results.bindings, function() {
           var ts = this.obj.value
           thtml += '<blockquote class="cite-collection" cite="';
           thtml += ts + '">' + ts + '</blockquote>'; 
           console.log(ts);
    });
    $("#results").html("");
    $("#results").append(thtml);
    citekit_init();
}

/* ------ queries --------- */

function collectionQuery(){

var q = "select distinct ?coll ?label where { ?s <http://www.homermultitext.org/cite/rdf/belongsTo> ?coll .  ?coll <http://www.w3.org/1999/02/22-rdf-syntax-ns#label> ?label .  }";
var returnVal = window.endpoint + encodeURIComponent(q);
return returnVal;

}

function propertiesQuery(collURN){
    console.log("doing propQuery");
    var q = "select ?property where { <";
    q += collURN + "> <http://www.homermultitext.org/cite/rdf/collProperty> ?property .  }";
var returnVal = window.endpoint + encodeURIComponent(q);
return returnVal;

}

function stringQuery(coll,prop,s){
    var q = "select ?obj where { ?obj <http://www.homermultitext.org/cite/rdf/belongsTo><" + coll;
    q += "> .  ?obj <" + prop;
    q += '> ?f .  FILTER regex(?f, "' + s;
    q += '", "i") }';
    var returnVal = window.endpoint + encodeURIComponent(q);
    return returnVal;
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
