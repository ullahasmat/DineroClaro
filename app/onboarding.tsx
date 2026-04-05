import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocale, LifeStage } from '@/context/AppContext';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const FEATURES = [
  {
    emoji: '💰',
    label: 'Home',
    title: 'My Finances',
    desc: 'Track your credit score, income & cards in one place.',
    accent: '#7B3FFF',
    bg: '#1A0A3A',
  },
  {
    emoji: '📚',
    label: 'Learn',
    title: 'Learn',
    desc: 'Bite-sized lessons on credit, saving & investing.',
    accent: '#00E5A8',
    bg: '#062018',
  },
  {
    emoji: '🤖',
    label: 'Lana',
    title: 'Lana AI',
    desc: 'Your bilingual financial advisor — free, always on.',
    accent: '#FF3B8B',
    bg: '#2A0A18',
  },
  {
    emoji: '⭐',
    label: 'Profile',
    title: 'Profile',
    desc: 'Curated picks + life stage settings & your account.',
    accent: '#FFD060',
    bg: '#201400',
  },
];

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={p.wrap}>
      <Text style={p.label}>{step} of {total}</Text>
      <View style={p.track}>
        <View style={[p.fill, { width: `${(step / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const STAGES: { key: LifeStage; label: string; desc: string; accent: string; bg: string }[] = [
  { key: 'new-arrival',  label: 'New Arrival',  desc: 'Just arrived — building your foundation.',       accent: '#00E5A8', bg: '#062018' },
  { key: 'first-gen',   label: 'First Gen',     desc: 'First generation navigating U.S. finance.',     accent: '#FF3B8B', bg: '#1A0A14' },
  { key: 'established', label: 'Established',   desc: "Growing and protecting what you've earned.",    accent: '#7B3FFF', bg: '#120A28' },
];

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { lifeStage, setLifeStage } = useLocale();

  return (
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.brandRow}>
        <View style={s.brandIcon}>
          <Text style={s.brandEmoji}>✦</Text>
        </View>
        <View>
          <Text style={s.brandName}>DineroClaro</Text>
          <Text style={s.brandTagline}>Financial clarity for everyone</Text>
        </View>
      </View>

      <ProgressBar step={1} total={3} />

      <Text style={s.welcomeHeading}>Welcome to your{'\n'}money HQ 👋</Text>
      <Text style={s.welcomeSub}>
        Four powerful tools. One app. Built for the Hispanic community.
      </Text>

      <View style={s.featureGrid}>
        {FEATURES.map((f) => (
          <View key={f.label} style={[s.featureCard, { backgroundColor: f.bg, borderColor: f.accent + '55' }]}>
            <View style={[s.featureIconBox, { backgroundColor: f.accent + '22', borderColor: f.accent + '44' }]}>
              <Text style={s.featureEmoji}>{f.emoji}</Text>
            </View>
            <View style={[s.featureTabBadge, { backgroundColor: f.accent }]}>
              <Text style={s.featureTabLabel}>{f.label}</Text>
            </View>
            <Text style={[s.featureTitle, { color: f.accent }]}>{f.title}</Text>
            <Text style={s.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      {/* Life Stage selector */}
      <Text style={s.stageHeading}>What's your life stage?</Text>
      <Text style={s.stageSub}>You can change this any time in your Profile.</Text>

      <View style={s.stageList}>
        {STAGES.map((st) => {
          const active = lifeStage === st.key;
          return (
            <TouchableOpacity
              key={st.key}
              style={[
                s.stageRow,
                active
                  ? { backgroundColor: st.bg, borderColor: st.accent }
                  : { backgroundColor: '#0F0F24', borderColor: '#1C1C38' },
              ]}
              onPress={() => setLifeStage(st.key)}
              activeOpacity={0.8}
            >
              <View style={[s.stageRadio, active && { backgroundColor: st.accent, borderColor: st.accent }]}>
                {active && <View style={s.stageRadioDot} />}
              </View>
              <View style={s.stageText}>
                <Text style={[s.stageLabel, { color: active ? st.accent : '#fff' }]}>{st.label}</Text>
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
  const [form, setForm] = useState({
    creditScore: '',
    income: '',
    checking: '',
    cardBalance: '',
    cardLimit: '',
  });
  const set = (field: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <ScrollView
      contentContainerStyle={s.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={s.stepIconWrap}>
        <Text style={s.stepIcon}>💳</Text>
      </View>

      <ProgressBar step={2} total={3} />

      <Text style={s.stepHeading}>Your finances</Text>
      <Text style={s.stepSub}>We never connect to your bank. You can update any time.</Text>

      <Text style={s.inputLabel}>Approx. credit score</Text>
      <TextInput
        style={s.input}
        placeholder="e.g. 640"
        placeholderTextColor="#44446A"
        keyboardType="numeric"
        value={form.creditScore}
        onChangeText={set('creditScore')}
      />
      <Text style={s.inputLabel}>Monthly income</Text>
      <TextInput
        style={s.input}
        placeholder="e.g. 2400"
        placeholderTextColor="#44446A"
        keyboardType="numeric"
        value={form.income}
        onChangeText={set('income')}
      />
      <Text style={s.inputLabel}>Checking balance</Text>
      <TextInput
        style={s.input}
        placeholder="e.g. 1200"
        placeholderTextColor="#44446A"
        keyboardType="numeric"
        value={form.checking}
        onChangeText={set('checking')}
      />
      <Text style={s.inputLabel}>Credit card  (balance / limit)</Text>
      <View style={s.row}>
        <TextInput
          style={[s.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Balance"
          placeholderTextColor="#44446A"
          keyboardType="numeric"
          value={form.cardBalance}
          onChangeText={set('cardBalance')}
        />
        <Text style={s.slash}>/</Text>
        <TextInput
          style={[s.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Limit"
          placeholderTextColor="#44446A"
          keyboardType="numeric"
          value={form.cardLimit}
          onChangeText={set('cardLimit')}
        />
      </View>

      <TouchableOpacity style={s.cta} onPress={onNext} activeOpacity={0.85}>
        <Text style={s.ctaText}>Continue  →</Text>
      </TouchableOpacity>

      <Text style={s.skipText} onPress={onNext}>Skip for now</Text>
    </ScrollView>
  );
}

function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={s.doneWrap}>
      <ProgressBar step={3} total={3} />

      <View style={s.doneIconRing}>
        <Text style={s.doneIcon}>✦</Text>
      </View>
      <Text style={s.doneHeading}>You're all set!</Text>
      <Text style={s.doneSub}>
        Lana is ready to guide you.{'\n'}Your financial journey starts now.
      </Text>

      <View style={s.doneFeatureRow}>
        {FEATURES.map((f) => (
          <View key={f.label} style={[s.donePill, { backgroundColor: f.bg, borderColor: f.accent + '66' }]}>
            <Text style={s.donePillEmoji}>{f.emoji}</Text>
            <Text style={[s.donePillLabel, { color: f.accent }]}>{f.label}</Text>
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
    <View style={s.root}>
      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
      {step === 1 && <FinancesStep onNext={() => setStep(2)} />}
      {step === 2 && <DoneStep onFinish={() => router.replace('/(tabs)')} />}
    </View>
  );
}

const p = StyleSheet.create({
  wrap: { width: '100%', gap: 6, marginBottom: 24 },
  label: { fontSize: 11, color: '#44446A', fontWeight: '700', letterSpacing: 1, ...FF },
  track: { width: '100%', height: 4, backgroundColor: '#1C1C38', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#7B3FFF', borderRadius: 4 },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#08081A' },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingBottom: 48,
    gap: 4,
  },

  // Brand
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  brandIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#1A0A3A', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#7B3FFF66' },
  brandEmoji: { fontSize: 20, color: '#7B3FFF' },
  brandName: { fontSize: 18, fontWeight: '800', color: '#fff', ...FF },
  brandTagline: { fontSize: 11, color: '#44446A', letterSpacing: 0.5 },

  // Welcome step
  welcomeHeading: { fontSize: 30, fontWeight: '800', color: '#fff', lineHeight: 38, marginBottom: 8, ...FF },
  welcomeSub: { fontSize: 14, color: '#9090B8', lineHeight: 20, marginBottom: 20 },

  // Feature grid
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  featureCard: { width: '47%', borderRadius: 20, padding: 14, borderWidth: 1.5, gap: 8 },
  featureIconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  featureEmoji: { fontSize: 22 },
  featureTabBadge: { alignSelf: 'flex-start', borderRadius: 50, paddingHorizontal: 10, paddingVertical: 3 },
  featureTabLabel: { fontSize: 9, fontWeight: '800', color: '#08081A', letterSpacing: 1, ...FF },
  featureTitle: { fontSize: 14, fontWeight: '800', ...FF },
  featureDesc: { fontSize: 11, color: '#9090B8', lineHeight: 15 },

  // Finances step
  stepIconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#1A0A3A', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#7B3FFF55', marginBottom: 16 },
  stepIcon: { fontSize: 26 },
  stepHeading: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4, ...FF },
  stepSub: { fontSize: 13, color: '#9090B8', marginBottom: 20, lineHeight: 18 },
  inputLabel: { fontSize: 12, color: '#9090B8', fontWeight: '600', marginBottom: 6, ...FF },
  input: {
    width: '100%', backgroundColor: '#0F0F24', borderWidth: 1.5,
    borderColor: '#1C1C38', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    color: '#fff', fontSize: 14, marginBottom: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', marginBottom: 14 },
  slash: { color: '#44446A', fontSize: 18, fontWeight: '300' },
  skipText: { textAlign: 'center', fontSize: 13, color: '#44446A', marginTop: 12, textDecorationLine: 'underline' },

  // Done step
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 16 },
  doneIconRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1A0A3A', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#7B3FFF' },
  doneIcon: { fontSize: 34, color: '#7B3FFF' },
  doneHeading: { fontSize: 30, fontWeight: '800', color: '#fff', ...FF },
  doneSub: { fontSize: 15, color: '#9090B8', textAlign: 'center', lineHeight: 22 },
  doneFeatureRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginVertical: 8 },
  donePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5 },
  donePillEmoji: { fontSize: 16 },
  donePillLabel: { fontSize: 12, fontWeight: '800', ...FF },

  // Life stage selector
  stageHeading: { fontSize: 18, fontWeight: '800', color: '#fff', marginTop: 8, marginBottom: 4, ...FF },
  stageSub: { fontSize: 12, color: '#44446A', marginBottom: 12 },
  stageList: { gap: 10, marginBottom: 20 },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 14, borderWidth: 1.5 },
  stageRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#44446A', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stageRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#08081A' },
  stageText: { flex: 1, gap: 2 },
  stageLabel: { fontSize: 14, fontWeight: '800', ...FF },
  stageDesc: { fontSize: 12, color: '#9090B8', lineHeight: 16 },

  // Shared CTA
  cta: { width: '100%', backgroundColor: '#7B3FFF', borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', ...FF },
  privacy: { fontSize: 12, color: '#3C3C5C', textAlign: 'center', marginTop: 8 },
});
