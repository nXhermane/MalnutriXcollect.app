import { BlurView } from '@/components/shared/BlurView';
import { Icon } from '@/components/shared/icons';
import { BottomSheet } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';

interface QRScannerSheetProps {
  isOpen: boolean;
  onScan: (value: string) => void;
  onClose: () => void;
}

const FRAME_SIZE = 230;
const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

function ScanCorners({ color }: { color: string }) {
  const corners = [
    { top: 0, left: 0, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
    { top: 0, right: 0, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH },
    { bottom: 0, left: 0, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
    { bottom: 0, right: 0, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH },
  ];
  return (
    <>
      {corners.map((style, i) => (
        <View
          key={i}
          style={[
            {
              position: 'absolute',
              width: CORNER_SIZE,
              height: CORNER_SIZE,
              borderColor: color,
              borderRadius: 4,
            },
            style,
          ]}
        />
      ))}
    </>
  );
}

function QRScannerSheetContent({
  isOpen,
  onScan,
  onClose,
}: {
  isOpen: boolean;
  onScan: (value: string) => void;
  onClose: () => void;
}) {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [{ videoResolution: 'max', photoResolution: 'max' }]);

  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    if (!isOpen) setTorchOn(false);
  }, [isOpen]);

  const scanLineY = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      scanLineY.value = 0;
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(FRAME_SIZE - 4, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    }
  }, [isOpen, scanLineY]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const value = codes[0]?.value;
      if (value) {
        onScan(value);
        onClose();
      }
    },
  });

  return (
    <BottomSheet.Content
      snapPoints={['88%']}
      enablePanDownToClose
      handleComponent={null}
      contentContainerClassName="h-full px-0 pt-0 pb-0">
      {device && isOpen ? (
        <View style={{ flex: 1, overflow: 'hidden', borderRadius: 24 }}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isOpen}
            codeScanner={codeScanner}
            format={format}
            torch={torchOn ? 'on' : 'off'}
          />

          <View style={StyleSheet.absoluteFillObject}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} />

            <View style={{ flexDirection: 'row', height: FRAME_SIZE }}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} />
              <View style={{ width: FRAME_SIZE, position: 'relative' }}>
                <Animated.View
                  style={[
                    scanLineStyle,
                    {
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: 'rgba(255,255,255,0.6)',
                      zIndex: 10,
                    },
                  ]}
                />
                <ScanCorners color="white" />
              </View>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} />
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.55)',
                alignItems: 'center',
                paddingTop: 28,
                gap: 8,
              }}>
              <Text style={styles.hint}>Pointez vers le QR Code de Malnutrix Pro</Text>
              <View style={styles.hintBadge}>
                <Icon name="Smartphone" className="text-white/70" sizeClassName="text-xs" />
                <Text style={styles.hintSub}>Téléphone du nutritionniste</Text>
              </View>
            </View>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Icon name="X" className="text-white" sizeClassName="text-base" />
          </Pressable>

          <Pressable
            onPress={() => setTorchOn((v) => !v)}
            style={[styles.torchButton, torchOn && styles.torchButtonActive]}>
            <Icon
              name={torchOn ? 'Flashlight' : 'FlashlightOff'}
              className={torchOn ? 'text-yellow-300' : 'text-white'}
              sizeClassName="text-base"
            />
          </Pressable>
        </View>
      ) : (
        <View style={styles.noCamera}>
          <View style={styles.noCameraIcon}>
            <Icon name="CameraOff" className="text-muted" sizeClassName="text-4xl" />
          </View>
          <Text style={styles.noCameraTitle}>Caméra indisponible</Text>
          <Text style={styles.noCameraSubtitle}>
            Vérifiez les permissions dans les paramètres du téléphone
          </Text>
          <Pressable onPress={onClose} style={styles.closeFallback}>
            <Text style={styles.closeFallbackText}>Fermer</Text>
          </Pressable>
        </View>
      )}
    </BottomSheet.Content>
  );
}

export function QRScannerSheet({ isOpen, onScan, onClose }: QRScannerSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay>
          <BlurView />
        </BottomSheet.Overlay>
        <QRScannerSheetContent isOpen={isOpen} onScan={onScan} onClose={onClose} />
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  hintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hintSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchButton: {
    position: 'absolute',
    top: 16,
    right: 60,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchButtonActive: {
    backgroundColor: 'rgba(250,204,21,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.5)',
  },
  noCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  noCameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(128,128,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  noCameraTitle: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  noCameraSubtitle: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeFallback: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
  },
  closeFallbackText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
});
