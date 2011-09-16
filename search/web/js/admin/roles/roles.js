
function Roles() {
	this.dialog = null;
	this.newRoleDialog = null;
	this.editRoleDialog = null;
}

Roles.prototype.post = function(action,struct, retrieveFuncion) {
	$.post("users?action="+action, struct, retrieveFuncion);
}

Roles.prototype.refresh = function() {
	$.get("inc/admin/_roles.jsp", bind(function(data){ 
		$('#rolesDialog').html(data);
	},this));	
}

Roles.prototype.deleteRole = function(rname) {
	showConfirmDialog(dictionary['rights.dialog.buttons.delete.message'],  bind(function() {
	    var strct = {name: rname};
    	$.post("users?action=deleterole", strct, this.refresh);
	},this));
}


Roles.prototype.editRole = function(rname) {
	$.get("inc/admin/_edit_role.jsp?rolename="+rname, bind(function(data){ 
		if (this.editRoleDialog) {
			this.editRoleDialog.dialog('open');
		} else {
			$(document.body).append('<div id="editRole"></div>')
	        this.editRoleDialog = $('#editRole').dialog({ 
	            width:300,
	            height:250,
	            modal:true,
	            title:"#title",
	            buttons: {
	            	"Ok": bind(function() {
	            		var struct = {	id: $("#editRoleId").val(), 
	            				name: $("#editRoleName").val(), 
	            				personalAdminId: $("#editRolePersonalAdminId").val()
	            		};

	            		this.post("saverole", struct, this.refresh);
	            		this.editRoleDialog.dialog("close");
	            		
	            	},this),
	            	"Close": bind(function() {
	            		this.editRoleDialog.dialog("close");
	            	},this)
	            }
	    	});
		}
		$('#editRole').html(data);
	},this));
}

Roles.prototype.newRole = function() {
	$.get("inc/admin/_new_role.jsp", bind(function(data){ 
		if (this.newRoleDialog) {
			this.newRoleDialog.dialog('open');
		} else {
			
			$(document.body).append('<div id="newRole"></div>')
	        this.newRoleDialog = $('#newRole').dialog({ 
	            width:300,
	            height:250,
	            modal:true,
	            title:"#title",
	            buttons: {
	            	"Ok": bind(function() {

	            		var struct = {	id: -1, 
	            				name: $("#newRoleName").val(), 
	            				personalAdminId: $("#newRolePersonalAdminId").val()
	            		};
	            		this.post("newrole", struct, this.refresh);
	            		this.newRoleDialog.dialog("close");
	            		
	            	},this),
	            	"Close": bind(function() {
	            		this.newRoleDialog.dialog("close");
	            	},this)
	            }
	    	});
		}

		$('#newRole').html(data);
	},this));	
}

Roles.prototype.showRoles = function() {
	$.get("inc/admin/_roles.jsp", bind(function(data){ 

		if (this.dialog) {
			this.dialog.dialog('open');
		} else {
			
			$(document.body).append('<div id="rolesDialog"></div>')
	        this.dialog = $('#rolesDialog').dialog({ 
	            width:640,
	            height:480,
	            modal:true,
	            title:"#title",
	            buttons: {
	            	"Close": bind(function() {
	            		this.dialog.dialog("close");
	            	},this)
	            }
	    	});
		}
		$('#rolesDialog').html(data);
	},this));
}

var roles = new Roles();