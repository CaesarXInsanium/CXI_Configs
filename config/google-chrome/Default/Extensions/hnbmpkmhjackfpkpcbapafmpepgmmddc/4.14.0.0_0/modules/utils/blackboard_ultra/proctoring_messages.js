chrome.runtime.onMessage.addListener(((request,sender,sendResponse)=>{if("bbultra_bypass_pin_accepted"===request.type)chrome.storage.local.set({bypass_status:1},(()=>{chrome.runtime.sendMessage({message:"close_all_webcam_windows"});removeLiveChatWidget()}));if("bbultra_open_livechat"===request.type)hlChat.maximizeWindow();if("bbultra_launch_webcam"===request.type)chrome.storage.local.get(null,(storage=>{chrome.runtime.sendMessage({message:"webcam_launch",url:hl_url+"/webapp/camera",session_id:request.data.sessionId,lms_id:6,relaunch:0,display_count:storage.display_count,current_url:window.location.hostname})}));if("bbultra_start_proctoring"===request.type){var data={lms_id:request.data.lmsId,lms_school_id:request.data.lmsSchoolId,lms_exam_id:request.data.lmsExamId,lms_student_id:request.data.lmsUserId,lms_student_email:request.data.studentEmail,lms_student_name:request.data.studentName,lms_student_first_name:request.data.studentFirstName,lms_student_last_name:request.data.studentLastName,current_attempt:request.data.attemptNumber,href:window.location.href,user_agent:navigator.userAgent,billable:1,ext_version:chrome.runtime.getManifest().version,browser_version:getChromeVersion(),self:""};chrome.runtime.sendMessage({message:"lms_init",data:data},(r=>{sendResponse(r);if(r&&r.result&&1==r.response.status){allowedScreens();chrome.runtime.sendMessage({message:"exam_tab_id"});startExamPending=true;insertLiveChat(r.response.student.user_name,r.response.student.id,r.response.exam_id,r.response.school_code);if(r.translations)globalThis.translations=r.translations}}))}if("bbultra_inside_exam"===request.type)chrome.storage.local.get(["bypass_status"],(storage=>{if(!storage.bypass_status){relaunchWebCamera();if(!examWasStarted)waitForFirstQuestion(initializeExam)}}));if("bbultra_submit_exam"===request.type){examWasStarted=false;chrome.storage.local.get(["bypass_status"],(storage=>{if(!storage.bypass_status)postLog("Exam Submit",currentQuestion)}));chrome.runtime.sendMessage({message:"disable_browser_guard"});removeLiveChatWidget();hlExamTools.removeExamTools();setTimeout((()=>{chrome.storage.local.get(null,(storage=>{if(null!==storage.webcam_tab_id&&"submitted"!==storage.exam_state)chrome.runtime.sendMessage({message:"close_webcam",type:"submit"})}))}),5e3)}if("bbultra_outside_exam"===request.type){examClosed();removeLiveChatWidget()}return true}));