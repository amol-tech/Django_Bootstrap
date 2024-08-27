// Data Table Pagination

$("td,th")
     .css({
         // required to allow resizer embedding
         position: "relative"
     })

     .prepend("<div class='resizer'></div>")
     .resizable({
         resizeHeight: false,
         // we use the column as handle and filter
         // by the contained .resizer element
         handleSelector: "",
         onDragStart: function(e, $el, opt) {
         // only drag resizer
         if (!$(e.target).hasClass("resizer"))
             return false;
         return true;
         }
     });


function configure_action_bar(model_name)
{
    var table_id = "tbl_" + model_name;
    var table_elm =  document.getElementById(table_id);

    if (table_elm != null )
    {
        $("#"+table_id).DataTable(
            {
              "pageLength": 40,
              "scrollCollapse": true
            }
        );
        var elm_filter = document.getElementById(table_id+"_filter");
        var elm_filter_input = elm_filter.getElementsByTagName("input")[0];
        var elm_paginate = document.getElementById(table_id+"_paginate");
        var elm_info = document.getElementById(table_id+"_info");

        // Remove First Row
        var elm_row = elm_filter.parentElement.parentElement
        elm_row.parentElement.removeChild(elm_info.parentElement.parentElement)
        elm_row.parentElement.removeChild(elm_row)

        document.getElementById("div_" + model_name + "_filter").append(elm_filter_input);
        document.getElementById("div_" + model_name + "_pagination").append(elm_paginate);
    }
}

$(".panel-left").resizable({
            handleSelector: ".splitter-v",
            resizeHeight: false
     });
$(".panel-left-menu").resizable({
            handleSelector: ".splitter-v",
            resizeHeight: false
     });
 $(".panel-top").resizable({
        handleSelector: ".splitter-h",
        resizeWidth: false
 });

$(document).on("click", ".show-standard-popup", function (e) {
    e.preventDefault();
    var title = $(this).data('title');
    var $popup = $("#standard_popup");
    var popup_url = $(this).data("popup-url");
    $(".modal-header #id_modal_title").text(title);
    $(".modal-body", $popup).load(popup_url, function () {
      $popup.modal("show");
    });
 });

 // Treeview Initialization
$(document).ready(function() {
  $('.treeview').mdbTreeview();
});

$(document).ready(function()
{
    $('.vertical-menu a').click(function(){
    $('.vertical-menu a').removeClass('active');
    $(this).addClass('active');
});

});
var rows = document.getElementsByClassName("tree-node-parent");
for(r of rows)
{
    r.addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
  });
}

function configSelectionEvent(elementId)
{
    var elm_parent = document.getElementById(elementId);
    var rows = elm_parent.getElementsByClassName("row-select");
    for(r of rows)
    {
        r.style.cursor = "pointer";
        r.addEventListener("click",function()
        {
            var rowsNotSelected = elm_parent.getElementsByClassName("row-select");
            for(r of rowsNotSelected)
            {
                r.style.background = "";
            }
            // highlight current selection
            var backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--thm-light-row-sel-bg-color');
            this.style.background = backgroundColor;
        });
    }
}

