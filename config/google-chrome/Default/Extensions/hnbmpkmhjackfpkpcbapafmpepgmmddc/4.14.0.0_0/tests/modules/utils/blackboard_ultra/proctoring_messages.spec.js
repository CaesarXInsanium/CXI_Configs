chrome.extension=chrome.runtime;require("../../../../modules/utils/blackboard_ultra/proctoring_messages");require("../../../../blackboard-ultra");require("../../../../modules/utils/blackboard_ultra/initialize_exam");require("../../../../modules/utils/blackboard_ultra/wait_for_first_question");const fs=require("fs");const path=require("path");globalThis.hl_url="https://tacosrgreat.com";globalThis.translations={webcam:{relaunch:"Please relaunch your web camera.<br />Do not close or minimize the web camera window please."}};function chromeStorageGetMock(storage){globalThis.chrome.storage={local:{get:jest.fn(((keys,callback)=>{callback(storage)}))}}}function chromeStorageSetMock(){globalThis.chrome.storage={local:{set:jest.fn(((keys,callback)=>{callback()}))}}}const manifest={version:"891234o75"};chrome.runtime.getManifest.mockReturnValue(manifest);getChromeVersion=jest.fn((()=>"valid_chrome_version"));function chromeRuntimeSendMessageMock(responseData){globalThis.chrome.runtime.sendMessage=jest.fn(((data,responseCallback)=>{if("undefined"!==typeof responseCallback)responseCallback(responseData)}))}function setupCurrentQuestion(){document.body.innerHTML=fs.readFileSync(path.resolve(__dirname,"fixtures/fake_exam_questions.html"));globalThis.currentQuestion=document.querySelectorAll("bb-assessment-question")[0].cloneNode(true)}describe("proctoring messages",(()=>{beforeEach((()=>{globalThis.startExamPending=false;globalThis.examWasStarted=true;jest.useFakeTimers();jest.clearAllMocks()}));afterEach((()=>{jest.useRealTimers()}));it("can start proctoring",(()=>{const responseData={result:true,response:{status:1,student:{user_name:"student_user",id:425},exam_id:"123",school_code:"loremipsum"}};chromeRuntimeSendMessageMock(responseData);globalThis.allowedScreens=jest.fn();globalThis.insertLiveChat=jest.fn();const sendResponseMock=jest.fn();const request={type:"bbultra_start_proctoring",data:{lmsId:"6",lmsSchoolId:"123",lmsExamId:"bacon",lmsUserId:"123908sdkfj2093",studentEmail:"taco@tacos.com",studentName:"Joe Taco",attemptNumber:"25"}};const storage={lms_exam_id:"cheese"};chromeStorageGetMock(storage);chrome.runtime.onMessage.callListeners(request,{},sendResponseMock);expect(globalThis.startExamPending).toBe(true);expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"lms_init",data:{lms_id:request.data.lmsId,lms_school_id:request.data.lmsSchoolId,lms_exam_id:request.data.lmsExamId,lms_student_id:request.data.lmsUserId,lms_student_email:request.data.studentEmail,lms_student_name:request.data.studentName,current_attempt:request.data.attemptNumber,href:window.location.href,user_agent:navigator.userAgent,billable:1,ext_version:chrome.runtime.getManifest().version,browser_version:getChromeVersion(),self:""}},expect.anything());expect(sendResponseMock).toHaveBeenCalledWith(responseData);expect(allowedScreens).toHaveBeenCalled();expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"exam_tab_id"});expect(insertLiveChat).toHaveBeenCalledWith(responseData.response.student.user_name,responseData.response.student.id,responseData.response.exam_id,responseData.response.school_code)}));it("can open livechat",(()=>{const request={type:"bbultra_open_livechat"};hlChat={maximizeWindow:jest.fn()};chrome.runtime.onMessage.callListeners(request,{});expect(hlChat.maximizeWindow).toBeCalled()}));it("can launch webcam",(()=>{const request={type:"bbultra_launch_webcam",data:{sessionId:"1234"}};const storage={display_count:6};chromeStorageGetMock(storage);chrome.runtime.onMessage.callListeners(request,{});expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"webcam_launch",display_count:storage.display_count,session_id:request.data.sessionId,lms_id:6,relaunch:0,url:hl_url+"/webapp/camera",current_url:window.location.hostname})}));it("can handle bypassing proctoring",(()=>{const request={type:"bbultra_bypass_pin_accepted"};chromeRuntimeSendMessageMock();chromeStorageSetMock();globalThis.isLiveChatActive=true;let htmlElement;document.body.appendChild=jest.fn((element=>{htmlElement=element}));chrome.runtime.onMessage.callListeners(request,{});expect(globalThis.chrome.storage.local.set).toHaveBeenCalledWith({bypass_status:1},expect.anything());expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"close_all_webcam_windows"});expect(htmlElement.type).toBe("text/javascript");expect(htmlElement.innerHTML).toBe("LiveChatWidget.call('destroy')")}));xit("can send log of first question",(()=>{}));it("can handle outside exam message after exam was started",(()=>{const request={type:"bbultra_outside_exam"};document.removeEventListener=jest.fn();window.removeEventListener=jest.fn();chromeRuntimeSendMessageMock();globalThis.hlExamTools={removeExamTools:jest.fn()};globalThis.isLiveChatActive=true;let htmlElement;document.body.appendChild=jest.fn((element=>{htmlElement=element}));chrome.runtime.onMessage.callListeners(request,{});expect(globalThis.examWasStarted).toBe(false);expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"exam_window_closed"});expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"close_webcam",type:"relaunch"});["copy","cut","paste","dragstart","contextmenu"].forEach((eventType=>{expect(document.removeEventListener).toHaveBeenCalledWith(eventType,expect.anything())}));expect(hlExamTools.removeExamTools).toHaveBeenCalled();expect(htmlElement.type).toBe("text/javascript");expect(htmlElement.innerHTML).toBe("LiveChatWidget.call('destroy')");expect(window.removeEventListener).toHaveBeenCalledWith("focus",expect.anything())}));it("will not try to destroy livechat widget if not inserted",(()=>{globalThis.isLiveChatActive=false;const request={type:"bbultra_outside_exam"};chrome.runtime.onMessage.callListeners(request,{});expect(document.body.innerHTML).not.toContain("LiveChatWidget.call('destroy')")}));it.todo("will call examClosed if lms exam id in request and in storage match");it("Will perform required actions on exam submit",(async()=>{setupCurrentQuestion();globalThis.hlExamTools={removeExamTools:jest.fn()};const storage={exam_id:"_43_2",student_id:"123434sdlkfj",exam_toggles:"",lms_school_id:"_50_1",lms_student_id:"asdffasdf",lms_student_name:"Joe Tester",student_attempt:"6",webcam_tab_id:1,exam_state:"active"};chromeStorageGetMock(storage);const request={type:"bbultra_submit_exam"};globalThis.isLiveChatActive=true;let htmlElements=[];document.body.appendChild=jest.fn((element=>{htmlElements.push(element)}));expect(globalThis.examWasStarted).toEqual(true);chrome.runtime.onMessage.callListeners(request,{});expect(globalThis.examWasStarted).toEqual(false);expect(chrome.runtime.sendMessage).toBeCalledWith({message:"disable_browser_guard"});const logData={event_type:"Exam Submit",question_num:currentQuestion.querySelector("legend").textContent,question_text:currentQuestion.querySelector("div[class*=question-container] div[role=presentation] p").textContent,question_html:currentQuestion.querySelector("div[class*=question-container] div[role=presentation] p").outerHTML,school_identifier:storage.lms_school_id,exam_identifier:storage.exam_id,student_identifier:storage.lms_student_id,current_attempt:storage.student_attempt,came_from_launch:true,user_name:storage.lms_student_name,lms_id:BB_ULTRA_LMS_ID,hl_student_id:storage.student_id};expect(chrome.runtime.sendMessage).toBeCalledWith({message:"lms_log",data:logData});expect(htmlElements[0].innerHTML).toContain("LiveChatWidget.call('destroy')");expect(chrome.runtime.sendMessage).not.toHaveBeenCalledWith({message:"close_webcam",type:"submit"});jest.runOnlyPendingTimers();expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"close_webcam",type:"submit"});expect(hlExamTools.removeExamTools).toBeCalled()}));it("will not do a post log if we are bypassing the exam",(()=>{postLog=jest.fn();globalThis.hlExamTools={removeExamTools:jest.fn()};chromeStorageGetMock({exam_state:"submitted",bypass_status:1});const request={type:"bbultra_submit_exam"};chrome.runtime.onMessage.callListeners(request,{});jest.runOnlyPendingTimers();expect(postLog).not.toBeCalled()}));it("will not do fallback close webcam message if exam already submitted",(()=>{setupCurrentQuestion();chromeStorageGetMock({exam_state:"submitted"});const request={type:"bbultra_submit_exam"};chrome.runtime.onMessage.callListeners(request,{});jest.runOnlyPendingTimers();expect(chrome.runtime.sendMessage).not.toHaveBeenCalledWith({message:"close_webcam",type:"submit"})}));it("will attempt to relaunch web camera when inside exam message is received",(()=>{const request={type:"bbultra_inside_exam"};globalThis.examWasStarted=false;document.body.innerHTML=fs.readFileSync(path.resolve(__dirname,"fixtures/all_exam_question_types.html"));chromeStorageGetMock({});trackExamClose=jest.fn();hlAlert={init:jest.fn()};postLog=jest.fn();insertExamTools=jest.fn();addQuestionListeners=jest.fn();applyExamSettings=jest.fn();chrome.runtime.onMessage.callListeners(request,{});expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({message:"pause_all_tabs",reason:["Please relaunch your web camera.<br />Do not close or minimize the web camera window please."],relaunch:true});expect(postLog).toBeCalled();expect(trackExamClose).toBeCalled();expect(addQuestionListeners).toBeCalled();expect(insertExamTools).not.toBeCalled()}));it("will not try to pause tabs while inside exam if bypass status is set",(()=>{chromeStorageGetMock({bypass_status:1});chromeRuntimeSendMessageMock();document.body.innerHTML=fs.readFileSync(path.resolve(__dirname,"fixtures/all_exam_question_types.html"));trackExamClose=jest.fn();hlAlert={init:jest.fn()};postLog=jest.fn();insertExamTools=jest.fn();addQuestionListeners=jest.fn();applyExamSettings=jest.fn();examWasStarted=true;const request={type:"bbultra_inside_exam"};chrome.runtime.onMessage.callListeners(request,{});expect(chrome.runtime.sendMessage).not.toHaveBeenCalledWith(expect.objectContaining({message:"pause_all_tabs"}));expect(postLog).not.toBeCalled();expect(trackExamClose).not.toBeCalled();expect(insertExamTools).not.toBeCalledWith(false);expect(addQuestionListeners).not.toBeCalled()}));it("will not initialize exam if bypass pin is set",(()=>{chromeStorageGetMock({bypass_status:1});chromeRuntimeSendMessageMock();document.body.innerHTML=fs.readFileSync(path.resolve(__dirname,"fixtures/all_exam_question_types.html"));trackExamClose=jest.fn();hlAlert={init:jest.fn()};postLog=jest.fn();insertExamTools=jest.fn();addQuestionListeners=jest.fn();applyExamSettings=jest.fn();examWasStarted=false;const request={type:"bbultra_inside_exam"};chrome.runtime.onMessage.callListeners(request,{});expect(chrome.runtime.sendMessage).not.toHaveBeenCalledWith(expect.objectContaining({message:"pause_all_tabs"}));expect(postLog).not.toBeCalled();expect(trackExamClose).not.toBeCalled();expect(insertExamTools).not.toBeCalledWith(false);expect(addQuestionListeners).not.toBeCalled()}))}));