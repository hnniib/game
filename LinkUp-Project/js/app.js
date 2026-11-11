const lessons = {
  addition: {title:"Addition",description:"Use addition linking words when you want to add information or another supporting point.",words:["also","in addition","moreover","furthermore"],example:"The library is quiet. Furthermore, it has many useful resources.",tip:"“Furthermore” adds a stronger supporting point.",number:"01 / 06"},
  contrast: {title:"Contrast",description:"Use contrast linking words to show that two ideas are different or unexpected.",words:["however","although","nevertheless","on the other hand"],example:"The test was difficult. However, everyone tried their best.",tip:"“However” introduces an idea that contrasts with the previous one.",number:"02 / 06"},
  cause: {title:"Cause and Effect",description:"Use these expressions to explain why something happens or what happens as a result.",words:["because","therefore","consequently","as a result"],example:"It rained all morning. As a result, the match was postponed.",tip:"“As a result” introduces the effect or outcome.",number:"03 / 06"},
  sequence: {title:"Sequence",description:"Use sequence words to guide readers through steps, events, or stages in the correct order.",words:["firstly","next","then","finally"],example:"First, mix the flour. Next, add the milk and eggs.",tip:"Sequence words help readers follow the order of events.",number:"04 / 06"},
  example: {title:"Giving Examples",description:"Use example linking words when you want to make a general point more specific.",words:["for example","for instance","such as","including"],example:"Some hobbies are inexpensive. For example, walking is free.",tip:"“For example” introduces a specific illustration of your point.",number:"05 / 06"},
  conclusion: {title:"Conclusion",description:"Use concluding expressions to signal that you are summarising or finishing your main point.",words:["in conclusion","to sum up","overall","in summary"],example:"In conclusion, regular practice can improve your writing.",tip:"“In conclusion” clearly signals the final point of a text.",number:"06 / 06"}
};
const examples = [
  {c:"addition",icon:"➕",title:"Adding a supporting point",text:"The course is affordable. <strong>Moreover</strong>, it offers flexible study hours."},
  {c:"addition",icon:"➕",title:"Adding information",text:"The park has a playground. <strong>In addition</strong>, there is a walking trail."},
  {c:"contrast",icon:"⚖️",title:"Showing an unexpected contrast",text:"The weather was cold. <strong>However</strong>, we still went swimming."},
  {c:"contrast",icon:"⚖️",title:"Comparing two sides",text:"Maya enjoys science, <strong>whereas</strong> her brother prefers art."},
  {c:"cause",icon:"🔗",title:"Showing a result",text:"The roads were icy. <strong>Therefore</strong>, the school closed early."},
  {c:"cause",icon:"🔗",title:"Explaining an outcome",text:"He forgot to set an alarm. <strong>Consequently</strong>, he arrived late."},
  {c:"sequence",icon:"🪜",title:"Starting a process",text:"<strong>Firstly</strong>, read the instructions carefully."},
  {c:"sequence",icon:"🪜",title:"Finishing a process",text:"Add the sauce and stir well. <strong>Finally</strong>, serve while hot."},
  {c:"example",icon:"🔍",title:"Introducing an example",text:"Many animals are nocturnal. <strong>For example</strong>, owls are active at night."},
  {c:"example",icon:"🔍",title:"Giving specific examples",text:"You can add vegetables <strong>such as</strong> carrots, peas, and spinach."},
  {c:"conclusion",icon:"🏁",title:"Summarising an argument",text:"<strong>In conclusion</strong>, teamwork helps people reach shared goals."},
  {c:"conclusion",icon:"🏁",title:"Wrapping up a discussion",text:"<strong>Overall</strong>, the event was enjoyable and well organised."}
];
const categoryNames = {addition:"ADDITION",contrast:"CONTRAST",cause:"CAUSE & EFFECT",sequence:"SEQUENCE",example:"GIVING EXAMPLES",conclusion:"CONCLUSION"};
const categoryGrid = document.getElementById("categoryGrid");
const lessonPanel = document.getElementById("lessonPanel");
function showLesson(key){
  const item=lessons[key]; if(!item)return;
  document.querySelectorAll(".category-card").forEach(card=>card.classList.toggle("selected",card.dataset.category===key));
  document.getElementById("lessonTitle").textContent=item.title;
  document.getElementById("lessonDescription").textContent=item.description;
  document.getElementById("lessonWords").innerHTML=item.words.map(word=>`<span class="word-pill">${word}</span>`).join("");
  const parts=item.example.split(/(Furthermore|However|As a result|First|Next|For example|In conclusion)/i);
  document.getElementById("lessonExample").innerHTML=parts.map(part=>/^(Furthermore|However|As a result|First|Next|For example|In conclusion)$/i.test(part)?`<mark>${part}</mark>`:part).join("");
  document.getElementById("lessonTip").textContent="Tip: "+item.tip;
  document.getElementById("lessonNumber").textContent=item.number;
}
categoryGrid.addEventListener("click",e=>{const card=e.target.closest("[data-category]");if(card)showLesson(card.dataset.category);});
showLesson("addition");

