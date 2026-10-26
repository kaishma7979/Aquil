/* Aquill login: sign-in screen until a valid Supabase session exists. */
const cfg = window.AQUILL_CONFIG;
const loginMsg = document.getElementById('loginMsg');
const signinBtn = document.getElementById('signin');
const db = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);

function applySession(session) {
  document.body.classList.toggle('signed-out', !session);
  if (session) window.dispatchEvent(new Event('hashchange'));
}
db.auth.onAuthStateChange((_e, s) => applySession(s));
db.auth.getSession().then(({ data }) => applySession(data.session));

async function signIn() {
  loginMsg.textContent = '';
  signinBtn.disabled = true;
  const { error } = await db.auth.signInWithPassword({
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  });
  signinBtn.disabled = false;
  if (error) loginMsg.textContent = 'Sign-in failed: ' + error.message;
}
signinBtn.addEventListener('click', signIn);
document.getElementById('password').addEventListener('keydown', e => { if (e.key === 'Enter') signIn(); });
document.getElementById('signout').addEventListener('click', () => db.auth.signOut());
