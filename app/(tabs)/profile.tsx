import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Modal, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocale, LifeStage } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const STAGE_COLORS: Record<LifeStage, string> = {
  'new-arrival':  '#00E5A8',
  'first-gen':    '#FF3B8B',
  'established':  '#7B3FFF',
};
const STAGE_BG: Record<LifeStage, string> = {
  'new-arrival':  '#062018',
  'first-gen':    '#1A0A14',
  'established':  '#120A28',
};
const STAGE_STICKER: Record<LifeStage, string> = {
  'new-arrival':  '✈️',
  'first-gen':    '🌟',
  'established':  '👑',
};

const T = {
  en: {
    eyebrow: '◆ YOUR PROFILE ◆',
    title: 'Profile',
    hello: 'Hello',
    guest: 'Guest',
    lifeStageLabel: 'LIFE STAGE',
    stages: {
      'new-arrival': 'New Arrival',
      'first-gen':   'First Gen',
      'established': 'Established',
    } as Record<LifeStage, string>,
    stageDesc: {
      'new-arrival': "Just arrived — let's build your financial foundation.",
      'first-gen':   'First generation navigating the U.S. financial system.',
      'established': "Building wealth and protecting what you've earned.",
    } as Record<LifeStage, string>,
    accountLabel: 'ACCOUNT',
    personalInfo: 'Personal Information',
    name: 'Name',
    age: 'Age',
    area: 'Area / City',
    changePassword: 'Change Password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    save: 'Save',
    cancel: 'Cancel',
    logOut: 'Log Out',
    logIn: 'Log In',
    email: 'Email',
    password: 'Password',
    loggedInAs: 'Logged in as',
    notLoggedIn: 'Not logged in',
    passwordUpdated: 'Password updated ✓',
    stampLine1: 'LANA AI',
    stampLine2: '★ APPROVED ★',
  },
  es: {
    eyebrow: '◆ TU PERFIL ◆',
    title: 'Perfil',
    hello: 'Hola',
    guest: 'Invitado',
    lifeStageLabel: 'ETAPA DE VIDA',
    stages: {
      'new-arrival': 'Recién llegado',
      'first-gen':   'Primera Gen',
      'established': 'Establecido',
    } as Record<LifeStage, string>,
    stageDesc: {
      'new-arrival': 'Recién llegado — construyamos tu base financiera.',
      'first-gen':   'Primera generación navegando el sistema financiero de EE.UU.',
      'established': 'Construyendo riqueza y protegiendo lo que has ganado.',
    } as Record<LifeStage, string>,
    accountLabel: 'CUENTA',
    personalInfo: 'Información personal',
    name: 'Nombre',
    age: 'Edad',
    area: 'Área / Ciudad',
    changePassword: 'Cambiar contraseña',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    save: 'Guardar',
    cancel: 'Cancelar',
    logOut: 'Cerrar sesión',
    logIn: 'Iniciar sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    loggedInAs: 'Sesión iniciada como',
    notLoggedIn: 'Sin sesión activa',
    passwordUpdated: 'Contraseña actualizada ✓',
    stampLine1: 'LANA IA',
    stampLine2: '★ APROBADO ★',
  },
};

function LangToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <View style={lt.wrap}>
      <TouchableOpacity
        style={[lt.btn, locale === 'en' && lt.active]}
        onPress={() => setLocale('en')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 4 }}
      >
        <Text style={[lt.text, locale === 'en' && lt.activeText]}>EN</Text>
      </TouchableOpacity>
      <View style={lt.divider} />
      <TouchableOpacity
        style={[lt.btn, locale === 'es' && lt.active]}
        onPress={() => setLocale('es')}
        hitSlop={{ top: 10, bottom: 10, left: 4, right: 10 }}
      >
        <Text style={[lt.text, locale === 'es' && lt.activeText]}>ES</Text>
      </TouchableOpacity>
    </View>
  );
}

function SectionRow({ label }: { label: string }) {
  return (
    <View style={sec.row}>
      <Text style={sec.label}>{label}</Text>
      <View style={sec.line} />
    </View>
  );
}

