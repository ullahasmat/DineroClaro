import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Platform, ActivityIndicator, Image,
} from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useLocale } from '@/context/AppContext';
import { isVoiceAvailable, startListening, stopListening } from '@/services/speech';

const FONT = Platform.OS === 'ios' ? 'Avenir Next' : undefined;
const FF = FONT ? { fontFamily: FONT } : {};

const runtime = Constants as unknown as {
  expoConfig?: { hostUri?: string };
  expoGoConfig?: { debuggerHost?: string };
  manifest?: { debuggerHost?: string };
  manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
};
const hostUri =
  runtime.expoGoConfig?.debuggerHost ??
  runtime.manifest?.debuggerHost ??
  runtime.expoConfig?.hostUri ??
  runtime.manifest2?.extra?.expoClient?.hostUri;
const host = hostUri?.split(':')[0];
const fallbackApiBase = Platform.select({ ios: 'http://127.0.0.1:8000', android: 'http://10.0.2.2:8000', default: 'http://localhost:8000' });
const API_BASE = host ? `http://${host}:8000` : fallbackApiBase;

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
  red:    '#E04040',
  orange: '#E88B17',
  tintN:  'rgba(230,238,252,0.9)',
  tintG:  'rgba(255,248,225,0.9)',
  tintB:  'rgba(228,240,255,0.9)',
  tintGr: 'rgba(220,248,235,0.9)',
  tintR:  'rgba(255,230,230,0.9)',
  tintO:  'rgba(255,243,225,0.9)',
};

type DocCategory = 'important' | 'sensitive' | 'trash';

type Doc = {
  id: string;
  title: string;
  text: string;
  category: DocCategory;
  summary: string;
  legitimacy: 'legit' | 'suspicious' | 'scam' | 'pending';
  date: string;
};

const CATEGORY_META: Record<DocCategory, { emoji: string; color: string; bg: string }> = {
  important: { emoji: '📌', color: C.blue, bg: C.tintB },
  sensitive: { emoji: '🔒', color: C.orange, bg: C.tintO },
  trash:     { emoji: '🗑️', color: C.red, bg: C.tintR },
};

const LEGIT_META: Record<Doc['legitimacy'], { label: string; labelEs: string; color: string; bg: string }> = {
  legit:      { label: 'Legitimate', labelEs: 'Legítimo', color: C.green, bg: C.tintGr },
  suspicious: { label: 'Suspicious', labelEs: 'Sospechoso', color: C.orange, bg: C.tintO },
  scam:       { label: 'Likely Scam', labelEs: 'Posible estafa', color: C.red, bg: C.tintR },
  pending:    { label: 'Analyzing...', labelEs: 'Analizando...', color: C.text3, bg: C.tintN },
};

