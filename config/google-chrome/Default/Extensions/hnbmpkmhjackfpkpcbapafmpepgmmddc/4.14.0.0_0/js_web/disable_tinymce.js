var disallowed_array=["contextmenu","paste","copy","cut","dragstart","drop"];var disallowed_events=disallowed_array.join(" ");if("undefined"!=typeof tinyMCE){for(editor_id in tinyMCE.editors){tinyMCE.editors[editor_id].off(disallowed_events);tinyMCE.editors[editor_id].on(disallowed_events,(function(event){event.preventDefault();event.stopImmediatePropagation();dispatchTinymceEvent(event.type);return false}))}function dispatchTinymceEvent(event_type){document.dispatchEvent(new CustomEvent("hl_tinymce_event",{bubbles:true,detail:{event_type:event_type}}))}}