function SettingRow({
  icon, label, value, accent, onPress,
}: {
  icon: string; label: string; value?: string; accent?: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={sr.row} onPress={onPress} activeOpacity={0.75}>
      <View style={[sr.iconBox, { backgroundColor: (accent ?? '#7B3FFF') + '1A' }]}>
        <Text style={sr.icon}>{icon}</Text>
      </View>
      <View style={sr.textBlock}>
        <Text style={sr.label}>{label}</Text>
        {value ? <Text style={sr.value}>{value}</Text> : null}
      </View>
      <Text style={[sr.chevron, { color: accent ?? '#44446A' }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { locale, lifeStage } = useLocale();
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
  const stageBg   = STAGE_BG[lifeStage];

  function openPersonalInfo() {
    setEditUser({ name: user.name, age: user.age, area: user.area });
    setShowPersonalInfo(true);
  }

  function savePersonalInfo() {
    setUser((u) => ({ ...u, ...editUser }));
    setShowPersonalInfo(false);
  }

  function doLogin() {
    if (!loginForm.email.trim()) return;
    setUser((u) => ({ ...u, email: loginForm.email }));
    setIsLoggedIn(true);
    setLoginForm({ email: '', password: '' });
    setShowLogin(false);
  }

  function savePassword() {
    setPwSaved(true);
    setTimeout(() => { setPwSaved(false); setShowChangePassword(false); }, 1200);
    setPwForm({ current: '', next: '', confirm: '' });
  }

  const displayName = user.name || (isLoggedIn ? user.email.split('@')[0] : t.guest);

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={[s.avatarBox, { borderColor: stageColor + '66', backgroundColor: stageBg }]}>
            <Text style={[s.avatarText, { color: stageColor }]}>{displayName[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <View style={s.headerText}>
            <Text style={[s.eyebrow, { color: stageColor }]}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.hello}, {displayName}</Text>
          </View>
          <LangToggle />
        </View>

        {/* ── Life Stage ── */}
        <SectionRow label={t.lifeStageLabel} />

        <View style={[s.stageCard, { backgroundColor: stageBg, borderColor: stageColor + '55' }]}>
          <View style={s.stageBubbleRow}>
            <View style={[s.stageStickerBox, { backgroundColor: stageColor + '22', borderColor: stageColor + '55' }]}>
              <Text style={s.stageSticker}>{STAGE_STICKER[lifeStage]}</Text>
            </View>
            <View style={[s.stageBubble, { backgroundColor: stageColor }]}>
              <Text style={s.stageBubbleText}>{t.stages[lifeStage]}</Text>
            </View>
          </View>
          <Text style={[s.stageDesc, { color: stageColor }]}>{t.stageDesc[lifeStage]}</Text>
          <Text style={s.stageLocked}>Change in Update Preferences ›</Text>
        </View>

        {/* ── Account ── */}
        <SectionRow label={t.accountLabel} />

        <View style={s.settingsBlock}>
          <SettingRow
            icon="🛠️"
            label={locale === 'en' ? 'Update Preferences' : 'Actualizar preferencias'}
            value={locale === 'en' ? 'Reopen welcome & life stage' : 'Reabrir bienvenida y etapa'}
            accent="#00E5A8"
            onPress={() => router.push('/onboarding')}
          />
          <View style={s.settingDivider} />
          <SettingRow
            icon="👤"
            label={t.personalInfo}
            value={user.name ? `${user.name}${user.area ? '  ·  ' + user.area : ''}` : undefined}
            accent="#7B3FFF"
            onPress={openPersonalInfo}
          />
          <View style={s.settingDivider} />
          <SettingRow
            icon="🔑"
            label={t.changePassword}
            accent="#FFD060"
            onPress={() => setShowChangePassword(true)}
          />
          <View style={s.settingDivider} />
          <SettingRow
            icon={isLoggedIn ? '🚪' : '🔐'}
            label={isLoggedIn ? t.logOut : t.logIn}
            value={isLoggedIn ? `${t.loggedInAs} ${user.email || displayName}` : t.notLoggedIn}
            accent={isLoggedIn ? '#FF3B8B' : '#00E5A8'}
            onPress={() => {
              if (isLoggedIn) {
                setIsLoggedIn(false);
                setUser({ name: '', age: '', area: '', email: '' });
              } else {
                setShowLogin(true);
              }
            }}
          />
        </View>

        {/* ── Footer stamp ── */}
        <View style={s.footerStamp}>
          <View style={[s.stampInner, { borderColor: stageColor }]}>
            <Text style={[s.stampLine1, { color: stageColor }]}>{t.stampLine1}</Text>
            <Text style={[s.stampLine2, { color: stageColor }]}>{t.stampLine2}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Personal Info Modal ── */}
      <Modal visible={showPersonalInfo} transparent animationType="slide" onRequestClose={() => setShowPersonalInfo(false)}>
        <View style={m.overlay}>
          <View style={m.card}>
            <Text style={m.title}>👤  {t.personalInfo}</Text>
            <Text style={m.fieldLabel}>{t.name}</Text>
            <TextInput style={m.input} value={editUser.name} onChangeText={(v) => setEditUser((u) => ({ ...u, name: v }))} placeholder={t.name} placeholderTextColor="#44446A" />
            <Text style={m.fieldLabel}>{t.age}</Text>
            <TextInput style={m.input} value={editUser.age} onChangeText={(v) => setEditUser((u) => ({ ...u, age: v }))} placeholder={t.age} placeholderTextColor="#44446A" keyboardType="numeric" />
            <Text style={m.fieldLabel}>{t.area}</Text>
            <TextInput style={m.input} value={editUser.area} onChangeText={(v) => setEditUser((u) => ({ ...u, area: v }))} placeholder={t.area} placeholderTextColor="#44446A" />
            <View style={m.row}>
              <TouchableOpacity style={m.cancelBtn} onPress={() => setShowPersonalInfo(false)}>
                <Text style={m.cancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={m.saveBtn} onPress={savePersonalInfo}>
                <Text style={m.saveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Change Password Modal ── */}
      <Modal visible={showChangePassword} transparent animationType="slide" onRequestClose={() => setShowChangePassword(false)}>
        <View style={m.overlay}>
          <View style={m.card}>
            <Text style={m.title}>🔑  {t.changePassword}</Text>
            {pwSaved ? (
              <View style={m.successBadge}>
                <Text style={m.successText}>{t.passwordUpdated}</Text>
              </View>
            ) : (
              <>
                <Text style={m.fieldLabel}>{t.currentPassword}</Text>
                <TextInput style={m.input} value={pwForm.current} onChangeText={(v) => setPwForm((p) => ({ ...p, current: v }))} placeholder="••••••••" placeholderTextColor="#44446A" secureTextEntry />
                <Text style={m.fieldLabel}>{t.newPassword}</Text>
                <TextInput style={m.input} value={pwForm.next} onChangeText={(v) => setPwForm((p) => ({ ...p, next: v }))} placeholder="••••••••" placeholderTextColor="#44446A" secureTextEntry />
                <Text style={m.fieldLabel}>{t.confirmPassword}</Text>
                <TextInput style={m.input} value={pwForm.confirm} onChangeText={(v) => setPwForm((p) => ({ ...p, confirm: v }))} placeholder="••••••••" placeholderTextColor="#44446A" secureTextEntry />
                <View style={m.row}>
                  <TouchableOpacity style={m.cancelBtn} onPress={() => setShowChangePassword(false)}>
                    <Text style={m.cancelText}>{t.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={m.saveBtn} onPress={savePassword}>
                    <Text style={m.saveText}>{t.save}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Login Modal ── */}
      <Modal visible={showLogin} transparent animationType="slide" onRequestClose={() => setShowLogin(false)}>
        <View style={m.overlay}>
          <View style={m.card}>
            <Text style={m.title}>🔐  {t.logIn}</Text>
            <Text style={m.fieldLabel}>{t.email}</Text>
            <TextInput style={m.input} value={loginForm.email} onChangeText={(v) => setLoginForm((f) => ({ ...f, email: v }))} placeholder="you@email.com" placeholderTextColor="#44446A" keyboardType="email-address" autoCapitalize="none" />
            <Text style={m.fieldLabel}>{t.password}</Text>
            <TextInput style={m.input} value={loginForm.password} onChangeText={(v) => setLoginForm((f) => ({ ...f, password: v }))} placeholder="••••••••" placeholderTextColor="#44446A" secureTextEntry />
            <View style={m.row}>
              <TouchableOpacity style={m.cancelBtn} onPress={() => setShowLogin(false)}>
                <Text style={m.cancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={m.saveBtn} onPress={doLogin}>
                <Text style={m.saveText}>{t.logIn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: '#0F0F24', borderRadius: 20, borderWidth: 2, borderColor: '#7B3FFF66', overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 5 },
  active: { backgroundColor: '#7B3FFF' },
  divider: { width: 1, backgroundColor: '#7B3FFF44' },
  text: { fontSize: 11, fontWeight: '800', color: '#44446A', letterSpacing: 1, ...FF },
  activeText: { color: '#fff' },
});

const sec = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 10 },
  label: { fontSize: 11, color: '#44446A', fontWeight: '800', letterSpacing: 1.5, ...FF },
  line: { flex: 1, height: 1, backgroundColor: '#1C1C38' },
});

const sr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  textBlock: { flex: 1, gap: 2 },
  label: { fontSize: 15, fontWeight: '600', color: '#fff', ...FF },
  value: { fontSize: 11, color: '#44446A' },
  chevron: { fontSize: 22, fontWeight: '300' },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000CC', justifyContent: 'flex-end' },
  card: { backgroundColor: '#0F0F24', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 10, borderTopWidth: 1.5, borderColor: '#7B3FFF' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4, ...FF },
  fieldLabel: { fontSize: 12, color: '#9090B8', fontWeight: '600', marginBottom: 2, ...FF },
  input: { backgroundColor: '#15152C', borderWidth: 1.5, borderColor: '#1C1C38', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 14, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, backgroundColor: '#15152C', borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: '#1C1C38' },
  cancelText: { color: '#9090B8', fontSize: 15, fontWeight: '700', ...FF },
  saveBtn: { flex: 1, backgroundColor: '#7B3FFF', borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '700', ...FF },
  successBadge: { backgroundColor: '#062018', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#00E5A8' },
  successText: { color: '#00E5A8', fontSize: 16, fontWeight: '800', ...FF },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08081A' },
  scroll: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 104, gap: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatarBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  avatarText: { fontSize: 22, fontWeight: '800', ...FF },
  headerText: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2, ...FF },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#fff', ...FF },
  stageCard: { borderRadius: 20, padding: 16, borderWidth: 1.5, gap: 10, marginBottom: 4 },
  stageBubbleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stageStickerBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  stageSticker: { fontSize: 26 },
  stageBubble: { borderRadius: 50, paddingHorizontal: 18, paddingVertical: 8 },
  stageBubbleText: { fontSize: 15, fontWeight: '800', color: '#08081A', ...FF },
  stageDesc: { fontSize: 13, lineHeight: 18 },
  stageLocked: { fontSize: 11, color: '#44446A', letterSpacing: 0.3 },
  settingsBlock: { backgroundColor: '#0F0F24', borderRadius: 20, borderWidth: 1.5, borderColor: '#1C1C38', overflow: 'hidden' },
  settingDivider: { height: 1, backgroundColor: '#1C1C38', marginHorizontal: 16 },
  footerStamp: { alignSelf: 'center', marginTop: 12 },
  stampInner: { borderWidth: 2, borderRadius: 50, paddingHorizontal: 22, paddingVertical: 10, alignItems: 'center', transform: [{ rotate: '-2deg' }] },
  stampLine1: { fontSize: 11, fontWeight: '800', letterSpacing: 3, ...FF },
  stampLine2: { fontSize: 14, fontWeight: '800', letterSpacing: 2, ...FF },
});