function renderExamples(filter="all"){
  const list=document.getElementById("exampleList");
  const filtered=filter==="all"?examples:examples.filter(item=>item.c===filter);
  list.innerHTML=filtered.map(item=>`<article class="example-card"><span class="example-icon">${item.icon}</span><div><h4>${item.title}</h4><p>${item.text}</p><span class="example-tag">${categoryNames[item.c]}</span></div></article>`).join("");
}
document.getElementById("exampleFilters").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]");if(!btn)return;
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.toggle("selected",b===btn));
  renderExamples(btn.dataset.filter);
});
renderExamples();

const flashcards=[
  {word:"Moreover",category:"ADDITION",hint:"Tap to reveal the meaning",meaning:"In addition; used to add another supporting point."},
  {word:"However",category:"CONTRAST",hint:"Tap to reveal the meaning",meaning:"Used to introduce a statement that contrasts with what came before."},
  {word:"Therefore",category:"CAUSE & EFFECT",hint:"Tap to reveal the meaning",meaning:"For that reason; used to show a logical result."},
  {word:"Firstly",category:"SEQUENCE",hint:"Tap to reveal the meaning",meaning:"Used to introduce the first point or step in a series."},
  {word:"For instance",category:"GIVING EXAMPLES",hint:"Tap to reveal the meaning",meaning:"Used to introduce a specific example."},
  {word:"Overall",category:"CONCLUSION",hint:"Tap to reveal the meaning",meaning:"Considering everything; used to give a general summary."},
  {word:"Nevertheless",category:"CONTRAST",hint:"Tap to reveal the meaning",meaning:"Despite what has just been said; introduces a contrasting point."},
  {word:"Consequently",category:"CAUSE & EFFECT",hint:"Tap to reveal the meaning",meaning:"As a result of something; introduces an outcome."}
];
let flashIndex=0;
function updateFlashcard(){
  const card=flashcards[flashIndex],el=document.getElementById("flashcard");
  el.classList.remove("flipped");
  document.getElementById("flashCategory").textContent=card.category;
  document.getElementById("flashWord").textContent=card.word;
  document.getElementById("flashHint").textContent=card.hint;
  document.getElementById("flashMeaning").textContent=card.meaning;
  document.getElementById("flashCounter").textContent=`CARD ${flashIndex+1} OF ${flashcards.length}`;
  document.getElementById("flashProgress").style.width=`${((flashIndex+1)/flashcards.length)*100}%`;
}
document.getElementById("flashcard").addEventListener("click",()=>document.getElementById("flashcard").classList.toggle("flipped"));
document.getElementById("prevCard").addEventListener("click",()=>{flashIndex=(flashIndex-1+flashcards.length)%flashcards.length;updateFlashcard();});
document.getElementById("nextCard").addEventListener("click",()=>{flashIndex=(flashIndex+1)%flashcards.length;updateFlashcard();});
updateFlashcard();

