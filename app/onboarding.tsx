import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();
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
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.iconWrap}>
          <Text style={s.iconText}>⏰</Text>
        </View>

        <Text style={s.heading}>Bienvenido</Text>
        <Text style={s.subheading}>Step 2 of 3 — your finances</Text>

        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: '66%' }]} />
        </View>

        <Text style={s.sectionLabel}>Enter your info manually</Text>

        <TextInput
          style={s.input}
          placeholder="Approx. credit score"
          placeholderTextColor="#5a8888"
          keyboardType="numeric"
          value={form.creditScore}
          onChangeText={set('creditScore')}
        />
        <TextInput
          style={s.input}
          placeholder="Monthly income"
          placeholderTextColor="#5a8888"
          keyboardType="numeric"
          value={form.income}
          onChangeText={set('income')}
        />
        <TextInput
          style={s.input}
          placeholder="Checking balance"
          placeholderTextColor="#5a8888"
          keyboardType="numeric"
          value={form.checking}
          onChangeText={set('checking')}
        />
        <View style={s.row}>
          <TextInput
            style={[s.input, { flex: 1 }]}
            placeholder="Card balance / limit"
            placeholderTextColor="#5a8888"
            keyboardType="numeric"
            value={form.cardBalance}
            onChangeText={set('cardBalance')}
          />
          <Text style={s.dollar}>$</Text>
          <TextInput
            style={[s.input, { flex: 1 }]}
            placeholder="Limit"
            placeholderTextColor="#5a8888"
            keyboardType="numeric"
            value={form.cardLimit}
            onChangeText={set('cardLimit')}
          />
        </View>

        <Text style={s.privacy}>
          We don't connect to your bank. Update anytime.
        </Text>

        <TouchableOpacity
          style={s.cta}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
        >
          <Text style={s.ctaText}>Build my plan →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1a1a' },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#1a9e7a',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  iconText: { fontSize: 24 },
  heading: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subheading: { fontSize: 13, color: '#8ab8b8', marginBottom: 16 },
  progressTrack: {
    width: '100%', height: 6, backgroundColor: '#1e3333',
    borderRadius: 4, marginBottom: 24, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#1db896', borderRadius: 4 },
  sectionLabel: { alignSelf: 'flex-start', fontSize: 14, color: '#a0c4c4', marginBottom: 12 },
  input: {
    width: '100%', backgroundColor: '#162828', borderWidth: 1,
    borderColor: '#1e3d3d', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    color: '#fff', fontSize: 14, marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  dollar: { color: '#8ab8b8', fontSize: 16, fontWeight: '600' },
  privacy: { fontSize: 12, color: '#5a8888', textAlign: 'center', marginVertical: 8 },
  cta: {
    width: '100%', backgroundColor: '#1db896', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
