import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { Center } from '@/components/ui/center';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Plus } from 'lucide-react-native';
export default function PatientScreen() {
  const { id } = useLocalSearchParams();

  return (
    <VStack className="flex-1 bg-blue-500">
      <Center className="flex-1">
        <Text>Patient Id: {id}</Text>
      </Center>
      <Fab className=" w-12 h-12 bg-primary-c_light" onPress={() => alert("Show add measure bottom sheet")}>
        <FabIcon as={Plus} className="text-white" />
      </Fab>
    </VStack>
  );
}
