import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={s.greeting}>Buenos días,</Text>
        <Text style={s.name}>Carlos</Text>

        {/* Credit score */}
        <View style={s.card}>
          <Text style={s.cardLabel}>CREDIT SCORE</Text>
          <View style={s.scoreRow}>
            <Text style={s.scoreNum}>642</Text>
            <View style={s.fairBadge}>
              <Text style={s.fairText}>Fair</Text>
            </View>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: '62%' }]} />
          </View>
          <Text style={s.goalText}>Goal: 720 · 78 pts away</Text>
        </View>

        {/* 2-col row */}
        <View style={s.grid2}>
          <View style={[s.card, s.flex1]}>
            <Text style={s.cardLabel}>CHECKING BALANCE</Text>
            <Text style={s.bigNum}>$1,240</Text>
            <Text style={s.subLabel}>self-reported</Text>
          </View>
          <View style={[s.card, s.flex1]}>
            <Text style={s.cardLabel}>CARD UTILIZATION</Text>
            <Text style={[s.bigNum, { color: '#1db896' }]}>22%</Text>
            <Text style={[s.subLabel, { color: '#1db896' }]}>Good range</Text>
          </View>
        </View>

        <View style={s.grid2}>
          <View style={[s.card, s.flex1]}>
            <Text style={s.cardLabel}>LESSONS DONE</Text>
            <Text style={s.bigNum}>4 / 12</Text>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: '33%' }]} />
            </View>
          </View>
          <View style={[s.card, s.flex1]}>
            <Text style={s.cardLabel}>XP EARNED</Text>
            <Text style={s.bigNum}>320 xp</Text>
            <View style={s.levelBadge}>
              <Text style={s.levelText}>Level 2</Text>
            </View>
          </View>
        </View>

        {/* Next steps */}
        <View style={s.card}>
          <Text style={s.cardLabel}>YOUR NEXT STEPS</Text>
          <View style={s.stepItem}>
            <View style={s.stepNum}>
              <Text style={s.stepNumText}>1</Text>
            </View>
            <View>
              <Text style={s.stepTitle}>Pay credit card on time</Text>
              <Text style={s.stepSub}>Keeps utilization low</Text>
            </View>
          </View>
          <View style={[s.stepItem, { opacity: 0.5 }]}>
            <View style={[s.stepNum, { backgroundColor: '#1e3333' }]}>
              <Text style={s.stepNumText}>2</Text>
            </View>
            <View>
              <Text style={s.stepTitle}>Learn: How does APR work?</Text>
              <Text style={s.stepSub}>5 min · earn 50 xp</Text>
            </View>
          </View>
        </View>

        {/* Scroll arrow hint */}
        <TouchableOpacity
          style={s.arrowBtn}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <Text style={s.arrowText}>↓</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d1a1a',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 12,
  },
  greeting: {
    fontSize: 15,
    color: '#8ab8b8',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#122222',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    color: '#8ab8b8',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreNum: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 44,
  },
  fairBadge: {
    backgroundColor: '#c97a1a',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  fairText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#1e3333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1db896',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#8ab8b8',
  },
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  bigNum: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  subLabel: {
    fontSize: 11,
    color: '#8ab8b8',
  },
  levelBadge: {
    backgroundColor: '#1a3333',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#1db896',
    fontSize: 11,
    fontWeight: '600',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 8,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1db896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stepSub: {
    fontSize: 12,
    color: '#1db896',
    marginTop: 2,
  },
  arrowBtn: {
    alignSelf: 'center',
    marginTop: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e3333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#8ab8b8',
    fontSize: 16,
  },
});