function configSelectionEventWithContextMenu(elementId)
{
    var elm_table = document.getElementById(elementId);
    var rows = elm_table.getElementsByClassName("row-select");
    var contextMenu = document.querySelector(".menubar-wrapper");
    var shareMenu = contextMenu.querySelector(".sub-menu");

    for(r of rows)
    {
        r.style.cursor = "pointer";
        r.addEventListener("click",function(e)
        {
            var rowsNotSelected = elm_table.getElementsByClassName("row-select");
            for(r of rowsNotSelected)
            {
                 r.style.background = "";
            }
            // highlight current selection
            var backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--thm-light-row-sel-bg-color');
            this.style.background = backgroundColor;
        });

        r.addEventListener("contextmenu", e => {
            e.preventDefault();
            var rect = e.target.getBoundingClientRect();
            let x = rect.left + 50, y = rect.top + 10;
            contextMenu.style.left = `${x}px`;
            contextMenu.style.top = `${y}px`;
            contextMenu.style.visibility = "visible";
        });
    }

    var menus = document.getElementsByClassName("menu-click");
    for(m of menus)
    {
        var action_index = m.getAttributeNode('action-index').value;
        if(action_index != null && action_index != 'NOT-DEFINE')
        {
            m.addEventListener("click",function(e)
            {
                e.preventDefault();
                var $popup = $("#standard_popup");
                var row_selection = getTableSelection(elm_table);
                var pk = row_selection.getElementsByClassName("row_id")[0];
                if (pk != null)
                {
                    var elm_menu = e.target;
                    if (elm_menu instanceof HTMLSpanElement)
                    {
                        elm_menu = elm_menu.parentElement.parentElement;
                    }
                    var action_title = elm_menu.getAttributeNode('action-title').value;
                    var action_index = elm_menu.getAttributeNode('action-index').value;
                    var action_url = elm_menu.getAttributeNode('action-url').value;
                    action_url = action_url.replace('@pk@',pk.textContent);
                    action_url = action_url.replace('context_menu',action_index);
                    $(".modal-header #id_modal_title").text(action_title);
                    $(".modal-body", $popup).load(action_url, function ()
                    {
                        $popup.modal("show");
                    });
                }
                else
                {
                    console.error('row_id class not define to identify the primary key value');
                }
            });
        }
        else
        {
            console.error('No action-url class define for this action');
        }
    }

    document.addEventListener("click", e => {
        if (contextMenu.style.visibility == "visible")
        {
            var s = e.target;
        }
	    contextMenu.style.visibility = "hidden"
    });
}

function getTableSelection(elm_parent)
{
    var rows = elm_parent.getElementsByClassName("row-select");
    for (r of rows)
    {
        if(r.style.background == "lightblue")
        {
            console.log(r.getElementsByClassName("row_id")[0].textContent);
            return r;
        }
    }
    return null;
}

function configOnSelectionView(elementId,data_url,data_view_id)
{
    var elm_parent = document.getElementById(elementId);
    var rows = elm_parent.getElementsByClassName("row-select");
    for(r of rows)
    {
        r.addEventListener("click",function()
        {
            var view_id = '#'+data_view_id;
            // AJax Call
            $.ajax({
                type: "GET",
                url: data_url,  // URL to your view that serves new info
                data: {'row_id': this.querySelector(".node-value").textContent.trim()}
            })
            .done(function(response) {
                $(view_id).html(response);
            });
        });
    }
}

function findParentByClass(el,class_name)
{
    while (el.parentElement)
    {
        el = el.parentElement;
        if (el.classList.contains(class_name))
            return el;
    }
    return null;
}

