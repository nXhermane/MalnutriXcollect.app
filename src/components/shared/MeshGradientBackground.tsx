import { Dimensions, View } from 'react-native';

export function MeshGradientBackground() {
  const { width, height } = Dimensions.get('window');
  return (
    <View className="absolute inset-0 overflow-hidden">
      <View
        className="absolute rounded-full bg-emerald-500 opacity-15"
        style={{
          top: -height * 0.1,
          left: -width * 0.2,
          width: width * 0.8,
          height: width * 0.8,
        }}
      />
      <View
        className="absolute rounded-full bg-teal-500 opacity-10"
        style={{
          top: height * 0.2,
          right: -width * 0.3,
          width: width,
          height: width,
        }}
      />
      <View
        className="absolute rounded-full bg-green-500 opacity-10"
        style={{
          bottom: height * 0.1,
          left: -width * 0.1,
          width: width * 0.7,
          height: width * 0.7,
        }}
      />
    </View>
  );
}
