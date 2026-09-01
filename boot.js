(function(){
  function renderApp(){
    if(typeof state==='undefined') return;
    if(state.activeWorkout) state.screen='workout';
    let html;
    try {
      if(state.screen==='home') html=home();
      else if(state.screen==='workout' && state.activeWorkout) html=(typeof window.workout==='function'?window.workout():workout());
      else if(state.screen==='plan') html=plan();
      else html=progress();
      document.body.innerHTML=html;
      setTimeout(function(){
        if(typeof enhance==='function') enhance();
      },0);
    } catch(err) {
      console.error('My Training render error',err);
      document.body.innerHTML='<div style="padding:40px;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif"><h2>My Training</h2><p style="color:#aaa">The app could not load correctly.</p><p style="color:#777;font-size:13px">Please refresh once.</p></div>';
    }
  }
  window.render=renderApp;
  if(typeof window.start==='function'){
    window.start=function(){
      state.activeWorkout=true;
      state.screen='workout';
      if(window.exercisePageState) window.exercisePageState.index=0;
      save();
      renderApp();
    };
  }
  if(typeof window.stopWorkout==='function'){
    window.stopWorkout=function(){
      if(!state.activeWorkout)return;
      if(!confirm('Stop this workout? Your sets will be saved, but the workout will not be marked completed.'))return;
      state.activeWorkout=false;
      state.screen='home';
      if(window.exercisePageState) window.exercisePageState.index=0;
      if(typeof stopRest==='function')stopRest();
      save();
      renderApp();
    };
  }
  renderApp();
})();