function MultiselectDropdown(options){
  var config={
    search:true,
    height:'15rem',
    placeholder:'select',
    txtSelected:'selected',
    txtAll:'All',
    txtRemove: 'Remove',
    txtSearch:'search',
    ...options
  };
  function newEl(tag,attrs){
    var e=document.createElement(tag);
    if(attrs!==undefined) Object.keys(attrs).forEach(k=>{
      if(k==='class') { Array.isArray(attrs[k]) ? attrs[k].forEach(o=>o!==''?e.classList.add(o):0) : (attrs[k]!==''?e.classList.add(attrs[k]):0)}
      else if(k==='style'){
        Object.keys(attrs[k]).forEach(ks=>{
          e.style[ks]=attrs[k][ks];
        });
       }
      else if(k==='text'){attrs[k]===''?e.innerHTML='&nbsp;':e.innerText=attrs[k]}
      else e[k]=attrs[k];
    });
    return e;
  }

  document.querySelectorAll("select[multiple]").forEach((el,k)=>{

    var div=newEl('div',{class:'multiselect-dropdown',style:{width:config.style?.width??el.clientWidth+'px',padding:config.style?.padding??''}});
    el.style.display='none';
    el.parentNode.insertBefore(div,el.nextSibling);
    var listWrap=newEl('div',{class:'multiselect-dropdown-list-wrapper'});
    var list=newEl('div',{class:'multiselect-dropdown-list',style:{height:config.height}});
    var search=newEl('input',{class:['multiselect-dropdown-search'].concat([config.searchInput?.class??'form-control']),style:{width:'100%',display:el.attributes['multiselect-search']?.value==='true'?'block':'none'},placeholder:config.txtSearch});
    listWrap.appendChild(search);
    div.appendChild(listWrap);
    listWrap.appendChild(list);

    el.loadOptions=()=>{
      list.innerHTML='';

      if(el.attributes['multiselect-select-all']?.value=='true'){
        var op=newEl('div',{class:'multiselect-dropdown-all-selector'})
        var ic=newEl('input',{type:'checkbox'});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:config.txtAll}));

        op.addEventListener('click',()=>{
          op.classList.toggle('checked');
          op.querySelector("input").checked=!op.querySelector("input").checked;

          var ch=op.querySelector("input").checked;
          list.querySelectorAll(":scope > div:not(.multiselect-dropdown-all-selector)")
            .forEach(i=>{if(i.style.display!=='none'){i.querySelector("input").checked=ch; i.optEl.selected=ch}});

          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
        });
        el.addEventListener('change', (ev)=>{
          let itms=Array.from(list.querySelectorAll(":scope > div:not(.multiselect-dropdown-all-selector)")).filter(e=>e.style.display!=='none')
          let existsNotSelected=itms.find(i=>!i.querySelector("input").checked);
          if(ic.checked && existsNotSelected) ic.checked=false;
          else if(ic.checked==false && existsNotSelected===undefined) ic.checked=true;
        });

        list.appendChild(op);
      }

      Array.from(el.options).map(o=>{
        var op=newEl('div',{class:o.selected?'checked':'',optEl:o})
        var ic=newEl('input',{type:'checkbox',checked:o.selected});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:o.text}));

        op.addEventListener('click',()=>{
          op.classList.toggle('checked');
          op.querySelector("input").checked=!op.querySelector("input").checked;
          op.optEl.selected=!!!op.optEl.selected;
          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
        });
        o.listitemEl=op;
        list.appendChild(op);
      });
      div.listEl=listWrap;

      div.refresh=()=>{
        div.querySelectorAll('span.optext, span.placeholder').forEach(t=>div.removeChild(t));
        var sels=Array.from(el.selectedOptions);
        if(sels.length>(el.attributes['multiselect-max-items']?.value??5)){
          div.appendChild(newEl('span',{class:['optext','maxselected'],text:sels.length+' '+config.txtSelected}));
        }
        else{
          sels.map(x=>{
            var c=newEl('span',{class:'optext',text:x.text, srcOption: x});
            if((el.attributes['multiselect-hide-x']?.value !== 'true'))
              c.appendChild(newEl('span',{class:'optdel',text:'🗙',title:config.txtRemove, onclick:(ev)=>{c.srcOption.listitemEl.dispatchEvent(new Event('click'));div.refresh();ev.stopPropagation();}}));

            div.appendChild(c);
          });
        }
        if(0==el.selectedOptions.length) div.appendChild(newEl('span',{class:'placeholder',text:el.attributes['placeholder']?.value??config.placeholder}));
      };
      div.refresh();
    }
    el.loadOptions();

    search.addEventListener('input',()=>{
      list.querySelectorAll(":scope div:not(.multiselect-dropdown-all-selector)").forEach(d=>{
        var txt=d.querySelector("label").innerText.toUpperCase();
        d.style.display=txt.includes(search.value.toUpperCase())?'block':'none';
      });
    });

    div.addEventListener('click',()=>{
      div.listEl.style.display='block';
      search.focus();
      search.select();
    });

    document.addEventListener('click', function(event) {
      if (!div.contains(event.target)) {
        listWrap.style.display='none';
        div.refresh();
      }
    });
  });
}

window.addEventListener('load',()=>{
  MultiselectDropdown(window.Swara);
});