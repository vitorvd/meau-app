import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export function BackButton() {
  const navigation = useNavigation();
  return (
    <MaterialIcons
      name="arrow-back"
      size={24}
      color="#434343"
      onPress={() => navigation.goBack()}
    />
  );
}
