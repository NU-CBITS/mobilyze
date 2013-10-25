	forms = {};
	forms.utilty = {};
	

	forms.cleanElement = function(form_element){

		var template_form_element = {orderer: form_element.orderer || null, content:form_element.content || "",question_type: form_element.question_type || null,responses: form_element.responses || [],data_label: form_element.data_label || null, placeholder: form_element.placeholder || null, classes: form_element.classes || "", ids: form_element.ids || "", default_response : form_element.default_response || "", visible:  form_element.visible || true, rows: form_element.rows || 3, cols: form_element.cols || 40};
		return template_form_element
	};

	forms.views = {};


	forms.views.wrapper = function(view,el){


		el.classes = el.classes || "";

		var return_value = '<div class="' + el.classes;

		if(el.visible == false){
			return_value += ' hide '
		}

		return_value += ' form-group ">'+view+'</div>'

		return return_value
	}



	forms.views.mainView = function(form, search_criteria){

		var form_to_render = form;

		var view = "";
		var element_view = "";

		_.each(form_to_render.elements,function(el){

			switch (el.question_type){
			case "textarea":
			element_view = forms.views.textarea(el);
			break;
			case "toggle":
			element_view = forms.views.radio(el);
			break;
			case "input" :
			element_view = forms.views.genericInput(el);
			break;
			case "phone":
			element_view =  forms.views.genericInput(el);
			break;
			case "date":
			element_view = forms.views.genericInput(el);
			break;
			case "time":
			element_view = forms.views.genericInput(el);
			break;
			case "select":
			element_view = forms.views.genericInput(el);
			break;
			case "checkbox":
			element_view = forms.views.radio(el);
			break;
			case "radio":
			element_view = forms.views.radio(el);
			break;
			default:
			element_view =  "<" + el.question_type + ">" + el.content +" <"
			break;	
			}
			view += forms.views.wrapper(element_view,el);

		});

		view += forms.views.submitButton(form_to_render.submit);

		return  '<form role="form" id="' + form_to_render.id + '">' + view + "</form>"

	};

	forms.views.submitButton = function(form_submit_object){


		if(form_submit_object == undefined){form_submit_object={};}

		if (typeof(form_submit_object.visible) == 'undefined'){var visible = false;}else{var visible=form_submit_object.visible;}
		var template = {label:form_submit_object.label || "Save", visible:visible, classes: form_submit_object.classes || ""}
		if (template.visible == false){
			var classes = 'class="hide '+ template.classes +'" '
		}
		else{
			var classes = 'class="'+ template.classes +'" '
		}


		return '<button type="submit"'+ classes+'>' +template.label + '</button>'




	}


	forms.views.label = function(form_element,view){

		form_element = forms.cleanElement(form_element);

		return '<label for="' + form_element.data_label+'">' + form_element.content + view + '</label>'

	};

	forms.views.genericInput = function(form_element){

		form_element = forms.cleanElement(form_element);

		var return_value = '<input type="'+form_element.question_type+'" name="'+form_element.data_label+'" id="'+form_element.ids+'" class="form-control" value="'+form_element.default_response+'" placeholder="'+form_element.placeholder +'"/>'

		return forms.views.label(form_element,return_value)

	};

	forms.views.textarea = function(form_element){
		form_element = forms.cleanElement(form_element);

		var return_value = '<textarea class="form-control" rows="' +form_element.rows+'" cols="' +form_element.cols+'" id="' + form_element.ids + '" name="' + form_element.data_label + '" placeholder="' + form_element.placeholder  +'">'+form_element.default_response+'</textarea>';

		return forms.views.label(form_element,return_value)

	};




	forms.views.radio = function(form_element){

		form_element = forms.cleanElement(form_element);

		if (form_element.content == ""){var return_value = ""}else{
			var return_value = '<label for="' + form_element.data_label + '">' + form_element.content + '</label>';}


		_.each(form_element.responses, function(el){

			if (el.checked == true){
				var checked = 'checked="checked"';
			}
			else {
				var checked = ""
			}


			if (el.classes != undefined){
				var classes = 'class =" ' + el.classes + '" ';
			}
			else{

				var classes = ""
			}

			return_value += '<div class="radio"><label ' + classes +'><input type="radio" name="'+form_element.data_label+'" value="'+el.value+'"' + checked+'>'+ el.label+'</label></div>'

		})
	

		return return_value



	}
	