const questions=[
 {q:"I was tired. ______, I finished my homework.",a:["However","For example","Firstly","In conclusion"],correct:0,why:"“However” shows contrast: being tired did not stop the person."},
 {q:"The shop was closed. ______, we went somewhere else.",a:["Moreover","Therefore","For instance","Finally"],correct:1,why:"“Therefore” introduces the result of the shop being closed."},
 {q:"You should eat more fruit, ______ apples and oranges.",a:["although","such as","consequently","overall"],correct:1,why:"“Such as” introduces specific examples."},
 {q:"______ prepare the ingredients. Then, heat the pan.",a:["Firstly","However","Therefore","In addition"],correct:0,why:"“Firstly” introduces the first step in a sequence."},
 {q:"The hotel is expensive. ______, it has excellent facilities.",a:["As a result","For example","Nevertheless","Firstly"],correct:2,why:"“Nevertheless” introduces a contrasting point."},
 {q:"The team practised every day. ______, they improved quickly.",a:["Consequently","On the other hand","For instance","To begin with"],correct:0,why:"“Consequently” shows the outcome of practising every day."},
 {q:"The museum is free. ______, it is open every day.",a:["In addition","Although","Instead of","As a result"],correct:0,why:"“In addition” adds another piece of information."},
 {q:"Many renewable energy sources exist. ______, solar power is widely used.",a:["However","For example","Finally","Therefore"],correct:1,why:"“For example” introduces one specific example."},
 {q:"______ , learning a new language takes time and practice.",a:["In conclusion","Next","Whereas","For instance"],correct:0,why:"“In conclusion” signals a summary or final statement."},
 {q:"Lena likes working in a team, ______ her friend prefers working alone.",a:["therefore","moreover","whereas","finally"],correct:2,why:"“Whereas” compares two contrasting preferences."}
];
let qIndex=0,score=0,answered=false;
function renderQuestion(){
  const q=questions[qIndex];answered=false;
  document.getElementById("quizProgressText").textContent=`QUESTION ${qIndex+1} / ${questions.length}`;
  document.getElementById("quizProgressBar").style.width=`${(qIndex/questions.length)*100}%`;
  document.getElementById("questionText").textContent=q.q;
  document.getElementById("answerOptions").innerHTML=q.a.map((answer,i)=>`<button class="answer-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${answer}</button>`).join("");
  document.getElementById("quizFeedback").textContent="";
  document.getElementById("quizFeedback").className="quiz-feedback";
  const next=document.getElementById("nextQuestion");next.disabled=true;next.textContent="Check answer first";
}
document.getElementById("answerOptions").addEventListener("click",e=>{
  const btn=e.target.closest("[data-answer]");if(!btn||answered)return;
  answered=true;const selected=Number(btn.dataset.answer),q=questions[qIndex],correct=selected===q.correct;
  if(correct)score++;
  document.querySelectorAll(".answer-option").forEach((option,i)=>{
    option.disabled=true;
    if(i===q.correct)option.classList.add("correct");
    else if(i===selected)option.classList.add("incorrect");
  });
  const feedback=document.getElementById("quizFeedback");
  feedback.textContent=(correct?"Correct! ":"Not quite. ")+q.why;
  feedback.classList.add(correct?"good":"bad");
  const next=document.getElementById("nextQuestion");next.disabled=false;
  next.textContent=qIndex===questions.length-1?"See my result →":"Next question →";
});
document.getElementById("nextQuestion").addEventListener("click",()=>{
  if(!answered)return;
  qIndex++;
  if(qIndex<questions.length){renderQuestion();return;}
  document.getElementById("quizQuestionArea").classList.add("hidden");
  document.getElementById("quizResult").classList.remove("hidden");
  document.getElementById("quizProgressBar").style.width="100%";
  document.getElementById("quizProgressText").textContent="QUIZ COMPLETED";
  document.getElementById("finalScore").textContent=`${score}/${questions.length}`;
  const percent=score/questions.length;
  document.getElementById("resultEmoji").textContent=percent>=.8?"🏆":percent>=.5?"🎉":"💪";
  document.getElementById("resultTitle").textContent=percent>=.8?"Excellent work!":percent>=.5?"Good effort!":"Keep practising!";
  document.getElementById("resultText").textContent=`You answered ${score} out of ${questions.length} questions correctly. ${percent>=.8?"You have a strong understanding of linking words.":"Review the lessons and try again to improve your score."}`;
});
document.getElementById("restartQuiz").addEventListener("click",()=>{
  qIndex=0;score=0;document.getElementById("quizResult").classList.add("hidden");document.getElementById("quizQuestionArea").classList.remove("hidden");renderQuestion();
});
renderQuestion();

const menuToggle=document.getElementById("menuToggle"),mainNav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));});
mainNav.addEventListener("click",e=>{if(e.target.closest("a")){mainNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}});
const sections=[...document.querySelectorAll("main section[id]")];
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id));}
  }),{rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section=>observer.observe(section));
}
