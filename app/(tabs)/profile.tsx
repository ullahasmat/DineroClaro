import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocale, LifeStage } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const C = {
  bg:     '#EEF3FB',
  card:   'rgba(255,255,255,0.95)',
  border: 'rgba(190,210,235,0.6)',
  navy:   '#162F5A',
  blue:   '#2B6CB0',
  gold:   '#E8A817',
  text:   '#0A1628',
  text2:  '#3D5575',
  text3:  '#7A95B4',
  green:  '#0E9A5E',
  tintN:  'rgba(230,238,252,0.9)',
  tintG:  'rgba(255,248,225,0.9)',
  tintB:  'rgba(228,240,255,0.9)',
};

const STAGE_COLORS: Record<LifeStage, string> = {
  'new-arrival':  '#0E9A5E',
  'first-gen':    '#2B6CB0',
  'established':  '#E8A817',
};
const STAGE_BG: Record<LifeStage, string> = {
  'new-arrival':  '#E8F5EF',
  'first-gen':    '#EBF4FF',
  'established':  '#FDF7E6',
};
const STAGE_STICKER: Record<LifeStage, string> = {
  'new-arrival':  '✈️',
  'first-gen':    '🌟',
  'established':  '👑',
};

const T = {
  en: {
    eyebrow: 'YOUR PROFILE',
    title: 'Profile',
    hello: 'Hello',
    guest: 'Guest',
    lifeStageLabel: 'LIFE STAGE',
    stages: { 'new-arrival': 'New Arrival', 'first-gen': 'First Gen', 'established': 'Established' } as Record<LifeStage, string>,
    stageDesc: {
      'new-arrival': "Just arrived — let's build your financial foundation.",
      'first-gen':   'First generation navigating the U.S. financial system.',
      'established': "Building wealth and protecting what you've earned.",
    } as Record<LifeStage, string>,
    accountLabel: 'ACCOUNT',
    updatePrefs: 'Update Preferences',
    updatePrefsVal: 'Reopen welcome & life stage',
    personalInfo: 'Personal Information',
    changePassword: 'Change Password',
    name: 'Name', age: 'Age', area: 'Area / City',
    currentPassword: 'Current password', newPassword: 'New password', confirmPassword: 'Confirm new password',
    save: 'Save', cancel: 'Cancel',
    logOut: 'Log Out', logIn: 'Log In',
    email: 'Email', password: 'Password',
    loggedInAs: 'Logged in as', notLoggedIn: 'Not logged in',
    passwordUpdated: 'Password updated ✓',
    anonymousMode: 'Anonymous Mode',
    anonymousDesc: 'No login required. All data stays on your device only.',
    anonymousOn: 'ON — Your data is private',
    anonymousOff: 'OFF — Data may sync to cloud',
    signUp: 'Sign Up',
    noAccount: "Don't have an account? Sign up",
    hasAccount: 'Already have an account? Log in',
    authError: 'Error',
  },
  es: {
    eyebrow: 'TU PERFIL',
    title: 'Perfil',
    hello: 'Hola',
    guest: 'Invitado',
    lifeStageLabel: 'ETAPA DE VIDA',
    stages: { 'new-arrival': 'Recién llegado', 'first-gen': 'Primera Gen', 'established': 'Establecido' } as Record<LifeStage, string>,
    stageDesc: {
      'new-arrival': 'Recién llegado — construyamos tu base financiera.',
      'first-gen':   'Primera generación navegando el sistema financiero de EE.UU.',
      'established': "Construyendo riqueza y protegiendo lo que has ganado.",
    } as Record<LifeStage, string>,
    accountLabel: 'CUENTA',
    updatePrefs: 'Actualizar preferencias',
    updatePrefsVal: 'Reabrir bienvenida y etapa',
    personalInfo: 'Información personal',
    changePassword: 'Cambiar contraseña',
    name: 'Nombre', age: 'Edad', area: 'Área / Ciudad',
    currentPassword: 'Contraseña actual', newPassword: 'Nueva contraseña', confirmPassword: 'Confirmar nueva contraseña',
    save: 'Guardar', cancel: 'Cancelar',
    logOut: 'Cerrar sesión', logIn: 'Iniciar sesión',
    email: 'Correo electrónico', password: 'Contraseña',
    loggedInAs: 'Sesión iniciada como', notLoggedIn: 'Sin sesión activa',
    passwordUpdated: 'Contraseña actualizada ✓',
    anonymousMode: 'Modo Anónimo',
    anonymousDesc: 'Sin inicio de sesión. Todos los datos se quedan en tu dispositivo.',
    anonymousOn: 'ON — Tus datos son privados',
    anonymousOff: 'OFF — Los datos pueden sincronizarse',
    signUp: 'Registrarse',
    noAccount: '¿No tienes cuenta? Regístrate',
    hasAccount: '¿Ya tienes cuenta? Inicia sesión',
    authError: 'Error',
  },
};

function LangToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <View style={lt.wrap}>
      <TouchableOpacity style={[lt.btn, locale === 'en' && lt.active]} onPress={() => setLocale('en')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 4 }}>
        <Text style={[lt.text, locale === 'en' && lt.activeText]}>EN</Text>
      </TouchableOpacity>
      <View style={lt.divider} />
      <TouchableOpacity style={[lt.btn, locale === 'es' && lt.active]} onPress={() => setLocale('es')} hitSlop={{ top: 10, bottom: 10, left: 4, right: 10 }}>
        <Text style={[lt.text, locale === 'es' && lt.activeText]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: 'rgba(27,59,111,0.06)', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 6, alignSelf: 'flex-start', marginTop: 8, marginBottom: 6 }}>
      <Text style={{ fontSize: 11, color: C.text3, fontWeight: '700', letterSpacing: 1.5, ...FF }}>{label}</Text>
    </View>
  );
}

function SettingRow({ icon, label, value, onPress, danger }: { icon: string; label: string; value?: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={sr.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={sr.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[sr.label, danger && { color: C.gold }]}>{label}</Text>
        {value ? <Text style={sr.value}>{value}</Text> : null}
      </View>
      <Text style={[sr.chevron, danger && { color: C.gold }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { locale, lifeStage, setUserProfile, session, signUp, signIn, signOut } = useLocale();
  const t = T[locale];

  const isLoggedIn = !!session;
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [user, setUser] = useState({ name: '', age: '', area: '', email: '' });
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editUser, setEditUser] = useState({ name: '', age: '', area: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const stageColor = STAGE_COLORS[lifeStage];
  const stageBg    = STAGE_BG[lifeStage];
  const displayName = user.name || (isLoggedIn ? (session?.user?.email?.split('@')[0] ?? t.guest) : t.guest);

  function savePersonalInfo() {
    setUser(u => ({ ...u, ...editUser }));
    setUserProfile({ name: editUser.name, age: editUser.age, area: editUser.area });
    setShowPersonalInfo(false);
  }
  async function doAuth() {
    if (!loginForm.email.trim() || !loginForm.password.trim()) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      const error = isSignUp
        ? await signUp(loginForm.email.trim(), loginForm.password)
        : await signIn(loginForm.email.trim(), loginForm.password);
      if (error) {
        setAuthError(error);
      } else {
        setLoginForm({ email: '', password: '' });
        setShowLogin(false);
        setIsSignUp(false);
      }
    } catch (e: any) {
      setAuthError(e?.message ?? 'Unknown error');
    } finally {
      setAuthLoading(false);
    }
  }
  function savePassword() {
    setPwSaved(true);
    setTimeout(() => { setPwSaved(false); setShowChangePassword(false); }, 1200);
    setPwForm({ current: '', next: '', confirm: '' });
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View style={[s.avatar, { backgroundColor: stageBg, borderColor: stageColor + '55' }]}>
            <Text style={[s.avatarText, { color: stageColor }]}>{displayName[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.hello}, {displayName}</Text>
          </View>
          <LangToggle />
        </View>

        {/* Life Stage */}
        <SectionLabel label={t.lifeStageLabel} />
        <View style={[s.stageCard, { backgroundColor: stageBg, borderColor: stageColor + '44' }]}>
          <View style={s.stageBubbleRow}>
            <View style={[s.stickerBox, { backgroundColor: C.card, borderColor: stageColor + '33' }]}>
              <Text style={{ fontSize: 26 }}>{STAGE_STICKER[lifeStage]}</Text>
            </View>
            <View style={[s.stageBubble, { backgroundColor: stageColor }]}>
              <Text style={s.stageBubbleText}>{t.stages[lifeStage]}</Text>
            </View>
          </View>
          <Text style={[s.stageDesc, { color: stageColor }]}>{t.stageDesc[lifeStage]}</Text>
          <Text style={s.stageLocked}>Change in Update Preferences ›</Text>
        </View>

        {/* Account */}
        <SectionLabel label={t.accountLabel} />
        <View style={s.settingsBlock}>
          <SettingRow icon="🛠️" label={t.updatePrefs} value={t.updatePrefsVal} onPress={() => router.push('/onboarding')} />
          <View style={s.divider} />
          <SettingRow
            icon="👤" label={t.personalInfo}
            value={user.name ? `${user.name}${user.area ? '  ·  ' + user.area : ''}` : undefined}
            onPress={() => { setEditUser({ name: user.name, age: user.age, area: user.area }); setShowPersonalInfo(true); }}
          />
          <View style={s.divider} />
          <SettingRow icon="🔑" label={t.changePassword} onPress={() => setShowChangePassword(true)} />
          <View style={s.divider} />
          <SettingRow
            icon={isLoggedIn ? '🚪' : '🔐'}
            label={isLoggedIn ? t.logOut : t.logIn}
            value={isLoggedIn ? `${t.loggedInAs} ${session?.user?.email ?? displayName}` : t.notLoggedIn}
            onPress={() => { if (isLoggedIn) { signOut(); } else { setAuthError(''); setIsSignUp(false); setShowLogin(true); } }}
            danger={isLoggedIn}
          />
          <View style={s.divider} />
          <TouchableOpacity style={s.anonRow} onPress={() => setAnonymousMode(!anonymousMode)} activeOpacity={0.7}>
            <Text style={s.anonIcon}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.anonLabel}>{t.anonymousMode}</Text>
              <Text style={s.anonDesc}>{t.anonymousDesc}</Text>
            </View>
            <View style={[s.anonToggle, anonymousMode && s.anonToggleOn]}>
              <View style={[s.anonDot, anonymousMode && s.anonDotOn]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>DineroClaro  ·  Financial clarity for everyone</Text>
        </View>
      </ScrollView>

      {/* Personal Info Modal */}
      <Modal visible={showPersonalInfo} transparent animationType="slide" onRequestClose={() => setShowPersonalInfo(false)}>
        <View style={m.overlay}><View style={m.card}>
          <Text style={m.title}>👤  {t.personalInfo}</Text>
          {([['name', t.name], ['age', t.age], ['area', t.area]] as [keyof typeof editUser, string][]).map(([key, label]) => (
            <View key={key}>
              <Text style={m.label}>{label}</Text>
              <TextInput style={m.input} value={editUser[key]} onChangeText={v => setEditUser(u => ({ ...u, [key]: v }))} placeholder={label} placeholderTextColor={C.text3} keyboardType={key === 'age' ? 'numeric' : 'default'} />
            </View>
          ))}
          <View style={m.row}>
            <TouchableOpacity style={m.cancelBtn} onPress={() => setShowPersonalInfo(false)}><Text style={m.cancelText}>{t.cancel}</Text></TouchableOpacity>
            <TouchableOpacity style={m.saveBtn} onPress={savePersonalInfo}><Text style={m.saveText}>{t.save}</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="slide" onRequestClose={() => setShowChangePassword(false)}>
        <View style={m.overlay}><View style={m.card}>
          <Text style={m.title}>🔑  {t.changePassword}</Text>
          {pwSaved ? (
            <View style={m.successBadge}><Text style={m.successText}>{t.passwordUpdated}</Text></View>
          ) : (
            <>
              {([['current', t.currentPassword], ['next', t.newPassword], ['confirm', t.confirmPassword]] as [keyof typeof pwForm, string][]).map(([key, label]) => (
                <View key={key}>
                  <Text style={m.label}>{label}</Text>
                  <TextInput style={m.input} value={pwForm[key]} onChangeText={v => setPwForm(p => ({ ...p, [key]: v }))} placeholder="••••••••" placeholderTextColor={C.text3} secureTextEntry />
                </View>
              ))}
              <View style={m.row}>
                <TouchableOpacity style={m.cancelBtn} onPress={() => setShowChangePassword(false)}><Text style={m.cancelText}>{t.cancel}</Text></TouchableOpacity>
                <TouchableOpacity style={m.saveBtn} onPress={savePassword}><Text style={m.saveText}>{t.save}</Text></TouchableOpacity>
              </View>
            </>
          )}
        </View></View>
      </Modal>

      {/* Login / Sign Up Modal */}
      <Modal visible={showLogin} transparent animationType="slide" onRequestClose={() => setShowLogin(false)}>
        <View style={m.overlay}><View style={m.card}>
          <Text style={m.title}>🔐  {isSignUp ? t.signUp : t.logIn}</Text>
          {authError ? <Text style={{ color: '#D32F2F', fontSize: 13, fontWeight: '600', marginBottom: 4, ...FF }}>{t.authError}: {authError}</Text> : null}
          <Text style={m.label}>{t.email}</Text>
          <TextInput style={m.input} value={loginForm.email} onChangeText={v => setLoginForm(f => ({ ...f, email: v }))} placeholder="you@email.com" placeholderTextColor={C.text3} keyboardType="email-address" autoCapitalize="none" />
          <Text style={m.label}>{t.password}</Text>
          <TextInput style={m.input} value={loginForm.password} onChangeText={v => setLoginForm(f => ({ ...f, password: v }))} placeholder="••••••••" placeholderTextColor={C.text3} secureTextEntry />
          <View style={m.row}>
            <TouchableOpacity style={m.cancelBtn} onPress={() => { setShowLogin(false); setAuthError(''); }}><Text style={m.cancelText}>{t.cancel}</Text></TouchableOpacity>
            <TouchableOpacity style={[m.saveBtn, authLoading && { opacity: 0.6 }]} onPress={doAuth} disabled={authLoading}>
              <Text style={m.saveText}>{isSignUp ? t.signUp : t.logIn}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setAuthError(''); }} style={{ alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: C.blue, fontSize: 13, fontWeight: '600', ...FF }}>{isSignUp ? t.hasAccount : t.noAccount}</Text>
          </TouchableOpacity>
        </View></View>
      </Modal>
    </View>
  );
}

const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: 'rgba(235,240,250,0.85)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(200,216,235,0.7)', overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  active: { backgroundColor: C.navy },
  divider: { width: 1, backgroundColor: C.border },
  text: { fontSize: 11, fontWeight: '700', color: C.text3, letterSpacing: 0.8, ...FF },
  activeText: { color: '#fff' },
});

const sr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 18 },
  icon: { fontSize: 18, width: 28, textAlign: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: C.text, ...FF },
  value: { fontSize: 11, color: C.text3, marginTop: 1 },
  chevron: { fontSize: 20, color: C.text3, fontWeight: '200' },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(14,30,61,0.5)', justifyContent: 'flex-end' },
  card: { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 10, borderTopWidth: 2, borderColor: C.gold },
  title: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 4, ...FF },
  label: { fontSize: 12, color: C.text2, fontWeight: '600', marginBottom: 4, ...FF },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: 'rgba(200,216,235,0.7)', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: C.text, fontSize: 14, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.text2, fontSize: 15, fontWeight: '700', ...FF },
  saveBtn: { flex: 1, backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '700', ...FF },
  successBadge: { backgroundColor: '#E8F5EF', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: C.green + '66' },
  successText: { color: C.green, fontSize: 16, fontWeight: '800', ...FF },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 110, gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  avatarText: { fontSize: 22, fontWeight: '800', ...FF },
  eyebrow: { fontSize: 11, color: C.blue, fontWeight: '600', letterSpacing: 3, opacity: 0.7, ...FF },
  pageTitle: { fontSize: 26, fontWeight: '200', color: C.text, letterSpacing: -0.5, ...FF },
  stageCard: { borderRadius: 24, padding: 18, borderWidth: 1, gap: 10 },
  stageBubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stickerBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stageBubble: { borderRadius: 50, paddingHorizontal: 20, paddingVertical: 9 },
  stageBubbleText: { fontSize: 15, fontWeight: '800', color: '#fff', ...FF },
  stageDesc: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
  stageLocked: { fontSize: 11, color: C.text3 },
  settingsBlock: {
    backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 16 }, android: { elevation: 2 } }),
  },
  divider: { height: 1, backgroundColor: 'rgba(200,216,235,0.7)', marginHorizontal: 18 },
  footer: { alignItems: 'center', paddingVertical: 8 },
  footerText: { fontSize: 12, color: C.text3, letterSpacing: 0.5, ...FF },
  anonRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 18 },
  anonIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  anonLabel: { fontSize: 15, fontWeight: '600', color: C.text, ...FF },
  anonDesc: { fontSize: 11, color: C.text3, marginTop: 1 },
  anonToggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: C.border, justifyContent: 'center', paddingHorizontal: 3 },
  anonToggleOn: { backgroundColor: C.green },
  anonDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  anonDotOn: { alignSelf: 'flex-end' },
});
