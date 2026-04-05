import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
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
  tintN:  '#EBF0FA',
  tintG:  '#FDF7E6',
};

const FEATURES = [
  { emoji: '💰', label: 'Home',    title: 'My Finances', desc: 'Track your credit score, income & cards.',     accent: C.navy,  bg: C.tintN },
  { emoji: '📚', label: 'Learn',   title: 'Learn',       desc: 'Bite-sized financial education.',              accent: C.blue,  bg: '#EBF4FF' },
  { emoji: '🤖', label: 'Lana',    title: 'Lana AI',     desc: 'Your bilingual financial advisor.',            accent: C.gold,  bg: C.tintG },
  { emoji: '⭐', label: 'Profile', title: 'Profile',     desc: 'Life stage settings & your account.',          accent: '#1A7A56', bg: '#E8F5EF' },
];

const STAGES: { key: LifeStage; emoji: string; label: string; desc: string; accent: string; bg: string }[] = [
  { key: 'new-arrival',  emoji: '✈️', label: 'New Arrival',  desc: 'Just arrived — building your foundation.',     accent: '#1A7A56', bg: '#E8F5EF' },
  { key: 'first-gen',    emoji: '🌟', label: 'First Gen',    desc: 'First generation navigating U.S. finance.',     accent: C.blue,   bg: '#EBF4FF' },
  { key: 'established',  emoji: '👑', label: 'Established',  desc: "Growing and protecting what you've earned.",    accent: C.gold,   bg: C.tintG },
];

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={p.wrap}>
      <View style={p.row}>
        <Text style={p.label}>Step {step} of {total}</Text>
        <Text style={p.pct}>{Math.round((step / total) * 100)}%</Text>
      </View>
      <View style={p.track}>
        <View style={[p.fill, { width: `${(step / total) * 100}%` }]} />
      </View>
    </View>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { lifeStage, setLifeStage } = useLocale();

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.brandRow}>
        <View style={s.brandIcon}>
          <Text style={s.brandStar}>✦</Text>
        </View>
        <View>
          <Text style={s.brandName}>DineroClaro</Text>
          <Text style={s.brandTagline}>Financial clarity for everyone</Text>
        </View>
      </View>

      <ProgressBar step={1} total={3} />

      <Text style={s.heading}>Welcome to your{'\n'}money HQ 👋</Text>
      <Text style={s.sub}>Four powerful tools. One app. Built for the Hispanic community.</Text>

      <View style={s.featureGrid}>
        {FEATURES.map(f => (
          <View key={f.label} style={[s.featureCard, { backgroundColor: f.bg, borderColor: f.accent + '33' }]}>
            <View style={[s.featureIconBox, { backgroundColor: C.card, borderColor: f.accent + '44' }]}>
              <Text style={{ fontSize: 22 }}>{f.emoji}</Text>
            </View>
            <View style={[s.featureBadge, { backgroundColor: f.accent }]}>
              <Text style={s.featureBadgeText}>{f.label}</Text>
            </View>
            <Text style={[s.featureTitle, { color: f.accent }]}>{f.title}</Text>
            <Text style={s.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      <Text style={s.stageHeading}>What's your life stage?</Text>
      <Text style={s.stageSub}>You can always change this in your Profile settings.</Text>

      <View style={s.stageList}>
        {STAGES.map(st => {
          const active = lifeStage === st.key;
          return (
            <TouchableOpacity
              key={st.key}
              style={[s.stageRow, active ? { backgroundColor: st.bg, borderColor: st.accent + '66' } : { backgroundColor: C.card, borderColor: C.border }]}
              onPress={() => setLifeStage(st.key)}
              activeOpacity={0.8}
            >
              <View style={[s.radio, active && { backgroundColor: st.accent, borderColor: st.accent }]}>
                {active && <View style={s.radioDot} />}
              </View>
              <Text style={{ fontSize: 20, width: 28 }}>{st.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.stageLabel, { color: active ? st.accent : C.text }]}>{st.label}</Text>
                <Text style={s.stageDesc}>{st.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={s.cta} onPress={onNext} activeOpacity={0.85}>
        <Text style={s.ctaText}>Get started  →</Text>
      </TouchableOpacity>
      <Text style={s.privacy}>Free · No bank connection · Private</Text>
    </ScrollView>
  );
}

function FinancesStep({ onNext }: { onNext: () => void }) {
  const { setFinancialProfile } = useLocale();
  const [form, setForm] = useState({ creditScore: '', income: '', checking: '', cardBalance: '', cardLimit: '' });
  const set = (f: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [f]: v }));

  function handleNext() {
    setFinancialProfile({
      creditScore: form.creditScore,
      income: form.income,
      checking: form.checking,
      cards: form.cardBalance || form.cardLimit
        ? [{ name: 'Primary Card', balance: form.cardBalance, limit: form.cardLimit }]
        : [],
    });
    onNext();
  }

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={s.stepIconWrap}>
        <Text style={{ fontSize: 28 }}>💳</Text>
      </View>
      <ProgressBar step={2} total={3} />
      <Text style={s.heading}>Your finances</Text>
      <Text style={s.sub}>We never connect to your bank. Update any time from the app.</Text>

      {[
        { key: 'creditScore', label: 'Approx. credit score', ph: 'e.g. 640' },
        { key: 'income',      label: 'Monthly income',       ph: 'e.g. 2,400' },
        { key: 'checking',    label: 'Checking balance',     ph: 'e.g. 1,200' },
      ].map(field => (
        <View key={field.key}>
          <Text style={s.inputLabel}>{field.label}</Text>
          <TextInput style={s.input} placeholder={field.ph} placeholderTextColor={C.text3} keyboardType="numeric" value={form[field.key as keyof typeof form]} onChangeText={set(field.key as keyof typeof form)} />
        </View>
      ))}

      <Text style={s.inputLabel}>Credit card  (balance / limit)</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TextInput style={[s.input, { flex: 1 }]} placeholder="Balance" placeholderTextColor={C.text3} keyboardType="numeric" value={form.cardBalance} onChangeText={set('cardBalance')} />
        <Text style={{ color: C.text3, fontSize: 18 }}>/</Text>
        <TextInput style={[s.input, { flex: 1 }]} placeholder="Limit" placeholderTextColor={C.text3} keyboardType="numeric" value={form.cardLimit} onChangeText={set('cardLimit')} />
      </View>

      <TouchableOpacity style={[s.cta, { marginTop: 8 }]} onPress={handleNext} activeOpacity={0.85}>
        <Text style={s.ctaText}>Continue  →</Text>
      </TouchableOpacity>
      <Text style={[s.privacy, { textDecorationLine: 'underline' }]} onPress={handleNext}>Skip for now</Text>
    </ScrollView>
  );
}

function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={s.doneWrap}>
      <ProgressBar step={3} total={3} />
      <View style={s.doneRing}>
        <Text style={{ fontSize: 36, color: C.gold }}>✦</Text>
      </View>
      <Text style={[s.heading, { textAlign: 'center' }]}>You're all set!</Text>
      <Text style={[s.sub, { textAlign: 'center' }]}>Lana is ready to guide you.{'\n'}Your financial journey starts now.</Text>
      <View style={s.donePills}>
        {FEATURES.map(f => (
          <View key={f.label} style={[s.donePill, { backgroundColor: f.bg, borderColor: f.accent + '44' }]}>
            <Text style={{ fontSize: 16 }}>{f.emoji}</Text>
            <Text style={[s.donePillText, { color: f.accent }]}>{f.label}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={s.cta} onPress={onFinish} activeOpacity={0.85}>
        <Text style={s.ctaText}>Build my plan  ✦</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
      {step === 1 && <FinancesStep onNext={() => setStep(2)} />}
      {step === 2 && <DoneStep onFinish={() => router.replace('/(tabs)')} />}
    </View>
  );
}

const p = StyleSheet.create({
  wrap: { width: '100%', gap: 6, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 11, color: C.text3, fontWeight: '600', letterSpacing: 0.5 },
  pct: { fontSize: 11, color: C.blue, fontWeight: '700' },
  track: { width: '100%', height: 4, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: C.gold, borderRadius: 4 },
});

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingBottom: 48, gap: 6 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28 },
  brandIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.tintN, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  brandStar: { fontSize: 20, color: C.navy },
  brandName: { fontSize: 18, fontWeight: '800', color: C.text, ...FF },
  brandTagline: { fontSize: 11, color: C.text3 },
  heading: { fontSize: 30, fontWeight: '800', color: C.text, lineHeight: 38, marginBottom: 6, ...FF },
  sub: { fontSize: 14, color: C.text2, lineHeight: 21, marginBottom: 16 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  featureCard: { width: '47%', borderRadius: 18, padding: 14, borderWidth: 1, gap: 8 },
  featureIconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  featureBadge: { alignSelf: 'flex-start', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3 },
  featureBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1, ...FF },
  featureTitle: { fontSize: 14, fontWeight: '800', ...FF },
  featureDesc: { fontSize: 11, color: C.text2, lineHeight: 15 },
  stageHeading: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 8, marginBottom: 4, ...FF },
  stageSub: { fontSize: 12, color: C.text3, marginBottom: 14 },
  stageList: { gap: 10, marginBottom: 20 },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 14, borderWidth: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  stageLabel: { fontSize: 14, fontWeight: '800', ...FF },
  stageDesc: { fontSize: 12, color: C.text3, lineHeight: 16, marginTop: 1 },
  stepIconWrap: { width: 58, height: 58, borderRadius: 18, backgroundColor: C.tintN, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  inputLabel: { fontSize: 12, color: C.text2, fontWeight: '600', marginBottom: 6, marginTop: 4, ...FF },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: C.text, fontSize: 14, marginBottom: 4 },
  cta: { width: '100%', backgroundColor: C.navy, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', ...FF },
  privacy: { fontSize: 12, color: C.text3, textAlign: 'center', marginTop: 10 },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
  doneRing: { width: 84, height: 84, borderRadius: 42, backgroundColor: C.tintG, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.gold + '66' },
  donePills: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginVertical: 4 },
  donePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  donePillText: { fontSize: 12, fontWeight: '800', ...FF },
});
