import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import LabelWithValue from "../components/LabelWithValue";
import { Animal } from "../core/listeners/created-animal.listener";

export default function AnimalDetail({ route }: any) {
	const navigation = useNavigation();
	const animal = route.params.animal as Animal;

	const getBooleanIfIncluded = (array: Array<string>, value: string, trueFallback: string = "Sim", falseFallback: string = "Não") => array.includes(value) ? trueFallback : falseFallback;

	const handleClickAdoptionButton = () => {
		navigation.navigate("ConfirmAdoption" as never);
	}

	return (	
		<SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
			<ScrollView
				contentContainerStyle={styles.scrollView}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<Image source={require('../../assets/images/brisa.jpeg')} style={styles.image} />
				<Text style={styles.title}>{animal.nome}</Text>
				<View style={styles.bodyContainer}>
					<View style={[{flexDirection: "row", justifyContent: "space-between", width: "100%"}]}>
						<LabelWithValue
							label="Sexo"
							value={animal.sexo}
						/>
						<LabelWithValue
							label="Porte"
							value={animal.porte}
						/>
						<LabelWithValue
							label="Idade"
							value={animal.faixaEtaria}
						/>
					</View>
					<View style={[{flexDirection: "row", justifyContent: "flex-start", width: "100%"}]}>
						<View style={[{flexDirection: "column", gap: 10, flex: 1}]}>
							<LabelWithValue
								label="Castrado"
								value={getBooleanIfIncluded(animal.saude || [], "castrado")}
							/>
							<LabelWithValue
								label="Vacinado"
								value={getBooleanIfIncluded(animal.saude || [], "vacinado")}
							/>
						</View>
						<View style={[{flexDirection: "column", gap: 10, flex: 1}]}>
							<LabelWithValue
								label="Vermifugado"
								value={getBooleanIfIncluded(animal.saude || [], "vermifugado")}
							/>
							<LabelWithValue
								label="Doenças"
								value={getBooleanIfIncluded(animal.saude || [], "doencas", animal.doencas, "Nenhuma")}
							/>
						</View>
					</View>
					<LabelWithValue
						label="Temperamento"
						value={animal.temperamento?.join(", ") || "Não informado"}
					/>
					<LabelWithValue
						label="Exigências para adoção"
						value={animal.exigenciaAdocao?.join(", ") || "Não informado"}
					/>
					<LabelWithValue
						label="Mais sobre o animal"
						value={animal.sobreAnimal || "Não informado"}
					/>
					
					<Button text="Pretendo Adotar" type="yellow" onPress={handleClickAdoptionButton} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: StatusBar.currentHeight,
	},
	scrollView: {
		flexGrow: 1,
		backgroundColor: "#fff",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
  image: {
    width: "100%",
    height: "25%",
    resizeMode: "cover",
  },
	bodyContainer: {
		width: "100%",
		paddingHorizontal: 25,
		paddingVertical: 30,
		gap: 30,
	},
	title: {
		paddingHorizontal: 25,
		paddingTop: 20,
		fontSize: 16,
		color: "#434343",
		textAlign: "center",
		fontFamily: "Roboto-Medium",
		letterSpacing: 0.5
	},
});
