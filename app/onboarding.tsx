import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
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
};

const FEATURES = [
  { emoji: '💰', label: 'Home' },
  { emoji: '📚', label: 'Learn' },
  { emoji: '🤖', label: 'Lana' },
  { emoji: '🗂️', label: 'Vault' },
  { emoji: '👤', label: 'Profile' },
];

const STAGES: { key: LifeStage; emoji: string; label: string }[] = [
  { key: 'new-arrival', emoji: '✈️', label: 'New Arrival' },
  { key: 'first-gen',   emoji: '🌟', label: 'First Gen' },
  { key: 'established', emoji: '👑', label: 'Established' },
];

const STAGE_COLORS: Record<LifeStage, string> = { 'new-arrival': '#0E9A5E', 'first-gen': '#2B6CB0', 'established': '#E8A817' };

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={p.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[p.dot, i < step && p.dotActive]} />
      ))}
    </View>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { lifeStage, setLifeStage } = useLocale();

  return (
    <View style={s.page}>
      {/* Brand */}
      <View style={s.brandRow}>
        <View style={s.brandIcon}><Text style={s.brandStar}>✦</Text></View>
        <Text style={s.brandName}>DineroClaro</Text>
      </View>

      <ProgressDots step={1} total={3} />

      <Text style={s.heading}>Welcome 👋</Text>
      <Text style={s.sub}>Financial clarity for the Hispanic community.</Text>

      {/* What's inside — muted display-only grid */}
      <View style={s.featureCard}>
        <Text style={s.featureCardLabel}>WHAT'S INSIDE</Text>
        <View style={s.featureGrid}>
          {FEATURES.map(f => (
            <View key={f.label} style={s.featureItem}>
              <View style={s.featureCircle}>
                <Text style={{ fontSize: 16 }}>{f.emoji}</Text>
              </View>
              <Text style={s.featureItemLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Life stage — interactive selector */}
      <View style={s.stageCard}>
        <Text style={s.stageCardLabel}>SELECT YOUR STAGE</Text>
        <View style={s.stageRow}>
          {STAGES.map(st => {
            const active = lifeStage === st.key;
            const color = STAGE_COLORS[st.key];
            return (
              <TouchableOpacity
                key={st.key}
                style={[s.stageChip, active && { backgroundColor: color, borderColor: color }]}
                onPress={() => setLifeStage(st.key)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 22 }}>{st.emoji}</Text>
                <Text style={[s.stageLabel, active && { color: '#fff' }]}>{st.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* CTA */}
      <View style={s.ctaWrap}>
        <TouchableOpacity style={s.cta} onPress={onNext} activeOpacity={0.85}>
          <Text style={s.ctaText}>Get started  →</Text>
        </TouchableOpacity>
        <Text style={s.privacy}>Free · No bank connection · Private</Text>
      </View>
    </View>
  );
}

function FinancesStep({ onNext }: { onNext: () => void }) {
  const { setFinancialProfile } = useLocale();
  const [form, setForm] = useState({ creditScore: '', income: '', checking: '', cardBalance: '', cardLimit: '' });
  const set = (f: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [f]: v }));

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
    <ScrollView contentContainerStyle={s.scrollPage} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={{ fontSize: 28 }}>💳</Text>
      <ProgressDots step={2} total={3} />
      <Text style={s.heading}>Your finances</Text>
      <Text style={s.sub}>We never connect to your bank. Update any time.</Text>

      {[
        { key: 'creditScore', label: 'Credit score', ph: '640' },
        { key: 'income',      label: 'Monthly income', ph: '2,400' },
        { key: 'checking',    label: 'Checking balance', ph: '1,200' },
      ].map(field => (
        <View key={field.key}>
          <Text style={s.inputLabel}>{field.label}</Text>
          <TextInput style={s.input} placeholder={field.ph} placeholderTextColor={C.text3} keyboardType="numeric" value={form[field.key as keyof typeof form]} onChangeText={set(field.key as keyof typeof form)} />
        </View>
      ))}

      <Text style={s.inputLabel}>Credit card (balance / limit)</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TextInput style={[s.input, { flex: 1 }]} placeholder="Balance" placeholderTextColor={C.text3} keyboardType="numeric" value={form.cardBalance} onChangeText={set('cardBalance')} />
        <Text style={{ color: C.text3, fontSize: 18 }}>/</Text>
        <TextInput style={[s.input, { flex: 1 }]} placeholder="Limit" placeholderTextColor={C.text3} keyboardType="numeric" value={form.cardLimit} onChangeText={set('cardLimit')} />
      </View>

      <TouchableOpacity style={[s.cta, { marginTop: 12 }]} onPress={handleNext} activeOpacity={0.85}>
        <Text style={s.ctaText}>Continue  →</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext}><Text style={s.skipText}>Skip for now</Text></TouchableOpacity>
    </ScrollView>
  );
}

function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <View style={s.page}>
      <ProgressDots step={3} total={3} />
      <View style={s.doneRing}>
        <Text style={{ fontSize: 36, color: C.gold }}>✦</Text>
      </View>
      <Text style={[s.heading, { textAlign: 'center' }]}>You're all set!</Text>
      <Text style={[s.sub, { textAlign: 'center' }]}>Lana is ready to guide you.{'\n'}Your financial journey starts now.</Text>
      <View style={s.featureRow}>
        {FEATURES.map(f => (
          <View key={f.label} style={s.featurePill}>
            <Text style={{ fontSize: 16 }}>{f.emoji}</Text>
            <Text style={s.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>
      <View style={s.ctaWrap}>
        <TouchableOpacity style={s.cta} onPress={onFinish} activeOpacity={0.85}>
          <Text style={s.ctaText}>Build my plan  ✦</Text>
        </TouchableOpacity>
      </View>
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
  row: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 16 },
  dot: { width: 28, height: 4, borderRadius: 2, backgroundColor: C.border },
  dotActive: { backgroundColor: C.gold },
});

const s = StyleSheet.create({
  page: {
    flex: 1, paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32, justifyContent: 'space-between',
  },
  scrollPage: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 48, gap: 4,
  },

  /* Brand */
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  brandIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.tintN, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  brandStar: { fontSize: 16, color: C.navy },
  brandName: { fontSize: 18, fontWeight: '800', color: C.text, ...FF },

  /* Text */
  heading: { fontSize: 28, fontWeight: '200', color: C.text, letterSpacing: -0.5, marginBottom: 4, ...FF },
  sub: { fontSize: 14, color: C.text2, lineHeight: 20, marginBottom: 8 },

  /* Feature card — muted display */
  featureCard: {
    backgroundColor: 'rgba(22,47,90,0.04)', borderRadius: 20, padding: 14, gap: 10,
  },
  featureCardLabel: { fontSize: 10, fontWeight: '700', color: C.text3, letterSpacing: 1.5, ...FF },
  featureGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  featureItem: { alignItems: 'center', gap: 4 },
  featureCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  featureItemLabel: { fontSize: 10, fontWeight: '600', color: C.text3, ...FF },

  /* Feature row — for done step */
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginVertical: 8 },
  featurePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.card, borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: C.border,
  },
  featureLabel: { fontSize: 12, fontWeight: '600', color: C.text2, ...FF },

  /* Life stage — interactive selector */
  stageCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 16, gap: 12,
    borderWidth: 1.5, borderColor: C.gold + '44',
  },
  stageCardLabel: { fontSize: 10, fontWeight: '800', color: C.gold, letterSpacing: 1.5, textAlign: 'center', ...FF },
  stageRow: { flexDirection: 'row', gap: 10 },
  stageChip: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: C.bg, borderRadius: 16, paddingVertical: 14,
    borderWidth: 1.5, borderColor: C.border,
  },
  stageLabel: { fontSize: 11, fontWeight: '700', color: C.text, textAlign: 'center', ...FF },

  /* CTA */
  ctaWrap: { gap: 8, marginTop: 8 },
  cta: { width: '100%', backgroundColor: C.navy, borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700', ...FF },
  privacy: { fontSize: 11, color: C.text3, textAlign: 'center' },

  /* Forms */
  inputLabel: { fontSize: 12, color: C.text2, fontWeight: '600', marginBottom: 4, marginTop: 6, ...FF },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, color: C.text, fontSize: 14, marginBottom: 2 },
  skipText: { color: C.blue, fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 10, textDecorationLine: 'underline', ...FF },

  /* Done */
  doneRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.tintG, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.gold + '55', alignSelf: 'center' },
});
