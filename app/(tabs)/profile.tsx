import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocale, LifeStage } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const C = {
  bg:     '#F0F5FC',
  card:   '#FFFFFF',
  border: '#D6E8F5',
  navy:   '#1B3B6F',
  blue:   '#3B73B9',
  gold:   '#C4991A',
  text:   '#0E1E3D',
  text2:  '#4B6080',
  text3:  '#8FA7C0',
  green:  '#1A7A56',
  tintN:  '#EBF0FA',
  tintG:  '#FDF7E6',
  tintB:  '#EBF4FF',
};

const STAGE_COLORS: Record<LifeStage, string> = {
  'new-arrival':  '#1A7A56',
  'first-gen':    '#3B73B9',
  'established':  '#C4991A',
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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 6 }}>
      <Text style={{ fontSize: 11, color: C.text3, fontWeight: '700', letterSpacing: 1.5, ...FF }}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
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
  const { locale, lifeStage, setUserProfile } = useLocale();
  const t = T[locale];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: '', age: '', area: '', email: '' });
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editUser, setEditUser] = useState({ name: '', age: '', area: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);

  const stageColor = STAGE_COLORS[lifeStage];
  const stageBg    = STAGE_BG[lifeStage];
  const displayName = user.name || (isLoggedIn ? user.email.split('@')[0] : t.guest);

  function savePersonalInfo() {
    setUser(u => ({ ...u, ...editUser }));
    setUserProfile({ name: editUser.name, age: editUser.age, area: editUser.area });
    setShowPersonalInfo(false);
  }
  function doLogin() {
    if (!loginForm.email.trim()) return;
    setUser(u => ({ ...u, email: loginForm.email }));
    setIsLoggedIn(true);
    setLoginForm({ email: '', password: '' });
    setShowLogin(false);
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
            value={isLoggedIn ? `${t.loggedInAs} ${user.email || displayName}` : t.notLoggedIn}
            onPress={() => { if (isLoggedIn) { setIsLoggedIn(false); setUser({ name: '', age: '', area: '', email: '' }); } else setShowLogin(true); }}
            danger={isLoggedIn}
          />
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

      {/* Login Modal */}
      <Modal visible={showLogin} transparent animationType="slide" onRequestClose={() => setShowLogin(false)}>
        <View style={m.overlay}><View style={m.card}>
          <Text style={m.title}>🔐  {t.logIn}</Text>
          <Text style={m.label}>{t.email}</Text>
          <TextInput style={m.input} value={loginForm.email} onChangeText={v => setLoginForm(f => ({ ...f, email: v }))} placeholder="you@email.com" placeholderTextColor={C.text3} keyboardType="email-address" autoCapitalize="none" />
          <Text style={m.label}>{t.password}</Text>
          <TextInput style={m.input} value={loginForm.password} onChangeText={v => setLoginForm(f => ({ ...f, password: v }))} placeholder="••••••••" placeholderTextColor={C.text3} secureTextEntry />
          <View style={m.row}>
            <TouchableOpacity style={m.cancelBtn} onPress={() => setShowLogin(false)}><Text style={m.cancelText}>{t.cancel}</Text></TouchableOpacity>
            <TouchableOpacity style={m.saveBtn} onPress={doLogin}><Text style={m.saveText}>{t.logIn}</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>
    </View>
  );
}

const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: C.tintN, borderRadius: 20, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
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
  chevron: { fontSize: 20, color: C.text3 },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#0E1E3D99', justifyContent: 'flex-end' },
  card: { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 10, borderTopWidth: 3, borderColor: C.gold },
  title: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 4, ...FF },
  label: { fontSize: 12, color: C.text2, fontWeight: '600', marginBottom: 4, ...FF },
  input: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, color: C.text, fontSize: 14, marginBottom: 8 },
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
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 104, gap: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  avatarText: { fontSize: 22, fontWeight: '800', ...FF },
  eyebrow: { fontSize: 10, color: C.blue, fontWeight: '700', letterSpacing: 2, ...FF },
  pageTitle: { fontSize: 22, fontWeight: '800', color: C.text, ...FF },
  stageCard: { borderRadius: 18, padding: 18, borderWidth: 1, gap: 10 },
  stageBubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stickerBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stageBubble: { borderRadius: 50, paddingHorizontal: 20, paddingVertical: 9 },
  stageBubbleText: { fontSize: 15, fontWeight: '800', color: '#fff', ...FF },
  stageDesc: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
  stageLocked: { fontSize: 11, color: C.text3 },
  settingsBlock: {
    backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 }, android: { elevation: 2 } }),
  },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 18 },
  footer: { alignItems: 'center', paddingVertical: 8 },
  footerText: { fontSize: 12, color: C.text3, letterSpacing: 0.5, ...FF },
});