const T = {
  en: {
    eyebrow: 'DOCUMENT VAULT',
    title: 'Vault',
    filterAll: 'All',
    filterImportant: 'Important',
    filterSensitive: 'Sensitive',
    filterTrash: 'Trash/Scam',
    empty: 'No documents yet',
    emptySub: 'Paste or type any letter, email, or offer to scan it for legitimacy.',
    scanTitle: 'Scan a Document',
    scanPlaceholder: 'Paste the text of a letter, email, offer, or financial document...',
    scanBtn: 'Scan with Lana AI',
    cameraBtn: 'Take Photo',
    galleryBtn: 'From Gallery',
    orText: 'or paste text below',
    scanning: 'Lana is analyzing...',
    summaryLabel: 'AI SUMMARY',
    legitLabel: 'LEGITIMACY',
    categoryLabel: 'FILE UNDER',
    saveBtn: 'Save to Vault',
    close: 'Close',
    delete: 'Delete',
    moveLabel: 'Move to',
  },
  es: {
    eyebrow: 'BÓVEDA DE DOCUMENTOS',
    title: 'Bóveda',
    filterAll: 'Todos',
    filterImportant: 'Importantes',
    filterSensitive: 'Sensibles',
    filterTrash: 'Basura/Estafa',
    empty: 'Sin documentos aún',
    emptySub: 'Pega o escribe cualquier carta, correo u oferta para verificar su legitimidad.',
    scanTitle: 'Escanear Documento',
    scanPlaceholder: 'Pega el texto de una carta, correo, oferta o documento financiero...',
    scanBtn: 'Escanear con Lana AI',
    cameraBtn: 'Tomar Foto',
    galleryBtn: 'De Galería',
    orText: 'o pega texto abajo',
    scanning: 'Lana está analizando...',
    summaryLabel: 'RESUMEN AI',
    legitLabel: 'LEGITIMIDAD',
    categoryLabel: 'ARCHIVAR EN',
    saveBtn: 'Guardar en Bóveda',
    close: 'Cerrar',
    delete: 'Eliminar',
    moveLabel: 'Mover a',
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

export default function VaultScreen() {
  const { locale } = useLocale();
  const t = T[locale];

  const [docs, setDocs] = useState<Doc[]>([]);
  const [filter, setFilter] = useState<DocCategory | 'all'>('all');
  const [showScan, setShowScan] = useState(false);
  const [scanText, setScanText] = useState('');
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanBase64, setScanBase64] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ summary: string; legitimacy: Doc['legitimacy']; suggestedCategory: DocCategory } | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [listening, setListening] = useState(false);
  const voiceEnabled = isVoiceAvailable();

  function toggleVoice() {
    if (listening) {
      stopListening();
      setListening(false);
    } else {
      setListening(true);
      startListening(locale, {
        onResult: (text) => { setScanText(prev => prev ? prev + ' ' + text : text); setScanImage(null); },
        onEnd: () => setListening(false),
        onError: () => setListening(false),
      });
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      setScanImage(result.assets[0].uri);
      setScanBase64(result.assets[0].base64 ?? null);
      setScanText('');
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      setScanImage(result.assets[0].uri);
      setScanBase64(result.assets[0].base64 ?? null);
      setScanText('');
    }
  }

  const filtered = filter === 'all' ? docs : docs.filter(d => d.category === filter);

  async function scanDocument() {
    const text = scanText.trim();
    if (!text && !scanBase64) return;
    setScanning(true);
    setScanResult(null);

    try {
      const url = `${API_BASE}/scan/`;
      const body: Record<string, string | null> = { locale };
      if (scanBase64) {
        body.image_base64 = scanBase64;
        body.image_media_type = 'image/jpeg';
      }
      if (text) {
        body.document = text;
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      const reply: string = data.reply ?? data.response ?? '';

      if (!reply) {
        setScanResult({ summary: locale === 'en' ? 'Empty response from AI.' : 'Respuesta vacía del AI.', legitimacy: 'pending', suggestedCategory: 'important' });
        return;
      }

      // Try to extract JSON from response
      const jsonMatch = reply.match(/\{[^{}]*"summary"[^{}]*\}/s) ?? reply.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          const legit = ['legit', 'suspicious', 'scam'].includes(parsed.legitimacy) ? parsed.legitimacy : 'suspicious';
          const cat = ['important', 'sensitive', 'trash'].includes(parsed.category) ? parsed.category : (legit === 'scam' ? 'trash' : 'important');
          const extracted = parsed.extracted_text ?? '';
          const fullSummary = extracted
            ? `${parsed.summary || reply}\n\n📝 ${locale === 'en' ? 'Extracted text' : 'Texto extraído'}:\n${extracted}`
            : (parsed.summary || reply);
          setScanResult({ summary: fullSummary, legitimacy: legit as Doc['legitimacy'], suggestedCategory: cat as DocCategory });
          return;
        } catch { /* fall through */ }
      }

      // Fallback: use the raw reply as summary, guess legitimacy from keywords
      const lower = reply.toLowerCase();
      const guessLegit: Doc['legitimacy'] = lower.includes('scam') || lower.includes('estafa') ? 'scam'
        : lower.includes('suspicious') || lower.includes('sospechoso') ? 'suspicious' : 'legit';
      const guessCat: DocCategory = guessLegit === 'scam' ? 'trash' : 'important';
      setScanResult({ summary: reply, legitimacy: guessLegit, suggestedCategory: guessCat });

    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setScanResult({
        summary: locale === 'en'
          ? `Could not connect to Lana AI. ${msg ? `(${msg})` : 'Check that the backend is running.'}`
          : `No se pudo conectar con Lana AI. ${msg ? `(${msg})` : 'Verifica que el servidor esté activo.'}`,
        legitimacy: 'pending',
        suggestedCategory: 'important',
      });
    } finally {
      setScanning(false);
    }
  }

  function saveDoc() {
    if (!scanResult) return;
    const doc: Doc = {
      id: Date.now().toString(),
      title: scanText.trim().slice(0, 60) + (scanText.trim().length > 60 ? '...' : ''),
      text: scanText.trim(),
      category: scanResult.suggestedCategory,
      summary: scanResult.summary,
      legitimacy: scanResult.legitimacy,
      date: new Date().toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric' }),
    };
    setDocs(prev => [doc, ...prev]);
    setScanText('');
    setScanResult(null);
    setShowScan(false);
  }

  function deleteDoc(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id));
    setSelectedDoc(null);
  }

  function moveDoc(id: string, category: DocCategory) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, category } : d));
    setSelectedDoc(prev => prev && prev.id === id ? { ...prev, category } : prev);
  }

  const filters: { key: DocCategory | 'all'; label: string; emoji: string }[] = [
    { key: 'all', label: t.filterAll, emoji: '📋' },
    { key: 'important', label: t.filterImportant, emoji: '📌' },
    { key: 'sensitive', label: t.filterSensitive, emoji: '🔒' },
    { key: 'trash', label: t.filterTrash, emoji: '🗑️' },
  ];

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.eyebrow}>{t.eyebrow}</Text>
            <Text style={s.pageTitle}>{t.title}</Text>
          </View>
          <LangToggle />
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={s.scanBtn} onPress={() => { setShowScan(true); setScanResult(null); setScanText(''); setScanImage(null); setScanBase64(null); }} activeOpacity={0.8}>
          <Text style={s.scanBtnEmoji}>📷</Text>
          <Text style={s.scanBtnText}>{t.scanTitle}</Text>
        </TouchableOpacity>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {filters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[s.filterChip, filter === f.key && s.filterActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={s.filterEmoji}>{f.emoji}</Text>
              <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Documents */}
        {filtered.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>🗂️</Text>
            <Text style={s.emptyText}>{t.empty}</Text>
            <Text style={s.emptySub}>{t.emptySub}</Text>
          </View>
        ) : (
          filtered.map(doc => {
            const cat = CATEGORY_META[doc.category];
            const leg = LEGIT_META[doc.legitimacy];
            return (
              <TouchableOpacity key={doc.id} style={[s.docCard, { borderLeftColor: cat.color }]} onPress={() => setSelectedDoc(doc)} activeOpacity={0.8}>
                <View style={s.docHeader}>
                  <Text style={s.docEmoji}>{cat.emoji}</Text>
                  <Text style={s.docTitle} numberOfLines={1}>{doc.title}</Text>
                  <View style={[s.legitPill, { backgroundColor: leg.bg }]}>
                    <Text style={[s.legitText, { color: leg.color }]}>{locale === 'en' ? leg.label : leg.labelEs}</Text>
                  </View>
                </View>
                <Text style={s.docSummary} numberOfLines={2}>{doc.summary}</Text>
                <Text style={s.docDate}>{doc.date}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Scan Modal */}
      <Modal visible={showScan} transparent animationType="slide" onRequestClose={() => setShowScan(false)}>
        <View style={s.overlay}>
          <View style={s.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={s.modalTitle}>📷  {t.scanTitle}</Text>

              {/* Camera / Gallery buttons */}
              <View style={[s.captureRow, { marginTop: 14 }]}>
                <TouchableOpacity style={s.captureBtn} onPress={takePhoto} activeOpacity={0.8}>
                  <Text style={s.captureBtnEmoji}>📸</Text>
                  <Text style={s.captureBtnText}>{t.cameraBtn}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.captureBtn} onPress={pickFromGallery} activeOpacity={0.8}>
                  <Text style={s.captureBtnEmoji}>🖼️</Text>
                  <Text style={s.captureBtnText}>{t.galleryBtn}</Text>
                </TouchableOpacity>
                {voiceEnabled && (
                  <TouchableOpacity style={[s.captureBtn, listening && s.captureBtnActive]} onPress={toggleVoice} activeOpacity={0.8}>
                    <Text style={s.captureBtnEmoji}>{listening ? '⏹' : '🎙'}</Text>
                    <Text style={[s.captureBtnText, listening && { color: '#fff' }]}>{listening ? (locale === 'en' ? 'Stop' : 'Parar') : (locale === 'en' ? 'Dictate' : 'Dictar')}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Image preview */}
              {scanImage && (
                <View style={[s.imagePreview, { marginTop: 12 }]}>
                  <Image source={{ uri: scanImage }} style={s.previewImg} resizeMode="cover" />
                  <TouchableOpacity style={s.removeImg} onPress={() => { setScanImage(null); setScanBase64(null); setScanText(''); }}>
                    <Text style={s.removeImgText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={[s.orText, { marginVertical: 10 }]}>{t.orText}</Text>

              <TextInput
                style={s.scanInput}
                value={scanText}
                onChangeText={(v) => { setScanText(v); setScanImage(null); setScanBase64(null); }}
                placeholder={t.scanPlaceholder}
                placeholderTextColor={C.text3}
                multiline
                textAlignVertical="top"
                editable={!scanning}
              />

              {scanning && (
                <View style={[s.scanningRow, { marginTop: 10 }]}>
                  <ActivityIndicator size="small" color={C.gold} />
                  <Text style={s.scanningText}>{t.scanning}</Text>
                </View>
              )}

              {scanResult && !scanning && (
                <View style={[s.resultCard, { marginTop: 12 }]}>
                  <Text style={s.resultLabel}>{t.summaryLabel}</Text>
                  <Text style={s.resultBody}>{scanResult.summary}</Text>

                  <View style={s.resultRow}>
                    <Text style={s.resultLabel}>{t.legitLabel}</Text>
                    <View style={[s.legitPill, { backgroundColor: LEGIT_META[scanResult.legitimacy].bg }]}>
                      <Text style={[s.legitText, { color: LEGIT_META[scanResult.legitimacy].color }]}>
                        {locale === 'en' ? LEGIT_META[scanResult.legitimacy].label : LEGIT_META[scanResult.legitimacy].labelEs}
                      </Text>
                    </View>
                  </View>

                  <View style={s.resultRow}>
                    <Text style={s.resultLabel}>{t.categoryLabel}</Text>
                    <View style={[s.catPill, { backgroundColor: CATEGORY_META[scanResult.suggestedCategory].bg }]}>
                      <Text style={{ fontSize: 14 }}>{CATEGORY_META[scanResult.suggestedCategory].emoji}</Text>
                      <Text style={[s.catPillText, { color: CATEGORY_META[scanResult.suggestedCategory].color }]}>
                        {scanResult.suggestedCategory}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Buttons — always visible */}
              <View style={[s.modalBtnRow, { marginTop: 16, marginBottom: 8 }]}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setShowScan(false)}>
                  <Text style={s.cancelText}>{t.close}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.scanAiBtn} onPress={scanResult ? saveDoc : scanDocument} activeOpacity={0.85} disabled={scanning}>
                  <Text style={s.scanAiIcon}>✦</Text>
                  <Text style={s.scanAiText}>{scanResult ? t.saveBtn : t.scanBtn}</Text>
                </TouchableOpacity>
              </View>

              {/* Scan again after result */}
              {scanResult && !scanning && (
                <TouchableOpacity
                  style={[s.scanAgainBtn, { marginBottom: 8 }]}
                  onPress={() => { setScanResult(null); setScanText(''); setScanImage(null); setScanBase64(null); }}
                  activeOpacity={0.7}
                >
                  <Text style={s.scanAgainText}>{locale === 'en' ? '↻ Scan another document' : '↻ Escanear otro documento'}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Doc Detail Modal */}
      <Modal visible={!!selectedDoc} transparent animationType="slide" onRequestClose={() => setSelectedDoc(null)}>
        <View style={s.overlay}>
          <View style={s.modalCard}>
            {selectedDoc && (
              <>
                <View style={s.docHeader}>
                  <Text style={{ fontSize: 24 }}>{CATEGORY_META[selectedDoc.category].emoji}</Text>
                  <Text style={[s.modalTitle, { flex: 1 }]}>{selectedDoc.title}</Text>
                </View>

                <View style={[s.legitPill, { backgroundColor: LEGIT_META[selectedDoc.legitimacy].bg, alignSelf: 'flex-start' }]}>
                  <Text style={[s.legitText, { color: LEGIT_META[selectedDoc.legitimacy].color }]}>
                    {locale === 'en' ? LEGIT_META[selectedDoc.legitimacy].label : LEGIT_META[selectedDoc.legitimacy].labelEs}
                  </Text>
                </View>

                <Text style={s.resultLabel}>{t.summaryLabel}</Text>
                <Text style={s.resultBody}>{selectedDoc.summary}</Text>

                <Text style={s.resultLabel}>{t.moveLabel}</Text>
                <View style={s.moveRow}>
                  {(['important', 'sensitive', 'trash'] as DocCategory[]).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[s.moveBtn, selectedDoc.category === cat && { borderColor: CATEGORY_META[cat].color, borderWidth: 2 }]}
                      onPress={() => moveDoc(selectedDoc.id, cat)}
                    >
                      <Text style={{ fontSize: 16 }}>{CATEGORY_META[cat].emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={s.modalBtnRow}>
                  <TouchableOpacity style={s.cancelBtn} onPress={() => setSelectedDoc(null)}>
                    <Text style={s.cancelText}>{t.close}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.primaryBtn, { backgroundColor: C.red }]} onPress={() => deleteDoc(selectedDoc.id)}>
                    <Text style={s.primaryText}>{t.delete}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const lt = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: 'rgba(230,238,252,0.9)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(190,210,235,0.6)', overflow: 'hidden' },
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  active: { backgroundColor: C.navy },
  divider: { width: 1, backgroundColor: C.border },
  text: { fontSize: 11, fontWeight: '700', color: C.text3, letterSpacing: 0.8, ...FF },
  activeText: { color: '#fff' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 110, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 },
  eyebrow: { fontSize: 11, color: C.blue, fontWeight: '600', letterSpacing: 3, opacity: 0.7, ...FF },
  pageTitle: { fontSize: 34, fontWeight: '200', color: C.text, letterSpacing: -0.5, ...FF },

  /* Scan button */
  scanBtn: {
    backgroundColor: C.navy, borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12,
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }, android: { elevation: 4 } }),
  },
  scanBtnEmoji: { fontSize: 24 },
  scanBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', ...FF },

  /* Filters */
  filterRow: { gap: 8, paddingVertical: 4 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: C.card, borderRadius: 50, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: C.border,
  },
  filterActive: { backgroundColor: C.navy, borderColor: C.navy },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: 12, fontWeight: '600', color: C.text2, ...FF },
  filterTextActive: { color: '#fff' },

  /* Empty */
  emptyWrap: { alignItems: 'center', marginTop: 48, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, fontWeight: '600', color: C.text2, ...FF },
  emptySub: { fontSize: 13, color: C.text3, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  /* Doc cards */
  docCard: {
    backgroundColor: C.card, borderRadius: 18, padding: 16, gap: 8,
    borderWidth: 1, borderColor: C.border, borderLeftWidth: 4,
    ...Platform.select({ ios: { shadowColor: C.navy, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 12 }, android: { elevation: 2 } }),
  },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docEmoji: { fontSize: 16 },
  docTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: C.text, ...FF },
  docSummary: { fontSize: 13, color: C.text2, lineHeight: 19 },
  docDate: { fontSize: 11, color: C.text3, alignSelf: 'flex-end' },

  /* Legitimacy pill */
  legitPill: { borderRadius: 50, paddingHorizontal: 10, paddingVertical: 4 },
  legitText: { fontSize: 11, fontWeight: '700', ...FF },

  /* Category pill */
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 50, paddingHorizontal: 12, paddingVertical: 6 },
  catPillText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize', ...FF },

  /* Modal */
  overlay: { flex: 1, backgroundColor: 'rgba(10,22,40,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, gap: 14, borderTopWidth: 2, borderColor: C.gold, maxHeight: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.text, ...FF },

  /* Scan input */
  scanInput: {
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14, color: C.text, fontSize: 14,
    minHeight: 120, ...FF,
  },
  scanningRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  scanningText: { fontSize: 13, color: C.text3, fontStyle: 'italic', ...FF },

  /* Result */
  resultCard: { backgroundColor: C.tintN, borderRadius: 16, padding: 16, gap: 10 },
  resultLabel: { fontSize: 10, fontWeight: '700', color: C.text3, letterSpacing: 1.5, ...FF },
  resultBody: { fontSize: 14, color: C.text2, lineHeight: 21, ...FF },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  /* Move buttons */
  moveRow: { flexDirection: 'row', gap: 12 },
  moveBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.tintN, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },

  /* Buttons */
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, backgroundColor: C.bg, borderRadius: 50, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  cancelText: { color: C.text2, fontSize: 15, fontWeight: '600', ...FF },
  primaryBtn: { flex: 1, backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700', ...FF },
  scanAiBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.navy, borderRadius: 50, paddingVertical: 14,
  },
  scanAiIcon: { color: C.gold, fontSize: 16, fontWeight: '800' },
  scanAiText: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 0.3, ...FF },
  scanAgainBtn: { alignItems: 'center', paddingVertical: 12 },
  scanAgainText: { color: C.blue, fontSize: 13, fontWeight: '600', ...FF },

  /* Camera / Gallery */
  captureRow: { flexDirection: 'row', gap: 10 },
  captureBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.tintN, borderRadius: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: C.border,
  },
  captureBtnActive: { backgroundColor: C.red, borderColor: C.red },
  captureBtnEmoji: { fontSize: 18 },
  captureBtnText: { fontSize: 13, fontWeight: '600', color: C.navy, ...FF },
  orText: { fontSize: 12, color: C.text3, textAlign: 'center', ...FF },
  imagePreview: { position: 'relative', borderRadius: 16, overflow: 'hidden' },
  previewImg: { width: '100%', height: 160, borderRadius: 16 },
  removeImg: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  removeImgText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
