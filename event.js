// 1. Setup the Styles (Improved for 2026)
if (!document.getElementById('event-toaster-style')) {
  const style = document.createElement('style');
  style.id = 'event-toaster-style';
  style.innerHTML = `
    #event-toaster {
      position: fixed; top: 10px; right: 10px; z-index: 10001;
      display: flex; flex-direction: column-reverse; gap: 4px; 
      pointer-events: none; max-height: 95vh; overflow: hidden; width: 320px;
    }
    .toast-msg {
      background: rgba(20, 20, 20, 0.9); color: #eee; padding: 8px; 
      border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 10px; 
      border-left: 5px solid #888; backdrop-filter: blur(4px);
      animation: slideIn 0.3s ease, fadeout 5s forwards;
    }
    .t-mouse { border-color: #ff4757; }   /* Red */
    .t-key { border-color: #2ed573; }     /* Green */
    .t-form { border-color: #1e90ff; }    /* Blue */
    .t-clip { border-color: #ffa502; }    /* Orange */
    .t-pointer { border-color: #5352ed; } /* Purple */
    @keyframes slideIn { from {transform: translateX(100%); opacity: 0} to {transform: translateX(0); opacity: 1} }
    @keyframes fadeout { 0%, 90% {opacity: 1} 100% {opacity: 0} }
  `;
  document.head.appendChild(style);
  const toaster = document.createElement('div');
  toaster.id = 'event-toaster';
  document.body.appendChild(toaster);
}

const toaster = document.getElementById('event-toaster');

// 2. The Logic
const showAdvancedToast = (type, category, target, info) => {
  const div = document.createElement('div');
  div.className = `toast-msg t-${category}`;
  div.innerHTML = `<strong>[${type.toUpperCase()}]</strong> ${target}<br/><small>${info}</small>`;
  toaster.prepend(div);
  setTimeout(() => div.remove(), 5000);
};

// 3. Event Configuration
const eventGroups = {
  mouse: ['click', 'dblclick', 'contextmenu', 'wheel'],
  key: ['keydown', 'keyup', 'keypress'],
  form: ['input', 'change', 'submit', 'focusin', 'blur', 'invalid'],
  clip: ['copy', 'cut', 'paste'],
  pointer: ['pointerdown', 'pointerup', 'pointercancel'], // Unified Mouse/Touch/Pen
  media: ['play', 'pause', 'volumechange']
};

Object.keys(eventGroups).forEach(category => {
  eventGroups[category].forEach(evtName => {
    document.addEventListener(evtName, (e) => {
      const targetName = `${e.target.tagName}${e.target.id ? '#' + e.target.id : ''}`;
      
      let info = "";
      if (category === 'key') info = `Key: ${e.key} (Code: ${e.keyCode})`;
      else if (category === 'pointer') info = `Type: ${e.pointerType} | X: ${Math.round(e.clientX)} Y: ${Math.round(e.clientY)}`;
      else if (e.target.value !== undefined) info = `Value: ${e.target.value.substring(0, 20)}`;
      else info = "Action detected";

      showAdvancedToast(evtName, category, targetName, info);
    }, true);
  });
});

console.log("💎 Advanced Multi-Event Monitor Active.");
