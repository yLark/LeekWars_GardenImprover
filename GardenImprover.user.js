// ==UserScript==
// @name       		LeekWars : GardenImprover
// @version			  1.0
// @description  	Dans le potager, ajoute un lien sous chaque poireau proposé. Cela permet de rapidement accéder à sa page.
// @match      		http://leekwars.com/garden
// @author			  yLark
// @grant			    none
// @projectPage		https://github.com/yLark/LeekWars_GardenImprover
// @downloadURL		https://github.com/yLark/LeekWars_GardenImprover/raw/master/GardenImprover.user.js
// @updateURL		  https://github.com/yLark/LeekWars_GardenImprover/raw/master/GardenImprover.user.js
// ==/UserScript==


// Récupère les id et noms des poireaux
function getLeeksData(){
	
	var fights_type = {'enemies' : 'enemies', 'farmers' : 'farmers'};
	
	for(var fight_type in fights_type){	// Boucle sur les types de combats : solo, éleveur, équipe
		
		gardenData[fight_type] = {};
		var enemies_list;
		if(fight_type == 'farmers'){
			enemies_list = document.getElementById(fight_type);
		}else{
			enemies_list = document.getElementsByClassName(fight_type);
		}
		
		for(var i=0; i < enemies_list.length || i < 1; i++){
			gardenData[fight_type][i] = {};
			
			var enemies;
			if(enemies_list.length == undefined){
				enemies = enemies_list.children;
			}else{
				enemies = enemies_list[i].children;
			}
			
			for(var j=0; j < enemies.length; j++){
				
				var id = enemies[j].id;	// Récupère l'ID du poireau, de l'éleveur ou de l'équipe
				
				// étape intermédiaire de la récupération du nom
				var textToRemove = '';
				for(var k in enemies[j].children){
					var newText = enemies[j].children[k].textContent;
					if(newText != undefined) textToRemove += newText;
				}
				
				var name = enemies[j].textContent;
				name = name.replace(textToRemove,'');
				
				gardenData[fight_type][i][j] = {'id' : id, 'name' : name};	// Insertion dans la variable
			}
		}
	}
}


// Insère les liens cliquables dans le document html
function insertLink(){
	
	var fight_type_to_link = {'enemies' : 'leek', 'farmers' : 'farmer'};
	
	for(var type in gardenData){
		
		var enemies_list;
		if(type == 'farmers'){
			enemies_list = document.getElementById(type);
		}else{
			enemies_list = document.getElementsByClassName(type);
		}
		
		for(var i=0; i < enemies_list.length || i < 1; i++){
			for(var j in gardenData[type][i]){
				
				var linkLeek = document.createElement('div');
				
				// Génération du lien et de ses propriétés
				var a = document.createElement('a');
				a.href = '/' + fight_type_to_link[type] + '/' + gardenData[type][i][j]['id'];
				a.style = 'opacity:0.12;';
				a.setAttribute('onMouseOut',  'this.style.opacity=0.12');
				a.setAttribute('onMouseOver', 'this.style.opacity=0.25');
				
				// Génération de l'image et de ses propriétés
				var img = document.createElement('img');
				img.src = 'http://static.leekwars.com/image/house.png';
				img.alt = gardenData[type][i][j]['name'];
				img.title = 'Afficher la page de ' + gardenData[type][i][j]['name'];
				img.width = 18;
				
				a.appendChild(img);
				linkLeek.appendChild(a);
				
				if(enemies_list.length == 0 || enemies_list.length == undefined){
					enemies_list.children[j].appendChild(linkLeek);	// Insertion du contenu dans le DOM
				}else{
					enemies_list[i].children[j].appendChild(linkLeek);	// Insertion du contenu dans le DOM
				}
			}
		}
	}
}

var gardenData = {};
getLeeksData();
insertLink();
